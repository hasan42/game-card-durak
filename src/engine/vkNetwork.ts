/**
 * VK Mini Apps Network Manager для игры «Дурак»
 * Fallback вариант — игра внутри VK с друзьями
 * Использует Firebase как бэкенд, но с VK-интеграцией:
 * - VK Share для приглашений
 * - VK Friends API для списка друзей
 * - VK Bridge для уведомлений
 */

import { FirebaseNetworkManager } from 'game-network-lib';
import type { FirebaseConfig } from 'game-network-lib';
import { bridge, isVKEnvironment } from '../vk';

const VK_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export class VKNetworkManager extends FirebaseNetworkManager {
  constructor() {
    super(VK_FIREBASE_CONFIG);
  }

  /** Создать комнату с VK-приглашением */
  async hostWithVKInvite(maxPlayers: number = 2): Promise<string> {
    const roomId = await this.host({ maxPlayers });

    // Показать VK Share для приглашения друзей
    if (isVKEnvironment()) {
      try {
        await bridge.send('VKWebAppShare', {
          link: `https://vk.com/app{APP_ID}#room=${roomId}`,
        });
      } catch (e) {
        console.warn('[VKNetwork] Share failed:', e);
      }
    }

    return roomId;
  }

  /** Присоединиться через VK (по параметрам URL) */
  async joinFromVK(playerName: string = 'Игрок'): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('VK join requires browser environment');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room') || urlParams.get('vk_room');

    if (!roomId) {
      throw new Error('Не найден код комнаты в параметрах VK');
    }

    await this.join(roomId, { playerName });
  }

  /** Получить список друзей VK (если разрешено) */
  async getVKFriends(): Promise<{ id: number; name: string; photo: string }[]> {
    if (!isVKEnvironment()) return [];

    try {
      const result: any = await bridge.send('VKWebAppGetFriends', {
        multi: false,
      });

      if (result.users) {
        return result.users.map((u: any) => ({
          id: u.id,
          name: `${u.first_name} ${u.last_name}`,
          photo: u.photo_100,
        }));
      }
    } catch (e) {
      console.warn('[VKNetwork] GetFriends failed:', e);
    }

    return [];
  }

  /** Отправить уведомление в VK (заготовка) */
  async sendVKNotification(message: string): Promise<void> {
    if (!isVKEnvironment()) return;

    try {
      await bridge.send('VKWebAppShowWallPostBox', {
        message,
      });
    } catch (e) {
      console.warn('[VKNetwork] Notification failed:', e);
    }
  }
}