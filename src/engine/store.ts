/**
 * Игровой движок «Дурак» — Zustand store для N игроков (2-6)
 */

import { create } from 'zustand';
import type { Card, Suit, GameState, AttackCard, Player, GameMode, GamePhase } from './types';
import { createDeck, shuffle, canBeat, sortHand, cardsNeeded, SUIT_SYMBOLS, RANK_NAMES, getNextPlayerIndex } from './cards';
import { aiChooseAttack, aiChooseDefend, aiDecideTake } from './ai';

interface GameStore extends GameState {
  aiThinking: boolean;
  startGame: (mode?: GameMode, playerCount?: number) => void;
  resetGame: () => void;
  attack: (card: Card) => void;
  defend: (attackCardId: string, defendCard: Card) => void;
  take: () => void;
  pass: () => void;
  confirmHandoff: () => void;
  validDefends: (attackCardId: string) => Card[];
  canThrowIn: (card: Card, playerIndex: number) => boolean;
}

const INITIAL_STATE = {
  deck: [],
  trumpSuit: 'hearts' as Suit,
  trumpCard: null,
  players: [
    { id: 'player1', name: 'Игрок 1', hand: [], isWinner: false, takenCount: 0 },
    { id: 'player2', name: 'Игрок 2', hand: [], isWinner: false, takenCount: 0 },
  ],
  attackerIndex: 0,
  defenderIndex: 1,
  activePlayerIndex: 0,
  table: [],
  phase: 'waiting' as GamePhase,
  discardPile: [],
  consecutivePasses: 0,
  winner: null,
  lastAction: '',
  gameMode: 'hotseat' as GameMode,
  aiThinking: false,
  roundCount: 0,
  playerCount: 2,
  thrownInPasses: 0,
};

function removeFromHand(hand: Card[], card: Card): Card[] {
  return hand.filter(c => c.id !== card.id);
}

function canThrowInCard(card: Card, table: AttackCard[]): boolean {
  if (table.length === 0) return true;
  const ranks = new Set<number>();
  for (const ac of table) {
    ranks.add(ac.attackCard.rank);
    if (ac.defendCard) ranks.add(ac.defendCard.rank);
  }
  return ranks.has(card.rank);
}

/** Все ли карты на столе отбиты? */
function allDefended(table: AttackCard[]): boolean {
  return table.length > 0 && table.every(ac => ac.defendCard !== undefined);
}

/** Сколько подкидывающих ещё могут подкинуть? */
function getThrowerIndices(attackerIndex: number, defenderIndex: number, playerCount: number): number[] {
  if (playerCount <= 2) return [];
  const throwers: number[] = [];
  for (let i = 0; i < playerCount; i++) {
    if (i !== attackerIndex && i !== defenderIndex) {
      throwers.push(i);
    }
  }
  return throwers;
}

/** Все ли кто может подкинуть — спасовали? */

