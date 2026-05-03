/**
 * Компонент карты — отрисовка игральной карты с улучшенным визуалом
 */

import type { Card, Suit } from '../engine/types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../engine/cards';

/** Ранг: краткое имя для углов и полное для центра */
function rankDisplay(rank: number): { short: string; full: string } {
  switch (rank) {
    case 11: return { short: 'В', full: 'Valet' };
    case 12: return { short: 'Д', full: 'Queen' };
    case 13: return { short: 'К', full: 'King' };
    case 14: return { short: 'Т', full: 'Ace' };
    default: return { short: String(rank), full: String(rank) };
  }
}

interface CardProps {
  card: Card;
  trumpSuit?: Suit;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  faceDown?: boolean;
  className?: string;
  animating?: 'play' | 'take' | 'discard';
}

export function CardComponent({ card, trumpSuit, onClick, selected, disabled, faceDown, className = '', animating }: CardProps) {
  if (faceDown) {
    return <div className={`card-back ${className}`} />;
  }

  const color = SUIT_COLORS[card.suit];
  const isTrump = trumpSuit && card.suit === trumpSuit;
  const symbol = SUIT_SYMBOLS[card.suit];
  const { short, full } = rankDisplay(card.rank);
  const isFaceCard = card.rank >= 11;

  const animClass = animating === 'play' ? 'card-play-anim'
    : animating === 'take' ? 'card-take-anim'
    : animating === 'discard' ? 'card-discard-anim'
    : '';

  return (
    <div
      className={`playing-card ${color === 'red' ? 'card-red' : 'card-black'} ${selected ? 'selected' : ''} ${isTrump ? 'trump-card' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${animClass} ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      {/* Верхний левый угол */}
      <div className={`card-corner top-left ${color === 'red' ? 'text-red-600' : 'text-gray-800'}`}>
        <span className="card-rank">{short}</span>
        <span className="card-suit-small">{symbol}</span>
      </div>

      {/* Центр */}
      <div className={`card-center ${color === 'red' ? 'text-red-600' : 'text-gray-800'}`}>
        {isFaceCard ? (
          <div className="card-face">
            <span className="card-face-symbol">{symbol}</span>
            <span className="card-face-label">{full}</span>
          </div>
        ) : (
          <span className="card-big-suit">{symbol}</span>
        )}
      </div>

      {/* Нижний правый угол (перевёрнут) */}
      <div className={`card-corner bottom-right ${color === 'red' ? 'text-red-600' : 'text-gray-800'}`}>
        <span className="card-rank">{short}</span>
        <span className="card-suit-small">{symbol}</span>
      </div>
    </div>
  );
}