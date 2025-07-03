import cron from 'node-cron';
import dbConnect from '../config/db';
import GameModel from '../models/Game';
import UserProfileModel from '../models/UserProfile';
import { sendNotification } from '../utils/notifications';

// Constants
const NOTIFICATION_WINDOW_MS = 60 * 1000; // 1 minute window
const REMINDER_TIME_MS = 60 * 60 * 1000; // 1 hour before game

// Helper to get current UTC time
const getCurrentUTCDate = (): Date => new Date(new Date().toISOString());

// Helper to extract user IDs from game participants and organizer
const extractUserIdsFromGame = (game: any): string[] => {
  const participantIds = (game.participants || [])
    .map((p: any) => {
      if (typeof p === 'object' && p !== null && p._id) {
        return p._id.toString();
      }
      return typeof p === 'string' ? p : (p?.toString() ?? '');
    })
    .filter(Boolean);

  let organizerId = '';
  if (typeof game.organizer === 'object' && game.organizer !== null && game.organizer._id) {
    organizerId = game.organizer._id.toString();
  } else {
    organizerId =
      typeof game.organizer === 'string' ? game.organizer : (game.organizer?.toString() ?? '');
  }

  return organizerId ? [organizerId, ...participantIds] : participantIds;
};

// Helper to fetch user profiles for a list of userIds
const getUserProfiles = async (userIds: string[]) => {
  const profiles = await UserProfileModel.find({ userId: { $in: userIds } }).lean();
  const map: Record<string, any> = {};
  for (const profile of profiles) {
    map[profile.userId] = profile;
  }
  return map;
};

// Send notifications for games within a time range, using user settings
const sendGameNotifications = async (
  games: any[],
  notificationType: 'reminder' | 'start',
  timeDescription: string,
  options?: { now: Date; reminderTime?: Date }
): Promise<void> => {
  for (const game of games) {
    try {
      const userIds = extractUserIdsFromGame(game);
      if (userIds.length === 0) {
        console.warn(`[${notificationType}] No users to notify for game ${game._id}`);
        continue;
      }
      // Fetch user profiles for all participants/organizer
      const userProfiles = await getUserProfiles(userIds);
      // Filter users based on their settings
      let filteredUserIds: string[] = [];
      if (notificationType === 'reminder') {
        // For reminders, check alertBeforeGameStarts and alertTimeBeforeGame
        const now = options?.now || new Date();
        const reminderTime = options?.reminderTime || new Date(game.date);
        filteredUserIds = userIds.filter((userId) => {
          const profile = userProfiles[userId];
          if (!profile) return false;
          const settings = profile.settings || {};
          if (!settings.alertBeforeGameStarts) return false;
          // Calculate the user's preferred reminder time in ms
          const userReminderMinutes = settings.alertTimeBeforeGame ?? 30;
          const userReminderMs = userReminderMinutes * 60 * 1000;
          // The script runs every minute, so allow a window
          const diff = new Date(game.date).getTime() - now.getTime();
          return (
            diff >= userReminderMs - NOTIFICATION_WINDOW_MS &&
            diff <= userReminderMs + NOTIFICATION_WINDOW_MS
          );
        });
      } else if (notificationType === 'start') {
        // For start notifications, check alertOnStart
        filteredUserIds = userIds.filter((userId) => {
          const profile = userProfiles[userId];
          if (!profile) return false;
          const settings = profile.settings || {};
          return !!settings.alertOnStart;
        });
      }
      if (filteredUserIds.length === 0) {
        console.log(`[${notificationType}] No users opted in for game ${game._id}`);
        continue;
      }
      const message =
        notificationType === 'reminder'
          ? `Reminder: The game "${game.title}" starts soon!`
          : `The game "${game.title}" is starting now!`;
      await sendNotification({
        userIds: filteredUserIds,
        type: `game_${notificationType}`,
        title: notificationType === 'reminder' ? 'Game Reminder' : 'Game Starting Now',
        message,
        data: { gameId: game._id },
      });
      console.log(
        `[${notificationType}] Sent notification for game ${game._id} to users:`,
        filteredUserIds
      );
    } catch (error) {
      console.error(
        `[${notificationType}] Error sending notification for game ${game._id}:`,
        error
      );
    }
  }
};

// Find games within a specific time range
const findGamesInTimeRange = async (startTime: Date, endTime: Date) => {
  return GameModel.find({
    date: {
      $gte: startTime,
      $lte: endTime,
    },
  }).lean();
};

// Send reminders for games starting soon, using per-user settings
async function sendReminders(): Promise<void> {
  try {
    await dbConnect();
    const now = getCurrentUTCDate();
    // Find all games starting in the next 2 hours (to cover all user reminder windows)
    const windowMs = 2 * 60 * 60 * 1000;
    const endWindow = new Date(now.getTime() + windowMs);
    const games = await findGamesInTimeRange(now, endWindow);
    await sendGameNotifications(games, 'reminder', '', { now });
  } catch (error) {
    console.error('[Reminder] Error in sendReminders:', error);
    throw error;
  }
}

// Send notifications for games starting now, using per-user settings
async function sendStartNotifications(): Promise<void> {
  try {
    await dbConnect();
    const now = getCurrentUTCDate();
    // Find games starting now (within the window)
    const games = await findGamesInTimeRange(
      new Date(now.getTime() - NOTIFICATION_WINDOW_MS),
      new Date(now.getTime() + NOTIFICATION_WINDOW_MS)
    );
    await sendGameNotifications(games, 'start', 'now', { now });
  } catch (error) {
    console.error('[Start] Error in sendStartNotifications:', error);
    throw error;
  }
}

// Initialize and schedule jobs
function initializeScheduler(): void {
  try {
    // Run every minute
    cron.schedule('* * * * *', async () => {
      try {
        console.log('Running scheduled game notifications...');
        await sendReminders();
        await sendStartNotifications();
      } catch (error) {
        console.error('Error in scheduled game notifications:', error);
      }
    });

    console.log('Game notification scheduler started successfully.');
  } catch (error) {
    console.error('Failed to initialize scheduler:', error);
    process.exit(1);
  }
}

initializeScheduler();
