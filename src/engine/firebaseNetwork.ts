/**
 * Firebase Network Manager для игры «Дурак»
 * Firestore — real-time синхронизация, хост авторитетен
 * Поддержка 2-6 игроков, автоматический реконнект
 */

import {
  type NetworkRole,
  type NetworkEvent,
} from './network';
import {
  createRoom,
  joinRoom,
  leaveRoom,
  updateGameState,
  subscribeRoom,
  subscribePlayers,
  roomExists,
  type FirestoreRoom,
  type FirestorePlayer,
} from './firebase';

type Listener = (event: NetworkEvent) => void;

export class FirebaseNetworkManager {
  private _roomId: string = '';
  private myId: string = '';
  private myRole: NetworkRole | null = null;
  private myPlayerIndex: number = -1;
  private _isHost: boolean = false;
  private listeners: Listener[] = [];
  private unsubscribeRoom: (() => void) | null = null;
  private unsubscribePlayers: (() => void) | null = null;
  private _connected: boolean = false;
  private _players: FirestorePlayer[] = [];
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  // ─── EventEmitter ───

  on(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  onData(callback: (data: any) => void): () => void {
    return this.on((event) => {
      if (event.type === 'data') {
        callback(event.payload);
      }
    });
  }

  private emit(event: NetworkEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (e) {
        console.error('[FirebaseNetwork] Listener error:', e);
      }
    }
  }

  // ─── Connection ───

  /** Создать комнату (хост) */
  async host(maxPlayers: number = 2): Promise<string> {
    const roomId = this.generateRoomId();
    const hostId = this.generatePlayerId();

    this._roomId = roomId;
    this.myId = hostId;
    this._isHost = true;
    this.myRole = 'host';
    this.myPlayerIndex = 0;

    await createRoom(roomId, hostId, 'Игрок 1', maxPlayers);

    // Хост тоже записывает себя как игрока
    await this.registerAsPlayer(roomId, hostId, 'Игрок 1', 0);

    this.startHeartbeat();
    this.startSubscriptions();
    this._connected = true;

    this.emit({ type: 'connected', payload: { role: 'host', roomId } });

    return roomId;
  }

  /** Присоединиться к комнате (гость) */
  async join(roomId: string, playerName: string = 'Игрок'): Promise<void> {
    const playerId = this.generatePlayerId();

    // Проверить существование комнаты
    const exists = await roomExists(roomId);
    if (!exists) {
      throw new Error('Комната не найдена');
    }

    // Определить индекс игрока
    const room = await this.getRoomWithPlayers(roomId);
    const playerIndex = room?.playerCount ?? 0;

    const success = await joinRoom(roomId, playerId, `${playerName} ${playerIndex + 1}`, playerIndex);
    if (!success) {
      throw new Error('Не удалось присоединиться к комнате (возможно, она заполнена или игра уже началась)');
    }

    this._roomId = roomId;
    this.myId = playerId;
    this._isHost = false;
    this.myRole = 'guest';
    this.myPlayerIndex = playerIndex;

    this.startHeartbeat();
    this.startSubscriptions();
    this._connected = true;

    // Не вызываем emit синхронно — пусть вызывающий код проверит статус
    // this.emit({ type: 'connected', payload: { role: 'guest', roomId, playerIndex } });
  }

  /** Отключиться */
  disconnect(): void {
    this.stopHeartbeat();
    this.stopSubscriptions();

    if (this._roomId && this.myId) {
      leaveRoom(this._roomId, this.myId).catch(console.error);
    }

    this._roomId = '';
    this.myId = '';
    this._isHost = false;
    this.myRole = null;
    this.myPlayerIndex = -1;
    this._connected = false;
    this._players = [];
    this.listeners = [];
  }

  /** Отправить данные */
  send(data: any): boolean {
    if (!this._connected || !this._roomId) {
      console.warn('[FirebaseNetwork] Not connected, cannot send');
      return false;
    }

    // Хост обновляет gameState в Firestore
    if (this._isHost && data.type === 'full_state') {
      updateGameState(this._roomId, data.state).catch(console.error);
      return true;
    }

    // Гость отправляет action — хост должен слушать и применять
    // Для гостей: пишем в подколлекцию actions
    if (!this._isHost) {
      this.sendAction(data).catch(console.error);
      return true;
    }

    return false;
  }