/** AI делает ход */
function scheduleAiMoves(get: () => GameStore, set: (s: Partial<GameStore>) => void) {
  const state = get();
  if (state.gameMode !== 'ai' || state.phase === 'game_over' || state.phase === 'waiting') return;

  const humanIndex = 0;
  // Если сейчас ход человека — не делаем ничего
  if (state.activePlayerIndex === humanIndex) return;

  set({ aiThinking: true });

  setTimeout(() => {
    const s = get();
    if (s.phase === 'game_over' || s.phase === 'waiting' || s.activePlayerIndex === humanIndex) {
      set({ aiThinking: false });
      return;
    }

    const aiIndex = s.activePlayerIndex;
    const aiHand = s.players[aiIndex].hand;

    if (s.phase === 'attacking') {
      if (aiIndex === s.attackerIndex) {
        // AI атакует
        if (s.table.length === 0) {
          const card = aiChooseAttack(aiHand, s.table, s.trumpSuit);
          if (card) s.attack(card); else s.pass();
        } else {
          // Подкидывает или пасует
          const card = aiChooseAttack(aiHand, s.table, s.trumpSuit);
          if (card && canThrowInCard(card, s.table)) {
            s.attack(card);
          } else {
            s.pass();
          }
        }
      } else {
        // AI подкидывающий
        const card = aiChooseAttack(aiHand, s.table, s.trumpSuit);
        if (card && canThrowInCard(card, s.table)) {
          s.attack(card);
        } else {
          s.pass();
        }
      }
    } else if (s.phase === 'defending') {
      if (aiIndex === s.defenderIndex) {
        // AI защищается
        const undefended = s.table.filter(ac => !ac.defendCard);
        if (undefended.length > 0) {
          const shouldTake = aiDecideTake(s.table, aiHand, s.trumpSuit);
          if (shouldTake) {
            s.take();
          } else {
            const target = undefended[0];
            const defendCard = aiChooseDefend(target.attackCard, aiHand, s.trumpSuit);
            if (defendCard) {
              s.defend(target.attackCard.id, defendCard);
            } else {
              s.take();
            }
          }
        }
      } else {
        // AI подкидывающий на стадии защиты
        const card = aiChooseAttack(aiHand, s.table, s.trumpSuit);
        if (card && canThrowInCard(card, s.table) && s.table.length < s.players[s.defenderIndex].hand.length) {
          s.attack(card);
        } else {
          s.pass();
        }
      }
    }

    set({ aiThinking: false });

    // Если всё ещё AI ход — планируем следующий
    const after = get();
    if (after.gameMode === 'ai' && after.activePlayerIndex !== humanIndex && after.phase !== 'game_over' && after.phase !== 'waiting') {
      scheduleAiMoves(get, set);
    }
  }, 500 + Math.random() * 500);
}

