import { describe, it, expect } from 'vitest';
import { aiChooseAttack, aiChooseDefend, aiDecideTake, aiDecideThrowMore } from '../engine/ai';
import type { Card, Suit, AttackCard } from '../engine/types';

const HEARTS: Suit = 'hearts';
const SPADES: Suit = 'spades';
const DIAMONDS: Suit = 'diamonds';
const CLUBS: Suit = 'clubs';

function c(suit: Suit, rank: number): Card {
  return { suit, rank: rank as any, id: `${suit}-${rank}` };
}

const TRUMP = HEARTS;

describe('aiChooseAttack', () => {
  describe('первый ход (пустой стол)', () => {
    it('возвращает null при пустой руке', () => {
      expect(aiChooseAttack([], [], TRUMP)).toBeNull();
    });

    it('ходит младшей некозырной картой', () => {
      const hand = [c(SPADES, 14), c(CLUBS, 6), c(HEARTS, 6)];
      const result = aiChooseAttack(hand, [], TRUMP);
      expect(result).toBeTruthy();
      expect(result!.suit).toBe(CLUBS);
      expect(result!.rank).toBe(6);
    });

    it('предпочитает пары (ранги с 2+ картами)', () => {
      const hand = [c(CLUBS, 7), c(DIAMONDS, 7), c(SPADES, 6)];
      const result = aiChooseAttack(hand, [], TRUMP);
      // Ранг 7 — пара, ранг 6 — одиночная. Пара предпочтительнее, но 7 > 6 по рангу
      // Стратегия: сначала пары по младшему рангу
      expect(result).toBeTruthy();
      expect(result!.rank).toBe(7);
    });

    it('ходит младшим козырем если только козыри в руке', () => {
      const hand = [c(HEARTS, 12), c(HEARTS, 7), c(HEARTS, 14)];
      const result = aiChooseAttack(hand, [], TRUMP);
      expect(result!.suit).toBe(HEARTS);
      expect(result!.rank).toBe(7);
    });

    it('не ходит козырем если есть некозырные', () => {
      const hand = [c(SPADES, 6), c(HEARTS, 6)];
      const result = aiChooseAttack(hand, [], TRUMP);
      expect(result!.suit).not.toBe(HEARTS);
    });
  });

  describe('подкидывание (непустой стол)', () => {
    const table: AttackCard[] = [
      { attackCard: c(SPADES, 7), attackPlayerIndex: 0 },
    ];

    it('подкидывает карту совпадающего ранга', () => {
      const hand = [c(CLUBS, 7), c(DIAMONDS, 10), c(HEARTS, 14)];
      const result = aiChooseAttack(hand, table, TRUMP);
      expect(result).toBeTruthy();
      expect(result!.rank).toBe(7);
    });

    it('не подкидывает если нет карт подходящего ранга', () => {
      const hand = [c(CLUBS, 8), c(DIAMONDS, 10)];
      const result = aiChooseAttack(hand, table, TRUMP);
      expect(result).toBeNull();
    });

    it('не подкидывает старшие козыри при малом запасе козырей', () => {
      const table2: AttackCard[] = [
        { attackCard: c(SPADES, 7), attackPlayerIndex: 0 },
      ];
      const hand = [c(HEARTS, 13)]; // только один козырь — король
      const result = aiChooseAttack(hand, table2, TRUMP);
      expect(result).toBeNull();
    });
  });
});

