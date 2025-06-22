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
      nearbyGames: 0,
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
        nearbyGames: 0,
        activeGames: 0,
        friendsOnline: 5,
        totalUsers: 0,
      });
    }

    // Get user's games (created by user)
    const userGames = await GameModel.find({ 'organizer.id': userId }).countDocuments();

    // Get nearby games (within 50km radius - simplified for now)
    const nearbyGames = await GameModel.find({ status: 'open' }).countDocuments();

    // Get total active games
    const activeGames = await GameModel.find({ status: 'open' }).countDocuments();

    // Get total users (friends online is mock data for now)
    const totalUsers = await UserModel.countDocuments();

    return NextResponse.json({
      userGames,
      nearbyGames,
      activeGames,
      friendsOnline: Math.floor(Math.random() * 15) + 5, // Mock data
      totalUsers,
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    // Return default stats on error instead of throwing
    return NextResponse.json({
      userGames: 0,
      nearbyGames: 0,
      activeGames: 0,
      friendsOnline: 5,
      totalUsers: 0,
    });
  }
}
