import { describe, it, expect } from 'vitest';
import { serializeGameState, useNetStore } from '../engine/netStore';
import { useGameStore } from '../engine/store';

describe('serializeGameState', () => {
  it('не содержит функций', () => {
    useGameStore.getState().resetGame();
    useGameStore.getState().startGame('network', 2);
    const state = useGameStore.getState();
    const serialized = serializeGameState(state);
    for (const key of Object.keys(serialized)) {
      expect(typeof (serialized as any)[key]).not.toBe('function');
    }
  });

  it('можно JSON.stringify', () => {
    useGameStore.getState().resetGame();
    useGameStore.getState().startGame('network', 2);
    const state = useGameStore.getState();
    const serialized = serializeGameState(state);
    const json = JSON.stringify(serialized);
    expect(json).toBeTruthy();
    const parsed = JSON.parse(json);
    expect(parsed.deck).toBeDefined();
    expect(parsed.players).toBeDefined();
  });

  it('сохраняет все поля GameState', () => {
    useGameStore.getState().resetGame();
    useGameStore.getState().startGame('network', 2);
    const state = useGameStore.getState();
    const serialized = serializeGameState(state);

    const expectedKeys = [
      'deck', 'trumpSuit', 'trumpCard', 'players',
      'attackerIndex', 'defenderIndex', 'activePlayerIndex',
      'playerCount', 'table', 'phase', 'discardPile',
      'consecutivePasses', 'thrownInPasses', 'winner',
      'lastAction', 'gameMode', 'roundCount',
    ];

    for (const key of expectedKeys) {
      expect(serialized).toHaveProperty(key);
    }
  });

  it('не содержит Zustand-методов (attack, defend, etc.)', () => {
    useGameStore.getState().resetGame();
    useGameStore.getState().startGame('network', 2);
    const state = useGameStore.getState();
    const serialized = serializeGameState(state);

    const methodKeys = ['attack', 'defend', 'take', 'pass', 'startGame', 'resetGame',
      'validDefends', 'canThrowIn', 'confirmHandoff', 'aiThinking'];

    for (const key of methodKeys) {
      expect((serialized as any)[key]).toBeUndefined();
    }
  });

  it('данные игрока корректны после сериализации', () => {
    useGameStore.getState().resetGame();
    useGameStore.getState().startGame('network', 3);
    const state = useGameStore.getState();
    const serialized = serializeGameState(state);

    expect(serialized.players).toHaveLength(3);
    for (const p of serialized.players) {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('hand');
      expect(p.hand.length).toBeGreaterThan(0);
    }
  });

  it('колода и козырь сериализуются корректно', () => {
    useGameStore.getState().resetGame();
    useGameStore.getState().startGame('network', 2);
    const state = useGameStore.getState();
    const serialized = serializeGameState(state);

    expect(serialized.deck.length).toBeGreaterThan(0);
    expect(serialized.trumpSuit).toBeTruthy();
    expect(serialized.trumpCard).toBeTruthy();
    expect(serialized.trumpCard!.suit).toBe(serialized.trumpSuit);
  });

  it('сериализация после атаки корректна', () => {
    useGameStore.getState().resetGame();
    useGameStore.getState().startGame('network', 2);
    const state = useGameStore.getState();
    useGameStore.getState().attack(state.players[state.attackerIndex].hand[0]);

    const after = useGameStore.getState();
    const serialized = serializeGameState(after);

    expect(serialized.table).toHaveLength(1);
    expect(serialized.phase).toBe('defending');
    expect(serialized.lastAction).toBeTruthy();
  });
});

describe('useNetStore начальное состояние', () => {
  it('имеет корректные значения по умолчанию', () => {
    const state = useNetStore.getState();
    expect(state.role).toBeNull();
    expect(state.connected).toBe(false);
    expect(state.error).toBeNull();
    expect(state.roomId).toBeNull();
    expect(state.gameState).toBeNull();
    expect(state.myPlayerIndex).toBe(-1);
    expect(state.players).toEqual([]);
  });
});