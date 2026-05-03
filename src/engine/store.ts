/**
 * Игровой движок «Дурак» — Zustand store
 */

import { create } from 'zustand';
import type { Card, GameState, AttackCard, Player } from './types';
import { createDeck, shuffle, canBeat, sortHand, cardsNeeded, SUIT_SYMBOLS, RANK_NAMES } from './cards';

interface GameStore extends GameState {
  // Действия
  startGame: () => void;
  resetGame: () => void;
  attack: (card: Card) => void;
  defend: (attackCardId: string, defendCard: Card) => void;
  take: () => void;
  pass: () => void; // подкинуть нельзя / бито

  // Вспомогательные
  myRole: (playerIndex: number) => 'attacker' | 'defender' | 'none';
  canAttack: (playerIndex: number) => boolean;
  canDefend: () => boolean;
  canThrowIn: (card: Card, playerIndex: number) => boolean;
  validDefends: (attackCardId: string) => Card[];
}

const INITIAL_STATE: GameState = {
  deck: [],
  trumpSuit: 'hearts',
  trumpCard: null,
  players: [
    { id: 'player1', name: 'Игрок 1', hand: [], isWinner: false },
    { id: 'player2', name: 'Игрок 2', hand: [], isWinner: false },
  ],
  attackerIndex: 0,
  table: [],
  phase: 'waiting',
  discardPile: [],
  consecutivePasses: 0,
  winner: null,
  lastAction: '',
};

// dealCards removed — logic inline in startGame

/** Переместить карту из руки */
function removeFromHand(hand: Card[], card: Card): Card[] {
  return hand.filter(c => c.id !== card.id);
}

