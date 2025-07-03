import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
import { sendNotification } from '@/utils/notifications';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const game = await GameModel.findById(id)
      .populate('organizer', 'name email avatar _id')
      .populate('participants', 'name email avatar _id');
    if (!game) {
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    // Transform game to include 'id' field
    const gameObj = game.toObject();
    const transformedGame = {
      ...gameObj,
      id: gameObj._id.toString(),
    };

    return NextResponse.json(transformedGame);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    const game = await GameModel.findById(id)
      .populate('organizer', 'name email avatar _id')
      .populate('participants', 'name email avatar _id');
    if (!game) {
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }
    const participants = Array.isArray(game.participants) ? game.participants : [];
    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (participants.map((id) => id.toString()).includes(userId)) {
      return NextResponse.json({ message: 'Already registered' }, { status: 400 });
    }
    if (participants.length >= game.maxParticipants) {
      return NextResponse.json({ message: 'Game is full' }, { status: 400 });
    }
    if (Array.isArray(game.blockedUsers) && game.blockedUsers.includes(userId)) {
      return NextResponse.json(
        { message: 'You are blocked from joining this game' },
        { status: 403 }
      );
    }
    // Ensure we only push the ObjectId, not a User object
    game.participants = participants.map((p: any) => {
      if (typeof p === 'string' || p instanceof mongoose.Types.ObjectId) {
        return new mongoose.Types.ObjectId(p);
      } else if (p && p._id) {
        return new mongoose.Types.ObjectId(p._id);
      }
      return p;
    });

    game.participants.push(userObjectId as any);
    await game.save();

    // Notify organizer and participants (except the new user)
    const organizerId = game.organizer.toString();
    const notifyUserIds = [organizerId, ...game.participants.map((id: any) => id.toString())];
    await sendNotification({
      userIds: notifyUserIds,
      excludeUserIds: [userId],
      type: 'game_invitation',
      event: 'game_registration',
      title: 'New participant joined!',
      message: `A new user has registered for the game: ${game.title}`,
      data: { gameId: game._id, newUserId: userId },
    });

    // Transform game to include 'id' field
    const gameObj = game.toObject();
    const transformedGame = {
      ...gameObj,
      id: gameObj._id.toString(),
    };

    return NextResponse.json({ message: 'Registered successfully', game: transformedGame });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    console.log('CANCEL REGISTRATION');
    console.log('id', id);
    const { userId } = await req.json();
    console.log('userId', userId);

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    const game = await GameModel.findById(id)
      .populate('organizer', 'name email avatar _id')
      .populate('participants', 'name email avatar _id');
    if (!game) {
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }
    const participants = Array.isArray(game.participants) ? game.participants : [];
    console.log('participants', participants);

    // Build notification list BEFORE removing the user
    const allParticipantIds = [
      game.organizer.toString(),
      ...participants.map((p: any) =>
        typeof p === 'object' && p !== null && '_id' in p ? p._id.toString() : p.toString()
      ),
    ];
    // Notify all previous participants and organizer (except the user who cancelled)
    await sendNotification({
      userIds: allParticipantIds,
      excludeUserIds: [userId],
      type: 'game_reminder',
      event: 'game_cancellation',
      title: 'Participant cancelled registration',
      message: `A user has cancelled their registration for the game: ${game.title}`,
      data: { gameId: game._id, cancelledUserId: userId },
    });
    // Now remove the user from participants
    if (
      !participants
        .map((p) =>
          typeof p === 'object' && p !== null && '_id' in p ? p._id.toString() : p.toString()
        )
        .includes(userId)
    ) {
      return NextResponse.json(
        { message: 'You are not registered for this game' },
        { status: 400 }
      );
    }
    game.participants = participants.filter((p: any) => {
      if (typeof p === 'object' && p !== null && '_id' in p) {
        return p._id.toString() !== userId;
      }
      return p.toString() !== userId;
    });
    await game.save();

    // Transform game to include 'id' field
    const gameObj = game.toObject();
    const transformedGame = {
      ...gameObj,
      id: gameObj._id.toString(),
    };

    return NextResponse.json({ message: 'Registration cancelled', game: transformedGame });
  } catch (error: any) {
    console.error('Cancellation error:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}
