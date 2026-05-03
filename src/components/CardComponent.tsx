/**
 * Компонент карты — отрисовка игральной карты
 */

import type { Card, Suit } from '../engine/types';
import { SUIT_SYMBOLS, RANK_NAMES, SUIT_COLORS } from '../engine/cards';

interface CardProps {
  card: Card;
  trumpSuit?: Suit;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  faceDown?: boolean;
  className?: string;
}

export function CardComponent({ card, trumpSuit, onClick, selected, disabled, faceDown, className = '' }: CardProps) {
  if (faceDown) {
    return <div className={`card-back ${className}`} />;
  }

  const color = SUIT_COLORS[card.suit];
  const isTrump = trumpSuit && card.suit === trumpSuit;
  const symbol = SUIT_SYMBOLS[card.suit];
  const rank = RANK_NAMES[card.rank];

  return (
    <div
      className={`playing-card ${color} ${selected ? 'selected' : ''} ${isTrump ? 'trump-card' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex flex-col items-center justify-between h-full p-1">
        <div className="text-left w-full text-xs font-bold leading-none">
          <div>{rank}</div>
          <div>{symbol}</div>
        </div>
        <div className="text-2xl leading-none">{symbol}</div>
        <div className="text-right w-full text-xs font-bold leading-none rotate-180">
          <div>{rank}</div>
          <div>{symbol}</div>
        </div>
      </div>
    </div>
  );
}