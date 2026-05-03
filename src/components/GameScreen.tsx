/**
 * Главный экран игры «Дурак»
 */

import { useState } from 'react';
import { useGameStore } from '../engine/store';
import { CardComponent } from './CardComponent';
import { SUIT_SYMBOLS, RANK_NAMES, SUIT_NAMES } from '../engine/cards';
import type { Card } from '../engine/types';

export function GameScreen() {
  const store = useGameStore();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const {
    deck, trumpSuit, trumpCard, players, attackerIndex, table, phase,
    lastAction, winner, startGame, attack, defend, take, pass,
  } = store;

  const myIndex = 0; // В hot-seat режиме — игрок 1
  const opponentIndex = 1;
  const isAttacker = attackerIndex === myIndex;
  const isDefender = attackerIndex !== myIndex;

  // Обработчик клика по карте
  const handleCardClick = (card: Card) => {
    if (phase === 'game_over' || phase === 'waiting') return;

    if (phase === 'attacking') {
      if (isAttacker) {
        attack(card);
        setSelectedCard(null);
      }
    } else if (phase === 'defending') {
      if (isDefender) {
        // Защитник выбирает карту для отбоя
        setSelectedCard(card);
      } else {
        // Атакующий подкидывает
        if (store.canThrowIn(card, myIndex)) {
          attack(card);
        }
      }
    }
  };

  // Обработчик отбоя (защитник кладёт карту на карту атаки)
  const handleDefend = (attackCardId: string) => {
    if (selectedCard) {
      defend(attackCardId, selectedCard);
      setSelectedCard(null);
    }
  };

  if (phase === 'waiting') {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-8">
        <h1 className="text-5xl font-bold text-yellow-300 drop-shadow-lg">🃏 Дурак</h1>
        <p className="text-xl text-green-200">Классическая карточная игра</p>
        <button onClick={startGame} className="btn btn-primary text-xl px-8 py-3">
          Начать игру
        </button>
      </div>
    );
  }

  if (phase === 'game_over') {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-5xl font-bold text-yellow-300 drop-shadow-lg">
          {winner === null ? '🤝 Ничья!' : `🎉 Игрок ${winner! + 1} выиграл!`}
        </h1>
        <p className="text-xl text-green-200">
          {winner !== null ? 'Дурак — ' + (winner === 0 ? 'Игрок 2' : 'Игрок 1') : 'Оба без карт!'}
        </p>
        <button onClick={startGame} className="btn btn-primary text-xl px-8 py-3">
          Играть ещё
        </button>
      </div>
    );
  }

  const myHand = players[myIndex].hand;
  const opponentHand = players[opponentIndex].hand;
  // defenderIndex computed inline where needed

  return (
    <div className="table-bg min-h-screen flex flex-col h-screen">
      {/* Верхняя панель — инфо */}
      <div className="flex justify-between items-center px-4 py-2 bg-black/20 text-sm">
        <div className="text-green-200">
          Козырь: <span className="text-yellow-300 font-bold">
            {SUIT_SYMBOLS[trumpSuit]} {SUIT_NAMES[trumpSuit]}
          </span>
        </div>
        <div className="text-green-200">
          Колода: {deck.length} | Отбой: {store.discardPile.length}
        </div>
        <div className="text-yellow-300 font-semibold">
          {isAttacker ? '⚔️ Ваш ход' : '🛡️ Защита'}
        </div>
      </div>

      {/* Рука противника (рубашками) */}
      <div className="flex justify-center gap-1 px-4 py-2 min-h-[80px]">
        {opponentHand.map((_, i) => (
          <div key={i} className="card-back" />
        ))}
      </div>

      {/* Стол */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        {/* Козырь (нижняя карта колоды) */}
        {deck.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-green-200 text-sm">Колода</span>
            <CardComponent card={trumpCard!} trumpSuit={trumpSuit} />
            {deck.length > 1 && (
              <div className="card-back -ml-8" />
            )}
          </div>
        )}

        {/* Карты на столе */}
        {table.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {table.map(ac => (
              <div key={ac.attackCard.id} className="flex items-center gap-2">
                {/* Атакующая карта */}
                <div
                  className={`relative cursor-pointer ${!ac.defendCard && isDefender ? 'ring-2 ring-yellow-400 rounded-lg' : ''}`}
                  onClick={() => !ac.defendCard && isDefender && handleDefend(ac.attackCard.id)}
                >
                  <CardComponent card={ac.attackCard} trumpSuit={trumpSuit} />
                  {!ac.defendCard && isDefender && (
                    <div className="absolute -top-1 -right-1 text-xs bg-yellow-400 text-black rounded-full w-4 h-4 flex items-center justify-center">?</div>
                  )}
                </div>
                {/* Защищающая карта */}
                {ac.defendCard && (
                  <CardComponent card={ac.defendCard} trumpSuit={trumpSuit} className="-ml-6 -mt-2" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Сообщение о последнем действии */}
        {lastAction && (
          <div className="text-green-200 text-sm italic mt-2">{lastAction}</div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-center gap-3 py-2 px-4">
        {phase === 'defending' && isDefender && (
          <button onClick={take} className="btn btn-danger">
            📥 Взять
          </button>
        )}
        {phase === 'defending' && isDefender && table.every(ac => ac.defendCard) && (
          <button onClick={pass} className="btn btn-success">
            ✅ Бито!
          </button>
        )}
        {phase === 'attacking' && isAttacker && table.length > 0 && table.every(ac => ac.defendCard) && (
          <button onClick={pass} className="btn btn-success">
            ✅ Бито!
          </button>
        )}
        {phase === 'attacking' && isAttacker && table.length === 0 && (
          <span className="text-green-200 text-sm">Выберите карту для хода</span>
        )}
      </div>

      {/* Моя рука */}
      <div className="flex justify-center gap-1 px-4 py-3 bg-black/30 min-h-[110px] flex-wrap">
        {myHand.map(card => (
          <CardComponent
            key={card.id}
            card={card}
            trumpSuit={trumpSuit}
            selected={selectedCard?.id === card.id}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      {/* Подсказка для защитника */}
      {phase === 'defending' && isDefender && selectedCard && (
        <div className="text-center text-yellow-300 text-sm py-1">
          Нажмите на атакующую карту, чтобы отбить её {RANK_NAMES[selectedCard.rank]}{SUIT_SYMBOLS[selectedCard.suit]}
        </div>
      )}
    </div>
  );
}