/** Перейти к следующему активному игроку */
function advanceActivePlayer(state: GameState): Partial<GameState> {
  const { attackerIndex, defenderIndex, playerCount, table, phase } = state;
  const throwers = getThrowerIndices(attackerIndex, defenderIndex, playerCount);

  if (phase === 'attacking') {
    // Атакующий ходит → подкидывающие → защитник
    const allPlayers = [attackerIndex, ...throwers, defenderIndex];
    const currentPos = allPlayers.indexOf(state.activePlayerIndex);
    const nextPos = (currentPos + 1) % allPlayers.length;
    const nextActive = allPlayers[nextPos];

    if (nextActive === defenderIndex) {
      return { activePlayerIndex: defenderIndex, phase: 'defending' as GamePhase };
    }
    return { activePlayerIndex: nextActive };
  }

  if (phase === 'defending') {
    // После защиты подкидывающие могут добавить → потом атакующий решает Бито
    const allPlayers = [...throwers, attackerIndex];
    if (allPlayers.length === 0) {
      // 2 игрока — сразу проверяем Бито
      if (allDefended(table)) {
        return { phase: 'attacking' as GamePhase, activePlayerIndex: attackerIndex, thrownInPasses: 0 };
      }
      return { activePlayerIndex: defenderIndex };
    }
    // Подкидывающие + атакующий
    const currentPos = allPlayers.indexOf(state.activePlayerIndex);
    const nextPos = (currentPos + 1) % allPlayers.length;
    return { activePlayerIndex: allPlayers[nextPos], phase: 'attacking' as GamePhase, thrownInPasses: 0 };
  }

  return {};
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  validDefends: (attackCardId: string) => {
    const { players, defenderIndex, trumpSuit, table } = get();
    const defender = players[defenderIndex];
    const attackPair = table.find(ac => ac.attackCard.id === attackCardId && !ac.defendCard);
    if (!attackPair) return [];
    return defender.hand.filter(c => canBeat(attackPair.attackCard, c, trumpSuit));
  },

  canThrowIn: (card: Card, playerIndex: number) => {
    const { phase, attackerIndex, defenderIndex, table, players, playerCount } = get();
    if (phase !== 'attacking' && phase !== 'defending') return false;
    if (playerIndex === defenderIndex) return false;
    if (playerCount <= 2 && playerIndex !== attackerIndex) return false;
    const defenderHandSize = players[defenderIndex].hand.length;
    const totalTableCards = table.length;
    if (totalTableCards >= defenderHandSize) return false;
    return canThrowInCard(card, table);
  },

  startGame: (mode: GameMode = 'hotseat', playerCount: number = 2) => {
    playerCount = Math.max(2, Math.min(6, playerCount));
    const shuffled = shuffle(createDeck());
    const trumpCard = shuffled[shuffled.length - 1];
    const trumpSuit = trumpCard.suit;

    // Раздача: каждому по 6
    const players: Player[] = [];
    let deckPos = 0;
    for (let i = 0; i < playerCount; i++) {
      const handCards = shuffled.slice(deckPos, deckPos + 6);
      deckPos += 6;
      let name: string;
      if (mode === 'ai') {
        name = i === 0 ? 'Вы' : `Компьютер ${i + 1}`;
      } else {
        name = `Игрок ${i + 1}`;
      }
      players.push({ id: `player${i + 1}`, name, hand: sortHand(handCards, trumpSuit), isWinner: false, takenCount: 0 });
    }
    const remainingDeck = shuffled.slice(deckPos);

    // Определяем кто атакует: младший козырь
    let attackerIndex = 0;
    let minTrumpRank = 15;
    for (let i = 0; i < playerCount; i++) {
      const trumpCards = players[i].hand.filter(c => c.suit === trumpSuit);
      if (trumpCards.length > 0) {
        const minRank = Math.min(...trumpCards.map(c => c.rank));
        if (minRank < minTrumpRank) {
          minTrumpRank = minRank;
          attackerIndex = i;
        }
      }
    }

    const defenderIndex = getNextPlayerIndex(attackerIndex, playerCount);
    const initialPhase = mode === 'hotseat' ? 'handoff' : 'attacking';

    set({
      deck: remainingDeck, trumpSuit, trumpCard, players,
      attackerIndex, defenderIndex, activePlayerIndex: attackerIndex,
      table: [], phase: initialPhase, discardPile: [],
      consecutivePasses: 0, winner: null, gameMode: mode,
      aiThinking: false, roundCount: 1, playerCount, thrownInPasses: 0,
      lastAction: `${RANK_NAMES[trumpCard.rank]}${SUIT_SYMBOLS[trumpSuit]} — козырь`,
    });

    if (mode === 'ai' && attackerIndex !== 0) {
      scheduleAiMoves(get, set);
    }
  },

  resetGame: () => {
    set({ ...INITIAL_STATE });
  },

  confirmHandoff: () => {
    const { phase } = get();
    if (phase !== 'handoff') return;
    set({ phase: 'attacking' });
  },

  attack: (card: Card) => {
    const { phase, activePlayerIndex, defenderIndex, attackerIndex, players, table, playerCount, gameMode } = get();
    if (phase !== 'attacking' && phase !== 'defending') return;
    if (activePlayerIndex === defenderIndex) return; // защитник не атакует

    // Проверяем подкидывание
    if (table.length > 0 && !canThrowInCard(card, table)) return;
    const defenderHandSize = players[defenderIndex].hand.length;
    if (table.length >= defenderHandSize) return;

    const attacker = players[activePlayerIndex];
    if (!attacker.hand.find(c => c.id === card.id)) return;

    const newHand = removeFromHand(attacker.hand, card);
    const newPlayers = [...players];
    newPlayers[activePlayerIndex] = { ...attacker, hand: newHand };

    const newTable = [...table, { attackCard: card, attackPlayerIndex: activePlayerIndex }];
    const actionText = `${RANK_NAMES[card.rank]}${SUIT_SYMBOLS[card.suit]}`;

    const updates: Partial<GameStore> = {
      players: newPlayers,
      table: newTable,
      thrownInPasses: 0, // сброс при новом ходе
      lastAction: actionText,
    };

    // Если это первый ход — переход к защите/подкидыванию
    if (table.length === 0) {
      const throwers = getThrowerIndices(attackerIndex, defenderIndex, playerCount);
      if (throwers.length > 0) {
        updates.activePlayerIndex = throwers[0];
        updates.phase = 'attacking';
      } else {
        updates.activePlayerIndex = defenderIndex;
        updates.phase = 'defending';
      }
    } else {
      // Переход к следующему
      const next = advanceActivePlayer({ ...get(), ...updates, table: newTable } as GameState);
      Object.assign(updates, next);
    }

    set(updates);

    if (gameMode === 'ai') scheduleAiMoves(get, set);
  },

  defend: (attackCardId: string, defendCard: Card) => {
    const { players, defenderIndex, activePlayerIndex, trumpSuit, table, playerCount, gameMode, attackerIndex } = get();
    if (activePlayerIndex !== defenderIndex) return;

    const attackPair = table.find(ac => ac.attackCard.id === attackCardId && !ac.defendCard);
    if (!attackPair) return;
    if (!canBeat(attackPair.attackCard, defendCard, trumpSuit)) return;

    const defender = players[defenderIndex];
    if (!defender.hand.find(c => c.id === defendCard.id)) return;

    const newHand = removeFromHand(defender.hand, defendCard);
    const newPlayers = [...players];
    newPlayers[defenderIndex] = { ...defender, hand: newHand };

    const newTable = table.map(ac =>
      ac.attackCard.id === attackCardId
        ? { ...ac, defendCard, defendPlayerIndex: defenderIndex }
        : ac
    );

    const actionText = `Отбой: ${RANK_NAMES[defendCard.rank]}${SUIT_SYMBOLS[defendCard.suit]}`;

    // Все отбиты? → подкидывающие могут добавить, потом Бито
    const allDone = newTable.every(ac => ac.defendCard !== undefined);
    let updates: Partial<GameStore> = {
      players: newPlayers,
      table: newTable,
      lastAction: actionText,
    };

    if (allDone) {
      const throwers = getThrowerIndices(attackerIndex, defenderIndex, playerCount);
      if (throwers.length > 0) {
        // Подкидывающие могут добавить
        updates.activePlayerIndex = throwers[0];
        updates.phase = 'attacking';
        updates.thrownInPasses = 0;
      } else {
        // 2 игрока — сразу Бито
        updates = { ...updates, ...handleBito(get, set, newPlayers, newTable) };
      }
    } else {
      updates.activePlayerIndex = defenderIndex; // ещё есть что отбить
      updates.phase = 'defending';
    }

    set(updates);

    if (gameMode === 'ai') scheduleAiMoves(get, set);
  },

  take: () => {
    const { players, attackerIndex, defenderIndex, trumpSuit, table, deck, playerCount, gameMode, roundCount } = get();
    const { activePlayerIndex } = get();
    if (activePlayerIndex !== defenderIndex) return;

    const defender = players[defenderIndex];
    const tableCards = table.flatMap(ac => {
      const cards = [ac.attackCard];
      if (ac.defendCard) cards.push(ac.defendCard);
      return cards;
    });

    const newDefenderHand = sortHand([...defender.hand, ...tableCards], trumpSuit);
    const newPlayers = [...players];
    newPlayers[defenderIndex] = { ...defender, hand: newDefenderHand, takenCount: defender.takenCount + 1 };

    // Добрать карт из колоды
    let currentDeck = [...deck];

    // Сначала защитник добирает
    const defNeeds = cardsNeeded(newPlayers[defenderIndex].hand);
    if (defNeeds > 0 && currentDeck.length > 0) {
      const cards = currentDeck.slice(0, defNeeds);
      currentDeck = currentDeck.slice(defNeeds);
      newPlayers[defenderIndex] = { ...newPlayers[defenderIndex], hand: sortHand([...newPlayers[defenderIndex].hand, ...cards], trumpSuit) };
    }

    // Потом по кругу от атакующего
    for (let i = 0; i < playerCount; i++) {
      const idx = (attackerIndex + i) % playerCount;
      if (idx === defenderIndex) continue;
      const needs = cardsNeeded(newPlayers[idx].hand);
      if (needs > 0 && currentDeck.length > 0) {
        const cards = currentDeck.slice(0, needs);
        currentDeck = currentDeck.slice(needs);
        newPlayers[idx] = { ...newPlayers[idx], hand: sortHand([...newPlayers[idx].hand, ...cards], trumpSuit) };
      }
    }

    const gameOver = checkGameOver(newPlayers, currentDeck);
    if (gameOver.winner !== null) {
      set({ players: newPlayers, deck: currentDeck, table: [], phase: 'game_over', winner: gameOver.winner, lastAction: gameOver.message, roundCount: roundCount + 1 });
      return;
    }

    // Защитник взял → тот же атакующий продолжает, защитник пропускает
    // При 2 игроках — защитник не может пропустить, остаётся тем же
    const newDefenderIndex = playerCount === 2
      ? defenderIndex
      : getNextPlayerIndex(defenderIndex, playerCount, defenderIndex);
    const nextPhase = gameMode === 'hotseat' ? 'handoff' : 'attacking';

    set({
      players: newPlayers, deck: currentDeck, table: [],
      phase: nextPhase, consecutivePasses: 0, thrownInPasses: 0,
      attackerIndex, defenderIndex: newDefenderIndex,
      activePlayerIndex: attackerIndex,
      lastAction: `${defender.name} берёт!`,
      roundCount: roundCount + 1,
    });

    if (gameMode === 'ai') scheduleAiMoves(get, set);
  },

  pass: () => {
    const { activePlayerIndex, defenderIndex, attackerIndex, players, trumpSuit, deck, discardPile, gameMode, playerCount, thrownInPasses, roundCount, table } = get();

    // Защитник не может пасовать
    if (activePlayerIndex === defenderIndex) return;

    const newPasses = thrownInPasses + 1;

    // Если все пасуют и все отбиты → Бито!
    const allPlayersCanPass = 1 + getThrowerIndices(attackerIndex, defenderIndex, playerCount).length;
    if (allDefended(table) && newPasses >= allPlayersCanPass) {
      const allTableCards = table.flatMap(ac => [ac.attackCard, ac.defendCard!]);

      // Добрать карт
      const newPlayers = [...players];
      let currentDeck = [...deck];

      // Сначала защитник
      const defNeeds = cardsNeeded(newPlayers[defenderIndex].hand);
      if (defNeeds > 0 && currentDeck.length > 0) {
        const cards = currentDeck.slice(0, defNeeds);
        currentDeck = currentDeck.slice(defNeeds);
        newPlayers[defenderIndex] = { ...newPlayers[defenderIndex], hand: sortHand([...newPlayers[defenderIndex].hand, ...cards], trumpSuit) };
      }

      // Потом по кругу от атакующего
      for (let i = 0; i < playerCount; i++) {
        const idx = (attackerIndex + i) % playerCount;
        if (idx === defenderIndex) continue;
        const needs = cardsNeeded(newPlayers[idx].hand);
        if (needs > 0 && currentDeck.length > 0) {
          const cards = currentDeck.slice(0, needs);
          currentDeck = currentDeck.slice(needs);
          newPlayers[idx] = { ...newPlayers[idx], hand: sortHand([...newPlayers[idx].hand, ...cards], trumpSuit) };
        }
      }

      const gameOver = checkGameOver(newPlayers, currentDeck);
      if (gameOver.winner !== null) {
        set({ players: newPlayers, deck: currentDeck, table: [], discardPile: [...discardPile, ...allTableCards], phase: 'game_over', winner: gameOver.winner, lastAction: gameOver.message, roundCount: roundCount + 1 });
        return;
      }

      // Защитник становится атакующим
      const newAttacker = defenderIndex;
      const newDefender = getNextPlayerIndex(defenderIndex, playerCount);
      const nextPhase = gameMode === 'hotseat' ? 'handoff' : 'attacking';

      set({
        players: newPlayers, deck: currentDeck, table: [],
        discardPile: [...discardPile, ...allTableCards],
        attackerIndex: newAttacker, defenderIndex: newDefender,
        activePlayerIndex: newAttacker,
        phase: nextPhase, consecutivePasses: 0, thrownInPasses: 0,
        lastAction: 'Бито!',
        roundCount: roundCount + 1,
      });

      if (gameMode === 'ai') scheduleAiMoves(get, set);
      return;
    }

    // Не все пасанули — переход к следующему
    const throwers = getThrowerIndices(attackerIndex, defenderIndex, playerCount);
    const allActive = [attackerIndex, ...throwers];
    const currentPos = allActive.indexOf(activePlayerIndex);
    const nextPos = (currentPos + 1) % allActive.length;

    if (nextPos === 0 && allDefended(table)) {
      // Вернулись к атакующему и все отбиты → Бито!
      // Рекурсивно вызовем через pass снова с нужным состоянием
      set({ thrownInPasses: allPlayersCanPass }); // заставляем Бито
      get().pass();
      return;
    }

    const nextActive = allActive[nextPos];
    set({
      activePlayerIndex: nextActive,
      thrownInPasses: newPasses,
      lastAction: 'Пас',
    });

    if (gameMode === 'ai') scheduleAiMoves(get, set);
  },
}));

