import dbConnect from '@/config/db';
import { pusherServer } from '@/lib/api/notificationsApi';
import FriendInvitationModel from '@/models/FriendInvitation';
import NotificationModel from '@/models/Notification';
import UserModel from '@/models/User';
import UserProfileModel from '@/models/UserProfile';
import UserSocialModel from '@/models/UserSocial';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'sent' or 'received'

    console.log('GET /api/friend-invitations called with:', { userId, type });

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    let query: any = {};
    if (type === 'sent') {
      query.fromUserId = userId;
    } else if (type === 'received') {
      query.toUserId = userId;
    } else {
      query.$or = [{ fromUserId: userId }, { toUserId: userId }];
    }

    query.status = 'pending';

    console.log('Query for invitations:', query);

    const invitations = await FriendInvitationModel.find(query)
      .sort({ createdAt: -1 })
      .populate('fromUserId', 'name avatar')
      .populate('toUserId', 'name avatar')
      .lean();

    console.log('Found invitations:', invitations.length, invitations);

    return NextResponse.json(invitations);
  } catch (error) {
    console.error('Error fetching friend invitations:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { fromUserId, toUserId } = body;

    console.log('POST /api/friend-invitations called with:', { fromUserId, toUserId });

    if (!fromUserId || !toUserId) {
      return NextResponse.json(
        { message: 'fromUserId and toUserId are required' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(fromUserId) || !ObjectId.isValid(toUserId)) {
      return NextResponse.json({ message: 'Invalid user IDs' }, { status: 400 });
    }

    if (fromUserId === toUserId) {
      return NextResponse.json({ message: 'Cannot send invitation to yourself' }, { status: 400 });
    }

    // Check if users exist with detailed logging
    console.log('Looking up users with IDs:', { fromUserId, toUserId });

    const [fromUser, toUser] = await Promise.all([
      UserModel.findById(fromUserId).lean(),
      UserModel.findById(toUserId).lean(),
    ]);

    console.log('User lookup results:', {
      fromUser: fromUser ? { _id: fromUser._id, name: fromUser.name } : null,
      toUser: toUser ? { _id: toUser._id, name: toUser.name } : null,
    });

    if (!fromUser) {
      console.log('From user not found:', fromUserId);
      return NextResponse.json(
        {
          success: false,
          message: 'From user not found',
          debug: { fromUserId, toUserId },
        },
        { status: 404 }
      );
    }

    if (!toUser) {
      console.log('To user not found:', toUserId);
      return NextResponse.json(
        {
          success: false,
          message: 'To user not found',
          debug: { fromUserId, toUserId },
        },
        { status: 404 }
      );
    }

    // Check if invitation already exists (any status)
    const existingInvitation = await FriendInvitationModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    console.log('Existing invitation check:', {
      existingInvitation: existingInvitation
        ? {
            _id: existingInvitation._id,
            status: existingInvitation.status,
            fromUserId: existingInvitation.fromUserId,
            toUserId: existingInvitation.toUserId,
          }
        : null,
    });

    if (existingInvitation) {
      if (existingInvitation.status === 'pending') {
        return NextResponse.json(
          {
            success: false,
            message: 'Friend invitation already exists',
          },
          { status: 400 }
        );
      } else if (existingInvitation.status === 'accepted') {
        // Check if users are actually friends
        const [userProfile, friendProfile] = await Promise.all([
          UserProfileModel.findOne({ userId: fromUserId }),
          UserProfileModel.findOne({ userId: toUserId }),
        ]);
        const areActuallyFriends =
          userProfile?.friends.some((id) => id.toString() === toUserId) ||
          friendProfile?.friends.some((id) => id.toString() === fromUserId);
        if (areActuallyFriends) {
          console.log(
            'Found accepted invitation and users are actually friends, returning "Already friends"'
          );
          return NextResponse.json(
            {
              success: false,
              message: 'Already friends',
            },
            { status: 400 }
          );
        } else {
          // Not actually friends, delete the stale invitation and allow a new one
          await FriendInvitationModel.findByIdAndDelete(existingInvitation._id);
          console.log('Deleted stale accepted invitation:', existingInvitation._id);
        }
      } else if (existingInvitation.status === 'declined') {
        // If invitation was declined, delete it and allow a new one
        await FriendInvitationModel.findByIdAndDelete(existingInvitation._id);
        console.log('Deleted declined invitation:', existingInvitation._id);
      }
    }

    // Check if users are already friends
    const [userProfile, friendProfile] = await Promise.all([
      UserProfileModel.findOne({ userId: fromUserId }),
      UserProfileModel.findOne({ userId: toUserId }),
    ]);

    console.log('Friendship check:', {
      userProfile: userProfile
        ? {
            userId: userProfile.userId,
            friends: userProfile.friends.map((id) => id.toString()),
          }
        : null,
      friendProfile: friendProfile
        ? {
            userId: friendProfile.userId,
            friends: friendProfile.friends.map((id) => id.toString()),
          }
        : null,
    });

    const areAlreadyFriends =
      userProfile?.friends.some((id) => id.toString() === toUserId) ||
      friendProfile?.friends.some((id) => id.toString() === fromUserId);

    console.log('Are already friends:', areAlreadyFriends);

    if (areAlreadyFriends) {
      console.log('Found existing friendship, returning "Already friends"');
      return NextResponse.json(
        {
          success: false,
          message: 'Already friends',
        },
        { status: 400 }
      );
    }

    // Create invitation
    let invitation;
    try {
      invitation = await FriendInvitationModel.create({
        fromUserId,
        toUserId,
        status: 'pending',
      });
      console.log('Invitation created successfully:', invitation._id);
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key error - check if there's an existing invitation
        const existingInvitation = await FriendInvitationModel.findOne({
          fromUserId,
          toUserId,
        });

        if (existingInvitation) {
          if (existingInvitation.status === 'pending') {
            return NextResponse.json(
              {
                success: false,
                message: 'Friend invitation already exists',
              },
              { status: 400 }
            );
          } else if (existingInvitation.status === 'accepted') {
            return NextResponse.json(
              {
                success: false,
                message: 'Already friends',
              },
              { status: 400 }
            );
          }
        }

        return NextResponse.json(
          {
            success: false,
            message: 'Friend invitation already exists',
          },
          { status: 400 }
        );
      }
      throw error; // Re-throw other errors
    }

    // Create notification for recipient
    const notification = await NotificationModel.create({
      userId: toUserId,
      type: 'friend_invitation',
      title: 'New Friend Invitation',
      message: `${fromUser.name} sent you a friend invitation`,
      data: {
        friendInvitationId: invitation._id,
        fromUserId,
      },
    });

    // Send real-time notification via Pusher
    try {
      await pusherServer.trigger(`user-${toUserId}`, 'friend-invitation', notification);
    } catch (error) {
      console.error('Pusher error:', error);
      // Don't fail the request if Pusher fails
    }

    // Update social stats
    try {
      await Promise.all([
        UserSocialModel.findOneAndUpdate(
          { _id: fromUserId },
          { $addToSet: { pendingInvitations: invitation._id } },
          { upsert: true }
        ),
        UserSocialModel.findOneAndUpdate(
          { _id: toUserId },
          { $addToSet: { receivedInvitations: invitation._id } },
          { upsert: true }
        ),
      ]);
    } catch (error) {
      console.error('Error updating social stats:', error);
      // Don't fail the request if social stats update fails
    }

    return NextResponse.json(
      {
        success: true,
        invitation,
        message: 'Friend invitation sent successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating friend invitation:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
