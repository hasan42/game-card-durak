# 🃏 Дурак — Карточная игра

Классическая карточная игра «Дурак» на 36 карт. Играйте против AI, с другом на одном устройстве (hot-seat) или по сети.

## 🎮 Режимы игры

| Режим | Описание | Игроков |
|-------|----------|---------|
| 🤖 Против компьютера | AI с улучшенной стратегией | 2-6 |
| 👥 Hot-seat | На одном устройстве | 2-6 |
| 🌐 По сети | Онлайн через интернет или локальную сеть | 2-6 |

## 🌐 Сетевая игра

### Firebase (Интернет) ☁️
- Играйте из любой точки мира
- Код комнаты для подключения
- 2-6 игроков
- Лобби со списком подключённых игроков
- Реконнект при перезагрузке страницы
- Хост авторитетен, гости отправляют actions

### PeerJS (Локальная сеть) 🏠
- Играйте по Wi-Fi дома
- Без интернета
- 2 игрока

## ✨ Фичи

- 🎴 Анимации карт (раздача, атака, защита, взятие)
- 📱 Мобильная адаптация (375px+, touch-friendly)
- ⏱️ Таймер хода 30с (сетевая игра, авто-взятие/пас)
- 🔄 Реконнект гостя (сохранение в localStorage)
- 🏠 Лобби со списком игроков (Firebase)
- 📡 Overlay при дисконнекте хоста
- 🤖 AI с стратегией (атака/подкидывание/защита по очереди)

## 🚀 Быстрый старт

```bash
npm install
npm run dev
```

### Сборка и деплой
```bash
npm run build
npm run deploy
```

## ⚙️ Настройка Firebase

1. Создайте проект в [Firebase Console](https://console.firebase.google.com)
2. Включите Firestore Database
3. Скопируйте конфигурацию из Project Settings → General → Your apps → Web
4. Заполните `.env` файл:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Правила Firestore (для тестирования)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 🧪 Тестирование

```bash
npx vitest run
```

101 тест: карты, движок, AI, сериализация, сетевая игра.

## 🛠️ Технологии

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Zustand (стейт-менеджмент)
- [game-network-lib](https://github.com/hasan42/game-network-lib) (PeerJS + Firebase)

## 📦 game-network-lib

Выделенная библиотека для сетевой игры:
- `PeerJSNetworkManager` — WebRTC P2P (2 игрока)
- `FirebaseNetworkManager` — Firestore real-time (2-6 игроков)
- `GameNetwork` — высокоуровневая обёртка (хост авторитетен)
- Реконнект с `playerId` / `playerIndex`
- Установка: `npm install hasan42/game-network-lib`

## 📄 Структура проекта

```
src/
  components/
    GameScreen.tsx      # Главный экран (AI/hot-seat/сеть)
    NetworkScreen.tsx   # Лобби, создание/подключение, реконнект
    CardComponent.tsx   # Карточка с анимациями
  engine/
    store.ts            # Игровой стейт (Zustand, N игроков)
    cards.ts            # Карты, масти, ранги, canBeat, sortHand
    ai.ts               # AI противник
    types.ts             # Типы (Card, GameState, Player, NetworkAction)
    netStore.ts         # Сетевой стейт (обёртка над game-network-lib)
  __tests__/            # 101 автотест (vitest)
```

## 📝 Лицензия

MIT