import Pusher from 'pusher';
import { fetcher } from './fetcher';

export const notificationsApi = {
  getNotifications: async (
    userId: string,
    options?: {
      limit?: number;
      unreadOnly?: boolean;
    }
  ): Promise<any> => {
    const params = new URLSearchParams({ userId });
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.unreadOnly) params.append('unreadOnly', 'true');

    return fetcher<any>(`/api/notifications?${params}`);
  },

  createNotification: async (notificationData: {
    userId: string;
    type:
      | 'friend_invitation'
      | 'friend_accepted'
      | 'game_invitation'
      | 'game_reminder'
      | 'game_registration'
      | 'game_cancellation'
      | 'system';
    title: string;
    message: string;
    data?: any;
  }): Promise<any> => {
    return fetcher<any>('/api/notifications', {
      method: 'POST',
      body: notificationData,
    });
  },

  markAsRead: async (notificationId: string): Promise<any> => {
    return fetcher<any>(`/api/notifications/${notificationId}`, {
      method: 'PATCH',
      body: { isRead: true },
    });
  },

  markAllAsRead: async (userId: string): Promise<any> => {
    return fetcher<any>(`/api/notifications/mark-all-read`, {
      method: 'POST',
      body: { userId },
    });
  },
};

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});
