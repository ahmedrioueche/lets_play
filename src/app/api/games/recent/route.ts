import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    // Find the most recent games, sorted by createdAt descending
    const games = await GameModel.find({}).sort({ createdAt: -1 }).limit(limit).lean();

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching recent games:', error);
    return NextResponse.json({ message: 'Failed to fetch recent games' }, { status: 500 });
  }
}
