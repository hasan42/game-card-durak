/**
 * Главный экран игры «Дурак» — hot-seat режим
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
    lastAction, winner, startGame, attack, defend, take, pass, confirmHandoff,
  } = store;

  const currentPlayerIndex = phase === 'defending'
    ? (attackerIndex === 0 ? 1 : 0)
    : attackerIndex;


  // Обработчик клика по карте
  const handleCardClick = (card: Card) => {
    if (phase === 'game_over' || phase === 'waiting' || phase === 'handoff') return;

    if (phase === 'attacking') {
      attack(card);
      setSelectedCard(null);
    } else if (phase === 'defending') {
      // Защитник выбирает карту для отбоя
      setSelectedCard(card);
    }
  };

  // Обработчик отбоя
  const handleDefend = (attackCardId: string) => {
    if (selectedCard) {
      defend(attackCardId, selectedCard);
      setSelectedCard(null);
    }
  };

  // ====== Экран ожидания ======
  if (phase === 'waiting') {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-8">
        <div className="text-7xl mb-4">🃏</div>
        <h1 className="text-5xl font-bold text-yellow-300 drop-shadow-lg">Дурак</h1>
        <p className="text-xl text-green-200">Классическая карточная игра</p>
        <div className="flex flex-col gap-3 mt-4">
          <button onClick={startGame} className="btn btn-primary text-xl px-8 py-3">
            🎴 Играть (hot-seat)
          </button>
        </div>
        <div className="text-green-300/60 text-sm mt-8">
          Два игрока за одним экраном
        </div>
      </div>
    );
  }

  // ====== Экран передачи устройства ======
  if (phase === 'handoff') {
    const nextPlayer = players[currentPlayerIndex];
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-6xl mb-4">🔄</div>
        <h2 className="text-3xl font-bold text-yellow-300">Передайте устройство</h2>
        <p className="text-2xl text-green-200 font-semibold">{nextPlayer.name}</p>
        <p className="text-green-300/80">
          {attackerIndex === currentPlayerIndex ? '⚔️ Ваш ход — атакуйте!' : '🛡️ Вы защищаетесь!'}
        </p>
        {trumpCard && (
          <div className="text-green-300/60 text-sm mt-2">
            Козырь: {SUIT_SYMBOLS[trumpSuit]} {SUIT_NAMES[trumpSuit]}
          </div>
        )}
        <button onClick={confirmHandoff} className="btn btn-primary text-xl px-8 py-3 mt-4">
          👁️ Готов, вижу свои карты
        </button>
      </div>
    );
  }

  // ====== Экран конца игры ======
  if (phase === 'game_over') {
    const loserName = winner === 0 ? players[1].name : (winner === 1 ? players[0].name : '');
    const winnerName = winner === 0 ? players[0].name : (winner === 1 ? players[1].name : '');
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-7xl mb-2">{winner === -1 ? '🤝' : '🎉'}</div>
        <h1 className="text-4xl font-bold text-yellow-300 drop-shadow-lg">
          {winner === -1 ? 'Ничья!' : `${winnerName} выиграл!`}
        </h1>
        {winner !== -1 && (
          <p className="text-xl text-red-300">
            {loserName} — дурак! 🃏
          </p>
        )}
        <button onClick={startGame} className="btn btn-primary text-xl px-8 py-3 mt-4">
          🔄 Играть ещё
        </button>
        <button onClick={() => store.resetGame()} className="btn btn-danger px-6 py-2">
          В меню
        </button>
      </div>
    );
  }

  // ====== Игровой экран ======
  const myHand = players[currentPlayerIndex].hand;
  const opponentHand = players[attackerIndex === currentPlayerIndex ? 1 : 0].hand;
  const opponentName = players[attackerIndex === currentPlayerIndex ? 1 : 0].name;
  const amIAttacker = currentPlayerIndex === attackerIndex;
  const amIDefender = currentPlayerIndex !== attackerIndex;

  // Могу ли я подкинуть?

  return (
    <div className="table-bg min-h-screen flex flex-col h-screen">
      {/* Верхняя панель */}
      <div className="flex justify-between items-center px-3 py-2 bg-black/30 text-sm">
        <div className="text-green-200">
          Козырь: <span className="text-yellow-300 font-bold">
            {SUIT_SYMBOLS[trumpSuit]} {SUIT_NAMES[trumpSuit]}
          </span>
        </div>
        <div className="text-green-200">
          📦 {deck.length} | ♻️ {store.discardPile.length}
        </div>
        <div className="text-yellow-300 font-semibold">
          {amIAttacker ? '⚔️ Атака' : '🛡️ Защита'}
        </div>
      </div>

      {/* Рука противника (рубашками) */}
      <div className="flex justify-center gap-1 px-4 py-2 min-h-[60px] flex-wrap">
        <span className="text-green-200/60 text-xs w-full text-center">{opponentName} ({opponentHand.length} карт)</span>
        <div className="flex justify-center gap-0.5 flex-wrap">
          {opponentHand.map((_, i) => (
            <div key={i} className="card-back mini-card" />
          ))}
        </div>
      </div>

      {/* Стол */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
        {/* Колода + козырь */}
        {deck.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {trumpCard && (
              <CardComponent card={trumpCard} trumpSuit={trumpSuit} className="rotate-90 scale-75" />
            )}
            <div className="relative">
              {deck.length > 1 && <div className="card-back absolute -top-1 -left-1" />}
              <div className="card-back" />
            </div>
            <span className="text-green-200/60 text-xs ml-1">({deck.length})</span>
          </div>
        )}

        {/* Карты на столе */}
        {table.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-center">
            {table.map(ac => (
              <div key={ac.attackCard.id} className="flex flex-col items-center gap-1">
                <div
                  className={`relative cursor-pointer ${!ac.defendCard && amIDefender ? 'ring-2 ring-yellow-400 rounded-lg hover:ring-yellow-300' : ''}`}
                  onClick={() => !ac.defendCard && amIDefender && handleDefend(ac.attackCard.id)}
                >
                  <CardComponent card={ac.attackCard} trumpSuit={trumpSuit} />
                  {!ac.defendCard && amIDefender && (
                    <div className="absolute -top-2 -right-2 text-xs bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center font-bold">?</div>
                  )}
                </div>
                {ac.defendCard && (
                  <CardComponent card={ac.defendCard} trumpSuit={trumpSuit} className="-mt-3" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-green-200/40 text-lg">
            {amIAttacker ? 'Выберите карту для хода' : 'Ожидайте ход противника...'}
          </div>
        )}
      </div>

      {/* Действия */}
      <div className="flex justify-center gap-3 py-2 px-4">
        {phase === 'defending' && amIDefender && (
          <button onClick={take} className="btn btn-danger">
            📥 Взять ({table.filter(ac => !ac.defendCard).length + table.filter(ac => ac.defendCard).length} карт)
          </button>
        )}
        {((phase === 'defending' || phase === 'attacking') && table.length > 0 && table.every(ac => ac.defendCard) && amIAttacker) && (
          <button onClick={pass} className="btn btn-success">
            ✅ Бито!
          </button>
        )}
      </div>

      {/* Подсказка */}
      {phase === 'defending' && amIDefender && selectedCard && (
        <div className="text-center text-yellow-300 text-sm py-1">
          Нажмите на карту атаки, чтобы отбить {RANK_NAMES[selectedCard.rank]}{SUIT_SYMBOLS[selectedCard.suit]}
        </div>
      )}
      {phase === 'defending' && amIDefender && !selectedCard && table.some(ac => !ac.defendCard) && (
        <div className="text-center text-green-200 text-sm py-1">
          Выберите карту для защиты из руки
        </div>
      )}

      {/* Моя рука */}
      <div className="flex justify-center gap-1 px-4 py-3 bg-black/30 min-h-[110px] flex-wrap items-end">
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

      {/* Лог последнего действия */}
      {lastAction && (
        <div className="text-center text-green-200/70 text-xs py-1 bg-black/20">
          {lastAction}
        </div>
      )}
    </div>
  );
}