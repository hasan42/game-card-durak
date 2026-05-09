/**
 * Экран сетевой игры — создание/подключение к комнате
 * Поддержка PeerJS (локальная сеть) и Firebase (интернет)
 */

import { useState, useEffect, useRef } from 'react';
import { PeerJSNetworkManager, FirebaseNetworkManager } from 'game-network-lib';
import type { NetworkBackend } from '../engine/netStore';
import type { NetworkManagerInterface } from 'game-network-lib';

export type NetworkProvider = 'firebase' | 'peerjs';

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const PEERJS_CONFIG = {
  host: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
  port: 9000,
  path: '/myapp',
};

interface NetworkScreenProps {
  onConnected: (network: NetworkManagerInterface, role: 'host' | 'guest', backend: NetworkBackend) => void;
  onBack: () => void;
}

export function NetworkScreen({ onConnected, onBack }: NetworkScreenProps) {
  const [mode, setMode] = useState<'choose' | 'host_or_join' | 'backend' | 'host' | 'join'>('choose');
  const [provider, setProvider] = useState<NetworkProvider>('firebase');
  const [roomId, setRoomId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [generatedRoomId, setGeneratedRoomId] = useState('');
  const [playerCount, setPlayerCount] = useState(2);
  const networkRef = useRef<NetworkManagerInterface | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (networkRef.current && mode !== 'choose') {
        // Don't disconnect if we've handed off to game
      }
    };
  }, []);

  const handleHost = async () => {
    setStatus('Создание комнаты...');
    setError('');

    try {
      if (provider === 'firebase') {
        const network = new FirebaseNetworkManager(FIREBASE_CONFIG);
        networkRef.current = network;

        network.on((event) => {
          if (event.type === 'connected' && network.role === 'host') {
            setStatus('Комната создана! Ожидание игроков...');
            setGeneratedRoomId(network.roomId);
          }
          if (event.type === 'disconnected') {
            setError('Соединение разорвано');
          }
          if (event.type === 'error') {
            setError(String((event.payload as any)?.message || event.payload || 'Ошибка'));
            setStatus('');
          }
        });

        const id = await network.host({ maxPlayers: playerCount });
        setGeneratedRoomId(id);
        setStatus(`Комната ${id} создана! Ожидание игроков...`);
        
        // Ждём подключения второго игрока
        const checkInterval = setInterval(() => {
          if (network.playerList.length >= 2) {
            clearInterval(checkInterval);
            setStatus('Игроки подключены! Начинаем...');
            setTimeout(() => onConnected(network, 'host', 'firebase'), 300);
          }
        }, 1000);
      } else {
        // PeerJS
        const network = new PeerJSNetworkManager(PEERJS_CONFIG);
        networkRef.current = network;

        network.on((event) => {
          if (event.type === 'connected' && network.role === 'host') {
            setStatus('Игрок подключён! Начинаем...');
            setTimeout(() => onConnected(network, 'host', 'peerjs'), 300);
          }
          if (event.type === 'disconnected') {
            setError('Соединение разорвано');
          }
          if (event.type === 'error') {
            setError(String((event.payload as any)?.message || event.payload || 'Ошибка'));
            setStatus('');
          }
        });

        const id = await network.host();
        setGeneratedRoomId(id);
        setStatus(`Комната создана! Ожидание второго игрока...`);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка создания комнаты');
      setStatus('');
    }
  };

  const handleJoin = async () => {
    if (!roomId.trim()) {
      setError('Введите код комнаты');
      return;
    }
    setStatus('Подключение...');
    setError('');

    try {
      if (provider === 'firebase') {
        const network = new FirebaseNetworkManager(FIREBASE_CONFIG);
        networkRef.current = network;

        network.on((event) => {
          if (event.type === 'error') {
            setError(String((event.payload as any)?.message || event.payload || 'Ошибка подключения'));
            setStatus('');
          }
        });

        await network.join(roomId.trim());
        setStatus('Подключено! Начинаем...');
        onConnected(network, 'guest', 'firebase');
      } else {
        // PeerJS
        const network = new PeerJSNetworkManager(PEERJS_CONFIG);
        networkRef.current = network;

        network.on((event) => {
          if (event.type === 'error') {
            setError(String((event.payload as any)?.message || event.payload || 'Ошибка подключения'));
            setStatus('');
          }
        });

        await network.join(roomId.trim());
        setStatus('Подключено! Начинаем...');
        onConnected(network, 'guest', 'peerjs');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка подключения');
      setStatus('');
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(generatedRoomId);
    setStatus('Код скопирован!');
  };

  const cancelHost = () => {
    if (networkRef.current) {
      networkRef.current.disconnect();
      networkRef.current = null;
    }
    setMode('choose');
    setGeneratedRoomId('');
    setStatus('');
    setError('');
  };

  // ====== Начальный экран ======
  if (mode === 'choose') {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-8">
        <div className="text-7xl mb-4">🌐</div>
        <h1 className="text-4xl font-bold text-yellow-300 drop-shadow-lg">Сетевая игра</h1>
        <p className="text-green-200 text-center max-w-sm">
          Играйте с друзьями через интернет или локальную сеть.
        </p>
        <div className="flex flex-col gap-3 mt-4">
          <button onClick={() => setMode('host_or_join')} className="btn btn-primary text-xl px-8 py-3">
            🎮 Играть онлайн
          </button>
          <button onClick={onBack} className="btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-2">
            ← Назад
          </button>
        </div>
      </div>
    );
  }

  // ====== Экран выбора: создать или подключиться ======
  if (mode === 'host_or_join') {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">🎮</div>
        <h2 className="text-3xl font-bold text-yellow-300">Сетевая игра</h2>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button onClick={() => setMode('backend')} className="btn btn-primary text-xl px-8 py-4">
            🏠 Создать комнату
          </button>
          <button onClick={() => setMode('join')} className="btn bg-green-700 hover:bg-green-600 text-white text-xl px-8 py-4">
            🔗 Подключиться по коду
          </button>
          <button onClick={() => setMode('choose')} className="btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-2">
            ← Назад
          </button>
        </div>
      </div>
    );
  }

  // ====== Выбор бэкенда (только для создания) ======
  if (mode === 'backend') {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">🔧</div>
        <h2 className="text-3xl font-bold text-yellow-300">Выберите тип подключения</h2>
        
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button 
            onClick={() => { setProvider('firebase'); setMode('host'); handleHost(); }}
            className="btn btn-primary text-lg px-6 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">☁️</span>
              <div>
                <div className="font-bold">Firebase (Интернет)</div>
                <div className="text-sm opacity-80">Играйте из любой точки мира</div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => { setProvider('peerjs'); setMode('host'); handleHost(); }}
            className="btn bg-blue-700 hover:bg-blue-600 text-white text-lg px-6 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏠</span>
              <div>
                <div className="font-bold">PeerJS (Локальная сеть)</div>
                <div className="text-sm opacity-80">Играйте по Wi-Fi дома</div>
              </div>
            </div>
          </button>

          <button onClick={() => setMode('host_or_join')} className="btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 mt-2">
            ← Назад
          </button>
        </div>
      </div>
    );
  }

  // ====== Создание комнаты (хост) ======
  if (mode === 'host') {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">🏠</div>
        <h2 className="text-3xl font-bold text-yellow-300">
          {provider === 'firebase' ? 'Создание комнаты (Firebase)' : 'Создание комнаты (PeerJS)'}
        </h2>
        
        {provider === 'firebase' && (
          <div className="flex items-center gap-2 mb-2">
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
        )}
        
        {generatedRoomId && (
          <div className="bg-black/40 rounded-xl p-6 text-center">
            <p className="text-green-300 text-sm mb-2">Код комнаты:</p>
            <div className="text-3xl font-mono font-bold text-yellow-300 tracking-widest mb-3 select-all">
              {generatedRoomId}
            </div>
            <button onClick={copyRoomId} className="btn btn-primary px-4 py-2 text-sm">
              📋 Скопировать код
            </button>
          </div>
        )}
        {status && <p className="text-green-200 text-sm whitespace-pre-line text-center">{status}</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <p className="text-green-300/60 text-sm text-center max-w-xs">
          {provider === 'firebase' 
            ? 'Отправьте код друзьям. Когда все подключатся, игра начнётся.' 
            : 'Отправьте код другу. Когда он подключится, игра начнётся автоматически.'}
        </p>
        <button onClick={cancelHost} className="btn btn-danger px-6 py-2 mt-4">
          Отмена
        </button>
      </div>
    );
  }

  // ====== Подключение к комнате (гость) ======
  return (
    <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="text-6xl">🔗</div>
      <h2 className="text-3xl font-bold text-yellow-300">Подключение</h2>
      
      {/* Выбор бэкенда для подключения */}
      <div className="flex gap-2 mb-2">
        <button 
          onClick={() => setProvider('firebase')}
          className={`px-3 py-1 rounded text-sm ${provider === 'firebase' ? 'bg-yellow-500 text-black' : 'bg-frost-800 text-green-200'}`}
        >
          ☁️ Firebase
        </button>
        <button 
          onClick={() => setProvider('peerjs')}
          className={`px-3 py-1 rounded text-sm ${provider === 'peerjs' ? 'bg-yellow-500 text-black' : 'bg-frost-800 text-green-200'}`}
        >
          🏠 PeerJS
        </button>
      </div>
      
      <div className="bg-black/40 rounded-xl p-6 text-center">
        <p className="text-green-300 text-sm mb-3">Введите код комнаты:</p>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          placeholder="Код комнаты"
          className="w-full text-center text-xl font-mono bg-frost-900 border border-frost-700 rounded-lg px-4 py-3 text-yellow-300 focus:outline-none focus:border-yellow-400"
          autoFocus
        />
      </div>
      <button onClick={handleJoin} disabled={!roomId.trim()} className="btn btn-primary text-xl px-8 py-3">
        🎴 Подключиться
      </button>
      {status && <p className="text-green-200 text-sm">{status}</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button onClick={() => { setMode('host_or_join'); setStatus(''); setError(''); }} className="btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-2">
        ← Назад
      </button>
    </div>
  );
}