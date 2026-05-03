/**
 * PeerJS сетевой модуль для игры «Дурак»
 * P2P через WebRTC с сигнальным сервером PeerJS
 *
 * API: EventEmitter-стиль — подписка через on()/onData(), отправка через send()
 */

import Peer from 'peerjs';

export type NetworkRole = 'host' | 'guest';

export type NetworkEventType = 'connected' | 'disconnected' | 'data' | 'error';

export interface NetworkEvent {
  type: NetworkEventType;
  payload?: any;
}

type Listener = (event: NetworkEvent) => void;

// PeerJS конфигурация
// Локальный PeerJS сервер на Mac mini (192.168.0.78:9000)
// Для внешнего доступа нужен VPN/проброс портов
function getPeerConfig(): any {
  const localPeerHost = '192.168.0.78';
  const localPeerPort = 9000;
  const localPeerPath = '/myapp';

  // Если мы на том же хосте — используем localhost
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalNetwork = currentHost === localPeerHost ||
    currentHost === 'localhost' || currentHost === '127.0.0.1';

  const peerHost = isLocalNetwork ? currentHost : localPeerHost;
  const peerSecure = isLocalNetwork ? false : false;

  return {
    host: peerHost,
    port: localPeerPort,
    path: localPeerPath,
    secure: peerSecure,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    },
  };
}

export class NetworkManager {
  private peer: Peer | null = null;
  private connection: any | null = null;
  private myId: string = '';
  private myRole: NetworkRole | null = null;
  private isHost: boolean = false;
  private listeners: Listener[] = [];

  // ─── EventEmitter ───

  /** Подписаться на все события */
  on(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /** Подписка только на data-события (входящие сообщения) */
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
        console.error('[Network] Listener error:', e);
      }
    }
  }

  // ─── Подключение ───

  /** Создать комнату (хост). Resolves с room ID. */
  async host(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer(getPeerConfig());
      this.isHost = true;
      this.myRole = 'host';

      this.peer.on('open', (id) => {
        this.myId = id;
        console.log('[Network] Host created, room ID:', id);

        this.peer!.on('connection', (conn) => {
          console.log('[Network] Guest connected:', conn.peer);
          this.connection = conn;
          this.setupConnection(conn);
          this.emit({ type: 'connected', payload: { role: 'host' } });
        });

        resolve(id);
      });

      this.peer.on('error', (err) => {
        console.error('[Network] Host error:', err);
        this.emit({ type: 'error', payload: err });
        reject(err);
      });

      this.peer.on('disconnected', () => {
        this.emit({ type: 'disconnected' });
      });
    });
  }

  /** Присоединиться к комнате (гость) */
  async join(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer(getPeerConfig());
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
          this.emit({ type: 'connected', payload: { role: 'guest' } });
          resolve();
        });

        conn.on('error', (err) => {
          console.error('[Network] Connection error:', err);
          this.emit({ type: 'error', payload: err });
          reject(err);
        });
      });

      this.peer.on('error', (err) => {
        console.error('[Network] Guest error:', err);
        this.emit({ type: 'error', payload: err });
        reject(err);
      });
    });
  }

  private setupConnection(conn: any) {
    conn.on('data', (data: any) => {
      this.emit({ type: 'data', payload: data });
    });

    conn.on('close', () => {
      console.log('[Network] Connection closed');
      this.connection = null;
      this.emit({ type: 'disconnected' });
    });
  }

  /** Отправить данные по сети */
  send(data: any): boolean {
    if (!this.connection) {
      console.warn('[Network] No connection, cannot send');
      return false;
    }
    if (this.connection.open === false) {
      console.warn('[Network] Connection not open, cannot send');
      return false;
    }
    this.connection.send(data);
    return true;
  }

  /** Отключиться и уничтожить соединение */
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
    this.listeners = [];
  }

  // ─── Геттеры ───

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