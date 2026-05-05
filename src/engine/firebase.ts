/**
 * Firebase конфигурация для сетевой игры «Дурак»
 * Firestore — комнаты, игроки, состояние игры
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  DocumentReference,
  type DocumentData,
} from 'firebase/firestore';

// TODO: Заменить на реальные конфиги из Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ─── Типы ───

export interface FirestoreRoom {
  id: string;
  hostId: string;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  gameState?: any;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface FirestorePlayer {
  id: string;
  name: string;
  roomId: string;
  index: number;
  connected: boolean;
  lastSeen: Timestamp | null;
}

// ─── Комнаты ───

const ROOMS_COLLECTION = 'durak_rooms';
const PLAYERS_COLLECTION = 'durak_players';

export function getRoomRef(roomId: string): DocumentReference<DocumentData, DocumentData> {
  return doc(db, ROOMS_COLLECTION, roomId);
}

export function getPlayersRef(roomId: string) {
  return collection(db, ROOMS_COLLECTION, roomId, PLAYERS_COLLECTION);
}

export function getPlayerRef(roomId: string, playerId: string): DocumentReference<DocumentData, DocumentData> {
  return doc(db, ROOMS_COLLECTION, roomId, PLAYERS_COLLECTION, playerId);
}

/** Создать комнату */
export async function createRoom(
  roomId: string,
  hostId: string,
  hostName: string,
  maxPlayers: number = 2
): Promise<void> {
  await setDoc(getRoomRef(roomId), {
    id: roomId,
    hostId,
    hostName,
    playerCount: 1,
    maxPlayers,
    status: 'waiting',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Обновить статус комнаты */
export async function updateRoomStatus(
  roomId: string,
  status: FirestoreRoom['status'],
  gameState?: any
): Promise<void> {
  const data: any = { status, updatedAt: serverTimestamp() };
  if (gameState !== undefined) data.gameState = gameState;
  await updateDoc(getRoomRef(roomId), data);
}

/** Присоединиться к комнате */
export async function joinRoom(
  roomId: string,
  playerId: string,
  playerName: string,
  playerIndex: number
): Promise<boolean> {
  const roomRef = getRoomRef(roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) return false;

  const room = roomSnap.data() as FirestoreRoom;
  if (room.status !== 'waiting') return false;
  if (room.playerCount >= room.maxPlayers) return false;

  // Добавить игрока
  await setDoc(getPlayerRef(roomId, playerId), {
    id: playerId,
    name: playerName,
    roomId,
    index: playerIndex,
    connected: true,
    lastSeen: serverTimestamp(),
  });

  // Обновить счётчик
  await updateDoc(roomRef, {
    playerCount: room.playerCount + 1,
    updatedAt: serverTimestamp(),
  });

  return true;
}

/** Отключиться от комнаты */
export async function leaveRoom(roomId: string, playerId: string): Promise<void> {
  await deleteDoc(getPlayerRef(roomId, playerId));

  const roomRef = getRoomRef(roomId);
  const roomSnap = await getDoc(roomRef);
  if (!roomSnap.exists()) return;

  const room = roomSnap.data() as FirestoreRoom;
  const newCount = Math.max(0, room.playerCount - 1);

  if (newCount === 0) {
    // Удалить пустую комнату
    await deleteDoc(roomRef);
  } else {
    await updateDoc(roomRef, {
      playerCount: newCount,
      updatedAt: serverTimestamp(),
    });
  }
}

/** Подписка на комнату */
export function subscribeRoom(
  roomId: string,
  callback: (room: FirestoreRoom | null) => void
) {
  return onSnapshot(getRoomRef(roomId), (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback(snap.data() as FirestoreRoom);
  });
}

/** Подписка на игроков комнаты */
export function subscribePlayers(
  roomId: string,
  callback: (players: FirestorePlayer[]) => void
) {
  return onSnapshot(getPlayersRef(roomId), (snap) => {
    const players: FirestorePlayer[] = [];
    snap.forEach((doc) => {
      players.push(doc.data() as FirestorePlayer);
    });
    callback(players);
  });
}

/** Обновить состояние игры (только хост) */
export async function updateGameState(roomId: string, gameState: any): Promise<void> {
  await updateDoc(getRoomRef(roomId), {
    gameState,
    updatedAt: serverTimestamp(),
  });
}

/** Получить комнату */
export async function getRoom(roomId: string): Promise<FirestoreRoom | null> {
  const snap = await getDoc(getRoomRef(roomId));
  if (!snap.exists()) return null;
  return snap.data() as FirestoreRoom;
}

/** Проверить существование комнаты */
export async function roomExists(roomId: string): Promise<boolean> {
  const snap = await getDoc(getRoomRef(roomId));
  return snap.exists();
}
