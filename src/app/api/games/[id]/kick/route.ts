import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
import { sendNotification } from '@/utils/notifications';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { userId, organizerId, reason } = await req.json();
  if (!userId || !organizerId) {
    return NextResponse.json({ message: 'userId and organizerId required' }, { status: 400 });
  }
  const game = await GameModel.findById(id).populate('organizer').populate('participants');
  if (!game) {
    return NextResponse.json({ message: 'Game not found' }, { status: 404 });
  }
  const orgId = typeof game.organizer === 'string' ? game.organizer : game.organizer._id.toString();
  if (organizerId !== orgId) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
  }
  // Check if user is a participant
  const participants = Array.isArray(game.participants) ? game.participants : [];
  const isParticipant = participants.some(
    (p: any) => (p._id ? p._id.toString() : p.toString()) === userId
  );
  if (!isParticipant) {
    return NextResponse.json({ message: 'User is not a participant' }, { status: 400 });
  }
  // Remove the user from participants
  game.participants = participants.filter(
    (p: any) => (p._id ? p._id.toString() : p.toString()) !== userId
  );
  // Add to blockedUsers if not already present
  if (!Array.isArray(game.blockedUsers)) game.blockedUsers = [];
  if (!game.blockedUsers.includes(userId)) {
    game.blockedUsers.push(userId);
  }
  await game.save();
  // Notify the kicked user
  await sendNotification({
    userIds: [userId],
    type: 'game_cancellation',
    title: 'You have been removed from a game',
    message: `You have been removed from the game "${game.title}" by the organizer.${reason ? ' Reason: ' + reason : ''}`,
    data: { gameId: game._id, reason },
  });
  // Notify all other participants and organizer
  const notifyUserIds = [
    orgId,
    ...game.participants.map((p: any) => (p._id ? p._id.toString() : p.toString())),
  ];
  await sendNotification({
    userIds: notifyUserIds,
    type: 'game_cancellation',
    title: 'Participant removed',
    message: `A participant has been removed from the game "${game.title}".${reason ? ' Reason: ' + reason : ''}`,
    data: { gameId: game._id, kickedUserId: userId, reason },
  });
  return NextResponse.json({ message: 'Participant removed' });
}
