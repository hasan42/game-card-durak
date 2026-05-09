import { createRoot } from 'react-dom/client'
import './index.css'
import { GameScreen } from './components/GameScreen'

// Создаём root ДО асинхронных операций
const root = createRoot(document.getElementById('root')!)

// Рендерим без StrictMode для продакшена (убирает двойной рендер)
root.render(
  <GameScreen />
)