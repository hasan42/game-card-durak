import { n as __exportAll } from "./rolldown-runtime-BZ_oHznj.js";
import { a as setDoc, c as doc, d as initializeApp, i as onSnapshot, l as getFirestore, n as deleteDoc, o as updateDoc, r as getDoc, s as collection, u as serverTimestamp } from "./firebase-vendor-BbM1Nia1.js";
//#region src/engine/firebase.ts
/**
* Firebase конфигурация для сетевой игры «Дурак»
* Firestore — комнаты, игроки, состояние игры
*/
var firebase_exports = /* @__PURE__ */ __exportAll({
	createRoom: () => createRoom,
	getDb: () => getDb,
	getPlayerRef: () => getPlayerRef,
	getPlayersRef: () => getPlayersRef,
	getRoom: () => getRoom,
	getRoomRef: () => getRoomRef,
	joinRoom: () => joinRoom,
	leaveRoom: () => leaveRoom,
	roomExists: () => roomExists,
	subscribePlayers: () => subscribePlayers,
	subscribeRoom: () => subscribeRoom,
	updateGameState: () => updateGameState
});
var firebaseConfig = {
	apiKey: "AIzaSyA9dgeYI_Axx5gqgPacoBf_HGPncwT8qoU",
	authDomain: "game-card-durak.firebaseapp.com",
	projectId: "game-card-durak",
	storageBucket: "game-card-durak.firebasestorage.app",
	messagingSenderId: "872670434332",
	appId: "1:872670434332:web:a59d4438fffb0e6c85bbd9"
};
var app = null;
var db = null;
function getDb() {
	if (!db) {
		if (!firebaseConfig.apiKey || !firebaseConfig.projectId) throw new Error("Firebase не настроен. Заполните .env файл с VITE_FIREBASE_* переменными.");
		app = initializeApp(firebaseConfig);
		db = getFirestore(app);
	}
	return db;
}
var ROOMS_COLLECTION = "durak_rooms";
var PLAYERS_COLLECTION = "durak_players";
function getRoomRef(roomId) {
	return doc(getDb(), ROOMS_COLLECTION, roomId);
}
function getPlayersRef(roomId) {
	return collection(getDb(), ROOMS_COLLECTION, roomId, PLAYERS_COLLECTION);
}
function getPlayerRef(roomId, playerId) {
	return doc(getDb(), ROOMS_COLLECTION, roomId, PLAYERS_COLLECTION, playerId);
}
/** Создать комнату */
async function createRoom(roomId, hostId, hostName, maxPlayers = 2) {
	await setDoc(getRoomRef(roomId), {
		id: roomId,
		hostId,
		hostName,
		playerCount: 1,
		maxPlayers,
		status: "waiting",
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	});
}
/** Присоединиться к комнате */
async function joinRoom(roomId, playerId, playerName, playerIndex) {
	const roomRef = getRoomRef(roomId);
	const roomSnap = await getDoc(roomRef);
	if (!roomSnap.exists()) return false;
	const room = roomSnap.data();
	if (room.status !== "waiting") return false;
	if (room.playerCount >= room.maxPlayers) return false;
	await setDoc(getPlayerRef(roomId, playerId), {
		id: playerId,
		name: playerName,
		roomId,
		index: playerIndex,
		connected: true,
		lastSeen: serverTimestamp()
	});
	await updateDoc(roomRef, {
		playerCount: room.playerCount + 1,
		updatedAt: serverTimestamp()
	});
	return true;
}
/** Отключиться от комнаты */
async function leaveRoom(roomId, playerId) {
	await deleteDoc(getPlayerRef(roomId, playerId));
	const roomRef = getRoomRef(roomId);
	const roomSnap = await getDoc(roomRef);
	if (!roomSnap.exists()) return;
	const room = roomSnap.data();
	const newCount = Math.max(0, room.playerCount - 1);
	if (newCount === 0) await deleteDoc(roomRef);
	else await updateDoc(roomRef, {
		playerCount: newCount,
		updatedAt: serverTimestamp()
	});
}
/** Подписка на комнату */
function subscribeRoom(roomId, callback) {
	return onSnapshot(getRoomRef(roomId), (snap) => {
		if (!snap.exists()) {
			callback(null);
			return;
		}
		callback(snap.data());
	});
}
/** Подписка на игроков комнаты */
function subscribePlayers(roomId, callback) {
	return onSnapshot(getPlayersRef(roomId), (snap) => {
		const players = [];
		snap.forEach((doc) => {
			players.push(doc.data());
		});
		callback(players);
	});
}
/** Обновить состояние игры (только хост) */
async function updateGameState(roomId, gameState) {
	await updateDoc(getRoomRef(roomId), {
		gameState,
		updatedAt: serverTimestamp()
	});
}
/** Получить комнату */
async function getRoom(roomId) {
	const snap = await getDoc(getRoomRef(roomId));
	if (!snap.exists()) return null;
	return snap.data();
}
/** Проверить существование комнаты */
async function roomExists(roomId) {
	return (await getDoc(getRoomRef(roomId))).exists();
}
//#endregion
export { roomExists as a, updateGameState as c, leaveRoom as i, firebase_exports as n, subscribePlayers as o, joinRoom as r, subscribeRoom as s, createRoom as t };
