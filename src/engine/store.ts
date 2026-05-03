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
  confirmHandoff: () => void; // подтвердить передачу устройства

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

/** Проверить, может ли атакующий подкинуть ещё (учитывая ограничение по картам защитника) */
function canAttackerThrowMore(table: AttackCard[], defenderHandSize: number): boolean {
  // Защитник уже не может принять больше карт, чем у него в руке
  const undefendedCount = table.filter(ac => !ac.defendCard).length;
  if (undefendedCount > 0) return true; // ещё есть неотбитые — можно подкинуть к ним
  // Все отбиты — подкинуть можно только если защитник ещё не перегружен
  return table.length < defenderHandSize;
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
    const { phase, attackerIndex, table, players } = get();
    if (phase !== 'attacking' && phase !== 'defending') return false;
    if (playerIndex !== attackerIndex) return false;
    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    // Проверяем ограничение: нельзя подкинуть больше, чем у защитника карт
    if (!canAttackerThrowMore(table, players[defenderIndex].hand.length)) return false;
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
      phase: 'handoff',
      discardPile: [],
      consecutivePasses: 0,
      winner: null,
      lastAction: `${RANK_NAMES[trumpCard.rank]}${SUIT_SYMBOLS[trumpSuit]} — козырь. Ходит ${players[attackerIndex].name}`,
    });
  },

  resetGame: () => {
    set({ ...INITIAL_STATE });
  },

  confirmHandoff: () => {
    const { phase } = get();
    if (phase !== 'handoff') return;
    // После подтверждения — атакующий начинает ход
    set({ phase: 'attacking' });
  },

  attack: (card: Card) => {
    const { phase, attackerIndex, players, table } = get();
    if (phase !== 'attacking' && phase !== 'defending') return;

    // Валидация: при подкидывании проверяем ранг
    if (phase === 'defending' || (phase === 'attacking' && table.length > 0)) {
      if (!canThrowInCard(card, table)) return;
      // Дополнительная проверка: нельзя подкинуть больше, чем у защитника карт
      const defenderIndex = attackerIndex === 0 ? 1 : 0;
      if (!canAttackerThrowMore(table, players[defenderIndex].hand.length)) return;
    }

    const attacker = players[attackerIndex];
    const newHand = removeFromHand(attacker.hand, card);
    const newPlayers: Player[] = [...players];
    newPlayers[attackerIndex] = { ...attacker, hand: newHand };

    const newTable = [...table, { attackCard: card }];

    // После атаки — передаём к защитнику
    set({
      players: newPlayers,
      table: newTable,
      phase: 'handoff',
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
      // Бито! — но нужно дать атакующему подкинуть или нажать «Бито»
      // Пока просто показываем результат и ждём решения атакующего
      set({
        players: newPlayers,
        table: newTable,
        lastAction: `Отбой: ${RANK_NAMES[defendCard.rank]}${SUIT_SYMBOLS[defendCard.suit]}. Все карты отбиты!`,
      });
      // Не меняем фазу — атакующий может подкинуть или нажать Бито
    } else {
      // Есть ещё неотбитые — атакующий может подкинуть
      // Переход к атакующему для подкидывания
      set({
        players: newPlayers,
        table: newTable,
        phase: 'handoff',
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

    // Тот же атакующий продолжает — передача хода
    set({
      players: newPlayers,
      deck: currentDeck,
      table: [],
      discardPile,
      phase: 'handoff',
      consecutivePasses: 0,
      lastAction: `${players[defenderIndex].name} берёт! Атакующий продолжает.`,
    });
  },

  pass: () => {
    const { phase, attackerIndex, table, players, trumpSuit, deck, discardPile } = get();

    // Атакующий пасует (Бито!)
    if (phase === 'attacking' && table.length > 0) {
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

      // Защитник становится атакующим — handoff
      set({
        players: updatedPlayers,
        deck: currentDeck,
        table: [],
        discardPile: [...discardPile, ...allTableCards],
        attackerIndex: defenderIndex,
        phase: 'handoff',
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
    return { winner: -1, message: 'Ничья!' };
  }
  if (p1Empty) {
    return { winner: 0, message: `${players[0].name} выиграл! ${players[1].name} — дурак!` };
  }
  if (p2Empty) {
    return { winner: 1, message: `${players[1].name} выиграл! ${players[0].name} — дурак!` };
  }

  return { winner: null, message: '' };
}