import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
import { getDistanceFromLatLonInKm } from '@/utils/helper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');
    const radius = parseFloat(searchParams.get('radius') || '50'); // 50km default

    // If no coordinates provided, return error
    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude parameters are required' },
        { status: 400 }
      );
    }

    // Get all open games
    const allGames = await GameModel.find({ status: 'open' })
      .populate('organizer', 'name email avatar _id')
      .populate('participants', 'name email avatar _id')
      .sort({ createdAt: -1 })
      .limit(limit * 2); // Get more to filter by distance

    // Filter games by distance
    const nearbyGames = allGames
      .filter((game) => {
        if (!game.coordinates) return false;
        const distance = getDistanceFromLatLonInKm(
          lat,
          lng,
          game.coordinates.lat,
          game.coordinates.lng
        );
        return distance <= radius;
      })
      .slice(0, limit);

    // Return the actual games found (empty array if none)
    return NextResponse.json(nearbyGames);
  } catch (error: any) {
    console.error('Error fetching nearby games:', error);
    return NextResponse.json({ error: 'Failed to fetch nearby games' }, { status: 500 });
  }
}
