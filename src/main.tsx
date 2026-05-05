import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GameScreen } from './components/GameScreen'
import { isVKEnvironment, initVK } from './vk'

// Создаём root ДО асинхронных операций
const root = createRoot(document.getElementById('root')!)

// Рендерим сразу
root.render(
  <StrictMode>
    <GameScreen />
  </StrictMode>,
)

// VK инициализация — асинхронно, после рендера
if (isVKEnvironment() || !!(window as any).__VK_ENV__) {
  initVK().catch(console.error);
}