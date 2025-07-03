import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
import { sendNotification } from '@/utils/notifications';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { userId, reason } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  const game = await GameModel.findById(id)
    .populate('organizer', 'name email avatar _id')
    .populate('participants', 'name email avatar _id');

  if (!game) {
    return NextResponse.json({ message: 'Game not found' }, { status: 404 });
  }

  // Check if game requires permission
  if (!game.joinPermission) {
    return NextResponse.json(
      { message: 'This game does not require join permission' },
      { status: 400 }
    );
  }

  // Check if user is already a participant
  const participants = Array.isArray(game.participants) ? game.participants : [];
  const isParticipant = participants.some(
    (p: any) => (p._id ? p._id.toString() : p.toString()) === userId
  );
  if (isParticipant) {
    return NextResponse.json({ message: 'Already a participant' }, { status: 400 });
  }

  // Check if game is full
  if (participants.length >= game.maxParticipants) {
    return NextResponse.json({ message: 'Game is full' }, { status: 400 });
  }

  // Block if user is in blockedUsers
  if (Array.isArray(game.blockedUsers) && game.blockedUsers.includes(userId)) {
    return NextResponse.json(
      { message: 'You are blocked from joining this game' },
      { status: 403 }
    );
  }

  // organizer can be either a User object (with _id) or a string (ObjectId)
  let organizerId: string;
  if (game.organizer && typeof game.organizer === 'object' && '_id' in game.organizer) {
    organizerId = game.organizer._id.toString();
  } else {
    organizerId = game.organizer?.toString?.() ?? '';
  }

  // Send join request notification to organizer
  await sendNotification({
    userIds: [organizerId],
    type: 'game_join_request',
    title: 'New join request',
    message: `A user wants to join your game "${game.title}".${reason ? ' Reason: ' + reason : ''}`,
    data: {
      gameId: game._id,
      requestingUserId: userId,
      reason,
      type: 'join_request',
    },
  });

  // Add userId to joinRequests if not already present
  if (!game.joinRequests) game.joinRequests = [];
  if (!game.joinRequests.includes(userId)) {
    game.joinRequests.push(userId);
    await game.save();
  }

  return NextResponse.json({ message: 'Join request sent successfully' });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  const game = await GameModel.findById(id).populate('organizer', 'name email avatar _id');
  if (!game) {
    return NextResponse.json({ message: 'Game not found' }, { status: 404 });
  }

  if (!Array.isArray(game.joinRequests)) game.joinRequests = [];
  const before = game.joinRequests.length;
  game.joinRequests = game.joinRequests.filter((id: string) => id !== userId);
  const after = game.joinRequests.length;
  await game.save();

  if (before === after) {
    return NextResponse.json({ message: 'No join request to cancel' }, { status: 400 });
  }

  // organizer can be either a User object (with _id) or a string (ObjectId)
  let organizerId: string;
  if (game.organizer && typeof game.organizer === 'object' && '_id' in game.organizer) {
    organizerId = game.organizer._id.toString();
  } else {
    organizerId = game.organizer?.toString?.() ?? '';
  }

  // Send notification to organizer about cancellation
  await sendNotification({
    userIds: [organizerId],
    type: 'game_join_request',
    title: 'Join request cancelled',
    message: `A user has cancelled their join request for your game "${game.title}".`,
    data: {
      gameId: game._id,
      requestingUserId: userId,
      type: 'join_request_cancel',
    },
  });

  return NextResponse.json({ message: 'Join request cancelled' });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { userId, action } = await req.json(); // action: 'accept' | 'reject'

  if (!userId || !['accept', 'reject'].includes(action)) {
    return NextResponse.json({ message: 'User ID and valid action are required' }, { status: 400 });
  }

  const game = await GameModel.findById(id)
    .populate('organizer', 'name email avatar _id')
    .populate('participants', 'name email avatar _id');
  if (!game) {
    return NextResponse.json({ message: 'Game not found' }, { status: 404 });
  }

  // Remove from joinRequests
  if (!Array.isArray(game.joinRequests)) game.joinRequests = [];
  game.joinRequests = game.joinRequests.filter((uid: string) => uid !== userId);

  // Block if user is in blockedUsers
  if (Array.isArray(game.blockedUsers) && game.blockedUsers.includes(userId)) {
    return NextResponse.json(
      { message: 'You are blocked from joining this game' },
      { status: 403 }
    );
  }

  if (action === 'accept') {
    // Add to participants if not already present
    if (!game.participants.some((p: any) => (p._id ? p._id.toString() : p.toString()) === userId)) {
      game.participants.push(userId);
    }
    await game.save();
    // Send notification to user
    await sendNotification({
      userIds: [userId],
      type: 'game_join_request',
      title: 'Join request accepted',
      message: `Your request to join "${game.title}" was accepted!`,
      data: {
        gameId: game._id,
        type: 'join_request_accepted',
      },
    });
    return NextResponse.json({ message: 'Join request accepted' });
  } else {
    // Add to blockedUsers if not already present
    if (!Array.isArray(game.blockedUsers)) game.blockedUsers = [];
    if (!game.blockedUsers.includes(userId)) {
      game.blockedUsers.push(userId);
    }
    await game.save();
    // Send notification to user
    await sendNotification({
      userIds: [userId],
      type: 'game_join_request',
      title: 'Join request rejected',
      message: `Your request to join "${game.title}" was rejected.`,
      data: {
        gameId: game._id,
        type: 'join_request_rejected',
      },
    });
    return NextResponse.json({ message: 'Join request rejected' });
  }
}
