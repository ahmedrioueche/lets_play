import { pusherServer } from '@/lib/pusherServer';
import NotificationModel from '@/models/Notification';
import UserProfileModel from '@/models/UserProfile';
import { transporter } from './nodemailer';

interface SendNotificationOptions {
  userIds: string[]; // Array of user IDs to notify
  type: string; // Notification type (e.g., 'game_registration', 'game_cancellation', etc.)
  title: string;
  message: string;
  data?: Record<string, any>;
  event?: string; // Pusher event name (defaults to type)
  excludeUserIds?: string[]; // Optional: user IDs to exclude from notification
}

// Helper to send email notification
async function sendEmailNotification({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  await transporter.sendMail({
    to,
    subject,
    text,
    html,
  });
}

// List of important events for email notifications
const IMPORTANT_EVENTS = ['game_reminder', 'game_cancellation', 'game_kick'];

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
      // Fetch user profile/settings
      const userProfile = await UserProfileModel.findOne({ userId });
      const pushEnabled = userProfile?.settings?.pushNotifications !== false;
      const emailEnabled = userProfile?.settings?.emailNotifications !== false;
      const userEmail = userProfile?.email;

      // Always create notification in DB
      const notification = await NotificationModel.create({
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
      });

      // Send push notification if enabled
      if (pushEnabled) {
        try {
          await pusherServer.trigger(`user-${userId}`, event || type, notification);
        } catch (e) {
          // Optionally log or handle Pusher errors
        }
      }

      // Send email notification if important event and enabled
      if (emailEnabled && IMPORTANT_EVENTS.includes(type) && userEmail) {
        try {
          await sendEmailNotification({
            to: userEmail,
            subject: title,
            text: message,
          });
        } catch (e) {
          // Optionally log or handle email errors
        }
      }

      return notification;
    })
  );
  return notifications;
}
