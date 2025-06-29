import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
import UserModel from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection failed:', error);
    // Return default stats if database is not available
    return NextResponse.json({
      userGames: 0,
      activeGames: 0,
      friendsOnline: 5,
      totalUsers: 0,
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // If no userId provided, return default stats (for new users)
    if (!userId) {
      return NextResponse.json({
        userGames: 0,
        activeGames: 0,
        friendsOnline: 5,
        totalUsers: 0,
      });
    }

    // Get all games where user is organizer or participant
    const allUserGames = await GameModel.find({
      $or: [{ organizer: userId }, { participants: userId }],
    })
      .populate('organizer', 'name email avatar _id')
      .populate('participants', 'name email avatar _id');

    // userGames: total count
    const userGames = allUserGames.length;

    // activeGames: games in the future (date/time >= now)
    const now = new Date();
    const activeGames = allUserGames.filter((game) => {
      // Combine date and time fields
      const dateStr = game.date || '';
      const timeStr = game.time || '00:00';
      const gameDate = new Date(`${dateStr}T${timeStr}`);
      return gameDate >= now;
    }).length;

    // Get total users (friends online is mock data for now)
    const totalUsers = await UserModel.countDocuments();

    return NextResponse.json({
      userGames,
      activeGames,
      friendsOnline: 0,
      totalUsers,
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    // Return default stats on error instead of throwing
    return NextResponse.json({
      userGames: 0,
      activeGames: 0,
      friendsOnline: 0,
      totalUsers: 0,
    });
  }
}
