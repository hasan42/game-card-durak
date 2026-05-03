/**
 * Экран сетевой игры — создание/подключение к комнате
 */

import { useState } from 'react';
import { NetworkManager } from '../engine/network';
import type { NetworkRole } from '../engine/network';

interface NetworkScreenProps {
  onConnected: (network: NetworkManager, role: NetworkRole) => void;
  onBack: () => void;
}

export function NetworkScreen({ onConnected, onBack }: NetworkScreenProps) {
  const [mode, setMode] = useState<'choose' | 'host' | 'join'>('choose');
  const [roomId, setRoomId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [generatedRoomId, setGeneratedRoomId] = useState('');

  const handleHost = async () => {
    setStatus('Создание комнаты...');
    setError('');

    const network = new NetworkManager({
      onConnected: (_role, _peerId) => {
        setStatus('Комната создана! Ожидание игрока...');
      },
      onDisconnected: () => {
        setError('Соединение разорвано');
      },
      onMessage: (msg) => {
        if (msg.type === 'join') {
          setStatus('Игрок подключён! Начинаем...');
          setTimeout(() => onConnected(network, 'host'), 500);
        }
      },
      onError: (err) => {
        setError(err.message);
        setStatus('');
      },
    });

    try {
      const id = await network.host();
      setGeneratedRoomId(id);
      setStatus(`Комната создана! Код: ${id}\nОжидание второго игрока...`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleJoin = async () => {
    if (!roomId.trim()) {
      setError('Введите код комнаты');
      return;
    }
    setStatus('Подключение...');
    setError('');

    const network = new NetworkManager({
      onConnected: (_role, _peerId) => {
        setStatus('Подключено! Начинаем...');
        setTimeout(() => onConnected(network, 'guest'), 500);
      },
      onDisconnected: () => {
        setError('Соединение разорвано');
      },
      onMessage: (msg) => {
        if (msg.type === 'ready') {
          setStatus('Хост готов!');
        }
      },
      onError: (err) => {
        setError(err.message);
        setStatus('');
      },
    });

    try {
      await network.join(roomId.trim());
    } catch (err: any) {
      setError(err.message);
      setStatus('');
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(generatedRoomId);
    setStatus('Код скопирован!');
  };

  if (mode === 'choose') {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-8">
        <div className="text-7xl mb-4">🌐</div>
        <h1 className="text-4xl font-bold text-yellow-300 drop-shadow-lg">Сетевая игра</h1>
        <p className="text-green-200 text-center max-w-sm">
          Играйте с другом через интернет.<br />
          Один создаёт комнату, другой подключается по коду.
        </p>
        <div className="flex flex-col gap-3 mt-4">
          <button onClick={() => { setMode('host'); handleHost(); }} className="btn btn-primary text-xl px-8 py-3">
            🏠 Создать комнату
          </button>
          <button onClick={() => setMode('join')} className="btn bg-green-700 hover:bg-green-600 text-white text-xl px-8 py-3">
            🔗 Подключиться по коду
          </button>
          <button onClick={onBack} className="btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-2">
            ← Назад
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'host') {
    return (
      <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">🏠</div>
        <h2 className="text-3xl font-bold text-yellow-300">Создание комнаты</h2>
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
          Отправьте код другу. Когда он подключится, игра начнётся автоматически.
        </p>
        <button onClick={() => { setMode('choose'); setGeneratedRoomId(''); }} className="btn btn-danger px-6 py-2 mt-4">
          Отмена
        </button>
      </div>
    );
  }

  // mode === 'join'
  return (
    <div className="table-bg min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="text-6xl">🔗</div>
      <h2 className="text-3xl font-bold text-yellow-300">Подключение</h2>
      <div className="bg-black/40 rounded-xl p-6 text-center">
        <p className="text-green-300 text-sm mb-3">Введите код комнаты:</p>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
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
      <button onClick={() => setMode('choose')} className="btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-2">
        ← Назад
      </button>
    </div>
  );
}