/**
 * AI противник для игры «Дурак»
 * Улучшенная стратегия: учёт козырей, подсчёт карт, умное решение брать/отбиваться
 */

import type { Card, Suit, AttackCard } from './types';
import { canBeat } from './cards';

// ─── Вспомогательные функции ───

/** Количество козырей в руке */
function trumpCount(hand: Card[], trumpSuit: Suit): number {
  return hand.filter(c => c.suit === trumpSuit).length;
}

/** Самый младший козырь в руке */

/** Карты, которыми можно отбить атакующую карту */
function beatableCards(attackCard: Card, hand: Card[], trumpSuit: Suit): Card[] {
  return hand.filter(c => canBeat(attackCard, c, trumpSuit));
}

/** Ранги на столе (для подкидывания) */
function ranksOnTable(table: AttackCard[]): Set<number> {
  const ranks = new Set<number>();
  for (const ac of table) {
    ranks.add(ac.attackCard.rank);
    if (ac.defendCard) ranks.add(ac.defendCard.rank);
  }
  return ranks;
}

/** «Сила» карты: ниже = лучше для сброса */
function cardPower(card: Card, trumpSuit: Suit): number {
  const base = card.rank;
  const trumpBonus = card.suit === trumpSuit ? 100 : 0;
  return base + trumpBonus;
}

// ─── Атака ───

/** Выбрать карту для атаки (первый ход) */
function aiFirstAttack(hand: Card[], trumpSuit: Suit): Card | null {
  if (hand.length === 0) return null;

  // Стратегия: ходим младшей некозырной, предпочитая карты которых много (пары)
  const nonTrump = hand.filter(c => c.suit !== trumpSuit);

  if (nonTrump.length > 0) {
    // Группируем по рангу — предпочитаем ранги с 2+ картами (пары/тройки)
    const byRank = new Map<number, Card[]>();
    for (const c of nonTrump) {
      const arr = byRank.get(c.rank) || [];
      arr.push(c);
      byRank.set(c.rank, arr);
    }

    // Сначала пытаемся ходить парой — младший ранг с 2+ картами
    const pairs = [...byRank.entries()]
      .filter(([_, cards]) => cards.length >= 2)
      .sort(([a], [b]) => a - b);

    if (pairs.length > 0) {
      return pairs[0][1][0]; // Младшая карта из лучшей пары
    }

    // Нет пар — ходим младшей некозырной
    return nonTrump.reduce((min, c) => c.rank < min.rank ? c : min, nonTrump[0]);
  }

  // Только козыри — ходим самым младшим
  return hand.reduce((min, c) => c.rank < min.rank ? c : min, hand[0]);
}

/** Выбрать карту для подкидывания */
function aiThrowIn(hand: Card[], table: AttackCard[], trumpSuit: Suit): Card | null {
  const ranks = ranksOnTable(table);
  const undefended = table.filter(ac => !ac.defendCard).length;

  // Не подкидываем если у защитника мало карт
  // Не подкидываем козырями (кроме мелких) если у нас мало козырей
  const myTrumps = trumpCount(hand, trumpSuit);

  // Приоритет: сбрасываем слабые некозырные карты, совпадающие по рангу
  const candidates = hand
    .filter(c => ranks.has(c.rank))
    .filter(c => {
      // Не подкидываем старшие козыри
      if (c.suit === trumpSuit && c.rank >= 11 && myTrumps <= 2) return false;
      // Не подкидываем если на столе много неотбитых
      if (undefended >= 2) return false;
      return true;
    })
    .sort((a, b) => cardPower(a, trumpSuit) - cardPower(b, trumpSuit));

  return candidates[0] || null;
}

/** Общая функция атаки */
export function aiChooseAttack(hand: Card[], table: AttackCard[], trumpSuit: Suit): Card | null {
  if (hand.length === 0) return null;

  if (table.length === 0) {
    return aiFirstAttack(hand, trumpSuit);
  }

  return aiThrowIn(hand, table, trumpSuit);
}

// ─── Защита ───

/** Выбрать карту для защиты */
export function aiChooseDefend(attackCard: Card, hand: Card[], trumpSuit: Suit): Card | null {
  const options = beatableCards(attackCard, hand, trumpSuit);
  if (options.length === 0) return null;

  // Сортируем по «стоимости» — сначала дешёвые некозырные, потом козыри
  options.sort((a, b) => cardPower(a, trumpSuit) - cardPower(b, trumpSuit));

  const myTrumps = trumpCount(hand, trumpSuit);
  const handSize = hand.length;

  // Если атакующая карта не козырь — пытаемся отбить некозырной
  const nonTrumpOptions = options.filter(c => c.suit !== trumpSuit);
  if (nonTrumpOptions.length > 0) {
    // Отбиваем младшей подходящей некозырной
    return nonTrumpOptions[0];
  }

  // Приходится козырить
  // Но не козырим старшими козырями если у нас мало козырей или много карт на руке
  const trumpOptions = options.filter(c => c.suit === trumpSuit);
  if (trumpOptions.length > 0) {
    // Не козырим козырную карту старшим козырем если у нас мало козырей
    if (attackCard.suit === trumpSuit && myTrumps <= 1 && handSize > 3) {
      return null; // Лучше взять
    }
    return trumpOptions[0]; // Младший козырь
  }

  return null;
}

// ─── Решения ───

/** Решение: брать или отбиваться? */
export function aiDecideTake(table: AttackCard[], hand: Card[], trumpSuit: Suit): boolean {
  const undefended = table.filter(ac => !ac.defendCard);
  if (undefended.length === 0) return false;

  // Сколько можем отбить?
  let canDefendCount = 0;
  let totalCost = 0;

  for (const ac of undefended) {
    const options = beatableCards(ac.attackCard, hand, trumpSuit);
    if (options.length > 0) {
      canDefendCount++;
      // Стоимость отбития — «сила» лучшей (дешёвой) карты
      const best = options.sort((a, b) => cardPower(a, trumpSuit) - cardPower(b, trumpSuit))[0];
      totalCost += cardPower(best, trumpSuit);
    }
  }

  const myTrumps = trumpCount(hand, trumpSuit);

  // Берём если:
  // 1. Не можем отбить больше половины
  if (canDefendCount < Math.ceil(undefended.length / 2)) return true;

  // 2. Придётся потратить много козырей и у нас их мало
  const needTrumps = undefended.filter(ac =>
    hand.some(c => canBeat(ac.attackCard, c, trumpSuit) && c.suit === trumpSuit)
  ).length;
  if (needTrumps > 0 && myTrumps <= needTrumps + 1 && hand.length <= 4) return true;

  // 3. Слишком дорого — средняя стоимость > 50 (придётся тратить козыри)
  if (canDefendCount > 0 && totalCost / canDefendCount > 50 && hand.length <= 3) return true;

  return false;
}

/** Решение: подкидывать ещё? (не используется в текущей архитектуре, но доступно) */
export function aiDecideThrowMore(
  table: AttackCard[],
  hand: Card[],
  trumpSuit: Suit,
  defenderHandSize: number
): boolean {
  if (table.length >= defenderHandSize) return false;
  if (hand.length <= 2) return false;
  return aiChooseAttack(hand, table, trumpSuit) !== null;
}