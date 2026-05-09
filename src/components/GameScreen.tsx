/**
 * Главный экран игры «Дурак» — AI, hot-seat, сеть
 */

import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../engine/store';
import { useNetStore } from '../engine/netStore';
import { CardComponent } from './CardComponent';
import { NetworkScreen } from './NetworkScreen';
import { SUIT_SYMBOLS, RANK_NAMES, SUIT_NAMES } from '../engine/cards';
import type { Card, GameState } from '../engine/types';
import type { NetworkRole } from 'game-network-lib';
import type { NetworkManagerInterface } from 'game-network-lib';
import { VKNetworkManager } from '../engine/vkNetwork';
import { isVKEnvironment } from '../vk';
import type { NetworkBackend } from '../engine/netStore';

export function GameScreen() {
  const store = useGameStore();
  const netStore = useNetStore();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showNetwork, setShowNetwork] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);

  // Анимации
  const prevTableRef = useRef<Set<string>>(new Set());
  const [newCardIds, setNewCardIds] = useState<Set<string>>(new Set());
  const [clearing, setClearing] = useState(false);

  const isNetworkMode = netStore.role !== null;
  const myPlayerIndex = netStore.myPlayerIndex;
  const netGameState = netStore.gameState;

  // Для гостя — используем состояние из сети, для хоста — из store
  const gameState: GameState | null = isNetworkMode
    ? (netStore.role === 'guest' ? netGameState : store)
    : store;

  useEffect(() => {
    const table = gameState?.table || [];
    const lastAction = gameState?.lastAction || '';
    const currentIds = new Set(table.map(ac => ac.attackCard.id));
    const prevIds = prevTableRef.current;
    const addedIds = new Set<string>();
    for (const id of currentIds) {
      if (!prevIds.has(id)) addedIds.add(id);
    }
    for (const ac of table) {
      if (ac.defendCard) {
        const key = `defend-${ac.attackCard.id}`;
        if (!prevIds.has(key)) addedIds.add(key);
      }
    }
    if (addedIds.size > 0) {
      setNewCardIds(addedIds);
      setTimeout(() => setNewCardIds(new Set()), 350);
    }
    if (table.length === 0 && prevIds.size > 0 && lastAction === 'Бито!') {
      setClearing(true);
      setTimeout(() => setClearing(false), 500);
    }
    const nextIds = new Set(table.map(ac => ac.attackCard.id));
    table.forEach(ac => {
      if (ac.defendCard) nextIds.add(`defend-${ac.attackCard.id}`);
    });
    prevTableRef.current = nextIds;
  }, [gameState?.table, gameState?.lastAction]);

  // Если нет gameState — показать загрузку
  if (!gameState) {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl animate-pulse">🃏</div>
        <p className="text-green-200">Загрузка...</p>
      </div>
    );
  }

  const {
    deck, trumpSuit, trumpCard, players, table, phase,
    lastAction, winner, gameMode,
  } = gameState;

  // Методы всегда из store
  const { aiThinking } = store;
  const isVK = isVKEnvironment();
  

  // ====== Сетевой экран ======
  if (showNetwork && !isNetworkMode) {
    return (
      <NetworkScreen
        onConnected={(network: NetworkManagerInterface | VKNetworkManager, role: NetworkRole, backend: NetworkBackend) => {
          // Откладываем инициализацию, чтобы React закончил текущий рендер
          queueMicrotask(() => {
            // Инициализируем сетевой store
            if (role === 'host') {
              store.startGame('network');
              netStore.initHost(network, backend);
            } else {
              netStore.initGuest(network, backend);
            }
          });
        }}
        onBack={() => setShowNetwork(false)}
      />
    );
  }

  // ====== Экран выбора режима ======
  if (phase === 'waiting' && !isNetworkMode) {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-8">
        <div className="text-7xl mb-4">🃏</div>
        <h1 className="text-5xl font-bold text-yellow-300 drop-shadow-lg">Дурак</h1>
        <p className="text-xl text-green-200">Классическая карточная игра</p>
        <div className="flex flex-col gap-3 mt-4">
          <button onClick={() => store.startGame('ai' as any, playerCount)} className="btn btn-primary text-xl px-8 py-3">
            🤖 Против компьютера
          </button>

          {/* Выбор количества игроков для AI */}
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-green-200 text-sm">Игроков:</span>
            {[2, 3, 4, 5, 6].map(n => (
              <button
                key={n}
                onClick={() => setPlayerCount(n)}
                className={`w-10 h-10 rounded-lg font-bold text-lg ${playerCount === n ? 'bg-yellow-500 text-black' : 'bg-frost-800 text-green-200 hover:bg-frost-700'}`}
              >
                {n}
              </button>
            ))}
          </div>

          <button onClick={() => store.startGame('hotseat')} className="btn bg-green-700 hover:bg-green-600 text-white text-xl px-8 py-3">
            👥 Hot-seat (на одном устройстве)
          </button>
          <button onClick={() => setShowNetwork(true)} className="btn bg-purple-700 hover:bg-purple-600 text-white text-xl px-8 py-3">
            🌐 По сети
          </button>
          {isVK && (
            <button onClick={() => { setShowNetwork(true); }} className="btn bg-blue-600 hover:bg-blue-500 text-white text-xl px-8 py-3">
              📱 VK Друзья
            </button>
          )}
          {!isVK && (
            <div className="text-center text-sm text-blue-300/60 mt-2">
              VK Mini App доступен внутри VK
            </div>
          )}
        </div>
        <div className="text-green-300/50 text-sm mt-4">
          36 карт • Козырь • Классические правила
        </div>
      </div>
    );
  }

  // ====== Экран передачи устройства (hot-seat) ======
  if (phase === 'handoff' && !isNetworkMode) {
    const currentPlayerIndex = gameState.activePlayerIndex ?? gameState.defenderIndex ?? 1;
    const nextPlayer = players[currentPlayerIndex];
    const isAttacker = currentPlayerIndex === (gameState.attackerIndex ?? 0);
    const isDefender = currentPlayerIndex === (gameState.defenderIndex ?? 1);
    const roleLabel = isAttacker ? '⚔️' : isDefender ? '🛡️' : '🔄';
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-6xl mb-4">🔄</div>
        <h2 className="text-3xl font-bold text-yellow-300">Передайте устройство</h2>
        <p className="text-2xl text-green-200 font-semibold">{roleLabel} {nextPlayer.name}</p>
        <p className="text-green-300/80">
          {isAttacker ? 'Ваш ход — атакуйте!' : isDefender ? 'Вы защищаетесь!' : 'Вы подкидываете!'}
        </p>
        {trumpCard && (
          <div className="text-green-300/60 text-sm mt-2">
            Козырь: {SUIT_SYMBOLS[trumpSuit]} {SUIT_NAMES[trumpSuit]}
          </div>
        )}
        <button onClick={() => store.confirmHandoff()} className="btn btn-primary text-xl px-8 py-3 mt-4">
          👁️ Готов, вижу свои карты
        </button>
      </div>
    );
  }

  // ====== Экран конца игры ======
  if (phase === 'game_over') {
    const isAiMode = gameMode === 'ai';
    const playerWon = isNetworkMode ? winner === myPlayerIndex : (isAiMode ? winner === 0 : winner !== null);
    const roundCount = gameState.roundCount || 1;
    const pc = gameState.playerCount ?? 2;
    const loserPlayer = players.find(p => p.hand.length > 0);

    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-4 game-over-appear">
        <div className="text-8xl mb-2 game-over-emoji">
          {winner === -1 ? '🤝' : (playerWon ? '🎉' : '😅')}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-yellow-300 drop-shadow-lg">
          {winner === -1 ? 'Ничья!' : isAiMode ? (playerWon ? 'Вы выиграли!' : 'Вы — дурак! 🃏') : (loserPlayer ? `${loserPlayer.name} — дурак!` : 'Игра окончена!')}
        </h1>

        <div className="bg-black/30 rounded-xl p-4 sm:p-6 mt-2 min-w-[300px]">
          <h3 className="text-ice-300 text-sm font-bold mb-3 text-center">📊 Игроки</h3>
          <div className="space-y-1">
            {players.map((p) => (
              <div key={p.id} className={`flex justify-between items-center px-3 py-1 rounded ${p.hand.length === 0 ? 'bg-yellow-900/30' : (loserPlayer?.id === p.id ? 'bg-red-900/30' : 'bg-black/20')}`}>
                <span className={p.hand.length === 0 ? 'text-yellow-300 font-bold' : (loserPlayer?.id === p.id ? 'text-red-400' : 'text-green-200')}>
                  {p.hand.length === 0 ? '👑' : (loserPlayer?.id === p.id ? '🃏' : '✅')} {p.name}
                </span>
                <span className="text-green-300/60 text-xs">
                  {p.hand.length} карт • {p.takenCount} взятий
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-sm">
            <div>
              <div className="text-yellow-300 text-xl font-bold">{roundCount}</div>
              <div className="text-green-300/70">Раундов</div>
            </div>
            <div>
              <div className="text-green-300 text-xl font-bold">{gameState.discardPile?.length || 0}</div>
              <div className="text-green-300/70">В отборе</div>
            </div>
            <div>
              <div className="text-ice-200 text-xl font-bold">{SUIT_SYMBOLS[trumpSuit]}</div>
              <div className="text-green-300/70">Козырь</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={() => {
            if (isNetworkMode) { netStore.disconnect(); }
            store.startGame(gameMode, pc);
          }} className="btn btn-primary text-lg px-6 py-3">
            🔄 Ещё раз
          </button>
          <button onClick={() => {
            if (isNetworkMode) { netStore.disconnect(); }
            store.resetGame();
          }} className="btn btn-danger px-6 py-2">
            В меню
          </button>
        </div>
      </div>
    );
  }

  // ====== Игровой экран (N игроков) ======
  const myIndex = isNetworkMode ? myPlayerIndex : 0; // В AI режиме человек = игрок 0
  const defenderIdx = gameState.defenderIndex ?? 1;
  const attackerIdx = gameState.attackerIndex ?? 0;
  const activeIdx = gameState.activePlayerIndex ?? 0;
  const pc = gameState.playerCount ?? 2;

  const myHand = isNetworkMode
    ? (players[myPlayerIndex]?.hand || [])
    : players[myIndex]?.hand || [];

  // Роли
  const amIAttacker = myIndex === attackerIdx;
  const amIDefender = myIndex === defenderIdx;
  const amIThrower = !amIAttacker && !amIDefender && myIndex !== defenderIdx;
  const amIActive = myIndex === activeIdx;

  // Роль для отображения
  const myRole = amIAttacker ? '⚔️ Атака' : amIDefender ? '🛡️ Защита' : amIThrower ? '🔄 Подкидывает' : '⏳ Ожидание';

  // Действия — в сетевом режиме гость только отправляет action хосту
  const doAttack = (card: Card) => {
    if (isNetworkMode && netStore.role === 'guest') {
      netStore.sendAction({ type: 'attack', cardId: card.id });
      setSelectedCard(null);
      return;
    }
    store.attack(card);
    setSelectedCard(null);
  };

  const doDefend = (attackCardId: string, defendCard: Card) => {
    if (isNetworkMode && netStore.role === 'guest') {
      netStore.sendAction({ type: 'defend', attackCardId, defendCardId: defendCard.id });
      setSelectedCard(null);
      return;
    }
    store.defend(attackCardId, defendCard);
    setSelectedCard(null);
  };

  const doTake = () => {
    if (isNetworkMode && netStore.role === 'guest') {
      netStore.sendAction({ type: 'take' });
      return;
    }
    store.take();
  };

  const doPass = () => {
    if (isNetworkMode && netStore.role === 'guest') {
      netStore.sendAction({ type: 'pass' });
      return;
    }
    store.pass();
  };

  // Другие игроки (кроме меня)
  const otherPlayers = players.map((p, i) => ({ ...p, index: i }))
    .filter(p => p.index !== myIndex);

  return (
    <div className="table-bg min-h-screen flex flex-col h-screen">
      {/* Верхняя панель */}
      <div className="top-panel flex justify-between items-center px-3 py-2 bg-black/30 text-sm">
        <div className="text-green-200">
          Козырь: <span className="text-yellow-300 font-bold">{SUIT_SYMBOLS[trumpSuit]} {SUIT_NAMES[trumpSuit]}</span>
        </div>
        <div className="text-green-200">📦 {deck.length} | ♻️ {gameState.discardPile?.length || 0} | 👥 {pc}</div>
        <div className="flex items-center gap-2">
          {isNetworkMode && (
            <span className={netStore.connected ? 'text-green-400' : 'text-red-400'}>
              {netStore.connected ? '🟢' : '🔴'}
            </span>
          )}
          <span className="text-yellow-300 font-semibold">
            {aiThinking ? '🤔 Думает...' : myRole}
          </span>
        </div>
      </div>

      {/* Другие игроки */}
      <div className="flex flex-wrap justify-center gap-2 px-3 py-2">
        {otherPlayers.map(p => {
          const isDefender = p.index === defenderIdx;
          const isAttacker = p.index === attackerIdx;
          const isActive = p.index === activeIdx;
          const roleLabel = isAttacker ? '⚔️' : isDefender ? '🛡️' : '🔄';
          return (
            <div key={p.id} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${isActive ? 'bg-yellow-900/30 ring-1 ring-yellow-500' : 'bg-black/20'}`}>
              <span className={`text-xs font-medium ${isActive ? 'text-yellow-300' : 'text-green-200/60'}`}>
                {roleLabel} {p.name} ({p.hand?.length || 0})
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: Math.min(p.hand?.length || 0, 10) }, (_, i) => (
                  <div key={i} className="card-back mini-card" style={{ width: '18px', height: '26px' }} />
                ))}
                {(p.hand?.length || 0) > 10 && <span className="text-xs text-green-300">+{p.hand.length - 10}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Стол */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
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

        {table.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-center">
            {table.map(ac => {
              const isNewAttack = newCardIds.has(ac.attackCard.id);
              const isNewDefend = ac.defendCard && newCardIds.has(`defend-${ac.attackCard.id}`);
              return (
                <div key={ac.attackCard.id} className="flex flex-col items-center gap-1">
                  <div
                    className={`relative ${!ac.defendCard && amIDefender && amIActive ? 'ring-2 ring-yellow-400 rounded-lg cursor-pointer hover:ring-yellow-300' : ''}`}
                    onClick={() => !ac.defendCard && amIDefender && amIActive && handleDefend(ac.attackCard.id)}
                  >
                    <CardComponent card={ac.attackCard} trumpSuit={trumpSuit} animating={isNewAttack ? 'play' : undefined} />
                    {!ac.defendCard && amIDefender && amIActive && (
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
              amIActive
                ? (amIAttacker ? 'Ваш ход — атакуйте!' : amIDefender ? 'Отбивайтесь или возьмите!' : amIThrower ? 'Подкиньте карту или пас' : 'Ожидайте...')
                : 'Ожидайте свой ход...'
            )}
          </div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-center gap-3 py-2 px-4 flex-wrap">
        {amIDefender && amIActive && table.some(ac => !ac.defendCard) && (
          <button onClick={doTake} className="btn btn-danger" disabled={aiThinking}>
            📥 Взять ({table.reduce((n, ac) => n + (ac.defendCard ? 0 : 1), 0)} карт)
          </button>
        )}
        {(amIAttacker || amIThrower) && amIActive && table.length > 0 && table.every(ac => ac.defendCard) && (
          <button onClick={doPass} className="btn btn-success" disabled={aiThinking}>
            ✅ Бито!
          </button>
        )}
        {amIThrower && amIActive && (
          <button onClick={doPass} className="btn bg-gray-700 hover:bg-gray-600 text-white" disabled={aiThinking}>
            Пас
          </button>
        )}
        {isNetworkMode && (
          <button onClick={() => { netStore.disconnect(); store.resetGame(); }} className="btn bg-red-900 hover:bg-red-800 text-white text-xs px-3 py-1">
            ✕ Выйти
          </button>
        )}
      </div>

      {/* Подсказка */}
      {amIDefender && selectedCard && (
        <div className="text-center text-yellow-300 text-sm py-1">
          Нажмите на карту атаки, чтобы отбить {RANK_NAMES[selectedCard.rank]}{SUIT_SYMBOLS[selectedCard.suit]}
        </div>
      )}

      {/* Ошибка сети */}
      {netStore.error && (
        <div className="text-center text-red-400 text-sm py-1 bg-red-900/30">
          ⚠️ {netStore.error}
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
              if (aiThinking || !amIActive) return;
              if (amIDefender) {
                setSelectedCard(card);
              } else if (amIAttacker || amIThrower) {
                doAttack(card);
              }
            }}
            disabled={aiThinking || !amIActive}
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
      doDefend(attackCardId, selectedCard);
    }
  }
}