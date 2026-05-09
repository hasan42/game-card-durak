/**
 * Zustand store для сетевой игры «Дурак»
 * Обёртка над game-network-lib (PeerJS + Firebase)
 * Хост авторитетен, гости отправляют actions
 * Поддержка 2-6 игроков
 */

import { create } from 'zustand';
import { GameNetwork } from 'game-network-lib';
import type { NetworkManagerInterface } from 'game-network-lib';
import { useGameStore } from './store';
import type { GameState, NetworkAction } from './types';

export type NetworkBackend = 'peerjs' | 'firebase';

interface NetStore {
  network: NetworkManagerInterface | null;
  gameNet: GameNetwork | null;
  backend: NetworkBackend;
  role: 'host' | 'guest' | null;
  myPlayerIndex: number;
  gameState: GameState | null;
  connected: boolean;
  error: string | null;
  roomId: string | null;
  players: { id: string; name: string; index: number; connected: boolean }[];

  initHost: (network: NetworkManagerInterface, backend: NetworkBackend) => Promise<string>;
  initGuest: (network: NetworkManagerInterface, backend: NetworkBackend, playerIndex?: number) => Promise<void>;
  sendAction: (action: NetworkAction) => void;
  disconnect: () => void;
}

let unsubscribeGameStore: (() => void) | null = null;

export const useNetStore = create<NetStore>((set, get) => ({
  network: null,
  gameNet: null,
  backend: 'peerjs',
  role: null,
  myPlayerIndex: -1,
  gameState: null,
  connected: false,
  error: null,
  roomId: null,
  players: [],

  initHost: async (network, backend) => {
    const gameNet = new GameNetwork({
      backend,
      onAction: (action) => {
        executeAction(action as NetworkAction & { playerIndex: number });
      },
      onConnectionChange: (connected) => {
        if (!connected) {
          set({ connected: false });
        }
      },
      onError: (error) => {
        set({ error });
      },
    });

    const roomId = await gameNet.initHost(network);

    set({ network, gameNet, backend, role: 'host', myPlayerIndex: 0, connected: true, error: null, roomId });

    // Немедленно рассылаем текущее состояние игры
    broadcastState(gameNet);

    // Подписка на gameStore отложенно
    setTimeout(() => {
      unsubscribeGameStore = useGameStore.subscribe((state) => {
        broadcastState(gameNet, serializeGameState(state));
      });
    }, 0);

    return roomId;
  },

  initGuest: async (network, backend, playerIndex) => {
    const gameNet = new GameNetwork({
      backend,
      onState: (state, myPlayerIndex) => {
        set({ gameState: state as unknown as GameState, myPlayerIndex });
      },
      onConnectionChange: (connected) => {
        if (!connected) {
          set({ connected: false });
        }
      },
      onError: (error) => {
        set({ error });
      },
    });

    await gameNet.initGuest(network, playerIndex);

    const guestPlayerIndex = playerIndex ?? ('playerIndex' in network ? (network as any).playerIndex : 1);

    set({
      network,
      gameNet,
      backend,
      role: 'guest',
      myPlayerIndex: guestPlayerIndex,
      connected: true,
      error: null,
      roomId: 'roomId' in network ? (network as any).roomId : null,
    });
  },

  sendAction: (action) => {
    const { gameNet } = get();
    if (!gameNet) return;
    gameNet.sendAction(action);
  },

  disconnect: () => {
    if (unsubscribeGameStore) {
      unsubscribeGameStore();
      unsubscribeGameStore = null;
    }
    const { gameNet } = get();
    if (gameNet) gameNet.disconnect();
    set({ network: null, gameNet: null, backend: 'peerjs', role: null, myPlayerIndex: -1, gameState: null, connected: false, error: null, roomId: null, players: [] });
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
function broadcastState(gameNet: GameNetwork, state?: GameState) {
  const s = state ?? serializeGameState(useGameStore.getState());

  // Для PeerJS: скрываем карты хоста от гостя
  // Для Firebase: шлём полный state, клиент сам скрывает
  if (gameNet.status.backend === 'peerjs') {
    const guestState: GameState = {
      ...s,
      players: s.players.map((p, i) =>
        i === 0 ? { ...p, hand: [] } : p
      ),
    };
    gameNet.broadcastState(guestState as unknown as Record<string, unknown>);
  } else {
    gameNet.broadcastState(s as unknown as Record<string, unknown>);
  }
}