/** Проверить, можно ли подкинуть карту */
function canThrowInCard(card: Card, table: AttackCard[]): boolean {
  if (table.length === 0) return true; // первый ход — можно любую
  // Подкинуть можно только ранг, который уже есть на столе
  const ranksOnTable = new Set<number>();
  for (const ac of table) {
    ranksOnTable.add(ac.attackCard.rank);
    if (ac.defendCard) ranksOnTable.add(ac.defendCard.rank);
  }
  return ranksOnTable.has(card.rank);
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  myRole: (playerIndex: number) => {
    const { attackerIndex } = get();
    if (playerIndex === attackerIndex) return 'attacker';
    return 'defender';
  },

  canAttack: (playerIndex: number) => {
    const { phase, attackerIndex } = get();
    if (phase !== 'attacking') return false;
    return playerIndex === attackerIndex;
  },

  canDefend: () => {
    return get().phase === 'defending';
  },

  canThrowIn: (card: Card, playerIndex: number) => {
    const { phase, attackerIndex, table } = get();
    if (phase !== 'attacking' && phase !== 'defending') return false;
    if (playerIndex !== attackerIndex) return false;
    return canThrowInCard(card, table);
  },

  validDefends: (attackCardId: string) => {
    const { players, attackerIndex, trumpSuit, table } = get();
    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const defender = players[defenderIndex];
    const attackPair = table.find(ac => ac.attackCard.id === attackCardId && !ac.defendCard);
    if (!attackPair) return [];
    return defender.hand.filter(c => canBeat(attackPair.attackCard, c, trumpSuit));
  },

  startGame: () => {
    const shuffled = shuffle(createDeck());
    const trumpCard = shuffled[shuffled.length - 1];
    const trumpSuit = trumpCard.suit;

    let players: Player[] = [
      { id: 'player1', name: 'Игрок 1', hand: [], isWinner: false },
      { id: 'player2', name: 'Игрок 2', hand: [], isWinner: false },
    ];

    // Раздаём по 6 карт
    const p1Hand = sortHand(shuffled.slice(0, 6), trumpSuit);
    const p2Hand = sortHand(shuffled.slice(6, 12), trumpSuit);
    players = [
      { ...players[0], hand: p1Hand },
      { ...players[1], hand: p2Hand },
    ];
    const remainingDeck = shuffled.slice(12);

    // Кто ходит первым: у кого младший козырь
    let attackerIndex = 0;
    const p1MinTrump = p1Hand.filter(c => c.suit === trumpSuit).sort((a, b) => a.rank - b.rank)[0];
    const p2MinTrump = p2Hand.filter(c => c.suit === trumpSuit).sort((a, b) => a.rank - b.rank)[0];
    if (p1MinTrump && p2MinTrump) {
      attackerIndex = p1MinTrump.rank <= p2MinTrump.rank ? 0 : 1;
    } else if (p2MinTrump) {
      attackerIndex = 1;
    }

    set({
      deck: remainingDeck,
      trumpSuit,
      trumpCard,
      players,
      attackerIndex,
      table: [],
      phase: 'attacking',
      discardPile: [],
      consecutivePasses: 0,
      winner: null,
      lastAction: `${RANK_NAMES[trumpCard.rank]}${SUIT_SYMBOLS[trumpSuit]} — козырь. Ходит Игрок ${attackerIndex + 1}`,
    });
  },

  resetGame: () => {
    set({ ...INITIAL_STATE });
  },

  attack: (card: Card) => {
    const { phase, attackerIndex, players, table } = get();
    if (phase !== 'attacking' && phase !== 'defending') return;
    if (phase === 'defending' && !canThrowInCard(card, table)) return;

    const attacker = players[attackerIndex];
    const newHand = removeFromHand(attacker.hand, card);
    const newPlayers: Player[] = [...players];
    newPlayers[attackerIndex] = { ...attacker, hand: newHand };

    const newTable = [...table, { attackCard: card }];

    set({
      players: newPlayers,
      table: newTable,
      phase: 'defending',
      lastAction: `Ход: ${RANK_NAMES[card.rank]}${SUIT_SYMBOLS[card.suit]}`,
    });
  },

  defend: (attackCardId: string, defendCard: Card) => {
    const { players, attackerIndex, trumpSuit, table } = get();
    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const defender = players[defenderIndex];

    const attackPair = table.find(ac => ac.attackCard.id === attackCardId && !ac.defendCard);
    if (!attackPair) return;
    if (!canBeat(attackPair.attackCard, defendCard, trumpSuit)) return;

    const newHand = removeFromHand(defender.hand, defendCard);
    const newPlayers: Player[] = [...players];
    newPlayers[defenderIndex] = { ...defender, hand: newHand };

    const newTable = table.map(ac =>
      ac.attackCard.id === attackCardId
        ? { ...ac, defendCard: defendCard }
        : ac
    );

    // Все отбиты?
    const allDefended = newTable.every(ac => ac.defendCard !== undefined);

    if (allDefended) {
      // Бито! Переход хода
      const { deck: currentDeck, discardPile } = get();
      const allTableCards = newTable.flatMap(ac => [ac.attackCard, ac.defendCard!]);

      // Добираем карты: сначала защитник, потом атакующий
      let updatedPlayers = [...newPlayers];
      let deck = [...currentDeck];

      const defenderNeeds = cardsNeeded(updatedPlayers[defenderIndex].hand);
      if (defenderNeeds > 0 && deck.length > 0) {
        const cards = deck.slice(0, defenderNeeds);
        deck = deck.slice(defenderNeeds);
        updatedPlayers[defenderIndex] = {
          ...updatedPlayers[defenderIndex],
          hand: sortHand([...updatedPlayers[defenderIndex].hand, ...cards], trumpSuit),
        };
      }

      const attackerNeeds = cardsNeeded(updatedPlayers[attackerIndex].hand);
      if (attackerNeeds > 0 && deck.length > 0) {
        const cards = deck.slice(0, attackerNeeds);
        deck = deck.slice(attackerNeeds);
        updatedPlayers[attackerIndex] = {
          ...updatedPlayers[attackerIndex],
          hand: sortHand([...updatedPlayers[attackerIndex].hand, ...cards], trumpSuit),
        };
      }

      // Проверяем конец игры
      const gameOver = checkGameOver(updatedPlayers, deck);
      if (gameOver.winner !== null) {
        set({
          players: updatedPlayers,
          deck,
          table: [],
          discardPile: [...discardPile, ...allTableCards],
          phase: 'game_over',
          winner: gameOver.winner,
          lastAction: gameOver.message,
        });
        return;
      }

      // Следующий ход: защитник становится атакующим
      set({
        players: updatedPlayers,
        deck,
        table: [],
        discardPile: [...discardPile, ...allTableCards],
        attackerIndex: defenderIndex,
        phase: 'attacking',
        consecutivePasses: 0,
        lastAction: 'Бито! Ход переходит.',
      });
    } else {
      set({
        players: newPlayers,
        table: newTable,
        lastAction: `Отбой: ${RANK_NAMES[defendCard.rank]}${SUIT_SYMBOLS[defendCard.suit]}`,
      });
    }
  },

  take: () => {
    const { players, attackerIndex, trumpSuit, table, deck, discardPile } = get();
    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const defender = players[defenderIndex];

    // Защитник берёт все карты со стола
    const tableCards = table.flatMap(ac => {
      const cards = [ac.attackCard];
      if (ac.defendCard) cards.push(ac.defendCard);
      return cards;
    });

    const newDefenderHand = sortHand([...defender.hand, ...tableCards], trumpSuit);
    const newPlayers: Player[] = [...players];
    newPlayers[defenderIndex] = { ...defender, hand: newDefenderHand };

    // Атакующий добирает
    const attacker = newPlayers[attackerIndex];
    const attackerNeeds = cardsNeeded(attacker.hand);
    let currentDeck = [...deck];
    if (attackerNeeds > 0 && currentDeck.length > 0) {
      const cards = currentDeck.slice(0, attackerNeeds);
      currentDeck = currentDeck.slice(attackerNeeds);
      newPlayers[attackerIndex] = {
        ...newPlayers[attackerIndex],
        hand: sortHand([...attacker.hand, ...cards], trumpSuit),
      };
    }

    // Проверяем конец игры
    const gameOver = checkGameOver(newPlayers, currentDeck);
    if (gameOver.winner !== null) {
      set({
        players: newPlayers,
        deck: currentDeck,
        table: [],
        discardPile,
        phase: 'game_over',
        winner: gameOver.winner,
        lastAction: gameOver.message,
      });
      return;
    }

    // Тот же атакующий продолжает
    set({
      players: newPlayers,
      deck: currentDeck,
      table: [],
      discardPile,
      phase: 'attacking',
      consecutivePasses: 0,
      lastAction: 'Берёт! Атакующий продолжает.',
    });
  },

  pass: () => {
    const { phase, attackerIndex, table, players, trumpSuit, deck, discardPile } = get();

    // Атакующий пасует (не подкидывает / бито)
    if (phase === 'attacking' && table.length > 0) {
      // Если на столе есть неотбитые карты — нельзя пасовать
      const allDefended = table.every(ac => ac.defendCard !== undefined);
      if (!allDefended) return;

      // Бито — собрать и перейти ходу
      const allTableCards = table.flatMap(ac => [ac.attackCard, ac.defendCard!]);
      const defenderIndex = attackerIndex === 0 ? 1 : 0;

      let updatedPlayers = [...players];
      let currentDeck = [...deck];

      // Добираем: сначала защитник, потом атакующий
      const defenderNeeds = cardsNeeded(updatedPlayers[defenderIndex].hand);
      if (defenderNeeds > 0 && currentDeck.length > 0) {
        const cards = currentDeck.slice(0, defenderNeeds);
        currentDeck = currentDeck.slice(defenderNeeds);
        updatedPlayers[defenderIndex] = {
          ...updatedPlayers[defenderIndex],
          hand: sortHand([...updatedPlayers[defenderIndex].hand, ...cards], trumpSuit),
        };
      }

      const attackerNeeds = cardsNeeded(updatedPlayers[attackerIndex].hand);
      if (attackerNeeds > 0 && currentDeck.length > 0) {
        const cards = currentDeck.slice(0, attackerNeeds);
        currentDeck = currentDeck.slice(attackerNeeds);
        updatedPlayers[attackerIndex] = {
          ...updatedPlayers[attackerIndex],
          hand: sortHand([...updatedPlayers[attackerIndex].hand, ...cards], trumpSuit),
        };
      }

      const gameOver = checkGameOver(updatedPlayers, currentDeck);
      if (gameOver.winner !== null) {
        set({
          players: updatedPlayers,
          deck: currentDeck,
          table: [],
          discardPile: [...discardPile, ...allTableCards],
          phase: 'game_over',
          winner: gameOver.winner,
          lastAction: gameOver.message,
        });
        return;
      }

      set({
        players: updatedPlayers,
        deck: currentDeck,
        table: [],
        discardPile: [...discardPile, ...allTableCards],
        attackerIndex: defenderIndex,
        phase: 'attacking',
        consecutivePasses: 0,
        lastAction: 'Бито! Ход переходит.',
      });
    }
  },
}));

/** Проверка конца игры */
function checkGameOver(players: Player[], deck: Card[]): { winner: number | null; message: string } {
  const p1Empty = players[0].hand.length === 0;
  const p2Empty = players[1].hand.length === 0;
  const deckEmpty = deck.length === 0;

  if (!deckEmpty) return { winner: null, message: '' };

  if (p1Empty && p2Empty) {
    // Ничья — оба без карт (редкий случай)
    return { winner: null, message: 'Ничья!' };
  }
  if (p1Empty) {
    const newPlayers: Player[] = [...players];
    newPlayers[0] = { ...newPlayers[0], isWinner: true };
    return { winner: 0, message: 'Игрок 1 выиграл!' };
  }
  if (p2Empty) {
    const newPlayers: Player[] = [...players];
    newPlayers[1] = { ...newPlayers[1], isWinner: true };
    return { winner: 1, message: 'Игрок 2 выиграл!' };
  }

  return { winner: null, message: '' };
}