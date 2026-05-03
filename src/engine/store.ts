/**
 * Игровой движок «Дурак» — Zustand store с поддержкой AI и hot-seat
 */

import { create } from 'zustand';
import type { Card, GameState, AttackCard, Player, GameMode, Suit, GamePhase } from './types';
import { createDeck, shuffle, canBeat, sortHand, cardsNeeded, SUIT_SYMBOLS, RANK_NAMES } from './cards';
import { aiChooseAttack, aiChooseDefend, aiDecideTake } from './ai';

interface GameStore extends GameState {
  gameMode: GameMode;
  aiThinking: boolean;
  startGame: (mode?: GameMode) => void;
  resetGame: () => void;
  attack: (card: Card) => void;
  defend: (attackCardId: string, defendCard: Card) => void;
  take: () => void;
  pass: () => void;
  confirmHandoff: () => void;
  validDefends: (attackCardId: string) => Card[];
  canThrowIn: (card: Card, playerIndex: number) => boolean;
}

const INITIAL_STATE = {
  deck: [],
  trumpSuit: 'hearts' as Suit,
  trumpCard: null,
  players: [
    { id: 'player1', name: 'Игрок 1', hand: [], isWinner: false, takenCount: 0 },
    { id: 'player2', name: 'Компьютер', hand: [], isWinner: false, takenCount: 0 },
  ],
  attackerIndex: 0,
  table: [],
  phase: 'waiting' as GamePhase,
  discardPile: [],
  consecutivePasses: 0,
  winner: null,
  lastAction: '',
  roundCount: 0,
};

function removeFromHand(hand: Card[], card: Card): Card[] {
  return hand.filter(c => c.id !== card.id);
}

function canThrowInCard(card: Card, table: AttackCard[]): boolean {
  if (table.length === 0) return true;
  const ranksOnTable = new Set<number>();
  for (const ac of table) {
    ranksOnTable.add(ac.attackCard.rank);
    if (ac.defendCard) ranksOnTable.add(ac.defendCard.rank);
  }
  return ranksOnTable.has(card.rank);
}

