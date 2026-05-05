/**
 * Zustand store для сетевой игры «Дурак»
 * Универсальный — поддержка PeerJS и Firebase
 * Хост авторитетен, гости отправляют actions
 * Поддержка 2-6 игроков
 */

import { create } from 'zustand';
import { NetworkManager } from './network';
import { FirebaseNetworkManager } from './firebaseNetwork';
import { useGameStore } from './store';
import type { GameState, NetworkAction } from './types';

export type NetworkBackend = 'peerjs' | 'firebase';

interface NetStore {
  network: NetworkManager | FirebaseNetworkManager | null;
  backend: NetworkBackend;
  role: 'host' | 'guest' | null;
  myPlayerIndex: number;
  gameState: GameState | null;
  connected: boolean;
  error: string | null;
  roomId: string | null;
  players: { id: string; name: string; index: number; connected: boolean }[];

  initHost: (network: NetworkManager | FirebaseNetworkManager, backend: NetworkBackend) => void;
  initGuest: (network: NetworkManager | FirebaseNetworkManager, backend: NetworkBackend) => void;
  sendAction: (action: NetworkAction) => void;
  disconnect: () => void;
}

let unsubscribeGameStore: (() => void) | null = null;

export const useNetStore = create<NetStore>((set, get) => ({
  network: null,
  backend: 'peerjs',
  role: null,
  myPlayerIndex: -1,
  gameState: null,
  connected: false,
  error: null,
  roomId: null,
  players: [],

  initHost: (network, backend) => {
    const myPlayerIndex = 0; // хост = игрок 0

    // Хост получает actions от гостей
    network.onData((data) => {
      const msg = data as { type: string; action?: NetworkAction };
      if (msg.type === 'action' && msg.action) {
        executeAction(msg.action);
      }
    });

    // Подписка на события сети
    network.on((event) => {
      if (event.type === 'disconnected') {
        set({ connected: false });
      }
      if (event.type === 'error') {
        set({ error: String(event.payload?.message || event.payload || 'Network error') });
      }
    });

    // При каждом изменении gameStore — рассылать состояние гостям
    unsubscribeGameStore = useGameStore.subscribe((state) => {
      broadcastState(network, state);
    });

    const roomId = 'roomId' in network ? network.roomId : null;
    set({ network, backend, role: 'host', myPlayerIndex, connected: true, error: null, roomId });
  },

  initGuest: (network, backend) => {
    // Гость слушает full_state от хоста
    network.onData((data) => {
      const msg = data as { type: string; state?: GameState; myPlayerIndex?: number };
      if (msg.type === 'full_state' && msg.state) {
        set({ gameState: msg.state, myPlayerIndex: msg.myPlayerIndex ?? 1 });
      }
    });

    network.on((event) => {
      if (event.type === 'disconnected') {
        set({ connected: false });
      }
      if (event.type === 'error') {
        set({ error: String(event.payload?.message || event.payload || 'Network error') });
      }
    });

    const roomId = 'roomId' in network ? network.roomId : null;
    set({ network, backend, role: 'guest', myPlayerIndex: 1, connected: true, error: null, roomId });
  },

  sendAction: (action) => {
    const { network, backend } = get();
    if (!network) return;

    if (backend === 'firebase') {
      (network as FirebaseNetworkManager).send({ type: 'action', action });
    } else {
      (network as NetworkManager).send({ type: 'action', action });
    }
  },

  disconnect: () => {
    if (unsubscribeGameStore) {
      unsubscribeGameStore();
      unsubscribeGameStore = null;
    }
    const { network } = get();
    if (network) network.disconnect();
    set({ network: null, backend: 'peerjs', role: null, myPlayerIndex: -1, gameState: null, connected: false, error: null, roomId: null, players: [] });
  },
}));

// ─── Helpers ───

/** Хост выполняет действие гостя через gameStore */
function executeAction(action: NetworkAction) {
  const store = useGameStore.getState();

  switch (action.type) {
    case 'attack': {
      // Найти карту у активного игрока
      const activeIndex = store.activePlayerIndex ?? 0;
      const card = store.players[activeIndex]?.hand.find(c => c.id === action.cardId);
      if (card) store.attack(card);
      break;
    }
    case 'defend': {
      const defenderIndex = store.defenderIndex ?? 1;
      const defendCard = store.players[defenderIndex]?.hand.find(c => c.id === action.defendCardId);
      if (defendCard) store.defend(action.attackCardId, defendCard);
      break;
    }
    case 'take': {
      store.take();
      break;
    }
    case 'pass': {
      store.pass();
      break;
    }
  }
}

/** Рассылка состояния гостям. Карты других игроков скрываются. */
function broadcastState(network: NetworkManager | FirebaseNetworkManager, state?: GameState) {
  const s = state ?? useGameStore.getState();

  // Формируем state для каждого игрока (скрываем чужие карты)
  // Для PeerJS: 1 гость, для Firebase: N гостей
  const isFirebase = network instanceof FirebaseNetworkManager;

  if (isFirebase) {
    // Firebase: хост пишет в Firestore один раз, гости читают
    // Но нам нужно скрыть карты всех кроме текущего игрока
    // Поэтому шлём полный state, а клиент сам скрывает чужие карты
    network.send({ type: 'full_state', state: s });
  } else {
    // PeerJS: 2 игрока, хост = 0, гость = 1
    const guestState: GameState = {
      ...s,
      players: s.players.map((p, i) =>
        i === 0 ? { ...p, hand: [] } : p // скрываем карты хоста
      ),
    };
    network.send({ type: 'full_state', state: guestState, myPlayerIndex: 1 });
  }
}