describe('aiChooseDefend', () => {
  it('возвращает null если нет карт для отбивания', () => {
    const attackCard = c(SPADES, 14);
    const hand = [c(CLUBS, 6), c(DIAMONDS, 7)];
    expect(aiChooseDefend(attackCard, hand, TRUMP)).toBeNull();
  });

  it('отбивает некозырной картой той же масти', () => {
    const attackCard = c(SPADES, 8);
    const hand = [c(SPADES, 10), c(SPADES, 14)];
    const result = aiChooseDefend(attackCard, hand, TRUMP);
    expect(result).toBeTruthy();
    expect(result!.suit).toBe(SPADES);
    expect(result!.rank).toBe(10); // младшая подходящая
  });

  it('отбивает козырем если нет карты той же масти', () => {
    const attackCard = c(SPADES, 14);
    const hand = [c(HEARTS, 6), c(CLUBS, 9)];
    const result = aiChooseDefend(attackCard, hand, TRUMP);
    expect(result).toBeTruthy();
    expect(result!.suit).toBe(HEARTS);
  });

  it('предпочитает некозырную карту козырной', () => {
    const attackCard = c(CLUBS, 8);
    const hand = [c(CLUBS, 10), c(HEARTS, 6)]; // 10 треф и 6 червей (козырь)
    const result = aiChooseDefend(attackCard, hand, TRUMP);
    expect(result!.suit).toBe(CLUBS);
  });

  it('возвращает null если отбиваться нечем (нет козыря, нет масти)', () => {
    const attackCard = c(SPADES, 14);
    const hand = [c(CLUBS, 6), c(DIAMONDS, 7)];
    // Пики бьют только пики старше или козырь; в руке нет ни того ни другого
    expect(aiChooseDefend(attackCard, hand, TRUMP)).toBeNull();
  });

  it('не козырит старшим козырем при малом запасе козырей и козырной атаке', () => {
    const attackCard = c(HEARTS, 8);
    // В руке 4 карты, только 1 козырь — не стоит его тратить
    const hand = [c(HEARTS, 14), c(CLUBS, 6), c(DIAMONDS, 9), c(SPADES, 10)];
    const result = aiChooseDefend(attackCard, hand, TRUMP);
    // myTrumps=1, attackCard — козырь, handSize=4 > 3 → лучше взять
    expect(result).toBeNull();
  });

  it('отбивает младшим козырем если козырей достаточно', () => {
    const attackCard = c(HEARTS, 8);
    const hand = [c(HEARTS, 9), c(HEARTS, 14), c(CLUBS, 6)];
    // myTrumps=2, не ограничено — отбивает младшим козырем
    const result = aiChooseDefend(attackCard, hand, TRUMP);
    expect(result!.suit).toBe(HEARTS);
    expect(result!.rank).toBe(9);
  });
});

describe('aiDecideTake', () => {
  it('возвращает false если всё отбито', () => {
    const table: AttackCard[] = [
      { attackCard: c(SPADES, 7), defendCard: c(SPADES, 10), attackPlayerIndex: 0 },
    ];
    const hand = [c(CLUBS, 6)];
    expect(aiDecideTake(table, hand, TRUMP)).toBe(false);
  });

  it('берёт если не может отбить половину', () => {
    const table: AttackCard[] = [
      { attackCard: c(SPADES, 14), attackPlayerIndex: 0 },
      { attackCard: c(CLUBS, 14), attackPlayerIndex: 0 },
    ];
    // В руке нет ни пик, ни треф, только козырь — можно отбить максимум 1
    const hand = [c(HEARTS, 6)];
    expect(aiDecideTake(table, hand, TRUMP)).toBe(true);
  });

  it('не берёт если может отбить некозырной картой без затрат', () => {
    const table: AttackCard[] = [
      { attackCard: c(SPADES, 7), attackPlayerIndex: 0 },
    ];
    // Много некозырных карт для отбивания, козырей не нужно тратить
    const hand = [c(SPADES, 10), c(SPADES, 14), c(CLUBS, 9), c(DIAMONDS, 8), c(HEARTS, 6)];
    expect(aiDecideTake(table, hand, TRUMP)).toBe(false);
  });

  it('берёт если придётся тратить много козырей', () => {
    const table: AttackCard[] = [
      { attackCard: c(SPADES, 14), attackPlayerIndex: 0 },
      { attackCard: c(CLUBS, 14), attackPlayerIndex: 0 },
    ];
    // Только 2 козыря в руке из 4 карт — придётся козырить обе
    const hand = [c(HEARTS, 6), c(HEARTS, 7), c(DIAMONDS, 8), c(DIAMONDS, 9)];
    expect(aiDecideTake(table, hand, TRUMP)).toBe(true);
  });
});

describe('aiDecideThrowMore', () => {
  it('не подкидывает если стол заполнен', () => {
    const table: AttackCard[] = [
      { attackCard: c(SPADES, 7), attackPlayerIndex: 0 },
      { attackCard: c(SPADES, 8), attackPlayerIndex: 0 },
    ];
    const hand = [c(CLUBS, 7)];
    // У защитника 2 карты — стол заполнен
    expect(aiDecideThrowMore(table, hand, TRUMP, 2)).toBe(false);
  });

  it('не подкидывает если мало карт в руке', () => {
    const table: AttackCard[] = [
      { attackCard: c(SPADES, 7), attackPlayerIndex: 0 },
    ];
    const hand = [c(CLUBS, 7)];
    expect(aiDecideThrowMore(table, hand, TRUMP, 6)).toBe(false);
  });

  it('подкидывает если есть подходящие карты', () => {
    const table: AttackCard[] = [
      { attackCard: c(SPADES, 7), attackPlayerIndex: 0 },
    ];
    const hand = [c(CLUBS, 7), c(DIAMONDS, 10), c(SPADES, 9)];
    expect(aiDecideThrowMore(table, hand, TRUMP, 6)).toBe(true);
  });
});