/**
 * Главный экран игры «Дурак» — с поддержкой AI и hot-seat
 */

import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../engine/store';
import { CardComponent } from './CardComponent';
import { SUIT_SYMBOLS, RANK_NAMES, SUIT_NAMES } from '../engine/cards';
import type { Card } from '../engine/types';

export function GameScreen() {
  const store = useGameStore();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // Отслеживание новых карт на столе для анимаций
  const prevTableRef = useRef<Set<string>>(new Set());
  const [newCardIds, setNewCardIds] = useState<Set<string>>(new Set());
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    const currentIds = new Set(store.table.map(ac => ac.attackCard.id));
    const prevIds = prevTableRef.current;

    // Находим новые ID (атакующие карты)
    const addedIds = new Set<string>();
    for (const id of currentIds) {
      if (!prevIds.has(id)) addedIds.add(id);
    }

    // Находим новые отбойные карты
    for (const ac of store.table) {
      if (ac.defendCard) {
        const defendKey = `defend-${ac.attackCard.id}`;
        if (!prevIds.has(defendKey)) addedIds.add(defendKey);
      }
    }

    if (addedIds.size > 0) {
      setNewCardIds(addedIds);
      setTimeout(() => setNewCardIds(new Set()), 350);
    }

    // Анимация «Бито» — стол очищается
    if (store.table.length === 0 && prevIds.size > 0 && store.lastAction === 'Бито!') {
      setClearing(true);
      setTimeout(() => setClearing(false), 500);
    }

    // Обновляем предыдущее состояние: атакующие + отбойные
    const nextIds = new Set(store.table.map(ac => ac.attackCard.id));
    store.table.forEach(ac => {
      if (ac.defendCard) nextIds.add(`defend-${ac.attackCard.id}`);
    });
    prevTableRef.current = nextIds;
  }, [store.table, store.lastAction]);

  const {
    deck, trumpSuit, trumpCard, players, attackerIndex, table, phase,
    lastAction, winner, gameMode, aiThinking, startGame, attack, defend, take, pass, confirmHandoff,
  } = store;

  const currentPlayerIndex = gameMode === 'ai' ? 0 : (
    phase === 'defending' ? (attackerIndex === 0 ? 1 : 0) : attackerIndex
  );

  // ====== Экран выбора режима ======
  if (phase === 'waiting') {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-8">
        <div className="text-7xl mb-4">🃏</div>
        <h1 className="text-5xl font-bold text-yellow-300 drop-shadow-lg">Дурак</h1>
        <p className="text-xl text-green-200">Классическая карточная игра</p>
        <div className="flex flex-col gap-3 mt-4">
          <button onClick={() => startGame('ai')} className="btn btn-primary text-xl px-8 py-3">
            🤖 Против компьютера
          </button>
          <button onClick={() => startGame('hotseat')} className="btn bg-green-700 hover:bg-green-600 text-white text-xl px-8 py-3">
            👥 Два игрока (hot-seat)
          </button>
        </div>
        <div className="text-green-300/50 text-sm mt-8">
          36 карт • Козырь • Классические правила
        </div>
      </div>
    );
  }

  // ====== Экран передачи устройства (hot-seat) ======
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
        <div className="flex gap-3 mt-4">
          <button onClick={() => startGame(gameMode)} className="btn btn-primary text-xl px-8 py-3">
            🔄 Ещё раз
          </button>
          <button onClick={() => store.resetGame()} className="btn btn-danger px-6 py-2">
            В меню
          </button>
        </div>
      </div>
    );
  }

  // ====== Игровой экран ======
  const myHand = players[0].hand; // В AI всегда игрок 0
  const opponentHand = players[1].hand;
  const opponentName = players[1].name;
  const amIAttacker = gameMode === 'ai' ? attackerIndex === 0 : currentPlayerIndex === attackerIndex;
  const amIDefender = gameMode === 'ai' ? attackerIndex !== 0 : currentPlayerIndex !== attackerIndex;

  return (
    <div className="table-bg min-h-screen flex flex-col h-screen">
      {/* Верхняя панель */}
      <div className="top-panel flex justify-between items-center px-3 py-2 bg-black/30 text-sm">
        <div className="text-green-200">
          Козырь: <span className="text-yellow-300 font-bold">{SUIT_SYMBOLS[trumpSuit]} {SUIT_NAMES[trumpSuit]}</span>
        </div>
        <div className="text-green-200">📦 {deck.length} | ♻️ {store.discardPile.length}</div>
        <div className="text-yellow-300 font-semibold">
          {aiThinking ? '🤔 Компьютер думает...' : (amIAttacker ? '⚔️ Атака' : '🛡️ Защита')}
        </div>
      </div>

      {/* Рука противника */}
      <div className="flex flex-col items-center gap-0.5 px-4 py-1">
        <span className="text-green-200/60 text-xs">{opponentName} ({opponentHand.length})</span>
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
          </div>
        )}

        {/* Карты на столе */}
        {table.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-center">
            {table.map(ac => {
              const isNewAttack = newCardIds.has(ac.attackCard.id);
              const isNewDefend = ac.defendCard && newCardIds.has(`defend-${ac.attackCard.id}`);
              return (
                <div key={ac.attackCard.id} className="flex flex-col items-center gap-1">
                  <div
                    className={`relative ${!ac.defendCard && amIDefender ? 'ring-2 ring-yellow-400 rounded-lg cursor-pointer hover:ring-yellow-300' : ''}`}
                    onClick={() => !ac.defendCard && amIDefender && handleDefend(ac.attackCard.id)}
                  >
                    <CardComponent card={ac.attackCard} trumpSuit={trumpSuit} animating={isNewAttack ? 'play' : undefined} />
                    {!ac.defendCard && amIDefender && (
                      <div className="absolute -top-2 -right-2 text-xs bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center font-bold">?</div>
                    )}
                  </div>
                  {ac.defendCard && (
                    <CardComponent card={ac.defendCard} trumpSuit={trumpSuit} className="-mt-3" animating={isNewDefend ? 'play' : undefined} />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-green-200/40 text-lg">
            {clearing ? (
              <span className="cards-clear text-2xl font-bold text-green-300">✅ Бито!</span>
            ) : (
              amIAttacker ? 'Выберите карту для хода' : 'Ожидайте ход противника...'
            )}
          </div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-center gap-3 py-2 px-4">
        {amIDefender && table.some(ac => !ac.defendCard) && (
          <button onClick={take} className="btn btn-danger" disabled={aiThinking}>
            📥 Взять ({table.reduce((n, ac) => n + (ac.defendCard ? 0 : 1), 0)} карт)
          </button>
        )}
        {amIAttacker && table.length > 0 && table.every(ac => ac.defendCard) && (
          <button onClick={pass} className="btn btn-success" disabled={aiThinking}>
            ✅ Бито!
          </button>
        )}
      </div>

      {/* Подсказка */}
      {amIDefender && selectedCard && (
        <div className="text-center text-yellow-300 text-sm py-1">
          Нажмите на карту атаки, чтобы отбить {RANK_NAMES[selectedCard.rank]}{SUIT_SYMBOLS[selectedCard.suit]}
        </div>
      )}

      {/* Моя рука */}
      <div className="player-hand flex justify-start gap-1 px-4 py-3 bg-black/30 min-h-[100px] flex-wrap items-end">
        {myHand.map(card => (
          <CardComponent
            key={card.id}
            card={card}
            trumpSuit={trumpSuit}
            selected={selectedCard?.id === card.id}
            onClick={() => {
              if (aiThinking) return;
              if (amIAttacker && (phase === 'attacking' || (phase === 'defending' && gameMode === 'ai'))) {
                attack(card);
                setSelectedCard(null);
              } else if (amIDefender) {
                setSelectedCard(card);
              }
            }}
            disabled={aiThinking}
          />
        ))}
      </div>

      {/* Лог */}
      {lastAction && (
        <div className="text-center text-green-200/70 text-xs py-1 bg-black/20">{lastAction}</div>
      )}
    </div>
  );

  function handleDefend(attackCardId: string) {
    if (selectedCard) {
      defend(attackCardId, selectedCard);
      setSelectedCard(null);
    }
  }
}