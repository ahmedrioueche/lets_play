import dbConnect from '@/config/db';
import { pusherServer } from '@/lib/api/notificationsApi';
import FriendInvitationModel from '@/models/FriendInvitation';
import NotificationModel from '@/models/Notification';
import UserProfileModel from '@/models/UserProfile';
import UserSocialModel from '@/models/UserSocial';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { action } = await request.json(); // 'accept' or 'decline'

    console.log('POST /api/friend-invitations/respond called with:', { id, action });

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid invitation ID' }, { status: 400 });
    }

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json({ message: 'Action must be accept or decline' }, { status: 400 });
    }

    const invitation = await FriendInvitationModel.findById(id)
      .populate('fromUserId', 'name avatar')
      .populate('toUserId', 'name avatar');

    if (!invitation) {
      console.log('Invitation not found:', id);
      return NextResponse.json({ message: 'Invitation not found' }, { status: 404 });
    }

    console.log('Found invitation:', {
      _id: invitation._id,
      status: invitation.status,
      fromUserId: invitation.fromUserId,
      toUserId: invitation.toUserId,
    });

    if (invitation.status !== 'pending') {
      console.log('Invitation already processed with status:', invitation.status);
      return NextResponse.json(
        {
          message: `Invitation already ${invitation.status}`,
          status: invitation.status,
        },
        { status: 400 }
      );
    }

    // Update invitation status
    invitation.status = action === 'accept' ? 'accepted' : 'declined';
    await invitation.save();

    console.log('Updated invitation status to:', invitation.status);

    // Get the populated user data
    const fromUser = invitation.fromUserId as any;
    const toUser = invitation.toUserId as any;

    // Create notification for sender
    const notificationMessage =
      action === 'accept'
        ? `${toUser.name} accepted your friend invitation`
        : `${toUser.name} declined your friend invitation`;

    const notification = await NotificationModel.create({
      userId: fromUser._id,
      type: action === 'accept' ? 'friend_accepted' : 'friend_declined',
      title: action === 'accept' ? 'Friend Invitation Accepted' : 'Friend Invitation Declined',
      message: notificationMessage,
      data: {
        friendInvitationId: invitation._id,
        toUserId: toUser._id,
      },
    });

    // Send real-time notification via Pusher (only once per event)
    try {
      await pusherServer.trigger(`user-${fromUser._id}`, 'friend-response', notification);
    } catch (error) {
      console.error('Pusher error:', error);
      // Don't fail the request if Pusher fails
    }

    if (action === 'accept') {
      // Add each other as friends
      try {
        await Promise.all([
          UserProfileModel.findOneAndUpdate(
            { userId: fromUser._id },
            { $push: { friends: toUser._id } },
            { upsert: true }
          ),
          UserProfileModel.findOneAndUpdate(
            { userId: toUser._id },
            { $push: { friends: fromUser._id } },
            { upsert: true }
          ),
        ]);

        // Update friend counts
        await Promise.all([
          UserSocialModel.findOneAndUpdate(
            { _id: fromUser._id },
            { $inc: { friendsCount: 1 } },
            { upsert: true }
          ),
          UserSocialModel.findOneAndUpdate(
            { _id: toUser._id },
            { $inc: { friendsCount: 1 } },
            { upsert: true }
          ),
        ]);

        // Send real-time notification to both users about the new friendship
        try {
          await Promise.all([
            pusherServer.trigger(`user-${fromUser._id}`, 'friend-added', {
              friendId: toUser._id,
              friendName: toUser.name,
            }),
            pusherServer.trigger(`user-${toUser._id}`, 'friend-added', {
              friendId: fromUser._id,
              friendName: fromUser.name,
            }),
          ]);
        } catch (error) {
          console.error('Pusher error for friend-added:', error);
          // Don't fail the request if Pusher fails
        }
      } catch (error) {
        console.error('Error updating friend relationships:', error);
        // Don't fail the request if friend update fails
      }
    }

    // Update social stats - remove from pending/received invitations
    try {
      await Promise.all([
        UserSocialModel.findOneAndUpdate(
          { _id: fromUser._id },
          { $pull: { pendingInvitations: invitation._id } }
        ),
        UserSocialModel.findOneAndUpdate(
          { _id: toUser._id },
          { $pull: { receivedInvitations: invitation._id } }
        ),
      ]);
    } catch (error) {
      console.error('Error updating social stats:', error);
      // Don't fail the request if social stats update fails
    }

    // Delete the invitation after it is accepted or declined
    await FriendInvitationModel.findByIdAndDelete(invitation._id);

    return NextResponse.json({
      success: true,
      message: `Invitation ${action}ed successfully`,
      invitation,
    });
  } catch (error) {
    console.error('Error responding to invitation:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
