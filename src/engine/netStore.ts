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
      const msg = data as { type: string; action?: any; playerIndex?: number };
      if (msg.type === 'action' && msg.action) {
        // playerIndex может быть на уровне msg или msg.action (зависит от транспорта)
        const playerIndex = msg.playerIndex ?? msg.action.playerIndex;
        const innerAction = msg.action.action ?? msg.action; // Firebase оборачивает: { type: 'action', action: { type: 'defend', ... }, playerIndex }
        const actionWithPlayer = { ...innerAction, playerIndex };
        executeAction(actionWithPlayer);
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

    const roomId = 'roomId' in network ? network.roomId : null;
    set({ network, backend, role: 'host', myPlayerIndex, connected: true, error: null, roomId });
    
    // Немедленно рассылаем текущее состояние игры
    // (подписка на изменения будет работать через setTimeout)
    broadcastState(network);
    
    // Подписка на gameStore отложенно, чтобы не вызывать внутри React render
    setTimeout(() => {
      unsubscribeGameStore = useGameStore.subscribe((state) => {
        // Используем state из callback, а не getState()
        broadcastState(network, state);
      });
    }, 0);
  },

  initGuest: (network, backend) => {
    // Определяем myPlayerIndex до подписок
    const guestPlayerIndex = 'playerIndex' in network ? (network as any).playerIndex : 1;

    // Сначала устанавливаем стейт, потом подписываемся
    set({ network, backend, role: 'guest', myPlayerIndex: guestPlayerIndex, connected: true, error: null, roomId: 'roomId' in network ? network.roomId : null });

    // Гость слушает full_state от хоста
    network.onData((data) => {
      const msg = data as { type: string; state?: GameState; myPlayerIndex?: number };
      console.log('[netStore] Guest received data:', msg.type, msg.state ? 'has state' : 'no state', 'myIndex:', msg.myPlayerIndex);
      if (msg.type === 'full_state' && msg.state) {
        console.log('[netStore] Setting gameState, phase:', msg.state.phase);
        set({ gameState: msg.state, myPlayerIndex: msg.myPlayerIndex ?? guestPlayerIndex });
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
function executeAction(action: any) {
  console.log('[netStore] Host executing action:', action.type, 'from player', action.playerIndex);
  const store = useGameStore.getState();

  switch (action.type) {
    case 'attack': {
      // Ищем карту у игрока, отправившего action (не у activePlayerIndex)
      const playerIdx = action.playerIndex ?? store.activePlayerIndex ?? 0;
      const card = store.players[playerIdx]?.hand.find(c => c.id === action.cardId);
      if (card) {
        // Устанавливаем activePlayerIndex на отправителя, если нужно
        if (store.activePlayerIndex !== playerIdx) {
          // Ход от подкидывающего — attack() использует activePlayerIndex
          // Нужно временно переключить
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
function broadcastState(network: NetworkManager | FirebaseNetworkManager, state?: GameState) {
  const raw = state ?? useGameStore.getState();
  // Убираем функции из Zustand store — Firestore не сериализует функции
  const s: GameState = ('validDefends' in raw) ? serializeGameState(raw) : raw;
  console.log('[broadcastState] phase:', s.phase, 'isFirebase:', network instanceof FirebaseNetworkManager);

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
