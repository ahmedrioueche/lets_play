import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
import NotificationModel from '@/models/Notification';
import UserModel from '@/models/User';
import UserProfileModel from '@/models/UserProfile';
import { getDistanceFromLatLonInKm } from '@/utils/helper';
import { sendNotification } from '@/utils/notifications';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const games = await GameModel.find({})
      .populate('organizer', 'name email avatar _id')
      .populate('participants', 'name email avatar _id')
      .sort({ createdAt: -1 });

    // Transform games to include 'id' field
    const transformedGames = games.map((game) => {
      const gameObj = game.toObject();
      return {
        ...gameObj,
        id: gameObj._id.toString(),
      };
    });

    return NextResponse.json(transformedGames);
  } catch (error: any) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const gameData = await req.json();
    console.log('Received game data on server:', gameData);

    const missingFields = [];
    if (!gameData.title) {
      missingFields.push('title');
    }
    if (!gameData.coordinates) {
      missingFields.push('coordinates object');
    } else if (
      typeof gameData.coordinates.lat !== 'number' ||
      typeof gameData.coordinates.lng !== 'number'
    ) {
      missingFields.push('coordinates.lat or coordinates.lng (must be numbers)');
    }
    if (!gameData.date) {
      missingFields.push('date');
    }
    if (!gameData.time) {
      missingFields.push('time');
    }

    if (!gameData.sport) {
      missingFields.push('sport');
    }
    if (!gameData.skillLevel) {
      missingFields.push('skillLevel');
    }
    if (!gameData.organizer) {
      missingFields.push('organizer required');
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing or invalid required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Ensure organizer is just the user ID
    if (typeof gameData.organizer === 'object' && gameData.organizer._id) {
      gameData.organizer = gameData.organizer._id;
    }

    // Remove _id if present (prevent invalid ObjectId error)
    if ('_id' in gameData) {
      delete gameData._id;
    }

    const newGame = await GameModel.create(gameData);
    const newGameId = newGame._id?.toString ? newGame._id.toString() : String(newGame._id);

    // --- Notification Logic ---
    const organizerId = gameData.organizer?._id || gameData.organizer;
    // 1. Get organizer's friends
    const organizerProfile = await UserProfileModel.findOne({ userId: organizerId }).lean();
    const friendIds = (organizerProfile?.friends || []).map((id) => id.toString());

    // 2. Get all users (excluding organizer)
    const allUsers = await UserModel.find({ _id: { $ne: organizerId } }).lean();

    // 3. Find users within their own maxDistance setting
    const userProfiles = await UserProfileModel.find({
      userId: { $in: allUsers.map((u) => u._id.toString()) },
    }).lean();
    const userProfileMap = new Map(userProfiles.map((p) => [p.userId.toString(), p]));

    const nearbyUserIds = allUsers
      .filter((user) => {
        if (!user.location || !user.location.cords) return false;
        const profile = userProfileMap.get(user._id.toString());
        const maxDistance = profile?.settings?.maxDistanceForVisibleGames ?? 20; // fallback to 10 if not set
        const dist = getDistanceFromLatLonInKm(
          gameData.coordinates.lat,
          gameData.coordinates.lng,
          user.location.cords.lat,
          user.location.cords.lng
        );
        return dist <= maxDistance;
      })
      .map((user) => user._id.toString());

    // 4. Deduplicate: friends + nearby (excluding organizer)
    const notifyUserIds = Array.from(new Set([...friendIds, ...nearbyUserIds])).filter(
      (id) => id !== organizerId
    );

    // 5. Create notifications
    const notifications = notifyUserIds.map((userId) => {
      const isFriend = friendIds.includes(userId);
      return {
        userId,
        type: isFriend ? 'game_invitation' : 'game_reminder',
        title: isFriend ? 'Your friend created a new game!' : 'New game near you!',
        message: `${gameData.title} (${gameData.sport}) at ${gameData.location || 'a nearby location'} on ${gameData.date} ${gameData.time}`,
        data: {
          gameId: newGameId,
          route: `/games/${newGameId}`,
          fromUserId: organizerId,
        },
        isRead: false,
      };
    });
    let createdNotifications = [];
    if (notifications.length > 0) {
      createdNotifications = await NotificationModel.insertMany(notifications);
      // Send real-time notification via Pusher for each user
      const { pusherServer } = await import('@/lib/pusherServer');
      for (const notification of createdNotifications) {
        try {
          await pusherServer.trigger(
            `user-${notification.userId}`,
            notification.type,
            notification
          );
        } catch (error) {
          console.error('Pusher error:', error);
        }
      }
    }
    // --- End Notification Logic ---

    return NextResponse.json(newGame, { status: 201 });
  } catch (error: any) {
    console.error('Error creating game:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const { gameId, userId } = await req.json();

    if (!gameId || !userId) {
      return NextResponse.json({ message: 'Game ID and User ID are required' }, { status: 400 });
    }

    const game = await GameModel.findById(gameId)
      .populate('organizer', 'name email avatar _id')
      .populate('participants', 'name email avatar _id');

    if (!game) {
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    // Check if the user is the organizer of the game
    const organizerId =
      typeof game.organizer === 'object' && game.organizer !== null && '_id' in game.organizer
        ? game.organizer._id.toString()
        : game.organizer.toString();

    if (organizerId !== userId) {
      return NextResponse.json(
        { message: 'Only the organizer can delete this game' },
        { status: 403 }
      );
    }

    // Notify all participants about the game deletion
    const participants = Array.isArray(game.participants) ? game.participants : [];
    const participantIds = participants.map((p: any) => {
      if (typeof p === 'object' && p !== null && '_id' in p) {
        return p._id.toString();
      }
      return p.toString();
    });

    // Send notifications to all participants
    await sendNotification({
      userIds: participantIds,
      excludeUserIds: [userId],
      type: 'game_reminder',
      event: 'game_deletion',
      title: 'Game cancelled',
      message: `The game "${game.title}" has been cancelled by the organizer`,
      data: { gameId: game._id, cancelledByUserId: userId },
    });

    // Delete the game
    await GameModel.findByIdAndDelete(gameId);

    return NextResponse.json({ message: 'Game deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}