  /** Отправить action (для гостей) */
  private async sendAction(data: any): Promise<void> {
    const { getDb } = await import('./firebase');
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

    const actionRef = doc(getDb(), 'durak_rooms', this._roomId, 'actions', `${Date.now()}_${this.myId}`);
    await setDoc(actionRef, {
      ...data,
      playerId: this.myId,
      playerIndex: this.myPlayerIndex,
      timestamp: serverTimestamp(),
    });
  }

  // ─── Subscriptions ───

  private startSubscriptions(): void {
    // Подписка на комнату — получаем gameState и статус
    this.unsubscribeRoom = subscribeRoom(this._roomId, (room) => {
      if (!room) {
        this.emit({ type: 'disconnected' });
        return;
      }

      // Гость получает gameState
      if (!this._isHost && room.gameState) {
        this.emit({ type: 'data', payload: { type: 'full_state', state: room.gameState, myPlayerIndex: this.myPlayerIndex } });
      }

      // Статус changed
      if (room.status === 'playing' && !this._connected) {
        this._connected = true;
      }
    });

    // Подписка на игроков
    this.unsubscribePlayers = subscribePlayers(this._roomId, (players) => {
      this._players = players;

      // Если хост — проверяем actions от гостей
      if (this._isHost) {
        this.pollActions().catch(console.error);
      }
    });
  }

  private stopSubscriptions(): void {
    if (this.unsubscribeRoom) {
      this.unsubscribeRoom();
      this.unsubscribeRoom = null;
    }
    if (this.unsubscribePlayers) {
      this.unsubscribePlayers();
      this.unsubscribePlayers = null;
    }
  }

  // ─── Actions (host polls) ───

  private async pollActions(): Promise<void> {
    const { getDb } = await import('./firebase');
    const { collection, getDocs, query, orderBy, deleteDoc, doc } = await import('firebase/firestore');

    const actionsRef = collection(getDb(), 'durak_rooms', this._roomId, 'actions');
    const q = query(actionsRef, orderBy('timestamp'));
    const snap = await getDocs(q);

    snap.forEach((docSnap) => {
      const action = docSnap.data();
      // Отправляем action как data-событие
      this.emit({ type: 'data', payload: { type: 'action', action } });
      // Удаляем обработанный action
      deleteDoc(doc(getDb(), 'durak_rooms', this._roomId, 'actions', docSnap.id)).catch(console.error);
    });
  }

  // ─── Heartbeat ───

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (!this._roomId || !this.myId) return;
      // Динамический импорт для избежания циклических зависимостей
      import('./firebase').then(({ getPlayerRef }) => {
        import('firebase/firestore').then(({ updateDoc, serverTimestamp }) => {
          updateDoc(getPlayerRef(this._roomId, this.myId), {
            lastSeen: serverTimestamp(),
            connected: true,
          }).catch(() => {});
        });
      });
    }, 10000); // каждые 10 секунд
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // ─── Helpers ───

  private async registerAsPlayer(roomId: string, playerId: string, name: string, index: number): Promise<void> {
    const { getPlayerRef } = await import('./firebase');
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    await setDoc(getPlayerRef(roomId, playerId), {
      id: playerId,
      name,
      roomId,
      index,
      connected: true,
      lastSeen: serverTimestamp(),
    });
  }

  private async getRoomWithPlayers(roomId: string): Promise<FirestoreRoom | null> {
    const { getRoom } = await import('./firebase');
    return getRoom(roomId);
  }

  private generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private generatePlayerId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  // ─── Getters ───

  get role(): NetworkRole | null {
    return this.myRole;
  }

  get roomId(): string {
    return this._roomId;
  }

  get id(): string {
    return this.myId;
  }

  get playerIndex(): number {
    return this.myPlayerIndex;
  }

  get isConnected(): boolean {
    return this._connected;
  }

  get playerList(): FirestorePlayer[] {
    return this._players;
  }
}