/** Обработка «Бито!» */
function handleBito(get: () => GameStore, _set: (s: Partial<GameStore>) => void, newPlayers: Player[], newTable: AttackCard[]): Partial<GameStore> {
  const { defenderIndex, attackerIndex, trumpSuit, deck, discardPile, playerCount, gameMode, roundCount } = get();

  const allTableCards = newTable.flatMap(ac => [ac.attackCard, ac.defendCard!]);
  let currentDeck = [...deck];
  const updatedPlayers = [...newPlayers];

  // Добрать: сначала защитник
  const defNeeds = cardsNeeded(updatedPlayers[defenderIndex].hand);
  if (defNeeds > 0 && currentDeck.length > 0) {
    const cards = currentDeck.slice(0, defNeeds);
    currentDeck = currentDeck.slice(defNeeds);
    updatedPlayers[defenderIndex] = { ...updatedPlayers[defenderIndex], hand: sortHand([...updatedPlayers[defenderIndex].hand, ...cards], trumpSuit) };
  }

  for (let i = 0; i < playerCount; i++) {
    const idx = (attackerIndex + i) % playerCount;
    if (idx === defenderIndex) continue;
    const needs = cardsNeeded(updatedPlayers[idx].hand);
    if (needs > 0 && currentDeck.length > 0) {
      const cards = currentDeck.slice(0, needs);
      currentDeck = currentDeck.slice(needs);
      updatedPlayers[idx] = { ...updatedPlayers[idx], hand: sortHand([...updatedPlayers[idx].hand, ...cards], trumpSuit) };
    }
  }

  const gameOver = checkGameOver(updatedPlayers, currentDeck);
  if (gameOver.winner !== null) {
    return {
      players: updatedPlayers, deck: currentDeck, table: [],
      discardPile: [...discardPile, ...allTableCards],
      phase: 'game_over', winner: gameOver.winner, lastAction: gameOver.message,
    };
  }

  const newAttacker = defenderIndex;
  const newDefender = getNextPlayerIndex(defenderIndex, playerCount);
  const nextPhase = gameMode === 'hotseat' ? 'handoff' : 'attacking';

  return {
    players: updatedPlayers, deck: currentDeck, table: [],
    discardPile: [...discardPile, ...allTableCards],
    attackerIndex: newAttacker, defenderIndex: newDefender,
    activePlayerIndex: newAttacker,
    phase: nextPhase, thrownInPasses: 0,
    lastAction: 'Бито!',
    roundCount: roundCount + 1,
  };
}

function checkGameOver(players: Player[], deck: Card[]): { winner: number | null; message: string } {
  const deckEmpty = deck.length === 0;
  if (!deckEmpty) return { winner: null, message: '' };

  const playersWithCards = players.filter(p => p.hand.length > 0);

  if (playersWithCards.length === 0) {
    return { winner: -1, message: 'Ничья!' };
  }

  if (playersWithCards.length === 1) {
    const loser = playersWithCards[0];
    const loserIndex = players.indexOf(loser);
    const winnerIndex = loserIndex === 0 ? 1 : 0;
    return { winner: winnerIndex, message: `${loser.name} — дурак! 🃏` };
  }

  // 2+ с картами — игра продолжается
  return { winner: null, message: '' };
}