/** AI делает ход с задержкой */
function scheduleAiMove(get: () => GameStore, set: (s: Partial<GameStore>) => void) {
  const state = get();
  if (state.gameMode !== 'ai' || state.phase === 'game_over' || state.phase === 'waiting') return;

  const aiIndex = 1; // AI всегда игрок 2
  const isAiAttacker = state.attackerIndex === aiIndex;
  const defenderIndex = state.attackerIndex === 0 ? 1 : 0;
  const isAiDefender = defenderIndex === aiIndex;

  set({ aiThinking: true });

  setTimeout(() => {
    const s = get();
    if (s.phase === 'game_over' || s.phase === 'waiting') {
      set({ aiThinking: false });
      return;
    }

    if (s.phase === 'attacking' && isAiAttacker) {
      // AI атакует
      const card = aiChooseAttack(s.players[aiIndex].hand, s.table, s.trumpSuit);
      if (card) {
        // Проверяем можно ли подкинуть
        if (s.table.length > 0 && !canThrowInCard(card, s.table)) {
          // Нельзя — пытаемся другую или пасуем
          const allCards = s.players[aiIndex].hand;
          const validCard = allCards.find(c => canThrowInCard(c, s.table));
          if (validCard) {
            s.attack(validCard);
          } else {
            s.pass();
          }
        } else {
          s.attack(card);
        }
      } else {
        s.pass();
      }
    } else if (s.phase === 'defending' && isAiDefender) {
      // AI защищается
      const undefended = s.table.filter(ac => !ac.defendCard);

      if (undefended.length > 0) {
        const shouldTake = aiDecideTake(s.table, s.players[aiIndex].hand, s.trumpSuit);
        if (shouldTake) {
          s.take();
        } else {
          // Пытаемся отбить первую неотбитую карту
          const target = undefended[0];
          const defendCard = aiChooseDefend(target.attackCard, s.players[aiIndex].hand, s.trumpSuit);
          if (defendCard) {
            s.defend(target.attackCard.id, defendCard);
          } else {
            s.take();
          }
        }
      } else {
        // Все отбиты — AI не подкидывает (как атакующий)
        // Но AI сейчас защитник, так что жём
      }
    } else if (s.phase === 'defending' && isAiAttacker) {
      // AI атакующий и подкидывает
      const card = aiChooseAttack(s.players[aiIndex].hand, s.table, s.trumpSuit);
      if (card && canThrowInCard(card, s.table)) {
        s.attack(card);
      } else {
        // Нечего подкинуть — пасуем (Бито)
        s.pass();
      }
    }

    set({ aiThinking: false });
  }, 800 + Math.random() * 600); // Задержка для реалистичности
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,
  gameMode: 'hotseat',
  aiThinking: false,

  validDefends: (attackCardId: string) => {
    const { players, attackerIndex, trumpSuit, table } = get();
    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const defender = players[defenderIndex];
    const attackPair = table.find(ac => ac.attackCard.id === attackCardId && !ac.defendCard);
    if (!attackPair) return [];
    return defender.hand.filter(c => canBeat(attackPair.attackCard, c, trumpSuit));
  },

  canThrowIn: (card: Card, playerIndex: number) => {
    const { phase, attackerIndex, table, players } = get();
    if (phase !== 'attacking' && phase !== 'defending') return false;
    if (playerIndex !== attackerIndex) return false;
    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    if (table.filter(ac => !ac.defendCard).length + table.filter(ac => ac.defendCard).length >= players[defenderIndex].hand.length) return false;
    return canThrowInCard(card, table);
  },

  startGame: (mode: GameMode = 'hotseat') => {
    const shuffled = shuffle(createDeck());
    const trumpCard = shuffled[shuffled.length - 1];
    const trumpSuit = trumpCard.suit;

    const p1Hand = sortHand(shuffled.slice(0, 6), trumpSuit);
    const p2Hand = sortHand(shuffled.slice(6, 12), trumpSuit);
    const remainingDeck = shuffled.slice(12);

    const players: Player[] = [
      { id: 'player1', name: 'Вы', hand: p1Hand, isWinner: false, takenCount: 0 },
      { id: 'player2', name: mode === 'ai' ? 'Компьютер' : 'Игрок 2', hand: p2Hand, isWinner: false, takenCount: 0 },
    ];

    let attackerIndex = 0;
    const p1MinTrump = p1Hand.filter(c => c.suit === trumpSuit).sort((a, b) => a.rank - b.rank)[0];
    const p2MinTrump = p2Hand.filter(c => c.suit === trumpSuit).sort((a, b) => a.rank - b.rank)[0];
    if (p1MinTrump && p2MinTrump) {
      attackerIndex = p1MinTrump.rank <= p2MinTrump.rank ? 0 : 1;
    } else if (p2MinTrump) {
      attackerIndex = 1;
    }

    const initialPhase = mode === 'hotseat' ? 'handoff' : 'attacking';

    set({
      deck: remainingDeck, trumpSuit, trumpCard, players, attackerIndex,
      table: [], phase: initialPhase, discardPile: [], consecutivePasses: 0,
      winner: null, gameMode: mode, aiThinking: false, roundCount: 1,
      lastAction: `${RANK_NAMES[trumpCard.rank]}${SUIT_SYMBOLS[trumpSuit]} — козырь`,
    });

    // If AI mode and AI attacks first, schedule AI move
    if (mode === 'ai' && attackerIndex === 1) {
      scheduleAiMove(get, set);
    }
  },

  resetGame: () => {
    set({ ...INITIAL_STATE, gameMode: 'hotseat', aiThinking: false });
  },

  confirmHandoff: () => {
    const { phase } = get();
    if (phase !== 'handoff') return;
    set({ phase: 'attacking' });
  },

  attack: (card: Card) => {
    const { phase, attackerIndex, players, table, gameMode } = get();
    if (phase !== 'attacking' && phase !== 'defending') return;

    if (phase === 'defending' || (phase === 'attacking' && table.length > 0)) {
      if (!canThrowInCard(card, table)) return;
      const defenderIndex = attackerIndex === 0 ? 1 : 0;
      if (table.length >= players[defenderIndex].hand.length) return;
    }

    const attacker = players[attackerIndex];
    const newHand = removeFromHand(attacker.hand, card);
    const newPlayers: Player[] = [...players];
    newPlayers[attackerIndex] = { ...attacker, hand: newHand };

    const newTable = [...table, { attackCard: card }];

    // Determine next phase
    const nextPhase = gameMode === 'hotseat' ? 'handoff' : 'defending';
    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const actionText = attackerIndex === 0
      ? `Ход: ${RANK_NAMES[card.rank]}${SUIT_SYMBOLS[card.suit]}`
      : `Компьютер ходит: ${RANK_NAMES[card.rank]}${SUIT_SYMBOLS[card.suit]}`;

    set({
      players: newPlayers, table: newTable,
      phase: nextPhase,
      lastAction: actionText,
    });

    // AI defends
    if (gameMode === 'ai' && defenderIndex === 1) {
      scheduleAiMove(get, set);
    }
  },

  defend: (attackCardId: string, defendCard: Card) => {
    const { players, attackerIndex, trumpSuit, table, gameMode } = get();
    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const defender = players[defenderIndex];

    const attackPair = table.find(ac => ac.attackCard.id === attackCardId && !ac.defendCard);
    if (!attackPair) return;
    if (!canBeat(attackPair.attackCard, defendCard, trumpSuit)) return;

    const newHand = removeFromHand(defender.hand, defendCard);
    const newPlayers: Player[] = [...players];
    newPlayers[defenderIndex] = { ...defender, hand: newHand };

    const newTable = table.map(ac =>
      ac.attackCard.id === attackCardId ? { ...ac, defendCard: defendCard } : ac
    );

    const allDefended = newTable.every(ac => ac.defendCard !== undefined);
    const actionText = defenderIndex === 0
      ? `Отбой: ${RANK_NAMES[defendCard.rank]}${SUIT_SYMBOLS[defendCard.suit]}`
      : `Компьютер отбивает: ${RANK_NAMES[defendCard.rank]}${SUIT_SYMBOLS[defendCard.suit]}`;

    set({ players: newPlayers, table: newTable, lastAction: actionText });

    // If all defended, AI attacker may throw in more
    if (allDefended && gameMode === 'ai' && attackerIndex === 1) {
      scheduleAiMove(get, set);
    } else if (gameMode === 'ai' && defenderIndex === 1 && !allDefended) {
      // More cards to defend
      scheduleAiMove(get, set);
    }
  },

  take: () => {
    const { players, attackerIndex, trumpSuit, table, deck, discardPile, gameMode, roundCount } = get();
    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const defender = players[defenderIndex];

    const tableCards = table.flatMap(ac => {
      const cards = [ac.attackCard];
      if (ac.defendCard) cards.push(ac.defendCard);
      return cards;
    });

    const newDefenderHand = sortHand([...defender.hand, ...tableCards], trumpSuit);
    const newPlayers: Player[] = [...players];
    newPlayers[defenderIndex] = { ...defender, hand: newDefenderHand, takenCount: defender.takenCount + 1 };

    // Attacker draws
    const attacker = newPlayers[attackerIndex];
    let currentDeck = [...deck];
    const attackerNeeds = cardsNeeded(attacker.hand);
    if (attackerNeeds > 0 && currentDeck.length > 0) {
      const cards = currentDeck.slice(0, attackerNeeds);
      currentDeck = currentDeck.slice(attackerNeeds);
      newPlayers[attackerIndex] = { ...attacker, hand: sortHand([...attacker.hand, ...cards], trumpSuit) };
    }

    const gameOver = checkGameOver(newPlayers, currentDeck);
    if (gameOver.winner !== null || gameOver.winner === -1) {
      set({ players: newPlayers, deck: currentDeck, table: [], discardPile,
        phase: 'game_over', winner: gameOver.winner, lastAction: gameOver.message, roundCount: roundCount + 1 });
      return;
    }

    const nextPhase = gameMode === 'hotseat' ? 'handoff' : 'attacking';
    set({
      players: newPlayers, deck: currentDeck, table: [], discardPile,
      phase: nextPhase, consecutivePasses: 0, roundCount: roundCount + 1,
      lastAction: gameMode === 'ai' && defenderIndex === 1
        ? 'Компьютер берёт карты!'
        : `${players[defenderIndex].name} берёт!`,
    });

    // In AI mode, attacker continues
    if (gameMode === 'ai' && attackerIndex === 1) {
      scheduleAiMove(get, set);
    }
  },

  pass: () => {
    const { phase, attackerIndex, table, players, trumpSuit, deck, discardPile, gameMode, roundCount } = get();

    if ((phase === 'attacking' || phase === 'defending') && table.length > 0) {
      const allDefended = table.every(ac => ac.defendCard !== undefined);
      if (!allDefended) return;

      const allTableCards = table.flatMap(ac => [ac.attackCard, ac.defendCard!]);
      const defenderIndex = attackerIndex === 0 ? 1 : 0;

      let updatedPlayers = [...players];
      let currentDeck = [...deck];

      // Draw cards: defender first, then attacker
      for (const idx of [defenderIndex, attackerIndex]) {
        const needs = cardsNeeded(updatedPlayers[idx].hand);
        if (needs > 0 && currentDeck.length > 0) {
          const cards = currentDeck.slice(0, needs);
          currentDeck = currentDeck.slice(needs);
          updatedPlayers[idx] = { ...updatedPlayers[idx], hand: sortHand([...updatedPlayers[idx].hand, ...cards], trumpSuit) };
        }
      }

      const gameOver = checkGameOver(updatedPlayers, currentDeck);
      if (gameOver.winner !== null || gameOver.winner === -1) {
        set({ players: updatedPlayers, deck: currentDeck, table: [], discardPile: [...discardPile, ...allTableCards],
          phase: 'game_over', winner: gameOver.winner, lastAction: gameOver.message });
        return;
      }

      const nextPhase = gameMode === 'hotseat' ? 'handoff' : 'attacking';
      set({ players: updatedPlayers, deck: currentDeck, table: [],
        discardPile: [...discardPile, ...allTableCards],
        attackerIndex: defenderIndex, phase: nextPhase, consecutivePasses: 0, roundCount: roundCount + 1,
        lastAction: 'Бито!' });

      // AI takes next turn
      if (gameMode === 'ai' && defenderIndex === 1) {
        scheduleAiMove(get, set);
      }
    }
  },
}));

function checkGameOver(players: Player[], deck: Card[]): { winner: number | null; message: string } {
  const p1Empty = players[0].hand.length === 0;
  const p2Empty = players[1].hand.length === 0;
  const deckEmpty = deck.length === 0;

  if (!deckEmpty) return { winner: null, message: '' };

  if (p1Empty && p2Empty) return { winner: -1, message: 'Ничья!' };
  if (p1Empty) return { winner: 0, message: `${players[0].name} выиграл! ${players[1].name} — дурак!` };
  if (p2Empty) return { winner: 1, message: `${players[1].name} выиграл! ${players[0].name} — дурак!` };

  return { winner: null, message: '' };
}