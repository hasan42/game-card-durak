/**
 * VK Bridge интеграция для VK Mini App
 * — Инициализация VK Bridge
 * — Определение темы VK (светлая/тёмная)
 * — Получение информации о пользователе (имя, фото)
 * — Подписка на события VK (VKWebAppUpdateConfig)
 */

import bridge from '@vkontakte/vk-bridge';

export interface VKUser {
  id: number;
  firstName: string;
  lastName: string;
  photo100?: string;
  photo200?: string;
}

export interface VKTheme {
  theme: 'light' | 'dark';
}

let vkUser: VKUser | null = null;
let vkTheme: VKTheme = { theme: 'light' };
let vkInitialized = false;

/**
 * Проверка: запущено ли приложение внутри VK (Mini App)
 */
export function isVKEnvironment(): boolean {
  // VK Bridge доступен и мы внутри VK iframe
  if (typeof window === 'undefined') return false;
  // Проверяем URL параметры или наличие VK Bridge
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('vk_access_token_settings')
    || urlParams.has('vk_user_id')
    || urlParams.has('vk_app_id')
    || urlParams.has('vk_platform');
}

/**
 * Инициализация VK Bridge
 * Вызывается при старте приложения (из vk.html)
 */
export async function initVK(): Promise<void> {
  if (vkInitialized) return;

  try {
    // VKWebAppInit уже вызывается в vk.html, но можно и тут
    await bridge.send('VKWebAppInit');
    vkInitialized = true;

    // Подписка на смену темы
    bridge.subscribe((event: any) => {
      if (event.type === 'VKWebAppUpdateConfig') {
        const scheme = event.detail?.data?.scheme;
        if (scheme === 'vkui_dark' || scheme === 'space_gray') {
          vkTheme = { theme: 'dark' };
        } else {
          vkTheme = { theme: 'light' };
        }
        applyVKTheme(vkTheme.theme);
      }
    });

    // Получаем текущую тему
    try {
      const configResult: any = await bridge.send('VKWebAppGetConfig');
      const scheme = configResult?.scheme;
      if (scheme === 'vkui_dark' || scheme === 'space_gray') {
        vkTheme = { theme: 'dark' };
      } else {
        vkTheme = { theme: 'light' };
      }
      applyVKTheme(vkTheme.theme);
    } catch {
      // Не критично, используем тему по умолчанию
    }

    // Получаем информацию о пользователе
    try {
      const userInfo: any = await bridge.send('VKWebAppGetUserInfo');
      if (userInfo) {
        vkUser = {
          id: userInfo.id,
          firstName: userInfo.first_name || '',
          lastName: userInfo.last_name || '',
          photo100: userInfo.photo_100,
          photo200: userInfo.photo_200,
        };
      }
    } catch {
      // Не критично — будем использовать «Вы»
    }

  } catch (error) {
    console.error('[VK] Init failed:', error);
    vkInitialized = false;
  }
}

/**
 * Получить информацию о текущем пользователе VK
 */
export function getVKUser(): VKUser | null {
  return vkUser;
}

/**
 * Получить текущую тему VK
 */
export function getVKTheme(): VKTheme {
  return vkTheme;
}

/**
 * Применить VK тему к документу
 */
function applyVKTheme(theme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('vk-dark');
    root.classList.remove('vk-light');
  } else {
    root.classList.add('vk-light');
    root.classList.remove('vk-dark');
  }
}

/**
 * Показать рекламу VK (заготовка)
 */
export async function showVKAd(): Promise<void> {
  if (!isVKEnvironment()) return;
  try {
    await bridge.send('VKWebAppShowBannerAd', {
      banner_location: 'bottom',
    });
  } catch (error) {
    console.warn('[VK] Banner ad failed:', error);
  }
}

/**
 * Показать межстраничную рекламу VK (заготовка)
 */
export async function showVKInterstitialAd(): Promise<void> {
  if (!isVKEnvironment()) return;
  try {
    // @ts-ignore — VKWebAppShowInterstitialAd не в типах, но поддерживается
    await bridge.send('VKWebAppShowInterstitialAd' as any);
  } catch (error) {
    console.warn('[VK] Interstitial ad failed:', error);
  }
}

/**
 * Поделиться ссылкой в VK
 */
export async function vkShare(link?: string): Promise<void> {
  if (!isVKEnvironment()) return;
  try {
    await bridge.send('VKWebAppShare', {
      link: link || window.location.href,
    });
  } catch (error) {
    console.warn('[VK] Share failed:', error);
  }
}

/**
 * VK Bridge object (для прямого доступа)
 */
export { bridge };