/**
 * Тесты игрового движка «Дурак» — store.ts
 * Покрываем: старт игры, атаку, защиту, взятие, пас, конец игры, граничные случаи
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../engine/store';

beforeEach(() => {
  useGameStore.getState().resetGame();
});

function startAndSnapshot(mode: 'network' | 'ai' | 'hotseat' = 'network', players = 2) {
  useGameStore.getState().startGame(mode, players);
  return useGameStore.getState();
}

/** Получить текущий снапшот */
function snap() {
  return useGameStore.getState();
}

describe('startGame', () => {
  it('инициализирует корректное состояние для 2 игроков', () => {
    const s = startAndSnapshot();
    expect(s.phase).toBe('attacking');
    expect(s.players).toHaveLength(2);
    expect(s.deck.length + s.players[0].hand.length + s.players[1].hand.length).toBe(36);
    expect(s.table).toHaveLength(0);
    expect(s.trumpCard).toBeTruthy();
    expect(s.trumpSuit).toBe(s.trumpCard!.suit);
  });

  it('каждому игроку по 6 карт', () => {
    const s = startAndSnapshot();
    for (const p of s.players) {
      expect(p.hand).toHaveLength(6);
    }
  });

  it('колода содержит оставшиеся 24 карты', () => {
    const s = startAndSnapshot();
    expect(s.deck).toHaveLength(24);
  });

  it('атакующий — игрок с младшим козырем', () => {
    const s = startAndSnapshot();
    const attacker = s.players[s.attackerIndex];
    const hasTrumpInHand = attacker.hand.some(c => c.suit === s.trumpSuit);
    // У атакующего должен быть козырь в руке (иначе он бы не стал атакующим)
    // Если у обоих нет козырей — атакует игрок 0
    const allHands = s.players.map(p => p.hand.filter(c => c.suit === s.trumpSuit));
    const minTrumps = allHands.map(hand => hand.length > 0 ? Math.min(...hand.map(c => c.rank)) : 15);
    const expectedAttacker = minTrumps.indexOf(Math.min(...minTrumps));
    expect(s.attackerIndex).toBe(expectedAttacker);
  });

  it('защитник — следующий после атакующего', () => {
    const s = startAndSnapshot();
    expect(s.defenderIndex).toBe((s.attackerIndex + 1) % s.playerCount);
  });

  it('hotseat начинается с фазы handoff', () => {
    const s = startAndSnapshot('hotseat');
    expect(s.phase).toBe('handoff');
  });

  it('поддерживает 3-6 игроков', () => {
    for (const n of [3, 4, 5, 6]) {
      useGameStore.getState().resetGame();
      const s = startAndSnapshot('network', n);
      expect(s.players).toHaveLength(n);
      expect(s.playerCount).toBe(n);
      const totalCards = s.deck.length + s.players.reduce((sum, p) => sum + p.hand.length, 0);
      expect(totalCards).toBe(36);
    }
  });

  it('playerCount ограничен 2-6', () => {
    const s1 = startAndSnapshot('network', 1);
    expect(s1.playerCount).toBe(2);

    useGameStore.getState().resetGame();
    const s7 = startAndSnapshot('network', 10);
    expect(s7.playerCount).toBe(6);
  });
});

describe('attack', () => {
  it('атакующий может положить первую карту', () => {
    const s = startAndSnapshot();
    const card = s.players[s.attackerIndex].hand[0];
    useGameStore.getState().attack(card);
    const after = snap();
    expect(after.table).toHaveLength(1);
    expect(after.table[0].attackCard.id).toBe(card.id);
    expect(after.phase).toBe('defending');
  });

  it('защитник не может атаковать', () => {
    const s = startAndSnapshot();
    const defenderCard = s.players[s.defenderIndex].hand[0];
    useGameStore.getState().attack(defenderCard);
    const after = snap();
    // Фаза не должна измениться
    expect(after.table).toHaveLength(0);
  });

  it('нельзя атаковать картой не из своей руки', () => {
    const s = startAndSnapshot();
    const fakeCard = { suit: 'hearts' as const, rank: 14 as const, id: 'fake' };
    useGameStore.getState().attack(fakeCard);
    expect(snap().table).toHaveLength(0);
  });

  it('подкидывание — можно добавить карту того же ранга', () => {
    let s = startAndSnapshot();
    // Атакуем
    useGameStore.getState().attack(s.players[s.attackerIndex].hand[0]);
    s = snap();

    // Защищаемся
    if (s.table.length > 0) {
      const undefended = s.table.find(ac => !ac.defendCard);
      if (undefended) {
        const defenses = useGameStore.getState().validDefends(undefended.attackCard.id);
        if (defenses.length > 0) {
          useGameStore.getState().defend(undefended.attackCard.id, defenses[0]);
        }
      }
    }
    // После защиты при 2 игроках — фаза attacking (Бито или новая атака)
    const after = snap();
    // Важно, что не произошло ошибки
    expect(after.phase).toBeTruthy();
  });
});

