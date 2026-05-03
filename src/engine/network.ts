/**
 * PeerJS сетевой модуль для игры «Дурак»
 * Подключение P2P через WebRTC с сигнальным сервером PeerJS
 */

import Peer from 'peerjs';

export type NetworkRole = 'host' | 'guest';

export interface NetworkMessage {
  type: 'game_state' | 'action' | 'chat' | 'ready' | 'error' | 'join' | 'leave';
  payload: any;
}

export interface NetworkCallbacks {
  onConnected: (role: NetworkRole, peerId: string) => void;
  onDisconnected: () => void;
  onMessage: (message: NetworkMessage) => void;
  onError: (error: Error) => void;
}

export class NetworkManager {
  private peer: Peer | null = null;
  private connection: any | null = null;
  private callbacks: NetworkCallbacks;
  private myId: string = '';
  private myRole: NetworkRole | null = null;
  private isHost: boolean = false;

  constructor(callbacks: NetworkCallbacks) {
    this.callbacks = callbacks;
  }

  /** Создать комнату (хост) */
  async host(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer();
      this.isHost = true;
      this.myRole = 'host';

      this.peer.on('open', (id) => {
        this.myId = id;
        console.log('[Network] Host created, room ID:', id);

        this.peer!.on('connection', (conn) => {
          console.log('[Network] Guest connected:', conn.peer);
          this.connection = conn;
          this.setupConnection(conn);
          this.callbacks.onConnected('host', conn.peer);

          // Отправить готовность
          conn.on('open', () => {
            conn.send({ type: 'ready', payload: { role: 'host' } });
          });
        });

        resolve(id);
      });

      this.peer.on('error', (err) => {
        console.error('[Network] Host error:', err);
        this.callbacks.onError(err);
        reject(err);
      });

      this.peer.on('disconnected', () => {
        this.callbacks.onDisconnected();
      });
    });
  }

  /** Присоединиться к комнате (гость) */
  async join(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer();
      this.isHost = false;
      this.myRole = 'guest';

      this.peer.on('open', (id) => {
        this.myId = id;
        console.log('[Network] Joining room:', roomId);

        const conn = this.peer!.connect(roomId, { reliable: true });
        this.connection = conn;

        conn.on('open', () => {
          console.log('[Network] Connected to host');
          this.setupConnection(conn);
          conn.send({ type: 'join', payload: { peerId: id } });
          this.callbacks.onConnected('guest', roomId);
          resolve();
        });

        conn.on('error', (err) => {
          console.error('[Network] Connection error:', err);
          reject(err);
        });
      });

      this.peer.on('error', (err) => {
        console.error('[Network] Guest error:', err);
        this.callbacks.onError(err);
        reject(err);
      });
    });
  }

  private setupConnection(conn: any) {
    conn.on('data', (data: any) => {
      const msg = data as NetworkMessage;
      this.callbacks.onMessage(msg);
    });

    conn.on('close', () => {
      console.log('[Network] Connection closed');
      this.connection = null;
      this.callbacks.onDisconnected();
    });
  }

  /** Отправить сообщение */
  send(message: NetworkMessage): boolean {
    if (!this.connection || !this.connection.open) {
      console.warn('[Network] No connection, cannot send');
      return false;
    }
    this.connection.send(message);
    return true;
  }

  /** Отключиться */
  disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.myRole = null;
  }

  get role(): NetworkRole | null {
    return this.myRole;
  }

  get connected(): boolean {
    return this.connection !== null && this.connection.open;
  }

  get roomId(): string {
    return this.isHost ? this.myId : (this.connection?.peer || '');
  }
}