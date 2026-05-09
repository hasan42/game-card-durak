import { describe, it, expect } from 'vitest';
import {
  createDeck, shuffle, cardPower, canBeat, sortHand, cardsNeeded,
  getNextPlayerIndex, getPrevPlayerIndex, SUITS, RANKS, SUIT_SYMBOLS,
  RANK_NAMES, SUIT_COLORS, cardToString
} from '../engine/cards';
import type { Suit, Rank, Card } from '../engine/types';

describe('createDeck', () => {
  it('создаёт колоду из 36 карт', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(36);
  });

  it('содержит все комбинации масть×ранг', () => {
    const deck = createDeck();
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        expect(deck.find(c => c.suit === suit && c.rank === rank)).toBeTruthy();
      }
    }
  });

  it('каждая карта имеет уникальный id', () => {
    const deck = createDeck();
    const ids = deck.map(c => c.id);
    expect(new Set(ids).size).toBe(36);
  });

  it('id соответствует формату "масть-ранг"', () => {
    const deck = createDeck();
    for (const card of deck) {
      expect(card.id).toBe(`${card.suit}-${card.rank}`);
    }
  });
});

describe('shuffle', () => {
  it('возвращает массив той же длины', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(5);
  });

  it('не модифицирует исходный массив', () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    shuffle(arr);
    expect(arr).toEqual(copy);
  });

  it('содержит те же элементы', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('cardPower', () => {
  it('козырь сильнее любого некозыря', () => {
    const trump: Suit = 'spades';
    const trump6: Card = { suit: 'spades', rank: 6, id: 'spades-6' };
    const aceHearts: Card = { suit: 'hearts', rank: 14, id: 'hearts-14' };
    expect(cardPower(trump6, trump)).toBeGreaterThan(cardPower(aceHearts, trump));
  });

  it('некозыри одной масти сравниваются по рангу', () => {
    const trump: Suit = 'spades';
    const card1: Card = { suit: 'hearts', rank: 10, id: 'hearts-10' };
    const card2: Card = { suit: 'hearts', rank: 14, id: 'hearts-14' };
    expect(cardPower(card2, trump)).toBeGreaterThan(cardPower(card1, trump));
  });

  it('козырь получает бонус +100 к силе', () => {
    const trump: Suit = 'hearts';
    const card: Card = { suit: 'hearts', rank: 7, id: 'hearts-7' };
    expect(cardPower(card, trump)).toBe(107);
    expect(cardPower(card, 'spades' as Suit)).toBe(7);
  });
});

describe('canBeat', () => {
  const trump: Suit = 'hearts';

  it('карта той же масти с большим рангом бьёт', () => {
    const attack: Card = { suit: 'hearts', rank: 6, id: 'hearts-6' };
    const defend: Card = { suit: 'hearts', rank: 10, id: 'hearts-10' };
    expect(canBeat(attack, defend, trump)).toBe(true);
  });

  it('карта той же масти с меньшим рангом не бьёт', () => {
    const attack: Card = { suit: 'hearts', rank: 10, id: 'hearts-10' };
    const defend: Card = { suit: 'hearts', rank: 6, id: 'hearts-6' };
    expect(canBeat(attack, defend, trump)).toBe(false);
  });

  it('козырь бьёт некозырную карту', () => {
    const attack: Card = { suit: 'spades', rank: 14, id: 'spades-14' };
    const defend: Card = { suit: 'hearts', rank: 6, id: 'hearts-6' };
    expect(canBeat(attack, defend, trump)).toBe(true);
  });

  it('некозырная другая масть не бьёт', () => {
    const attack: Card = { suit: 'spades', rank: 6, id: 'spades-6' };
    const defend: Card = { suit: 'clubs', rank: 14, id: 'clubs-14' };
    expect(canBeat(attack, defend, trump)).toBe(false);
  });

  it('равный ранг той же масти не бьёт', () => {
    const attack: Card = { suit: 'hearts', rank: 10, id: 'hearts-10' };
    const defend: Card = { suit: 'hearts', rank: 10, id: 'hearts-10' };
    expect(canBeat(attack, defend, trump)).toBe(false);
  });
});

describe('sortHand', () => {
  const trump: Suit = 'hearts';

  it('козыри идут после некозырей', () => {
    const hand: Card[] = [
      { suit: 'hearts', rank: 14, id: 'hearts-14' },
      { suit: 'clubs', rank: 6, id: 'clubs-6' },
    ];
    const sorted = sortHand(hand, trump);
    expect(sorted[0].suit).toBe('clubs');
    expect(sorted[1].suit).toBe('hearts');
  });

  it('карты одной масти сортируются по рангу', () => {
    const hand: Card[] = [
      { suit: 'clubs', rank: 14, id: 'clubs-14' },
      { suit: 'clubs', rank: 6, id: 'clubs-6' },
    ];
    const sorted = sortHand(hand, trump);
    expect(sorted[0].rank).toBe(6);
    expect(sorted[1].rank).toBe(14);
  });

  it('не модифицирует исходный массив', () => {
    const hand: Card[] = [
      { suit: 'hearts', rank: 14, id: 'hearts-14' },
      { suit: 'clubs', rank: 6, id: 'clubs-6' },
    ];
    const original = [...hand];
    sortHand(hand, trump);
    expect(hand).toEqual(original);
  });
});

describe('cardsNeeded', () => {
  it('возвращает 6 минус размер руки', () => {
    expect(cardsNeeded([])).toBe(6);
    expect(cardsNeeded([{ suit: 'hearts' as Suit, rank: 6 as Rank, id: 'hearts-6' }])).toBe(5);
  });

  it('возвращает 0 если в руке 6+ карт', () => {
    const hand = Array.from({ length: 8 }, (_, i) => ({
      suit: 'hearts' as Suit, rank: i + 6 as any, id: `hearts-${i + 6}`
    }));
    expect(cardsNeeded(hand)).toBe(0);
  });
});

describe('getNextPlayerIndex', () => {
  it('возвращает следующий индекс по кругу', () => {
    expect(getNextPlayerIndex(0, 4)).toBe(1);
    expect(getNextPlayerIndex(1, 4)).toBe(2);
    expect(getNextPlayerIndex(3, 4)).toBe(0);
  });

  it('пропускает указанный индекс', () => {
    expect(getNextPlayerIndex(0, 4, 1)).toBe(2);
    expect(getNextPlayerIndex(2, 4, 3)).toBe(0);
  });

  it('2 игрока: skip защитника', () => {
    expect(getNextPlayerIndex(0, 2, 1)).toBe(0);
  });
});

describe('getPrevPlayerIndex', () => {
  it('возвращает предыдущий индекс по кругу', () => {
    expect(getPrevPlayerIndex(1, 4)).toBe(0);
    expect(getPrevPlayerIndex(0, 4)).toBe(3);
  });
});

describe('константы', () => {
  it('SUITS содержит 4 масти', () => {
    expect(SUITS).toHaveLength(4);
  });

  it('RANKS содержит 9 рангов (6–Т)', () => {
    expect(RANKS).toHaveLength(9);
    expect(RANKS[0]).toBe(6);
    expect(RANKS[RANKS.length - 1]).toBe(14);
  });

  it('SUIT_SYMBOLS корректны', () => {
    expect(SUIT_SYMBOLS.hearts).toBe('♥');
    expect(SUIT_SYMBOLS.diamonds).toBe('♦');
    expect(SUIT_SYMBOLS.clubs).toBe('♣');
    expect(SUIT_SYMBOLS.spades).toBe('♠');
  });

  it('RANK_NAMES: 11=В, 12=Д, 13=К, 14=Т', () => {
    expect(RANK_NAMES[11]).toBe('В');
    expect(RANK_NAMES[12]).toBe('Д');
    expect(RANK_NAMES[13]).toBe('К');
    expect(RANK_NAMES[14]).toBe('Т');
  });

  it('SUIT_COLORS: черви и бубны — красные', () => {
    expect(SUIT_COLORS.hearts).toBe('red');
    expect(SUIT_COLORS.diamonds).toBe('red');
    expect(SUIT_COLORS.clubs).toBe('black');
    expect(SUIT_COLORS.spades).toBe('black');
  });
});

describe('cardToString', () => {
  it('формат: Ранг+Масть', () => {
    expect(cardToString({ suit: 'hearts', rank: 14, id: 'hearts-14' } as Card)).toBe('Т♥');
    expect(cardToString({ suit: 'spades', rank: 11, id: 'spades-11' } as Card)).toBe('В♠');
  });

  it('десятка отображается как 10', () => {
    expect(cardToString({ suit: 'clubs', rank: 10, id: 'clubs-10' } as Card)).toBe('10♣');
  });
});