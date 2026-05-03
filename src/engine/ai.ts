/**
 * AI противник для игры «Дурак»
 * Простой бот с базовой стратегией
 */

import type { Card, Suit, AttackCard } from './types';
import { canBeat } from './cards';

/** Выбрать карту для атаки */
export function aiChooseAttack(hand: Card[], table: AttackCard[], trumpSuit: Suit): Card | null {
  if (hand.length === 0) return null;

  // Первый ход — выбираем младшую некозырную карту
  if (table.length === 0) {
    const nonTrump = hand.filter(c => c.suit !== trumpSuit);
    if (nonTrump.length > 0) {
      // Младшая некозырная
      return nonTrump.reduce((min, c) => c.rank < min.rank ? c : min, nonTrump[0]);
    }
    // Только козыри — младший козырь
    return hand.reduce((min, c) => c.rank < min.rank ? c : min, hand[0]);
  }

  // Подкидывание — ищем карту подходящего ранга
  const ranksOnTable = new Set<number>();
  for (const ac of table) {
    ranksOnTable.add(ac.attackCard.rank);
    if (ac.defendCard) ranksOnTable.add(ac.defendCard.rank);
  }

  // Пытаемся подкинуть младшую подходящую некозырную
  for (const rank of [6, 7, 8, 9, 10, 11, 12, 13, 14]) {
    if (!ranksOnTable.has(rank)) continue;
    const card = hand.find(c => c.rank === rank && c.suit !== trumpSuit);
    if (card) return card;
  }

  // Подкинуть козырь только если ранг совпадает и козырь младший
  for (const rank of [6, 7, 8, 9, 10, 11, 12, 13, 14]) {
    if (!ranksOnTable.has(rank)) continue;
    const card = hand.find(c => c.rank === rank && c.suit === trumpSuit);
    if (card && card.rank <= 10) return card; // только младшие козыри
  }

  return null; // нечего подкинуть
}

/** Выбрать карту для защиты */
export function aiChooseDefend(attackCard: Card, hand: Card[], trumpSuit: Suit): Card | null {
  // Ищем младшую подходящую некозырную
  const nonTrumpBeaters = hand
    .filter(c => c.suit === attackCard.suit && c.rank > attackCard.rank)
    .sort((a, b) => a.rank - b.rank);

  if (nonTrumpBeaters.length > 0) {
    return nonTrumpBeaters[0]; // младшая подходящая
  }

  // Козырь — только если атакующая карта не козырь или козырь младший
  if (attackCard.suit !== trumpSuit) {
    const trumpCards = hand
      .filter(c => c.suit === trumpSuit)
      .sort((a, b) => a.rank - b.rank);

    if (trumpCards.length > 0) {
      // Отбиваться козырем только если у нас мало козырей или много карт на столе
      return trumpCards[0]; // младший козырь
    }
  }

  // Нет подходящих карт — берём
  return null;
}

/** Решение: брать или отбиваться? */
export function aiDecideTake(
  table: AttackCard[],
  hand: Card[],
  trumpSuit: Suit
): boolean {
  // Если на столе много неотбитых карт и мало подходящих для защиты — берём
  const undefended = table.filter(ac => !ac.defendCard);
  const canDefend = undefended.filter(ac =>
    hand.some(c => canBeat(ac.attackCard, c, trumpSuit))
  );

  // Берём если не можем отбить больше половины
  if (canDefend.length < undefended.length / 2) return true;

  // Берём если у нас мало карт и много придётся брать
  if (hand.length <= 3 && table.length >= 3) return true;

  return false;
}

/** Решение: подкидывать ещё или сказать "Бито"? */
export function aiDecideThrowMore(
  table: AttackCard[],
  hand: Card[],
  trumpSuit: Suit,
  defenderHandSize: number
): boolean {
  // Не подкидываем если у защитника мало карт
  if (table.length >= defenderHandSize) return false;

  // Не подкидываем если у нас мало карт
  if (hand.length <= 2) return false;

  // Проверяем есть ли что подкинуть
  const nextCard = aiChooseAttack(hand, table, trumpSuit);
  return nextCard !== null;
}