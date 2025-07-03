import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
import { sendNotification } from '@/utils/notifications';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { userIds, organizerId } = await req.json();
  if (!Array.isArray(userIds) || !organizerId) {
    return NextResponse.json({ message: 'userIds and organizerId required' }, { status: 400 });
  }
  const game = await GameModel.findById(id);
  if (!game) {
    return NextResponse.json({ message: 'Game not found' }, { status: 404 });
  }
  const orgId = game.organizer?._id ? game.organizer._id.toString() : game.organizer.toString();
  if (organizerId !== orgId) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
  }
  await sendNotification({
    userIds,
    type: 'game_reminder',
    title: 'Game Reminder',
    message: `Reminder: The game "${game.title}" is starting soon!`,
    data: { gameId: game._id },
  });
  return NextResponse.json({ message: 'Reminders sent' });
}
