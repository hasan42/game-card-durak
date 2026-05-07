import { describe, it, expect } from 'vitest';
import { useGameStore } from '../engine/store';

describe('Debug store', () => {
  it('basic attack flow', () => {
    useGameStore.getState().resetGame();
    useGameStore.getState().startGame('network', 2);
    
    const s = useGameStore.getState();
    console.log('start:', {
      phase: s.phase,
      active: s.activePlayerIndex,
      attacker: s.attackerIndex,
      defender: s.defenderIndex,
      players: s.players.length,
      hand0: s.players[0]?.hand?.length,
      hand1: s.players[1]?.hand?.length,
    });
    
    const card = s.players[s.attackerIndex].hand[0];
    console.log('attacking with card:', card);
    s.attack(card);
    
    const s2 = useGameStore.getState();
    console.log('after attack:', {
      phase: s2.phase,
      active: s2.activePlayerIndex,
      table: s2.table.length,
      lastAction: s2.lastAction,
    });
    
    expect(s2.table.length).toBe(1);
    expect(s2.phase).toBe('defending');
  });
});