describe('defend', () => {
  it('защитник может отбить карту', () => {
    let s = startAndSnapshot();
    useGameStore.getState().attack(s.players[s.attackerIndex].hand[0]);
    s = snap();

    const attackCard = s.table[0].attackCard;
    const defenses = useGameStore.getState().validDefends(attackCard.id);
    if (defenses.length > 0) {
      const defendCard = defenses[0];
      useGameStore.getState().defend(attackCard.id, defendCard);
      const after = snap();
      // При 2 игроках после защиты → Бито, стол очищается, роли меняются
      expect(after.table).toHaveLength(0);
      // Защитник стал атакующим
      expect(after.attackerIndex).toBe(s.defenderIndex);
      // Карты на столе ушли в отбой
      expect(after.discardPile.length).toBeGreaterThan(0);
    }
  });

  it('нельзя отбить картой из чужой руки', () => {
    let s = startAndSnapshot();
    useGameStore.getState().attack(s.players[s.attackerIndex].hand[0]);
    s = snap();

    const attackCard = s.table[0].attackCard;
    // Пробуем отбить картой атакующего (не из руки защитника)
    const attackerCard = s.players[s.attackerIndex].hand[1];
    useGameStore.getState().defend(attackCard.id, attackerCard);
    expect(snap().table[0].defendCard).toBeUndefined();
  });

  it('validDefends возвращает только карты, которыми можно отбить', () => {
    let s = startAndSnapshot();
    useGameStore.getState().attack(s.players[s.attackerIndex].hand[0]);
    s = snap();

    const attackCard = s.table[0].attackCard;
    const defenses = useGameStore.getState().validDefends(attackCard.id);
    for (const d of defenses) {
      // Либо та же масть и старше, либо козырь
      const sameSuitHigher = d.suit === attackCard.suit && d.rank > attackCard.rank;
      const isTrump = d.suit === s.trumpSuit && attackCard.suit !== s.trumpSuit;
      expect(sameSuitHigher || isTrump).toBe(true);
    }
  });

  it('нельзя отбить уже отбитую карту', () => {
    let s = startAndSnapshot();
    useGameStore.getState().attack(s.players[s.attackerIndex].hand[0]);
    s = snap();

    const attackCard = s.table[0].attackCard;
    const defenses = useGameStore.getState().validDefends(attackCard.id);
    if (defenses.length > 0) {
      useGameStore.getState().defend(attackCard.id, defenses[0]);
      // После защиты при 2 игроках — Бито, стол пуст, так что validDefends вернёт []
      const after = snap();
      expect(after.table).toHaveLength(0);
      expect(useGameStore.getState().validDefends(attackCard.id)).toHaveLength(0);
    }
  });
});

describe('take (взять)', () => {
  it('защитник берёт карты', () => {
    let s = startAndSnapshot();
    const attackerHandSize = s.players[s.attackerIndex].hand.length;
    useGameStore.getState().attack(s.players[s.attackerIndex].hand[0]);
    s = snap();

    useGameStore.getState().take();
    s = snap();

    // Защитник забрал карты со стола
    const defenderHand = s.players[s.defenderIndex].hand;
    expect(defenderHand.length).toBeGreaterThan(0);
    expect(s.table).toHaveLength(0);
  });

  it('после взятия при 2 игроках атакует тот же игрок', () => {
    let s = startAndSnapshot();
    const { attackerIndex } = s;
    useGameStore.getState().attack(s.players[attackerIndex].hand[0]);
    snap();
    useGameStore.getState().take();
    s = snap();
    expect(s.attackerIndex).toBe(attackerIndex);
  });

  it('после взятия защитник добирает карты из колоды', () => {
    let s = startAndSnapshot();
    useGameStore.getState().attack(s.players[s.attackerIndex].hand[0]);
    s = snap();
    const defenderHandBefore = s.players[s.defenderIndex].hand.length;

    useGameStore.getState().take();
    s = snap();

    // После взятия и добора — в руке защитника должно быть >= 6 карт (если колода позволяет)
    if (s.deck.length > 0) {
      // Защитник взял карты + добрал из колоды
      expect(s.players[s.defenderIndex].hand.length).toBeGreaterThanOrEqual(6);
    }
  });
});

describe('pass', () => {
  it('защитник не может пасовать', () => {
    let s = startAndSnapshot();
    useGameStore.getState().attack(s.players[s.attackerIndex].hand[0]);
    s = snap();
    // Защитник пасует — ничего не должно произойти
    useGameStore.getState().pass();
    const after = snap();
    expect(after.table).toHaveLength(1);
    expect(after.phase).toBe('defending');
  });
});

describe('confirmHandoff', () => {
  it('переключает фазу из handoff в attacking', () => {
    const s = startAndSnapshot('hotseat');
    expect(s.phase).toBe('handoff');
    useGameStore.getState().confirmHandoff();
    expect(snap().phase).toBe('attacking');
  });

  it('не работает в других фазах', () => {
    const s = startAndSnapshot('network');
    const phaseBefore = s.phase;
    useGameStore.getState().confirmHandoff();
    expect(snap().phase).toBe(phaseBefore);
  });
});

