/**
 * Zustand store для сетевой игры «Дурак»
 * Хост — авторитет. Хост рассылает full_state, гость отправляет actions.
 * Хост = игрок 0, Гость = игрок 1 (всегда)
 */

import { create } from 'zustand';
import { NetworkManager } from './network';
import { useGameStore } from './store';
import type { GameState, NetworkAction } from './types';

interface NetStore {
  network: NetworkManager | null;
  role: 'host' | 'guest' | null;
  myPlayerIndex: number;
  gameState: GameState | null;
  connected: boolean;
  error: string | null;

  initHost: (network: NetworkManager) => void;
  initGuest: (network: NetworkManager) => void;
  sendAction: (action: NetworkAction) => void;
  disconnect: () => void;
}

let unsubscribeGameStore: (() => void) | null = null;

export const useNetStore = create<NetStore>((set, get) => ({
  network: null,
  role: null,
  myPlayerIndex: -1,
  gameState: null,
  connected: false,
  error: null,

  initHost: (network: NetworkManager) => {
    const myPlayerIndex = 0; // хост = игрок 0

    // Хост получает actions от гостя
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

    // При каждом изменении gameStore — рассылать состояние гостю
    unsubscribeGameStore = useGameStore.subscribe((state) => {
      broadcastState(network, state);
    });

    set({ network, role: 'host', myPlayerIndex, connected: true, error: null });
  },

  initGuest: (network: NetworkManager) => {
    const myPlayerIndex = 1; // гость = игрок 1

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

    set({ network, role: 'guest', myPlayerIndex, connected: true, error: null });
  },

  sendAction: (action: NetworkAction) => {
    const { network } = get();
    if (!network) return;
    network.send({ type: 'action', action });
  },

  disconnect: () => {
    if (unsubscribeGameStore) {
      unsubscribeGameStore();
      unsubscribeGameStore = null;
    }
    const { network } = get();
    if (network) network.disconnect();
    set({ network: null, role: null, myPlayerIndex: -1, gameState: null, connected: false, error: null });
  },
}));

// ─── Helpers ───

/** Хост выполняет действие гостя (игрок 1) через gameStore */
function executeAction(action: NetworkAction) {
  const store = useGameStore.getState();
  const guestIndex = 1; // гость всегда игрок 1

  switch (action.type) {
    case 'attack': {
      const card = store.players[guestIndex]?.hand.find(c => c.id === action.cardId);
      if (card) store.attack(card);
      break;
    }
    case 'defend': {
      const defendCard = store.players[guestIndex]?.hand.find(c => c.id === action.defendCardId);
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

/** Рассылка состояния гостю. Карты хоста скрываются. */
function broadcastState(network: NetworkManager, state?: GameState) {
  const s = state ?? useGameStore.getState();
  const guestState: GameState = {
    ...s,
    players: [
      { ...s.players[0], hand: [] },  // скрываем карты хоста
      s.players[1],                     // гость видит свои карты
    ],
  };
  network.send({ type: 'full_state', state: guestState, myPlayerIndex: 1 });
}