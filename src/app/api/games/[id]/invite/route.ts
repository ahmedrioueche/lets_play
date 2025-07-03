import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
import UserProfileModel from '@/models/UserProfile';
import { sendNotification } from '@/utils/notifications';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { inviterId, inviteeId } = await req.json();

  if (!inviterId || !inviteeId) {
    return NextResponse.json({ message: 'inviterId and inviteeId required' }, { status: 400 });
  }

  // Fetch invitee's profile/settings
  const inviteeProfile = await UserProfileModel.findOne({ userId: inviteeId });
  if (!inviteeProfile) {
    return NextResponse.json({ message: 'Invitee not found' }, { status: 404 });
  }
  const allowDirect = inviteeProfile.settings?.allowDirectGameInvites !== false;

  // If not allowed, check if inviter is a friend
  if (!allowDirect) {
    const isFriend = inviteeProfile.friends.map(String).includes(inviterId);
    if (!isFriend) {
      return NextResponse.json({ message: 'User does not allow direct invites' }, { status: 403 });
    }
  }

  // Fetch game
  const game = await GameModel.findById(id);
  if (!game) {
    return NextResponse.json({ message: 'Game not found' }, { status: 404 });
  }

  // Send notification to invitee
  await sendNotification({
    userIds: [inviteeId],
    type: 'game_invitation',
    title: 'Game Invitation',
    message: `You have been invited to join the game "${game.title}"`,
    data: { gameId: game._id, inviterId },
  });

  return NextResponse.json({ message: 'Invitation sent' });
}
