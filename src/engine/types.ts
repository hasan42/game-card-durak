/**
 * Типы для игры «Дурак»
 */

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
// 11=J, 12=Q, 13=K, 14=A

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string; // уникальный ID: "hearts-14"
}

export type PlayerRole = 'attacker' | 'defender' | 'none';

export type GameMode = 'hotseat' | 'ai';

export type GamePhase =
  | 'waiting'       // ожидание — выбор режима
  | 'dealing'       // раздача карт
  | 'handoff'       // передача устройства между игроками (hot-seat)
  | 'ai_turn'       // AI думает
  | 'attacking'     // атакующий ходит
  | 'defending'     // защищающийся отбивается
  | 'taking'        // защитник берёт карты
  | 'round_end'     // конец раунда, переход хода
  | 'game_over';    // игра окончена

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  isWinner: boolean;
  takenCount: number; // сколько раз брал карты
}

export interface AttackCard {
  attackCard: Card;
  defendCard?: Card; // undefined = ещё не отбился
}

export interface GameState {
  deck: Card[];
  trumpSuit: Suit;
  trumpCard: Card | null; // нижняя карта колоды
  players: Player[];
  attackerIndex: number;  // 0 или 1
  table: AttackCard[];     // карты на столе
  phase: GamePhase;
  discardPile: Card[];    // отбой
  consecutivePasses: number;
  winner: number | null;  // индекс победителя (-1 = ничья)
  lastAction: string;     // описание последнего действия
  gameMode: GameMode;     // режим игры
  roundCount: number;     // номер раунда
}

export interface GameActions {
  attack: (card: Card) => void;
  defend: (attackCardId: string, defendCard: Card) => void;
  take: () => void;
  pass: () => void;
  startGame: () => void;
  resetGame: () => void;
}