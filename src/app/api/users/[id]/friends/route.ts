import dbConnect from '@/config/db';
import { pusherServer } from '@/lib/api/notificationsApi';
import FriendInvitationModel from '@/models/FriendInvitation';
import UserModel from '@/models/User';
import UserProfileModel from '@/models/UserProfile';
import UserSocialModel from '@/models/UserSocial';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id: userId } = await params;

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    // Get user profile to find friends
    const userProfile = await UserProfileModel.findOne({ userId });
    if (!userProfile) {
      return NextResponse.json({
        friends: [],
        friendRequests: [],
        pendingRequests: [],
        friendsCount: 0,
      });
    }

    // Get friends data
    const friends = await UserModel.find({
      _id: { $in: userProfile.friends },
    }).select('_id name avatar bio isOnline isVerified');

    // Get social data for blocked users
    const userSocial = await UserSocialModel.findOne({ _id: userId });
    const blockedUsers = userSocial?.blockedUsers || [];

    // Filter out blocked users
    const filteredFriends = friends.filter(
      (friend) => !blockedUsers.includes(friend._id.toString())
    );

    return NextResponse.json({
      friends: filteredFriends,
      friendRequests: [], // TODO: Implement friend requests
      pendingRequests: [], // TODO: Implement pending requests
      friendsCount: filteredFriends.length,
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id: userId } = await params;

    console.log('POST /api/users/[id]/friends - userId:', userId);

    if (!ObjectId.isValid(userId)) {
      console.log('Invalid user ID:', userId);
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const requestBody = await request.json();
    console.log('Request body:', requestBody);

    const { friendId } = requestBody;

    if (!friendId) {
      console.log('Missing friendId in request body');
      return NextResponse.json({ message: 'friendId is required' }, { status: 400 });
    }

    if (!ObjectId.isValid(friendId)) {
      console.log('Invalid friend ID:', friendId);
      return NextResponse.json({ message: 'Invalid friend ID' }, { status: 400 });
    }

    if (userId === friendId) {
      console.log('User trying to add themselves as friend');
      return NextResponse.json({ message: 'Cannot add yourself as a friend' }, { status: 400 });
    }

    // Check if friend exists
    const friend = await UserModel.findById(friendId);
    if (!friend) {
      console.log('Friend not found:', friendId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get or create user profile
    let userProfile = await UserProfileModel.findOne({ userId });
    if (!userProfile) {
      console.log('Creating new user profile for:', userId);
      userProfile = new UserProfileModel({ userId, friends: [] });
    }

    // Check if already friends
    if (userProfile.friends.some((id) => id.toString() === friendId)) {
      console.log('Already friends:', userId, 'and', friendId);
      return NextResponse.json({ message: 'Already friends' }, { status: 400 });
    }

    // Instead of directly adding friends, redirect to invitation system
    return NextResponse.json(
      {
        message: 'Please use the friend invitation system to add friends',
        redirectTo: '/api/friend-invitations',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error adding friend:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id: userId } = await params;

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const { friendId, action = 'remove' } = await request.json();
    if (!ObjectId.isValid(friendId)) {
      return NextResponse.json({ message: 'Invalid friend ID' }, { status: 400 });
    }

    if (action === 'remove') {
      // Remove friend from both users
      const [userProfile, friendProfile] = await Promise.all([
        UserProfileModel.findOne({ userId }),
        UserProfileModel.findOne({ userId: friendId }),
      ]);

      if (userProfile) {
        userProfile.friends = userProfile.friends.filter((id) => id.toString() !== friendId);
        await userProfile.save();
        console.log(
          'After removal, userProfile.friends:',
          userProfile.friends.map((id) => id.toString())
        );
      }

      if (friendProfile) {
        friendProfile.friends = friendProfile.friends.filter((id) => id.toString() !== userId);
        await friendProfile.save();
        console.log(
          'After removal, friendProfile.friends:',
          friendProfile.friends.map((id) => id.toString())
        );
      }

      // Clean up old friend invitations for both users
      await Promise.all([
        FriendInvitationModel.deleteMany({
          $or: [
            { fromUserId: userId, toUserId: friendId },
            { fromUserId: friendId, toUserId: userId },
          ],
        }),
      ]);

      // Update social stats for both users
      await Promise.all([
        UserSocialModel.findOneAndUpdate(
          { _id: userId },
          { $inc: { friendsCount: -1 } },
          { upsert: true }
        ),
        UserSocialModel.findOneAndUpdate(
          { _id: friendId },
          { $inc: { friendsCount: -1 } },
          { upsert: true }
        ),
      ]);

      // Send real-time notifications to both users
      try {
        await Promise.all([
          pusherServer.trigger(`user-${userId}`, 'friend-removed', {
            removedUserId: friendId,
            action: 'removed',
          }),
          pusherServer.trigger(`user-${friendId}`, 'friend-removed', {
            removedUserId: userId,
            action: 'removed',
          }),
          // Also trigger cache clearing events
          pusherServer.trigger(`user-${userId}`, 'friend-invitation-cancelled', {
            cancelledUserId: friendId,
          }),
          pusherServer.trigger(`user-${friendId}`, 'friend-invitation-cancelled', {
            cancelledUserId: userId,
          }),
        ]);
      } catch (error) {
        console.error('Pusher error:', error);
        // Don't fail the request if Pusher fails
      }

      return NextResponse.json({ success: true, message: 'Friend removed successfully' });
    } else if (action === 'block') {
      // Block user - use _id instead of userId
      await UserSocialModel.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { blockedUsers: friendId } },
        { upsert: true }
      );

      // Also remove from friends if they were friends
      const userProfile = await UserProfileModel.findOne({ userId });
      if (userProfile && userProfile.friends.some((id) => id.toString() === friendId)) {
        userProfile.friends = userProfile.friends.filter((id) => id.toString() !== friendId);
        await userProfile.save();

        // Update social stats - use _id instead of userId
        await UserSocialModel.findOneAndUpdate(
          { _id: userId },
          { $inc: { friendsCount: -1 } },
          { upsert: true }
        );
      }

      return NextResponse.json({ success: true, message: 'User blocked successfully' });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error removing/blocking friend:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
