/**
 * VK Mini Apps Network Manager для игры «Дурак»
 * Fallback вариант — игра внутри VK с друзьями
 * Использует Firebase как бэкенд, но с VK-интеграцией:
 * - VK Share для приглашений
 * - VK Friends API для списка друзей
 * - VK Bridge для уведомлений
 */

import { FirebaseNetworkManager } from './firebaseNetwork';
import { bridge, isVKEnvironment } from '../vk';

export class VKNetworkManager extends FirebaseNetworkManager {

  /** Создать комнату с VK-приглашением */
  async hostWithVKInvite(maxPlayers: number = 2): Promise<string> {
    const roomId = await this.host(maxPlayers);

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

    await this.join(roomId, playerName);
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
      // VK не позволяет произвольные уведомления,
      // но можно использовать VKWebAppShowWallPostBox
      await bridge.send('VKWebAppShowWallPostBox', {
        message,
      });
    } catch (e) {
      console.warn('[VKNetwork] Notification failed:', e);
    }
  }
}
