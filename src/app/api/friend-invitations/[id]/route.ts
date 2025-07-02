import dbConnect from '@/config/db';
import FriendInvitationModel from '@/models/FriendInvitation';
import UserSocialModel from '@/models/UserSocial';
import { sendNotification } from '@/utils/notifications';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid invitation ID' }, { status: 400 });
    }

    const invitation = await FriendInvitationModel.findById(id)
      .populate('fromUserId', 'name avatar')
      .populate('toUserId', 'name avatar')
      .lean();

    if (!invitation) {
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const { userId } = await request.json();

    console.log('DELETE /api/friend-invitations called with:', { id, userId });

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid invitation ID' }, { status: 400 });
    }

    const invitation = await FriendInvitationModel.findById(id)
      .populate('fromUserId', 'name avatar')
      .populate('toUserId', 'name avatar');

    if (!invitation) {
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    // Check if the user is authorized to cancel this invitation
    const fromUserId = (invitation.fromUserId as any)._id?.toString() || invitation.fromUserId;
    const toUserId = (invitation.toUserId as any)._id?.toString() || invitation.toUserId;

    if (userId !== fromUserId && userId !== toUserId) {
      return NextResponse.json(
        { message: 'Not authorized to cancel this invitation' },
        { status: 403 }
      );
    }

    // Get user names for notifications
    const fromUser = invitation.fromUserId as any;
    const toUser = invitation.toUserId as any;

    // Remove from social stats before deleting
    try {
      await Promise.all([
        UserSocialModel.findOneAndUpdate(
          { _id: fromUserId },
          { $pull: { pendingInvitations: invitation._id } }
        ),
        UserSocialModel.findOneAndUpdate(
          { _id: toUserId },
          { $pull: { receivedInvitations: invitation._id } }
        ),
      ]);
    } catch (error) {
      console.error('Error updating social stats:', error);
      // Continue with deletion even if social stats update fails
    }

    // Delete the invitation
    await FriendInvitationModel.findByIdAndDelete(id);

    // Send notification to the other user
    await sendNotification({
      userIds: [toUserId],
      type: 'friend_invitation_cancelled',
      event: 'friend-invitation-cancelled',
      title: 'Friend Invitation Cancelled',
      message: `${fromUser.name} cancelled the friend invitation.`,
      data: { fromUserId: fromUser._id },
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
