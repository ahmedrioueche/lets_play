import { pusherServer } from '@/lib/pusherServer';
import NotificationModel from '@/models/Notification';

interface SendNotificationOptions {
  userIds: string[]; // Array of user IDs to notify
  type: string; // Notification type (e.g., 'game_registration', 'game_cancellation', etc.)
  title: string;
  message: string;
  data?: Record<string, any>;
  event?: string; // Pusher event name (defaults to type)
  excludeUserIds?: string[]; // Optional: user IDs to exclude from notification
}

/**
 * Sends notifications to multiple users and triggers Pusher events.
 * - Creates a notification in the database for each user.
 * - Triggers a Pusher event for each user.
 * @param options SendNotificationOptions
 * @returns Promise<Notification[]>
 */
export async function sendNotification(options: SendNotificationOptions) {
  const { userIds, type, title, message, data = {}, event, excludeUserIds = [] } = options;

  // Remove excluded users and deduplicate
  const uniqueUserIds = Array.from(new Set(userIds)).filter((id) => !excludeUserIds.includes(id));

  const notifications = await Promise.all(
    uniqueUserIds.map(async (userId) => {
      const notification = await NotificationModel.create({
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
      });
      try {
        await pusherServer.trigger(`user-${userId}`, event || type, notification);
      } catch (e) {
        // Optionally log or handle Pusher errors
      }
      return notification;
    })
  );
  return notifications;
}
