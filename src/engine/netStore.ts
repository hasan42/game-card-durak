/**
 * Zustand store для сетевой игры «Дурак»
 * Хост авторитетен, гости отправляют actions
 * Поддержка 2-6 игроков (PeerJS + Firebase)
 */

import { create } from 'zustand';
import type { NetworkManagerInterface } from 'game-network-lib';
import { useGameStore } from './store';
import type { GameState, NetworkAction } from './types';

export type NetworkBackend = 'peerjs' | 'firebase';

interface NetStore {
  network: NetworkManagerInterface | null;
  backend: NetworkBackend;
  role: 'host' | 'guest' | null;
  myPlayerIndex: number;
  gameState: GameState | null;
  connected: boolean;
  error: string | null;
  roomId: string | null;
  players: { id: string; name: string; index: number; connected: boolean }[];

  initHost: (network: NetworkManagerInterface, backend: NetworkBackend) => void;
  initGuest: (network: NetworkManagerInterface, backend: NetworkBackend, playerIndex?: number) => void;
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
    const roomId = 'roomId' in network ? (network as any).roomId : null;

    // Подписка на данные от гостей (actions)
    network.onData((data) => {
      const msg = data as { type: string; action?: NetworkAction; playerIndex?: number };
      if (msg.type === 'action' && msg.action) {
        const playerIndex = msg.playerIndex ?? (msg.action as any).playerIndex ?? -1;
        const innerAction = (msg.action as { action?: NetworkAction }).action ?? msg.action;
        executeAction({ ...innerAction, playerIndex });
      }
    });

    // Подписка на события
    network.on((event) => {
      if (event.type === 'disconnected') {
        set({ connected: false });
      }
      if (event.type === 'error') {
        set({ error: String((event.payload as any)?.message ?? event.payload ?? 'Ошибка') });
      }
    });

    set({ network, backend, role: 'host', myPlayerIndex: 0, connected: true, error: null, roomId });

    // Немедленно рассылаем текущее состояние
    broadcastState(network, backend);

    // Подписка на gameStore
    setTimeout(() => {
      unsubscribeGameStore = useGameStore.subscribe((state) => {
        broadcastState(network, backend, serializeGameState(state));
      });
    }, 0);
  },

  initGuest: (network, backend, playerIndex) => {
    const guestPlayerIndex = playerIndex ?? ('playerIndex' in network ? (network as any).playerIndex : 1);
    const roomId = 'roomId' in network ? (network as any).roomId : null;

    // Подписка на данные от хоста (gameState)
    network.onData((data) => {
      const msg = data as { type: string; state?: GameState; myPlayerIndex?: number };
      if (msg.type === 'full_state' && msg.state) {
        const idx = msg.myPlayerIndex ?? guestPlayerIndex;
        set({ gameState: msg.state, myPlayerIndex: idx });
      }
    });

    // Подписка на события
    network.on((event) => {
      if (event.type === 'disconnected') {
        set({ connected: false });
      }
      if (event.type === 'error') {
        set({ error: String((event.payload as any)?.message ?? event.payload ?? 'Ошибка') });
      }
    });

    set({
      network,
      backend,
      role: 'guest',
      myPlayerIndex: guestPlayerIndex,
      connected: true,
      error: null,
      roomId,
    });
  },

  sendAction: (action) => {
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
    set({ network: null, backend: 'peerjs', role: null, myPlayerIndex: -1, gameState: null, connected: false, error: null, roomId: null, players: [] });
  },
}));

// ─── Helpers ───

/** Хост выполняет действие гостя через gameStore */
function executeAction(action: NetworkAction & { playerIndex: number }) {
  const store = useGameStore.getState();

  switch (action.type) {
    case 'attack': {
      const playerIdx = action.playerIndex ?? store.activePlayerIndex ?? 0;
      const card = store.players[playerIdx]?.hand.find(c => c.id === action.cardId);
      if (card) {
        if (store.activePlayerIndex !== playerIdx) {
          useGameStore.setState({ activePlayerIndex: playerIdx });
        }
        store.attack(card);
      }
      break;
    }
    case 'defend': {
      const defenderIdx = action.playerIndex ?? store.defenderIndex ?? 1;
      const defendCard = store.players[defenderIdx]?.hand.find(c => c.id === action.defendCardId);
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

/** Извлечь сериализуемое GameState из Zustand store (без функций) */
export function serializeGameState(store: any): GameState {
  return {
    deck: store.deck,
    trumpSuit: store.trumpSuit,
    trumpCard: store.trumpCard,
    players: store.players,
    attackerIndex: store.attackerIndex,
    defenderIndex: store.defenderIndex,
    activePlayerIndex: store.activePlayerIndex,
    playerCount: store.playerCount,
    table: store.table,
    phase: store.phase,
    discardPile: store.discardPile,
    consecutivePasses: store.consecutivePasses,
    thrownInPasses: store.thrownInPasses,
    winner: store.winner,
    lastAction: store.lastAction,
    gameMode: store.gameMode,
    roundCount: store.roundCount,
  };
}

/** Рассылка состояния гостям. Карты других игроков скрываются. */
function broadcastState(network: NetworkManagerInterface, backend: NetworkBackend, state?: GameState) {
  const s = state ?? serializeGameState(useGameStore.getState());

  // Для PeerJS: скрываем карты хоста от гостя
  // Для Firebase: шлём полный state, клиент сам скрывает
  if (backend === 'peerjs') {
    const guestState: GameState = {
      ...s,
      players: s.players.map((p, i) =>
        i === 0 ? { ...p, hand: [] } : p
      ),
    };
    network.send({ type: 'full_state', state: guestState });
  } else {
    network.send({ type: 'full_state', state: s });
  }
}