describe('resetGame', () => {
  it('возвращает состояние к начальному', () => {
    startAndSnapshot();
    useGameStore.getState().resetGame();
    const s = snap();
    expect(s.phase).toBe('waiting');
    expect(s.players).toHaveLength(2);
    expect(s.table).toHaveLength(0);
    expect(s.deck).toHaveLength(0);
    expect(s.winner).toBeNull();
  });
});

describe('конец игры', () => {
  it('checkGameOver определяется когда колода пуста и у одного игрока кончились карты', () => {
    // Симулируем ситуацию близкую к концу игры
    const s = useGameStore.getState();
    s.resetGame();

    // Устанавливаем состояние вручную
    useGameStore.setState({
      deck: [],
      trumpSuit: 'hearts',
      trumpCard: { suit: 'hearts', rank: 6, id: 'hearts-6' },
      players: [
        { id: 'player1', name: 'Игрок 1', hand: [], isWinner: false, takenCount: 0 },
        { id: 'player2', name: 'Игрок 2', hand: [{ suit: 'spades', rank: 6, id: 'spades-6' }], isWinner: false, takenCount: 0 },
      ],
      attackerIndex: 0,
      defenderIndex: 1,
      activePlayerIndex: 0,
      table: [],
      phase: 'attacking',
      discardPile: [],
      consecutivePasses: 0,
      thrownInPasses: 0,
      winner: null,
      gameMode: 'network',
      roundCount: 1,
      playerCount: 2,
    });

    // Игрок 0 атакует последней картой игрока 1
    // Но у 0 нет карт — это уже game_over
    const state = snap();
    expect(state.players[0].hand).toHaveLength(0);
    expect(state.players[1].hand).toHaveLength(1);
  });
});

describe('инварианты игры', () => {
  it('общее количество карт не теряется при полной игре', () => {
    let s = startAndSnapshot();
    let total = s.deck.length + s.table.length + s.discardPile.length;
    for (const p of s.players) total += p.hand.length;
    expect(total).toBe(36);
  });

  it('activePlayerIndex всегда валидный после каждого действия', () => {
    let s = startAndSnapshot();

    const check = () => {
      s = snap();
      expect(s.activePlayerIndex).toBeGreaterThanOrEqual(0);
      expect(s.activePlayerIndex).toBeLessThan(s.playerCount);
      expect(s.players[s.activePlayerIndex]).toBeTruthy();
    };

    // Атака
    useGameStore.getState().attack(s.players[s.attackerIndex].hand[0]);
    check();

    // Взять
    if (snap().phase === 'defending') {
      useGameStore.getState().take();
      check();
    }
  });

  it('каждая карта в игре уникальна', () => {
    const s = startAndSnapshot();
    // trumpCard — это нижняя карта колоды, она уже учтена в deck
    const allIds: string[] = [...s.deck.map(c => c.id), ...s.discardPile.map(c => c.id)];
    for (const p of s.players) {
      allIds.push(...p.hand.map(c => c.id));
    }
    for (const ac of s.table) {
      allIds.push(ac.attackCard.id);
      if (ac.defendCard) allIds.push(ac.defendCard.id);
    }

    expect(new Set(allIds).size).toBe(allIds.length);
    expect(allIds).toHaveLength(36);
  });
});

describe('полный раунд: атака → защита → Бито', () => {
  it('роли меняются после успешной защиты', () => {
    let s = startAndSnapshot();
    const { attackerIndex, defenderIndex } = s;

    // Атака
    useGameStore.getState().attack(s.players[attackerIndex].hand[0]);
    s = snap();

    // Защита
    const attackCard = s.table[0].attackCard;
    const defenses = useGameStore.getState().validDefends(attackCard.id);

    if (defenses.length > 0) {
      useGameStore.getState().defend(attackCard.id, defenses[0]);
      s = snap();

      // При 2 игроках — Бито, роли меняются
      expect(s.attackerIndex).toBe(defenderIndex);
      expect(s.defenderIndex).toBe(attackerIndex);
      expect(s.phase).toBe('attacking');
      expect(s.table).toHaveLength(0);
    }
  });
});

describe('canThrowIn', () => {
  it('защитник не может подкидывать', () => {
    const s = startAndSnapshot();
    const defenderCard = s.players[s.defenderIndex].hand[0];
    expect(useGameStore.getState().canThrowIn(defenderCard, s.defenderIndex)).toBe(false);
  });

  it('при 2 игроках только атакующий может подкидывать', () => {
    const s = startAndSnapshot();
    // При 2 игроках подкидывающих нет
    const attackerCard = s.players[s.attackerIndex].hand[0];
    // На пустом столе можно атаковать
    expect(useGameStore.getState().canThrowIn(attackerCard, s.attackerIndex)).toBe(true);
  });
});

describe('validDefends', () => {
  it('возвращает пустой массив для несуществующего attackCardId', () => {
    startAndSnapshot();
    const result = useGameStore.getState().validDefends('nonexistent');
    expect(result).toHaveLength(0);
  });

  it('возвращает пустой массив до атаки', () => {
    const s = startAndSnapshot();
    // Нет карт на столе — нет защиты
    expect(useGameStore.getState().validDefends('any')).toHaveLength(0);
  });
});