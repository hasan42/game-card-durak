/**
 * Zustand store для сетевой игры «Дурак»
 * Хост — авторитет. Хост рассылает full_state, гость отправляет actions.
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

  /** Хост: создаёт игру и начинает рассылать состояние */
  initHost: (network: NetworkManager) => void;
  /** Гость: подключается и слушает состояние от хоста */
  initGuest: (network: NetworkManager) => void;
  /** Гость: отправить действие хосту */
  sendAction: (action: NetworkAction) => void;
  /** Отключиться от сетевой игры */
  disconnect: () => void;
}

/** Подписка на изменения gameStore для рассылки хостом */
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

    // Подписка на входящие действия от гостя
    network.onData((data) => {
      const msg = data as { type: string; action?: NetworkAction };
      if (msg.type === 'action' && msg.action) {
        executeAction(msg.action);
        // После выполнения — рассылаем обновлённое состояние
        broadcastState(network);
      }
    });

    // Подписка на отключение
    network.on((event) => {
      if (event.type === 'disconnected') {
        set({ connected: false });
      }
      if (event.type === 'error') {
        set({ error: String(event.payload?.message || event.payload || 'Network error') });
      }
    });

    // Подписка на изменения gameStore — при каждом изменении отправлять состояние гостю
    unsubscribeGameStore = useGameStore.subscribe((state) => {
      broadcastState(network, state);
    });

    set({
      network,
      role: 'host',
      myPlayerIndex,
      connected: true,
      error: null,
    });
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

    // Подписка на отключение
    network.on((event) => {
      if (event.type === 'disconnected') {
        set({ connected: false });
      }
      if (event.type === 'error') {
        set({ error: String(event.payload?.message || event.payload || 'Network error') });
      }
    });

    set({
      network,
      role: 'guest',
      myPlayerIndex,
      connected: true,
      error: null,
    });
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
    if (network) {
      network.disconnect();
    }
    set({
      network: null,
      role: null,
      myPlayerIndex: -1,
      gameState: null,
      connected: false,
      error: null,
    });
  },
}));

// ─── Вспомогательные функции ───

/** Хост выполняет действие гостя через gameStore */
function executeAction(action: NetworkAction) {
  const store = useGameStore.getState();

  switch (action.type) {
    case 'attack': {
      const card = findCardInHand(store, action.cardId, store.attackerIndex === 0 ? 1 : 0);
      if (card) store.attack(card);
      break;
    }
    case 'defend': {
      const attackCard = store.table.find(ac => ac.attackCard.id === action.attackCardId && !ac.defendCard);
      const defendCard = findCardInHand(store, action.defendCardId, store.attackerIndex === 0 ? 1 : 0);
      if (attackCard && defendCard) {
        store.defend(action.attackCardId, defendCard);
      }
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

/** Найти карту в руке игрока по ID */
function findCardInHand(
  store: ReturnType<typeof useGameStore.getState>,
  cardId: string,
  playerIndex: number
) {
  return store.players[playerIndex]?.hand.find(c => c.id === cardId) ?? null;
}

/** Рассылка полного состояния гостю */
function broadcastState(network: NetworkManager, state?: GameState) {
  const s = state ?? useGameStore.getState();
  // Для гостя скрываем карты хоста (игрок 0)
  const guestState: GameState = {
    ...s,
    players: [
      { ...s.players[0], hand: [] }, // скрываем карты хоста
      s.players[1],
    ],
  };
  network.send({
    type: 'full_state',
    state: guestState,
    myPlayerIndex: 1,
  });
}