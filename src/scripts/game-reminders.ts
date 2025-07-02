import cron from 'node-cron';
import dbConnect from '../config/db';
import GameModel from '../models/Game';
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

// Send notifications for games within a time range
const sendGameNotifications = async (
  games: any[],
  notificationType: 'reminder' | 'start',
  timeDescription: string
): Promise<void> => {
  for (const game of games) {
    try {
      const userIds = extractUserIdsFromGame(game);
      if (userIds.length === 0) {
        console.warn(`[${notificationType}] No users to notify for game ${game._id}`);
        continue;
      }

      const message =
        notificationType === 'reminder'
          ? `Reminder: The game "${game.title}" starts in ${timeDescription}!`
          : `The game "${game.title}" is starting now!`;

      await sendNotification({
        userIds,
        type: `game_${notificationType}`,
        title: notificationType === 'reminder' ? 'Game Reminder' : 'Game Starting Now',
        message,
        data: { gameId: game._id },
      });

      console.log(`[${notificationType}] Sent notification for game ${game._id}`);
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

// Send reminders for games starting soon
async function sendReminders(): Promise<void> {
  try {
    await dbConnect();
    const now = getCurrentUTCDate();
    const reminderTime = new Date(now.getTime() + REMINDER_TIME_MS);

    const games = await findGamesInTimeRange(
      new Date(reminderTime.getTime() - NOTIFICATION_WINDOW_MS),
      new Date(reminderTime.getTime() + NOTIFICATION_WINDOW_MS)
    );

    await sendGameNotifications(games, 'reminder', '1 hour');
  } catch (error) {
    console.error('[Reminder] Error in sendReminders:', error);
    throw error;
  }
}

// Send notifications for games starting now
async function sendStartNotifications(): Promise<void> {
  try {
    await dbConnect();
    const now = getCurrentUTCDate();

    const games = await findGamesInTimeRange(
      new Date(now.getTime() - NOTIFICATION_WINDOW_MS),
      new Date(now.getTime() + NOTIFICATION_WINDOW_MS)
    );

    await sendGameNotifications(games, 'start', 'now');
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
