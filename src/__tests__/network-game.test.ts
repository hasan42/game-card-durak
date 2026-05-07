/**
 * Тесты логики сетевой игры «Дурак»
 * Важно: getState() возвращает снапшот, нужно вызывать перед каждым действием
 */

import { describe, it, expect } from 'vitest';
import { useGameStore } from '../engine/store';
import { serializeGameState } from '../engine/netStore';

function resetAndStart(mode: 'network' | 'ai' | 'hotseat' = 'network', players = 2) {
  useGameStore.getState().resetGame();
  useGameStore.getState().startGame(mode, players);
  return useGameStore.getState();
}

function getStore() {
  return useGameStore.getState();
}

describe('Сетевая игра', () => {
  it('serializeGameState не содержит функций', () => {
    const state = resetAndStart();
    const serialized = serializeGameState(state);
    for (const key of Object.keys(serialized)) {
      expect(typeof (serialized as any)[key]).not.toBe('function');
    }
  });

  it('serialised GameState можно JSON.stringify', () => {
    const serialized = serializeGameState(resetAndStart());
    const json = JSON.stringify(serialized);
    expect(json).toBeTruthy();
  });

  it('ход: атака → защита → бито → смена ролей', () => {
    let s = resetAndStart();
    const { attackerIndex, defenderIndex } = s;

    // Атакующий ходит
    s.attack(s.players[attackerIndex].hand[0]);
    s = getStore();
    expect(s.table.length).toBe(1);
    expect(s.phase).toBe('defending');
    expect(s.activePlayerIndex).toBe(defenderIndex);

    // Защитник отбивает
    const attackOnTable = s.table[0].attackCard;
    const possibleDefends = s.validDefends(attackOnTable.id);
    
    if (possibleDefends.length > 0) {
      s.defend(attackOnTable.id, possibleDefends[0]);
      s = getStore();
      
      // 2 игрока — Бито
      expect(s.attackerIndex).toBe(defenderIndex);
      expect(s.phase).toBe('attacking');
      expect(s.table.length).toBe(0);
    }
  });

  it('взятие при 2 игроках', () => {
    let s = resetAndStart();
    const { attackerIndex, defenderIndex } = s;

    s.attack(s.players[attackerIndex].hand[0]);
    s = getStore();
    expect(s.phase).toBe('defending');

    s.take();
    s = getStore();
    
    // При 2 игроках — тот же атакующий и защитник
    expect(s.attackerIndex).toBe(attackerIndex);
    expect(s.defenderIndex).toBe(defenderIndex);
    expect(s.activePlayerIndex).toBe(attackerIndex);
    expect(s.phase).toBe('attacking');
  });

  it('2 раунда: роли меняются после Бито', () => {
    let s = resetAndStart();
    const { attackerIndex, defenderIndex } = s;

    // Раунд 1
    s.attack(s.players[attackerIndex].hand[0]);
    s = getStore();
    
    const attackCard = s.table[0].attackCard;
    const possibleDefends = s.validDefends(attackCard.id);
    
    if (possibleDefends.length > 0) {
      s.defend(attackCard.id, possibleDefends[0]);
      s = getStore();
      
      // Бито
      expect(s.attackerIndex).toBe(defenderIndex);
      expect(s.defenderIndex).toBe(attackerIndex);

      // Раунд 2
      s.attack(s.players[s.attackerIndex].hand[0]);
      s = getStore();
      expect(s.table.length).toBe(1);
      expect(s.phase).toBe('defending');
    }
  });

  it('activePlayerIndex всегда валидный', () => {
    let s = resetAndStart();

    const check = () => {
      s = getStore();
      expect(s.activePlayerIndex).toBeGreaterThanOrEqual(0);
      expect(s.activePlayerIndex).toBeLessThan(s.playerCount);
      expect(s.players[s.activePlayerIndex]).toBeTruthy();
    };

    check();
    s.attack(s.players[s.attackerIndex].hand[0]);
    check();

    s.take();
    check();
    
    s.attack(s.players[s.attackerIndex].hand[0]);
    check();
  });

  it('взятие затем атака', () => {
    let s = resetAndStart();
    const { attackerIndex } = s;

    s.attack(s.players[attackerIndex].hand[0]);
    s = getStore();
    s.take();
    s = getStore();
    
    expect(s.attackerIndex).toBe(attackerIndex);
    expect(s.phase).toBe('attacking');

    s.attack(s.players[s.attackerIndex].hand[0]);
    s = getStore();
    expect(s.table.length).toBe(1);
  });
});