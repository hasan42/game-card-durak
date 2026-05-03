import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GameScreen } from './components/GameScreen'
import { isVKEnvironment, initVK } from './vk'

// Инициализация VK если запущено внутри VK (через vk.html или через VK iframe)
if (isVKEnvironment() || !!(window as any).__VK_ENV__) {
  initVK().catch(console.error);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameScreen />
  </StrictMode>,
)