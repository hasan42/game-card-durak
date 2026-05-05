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
- Автоматическая синхронизация через Firestore

### PeerJS (Локальная сеть) 🏠
- Играйте по Wi-Fi дома
- Без интернета
- 2 игрока

### VK Mini Apps 📱
- Интеграция с VK
- Приглашение друзей через VK Bridge
- Работает поверх Firebase

## 🚀 Быстрый старт

### Локальная разработка
```bash
npm install
npm run dev
```

### Сборка
```bash
npm run build
```

### Деплой на GitHub Pages
```bash
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

## 🛠️ Технологии

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Zustand (стейт-менеджмент)
- PeerJS (P2P)
- Firebase Firestore (онлайн)
- VK Bridge (VK Mini Apps)

## 📱 VK Mini Apps

### Настройка
1. Создайте приложение в [VK Dev](https://dev.vk.com/mini-apps)
2. Получите `APP_ID`
3. Добавьте в `.env`:
```bash
VITE_VK_APP_ID=your_vk_app_id
```
4. Укажите URL загрузки в настройках VK: `https://your-github-pages-url/vk.html`

## 📄 Структура проекта

```
src/
  components/
    GameScreen.tsx      # Главный экран игры
    NetworkScreen.tsx   # Экран сетевой игры
    CardComponent.tsx   # Компонент карты
  engine/
    store.ts            # Игровой стейт (Zustand)
    cards.ts            # Карты и масти
    ai.ts               # AI противник
    network.ts          # PeerJS сеть
    firebase.ts         # Firebase конфиг
    firebaseNetwork.ts  # Firebase сетевой менеджер
    vkNetwork.ts        # VK Mini Apps интеграция
    netStore.ts         # Сетевой стейт
  vk.ts                 # VK Bridge интеграция
```

## 📝 Лицензия

MIT
