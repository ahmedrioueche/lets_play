import dbConnect from '@/config/db';
import GameModel from '@/models/Game'; // Assuming you'll create this model
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const games = await GameModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(games);
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
    if (!gameData.maxPlayers) {
      missingFields.push('maxPlayers');
    }
    if (!gameData.sport) {
      missingFields.push('sport');
    }
    if (!gameData.skillLevel) {
      missingFields.push('skillLevel');
    }
    if (!gameData.organizer || !gameData.organizer.id || !gameData.organizer.name) {
      missingFields.push('organizer (id and name required)');
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing or invalid required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const newGame = await GameModel.create(gameData);
    return NextResponse.json(newGame, { status: 201 });
  } catch (error: any) {
    console.error('Error creating game:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}
