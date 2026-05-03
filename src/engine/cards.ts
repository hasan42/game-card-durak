/**
 * Колоды, масти, ранги — утилиты
 */

import type { Card, Suit, Rank } from './types';

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = [6, 7, 8, 9, 10, 11, 12, 13, 14];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const SUIT_NAMES: Record<Suit, string> = {
  hearts: 'Черви',
  diamonds: 'Бубны',
  clubs: 'Трефы',
  spades: 'Пики',
};

export const RANK_NAMES: Record<Rank, string> = {
  6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
  11: 'В', 12: 'Д', 13: 'К', 14: 'Т',
};

export const SUIT_COLORS: Record<Suit, 'red' | 'black'> = {
  hearts: 'red',
  diamonds: 'red',
  clubs: 'black',
  spades: 'black',
};

/** Создать полную колоду из 36 карт */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, id: `${suit}-${rank}` });
    }
  }
  return deck;
}

/** Перемешать колоду (Fisher-Yates) */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Сравнить ранги с учётом козыря */
export function cardPower(card: Card, trumpSuit: Suit): number {
  const isTrump = card.suit === trumpSuit;
  return card.rank + (isTrump ? 100 : 0);
}

/** Может ли карта побить другую */
export function canBeat(attackCard: Card, defendCard: Card, trumpSuit: Suit): boolean {
  if (defendCard.suit === attackCard.suit) {
    return defendCard.rank > attackCard.rank;
  }
  if (defendCard.suit === trumpSuit) {
    return true; // козырь бьёт любую некозырную
  }
  return false;
}

/** Отсортировать руку: по масти, потом по рангу. Козыри в конце */
export function sortHand(hand: Card[], trumpSuit: Suit): Card[] {
  const suitOrder: Record<Suit, number> = {
    hearts: 0, diamonds: 1, clubs: 2, spades: 3,
  };
  return [...hand].sort((a, b) => {
    const aTrump = a.suit === trumpSuit ? 1 : 0;
    const bTrump = b.suit === trumpSuit ? 1 : 0;
    if (aTrump !== bTrump) return aTrump - bTrump;
    if (a.suit !== b.suit) return suitOrder[a.suit] - suitOrder[b.suit];
    return a.rank - b.rank;
  });
}

/** Красиво показать карту */
export function cardToString(card: Card): string {
  return `${RANK_NAMES[card.rank]}${SUIT_SYMBOLS[card.suit]}`;
}

/** Сколько карт нужно раздать (до 6 в руке) */
export function cardsNeeded(hand: Card[]): number {
  return Math.max(0, 6 - hand.length);
}