import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
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
    if (game.currentPlayers >= game.maxPlayers) {
      return NextResponse.json({ message: 'Game is full' }, { status: 400 });
    }
    game.participants = participants;
    game.participants.push(userObjectId);
    game.currentPlayers += 1;
    await game.save();

    // Notify organizer and participants (except the new user)
    const NotificationModel = (await import('@/models/Notification')).default;
    const { pusherServer } = await import('@/lib/pusherServer');
    const organizerId = game.organizer.toString();
    const notifyUserIds = [
      organizerId,
      ...game.participants.map((id: any) => id.toString()),
    ].filter((id, idx, arr) => id !== userId && arr.indexOf(id) === idx);
    const notificationPromises = notifyUserIds.map(async (targetId) => {
      const notification = await NotificationModel.create({
        userId: targetId,
        type: 'game_invitation',
        title: 'New participant joined!',
        message: `A new user has registered for the game: ${game.title}`,
        data: { gameId: game._id, newUserId: userId },
        isRead: false,
      });
      try {
        await pusherServer.trigger(`user-${targetId}`, 'game_registration', notification);
      } catch (e) {}
      return notification;
    });
    await Promise.all(notificationPromises);

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
    if (!participants.map((id) => id.toString()).includes(userId)) {
      return NextResponse.json(
        { message: 'You are not registered for this game' },
        { status: 400 }
      );
    }
    game.participants = participants.filter((id) => id.toString() !== userId);
    game.currentPlayers = Math.max(0, game.currentPlayers - 1);
    await game.save();

    // Notify organizer and participants (except the user)
    const NotificationModel = (await import('@/models/Notification')).default;
    const { pusherServer } = await import('@/lib/pusherServer');
    const organizerId = game.organizer.toString();
    const notifyUserIds = [
      organizerId,
      ...game.participants.map((id: any) => id.toString()),
    ].filter((id, idx, arr) => id !== userId && arr.indexOf(id) === idx);
    const notificationPromises = notifyUserIds.map(async (targetId) => {
      const notification = await NotificationModel.create({
        userId: targetId,
        type: 'game_reminder',
        title: 'Participant cancelled registration',
        message: `A user has cancelled their registration for the game: ${game.title}`,
        data: { gameId: game._id, cancelledUserId: userId },
        isRead: false,
      });
      try {
        await pusherServer.trigger(`user-${targetId}`, 'game_cancellation', notification);
      } catch (e) {}
      return notification;
    });
    await Promise.all(notificationPromises);

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
