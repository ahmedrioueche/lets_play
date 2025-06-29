import dbConnect from '@/config/db';
import UserModel from '@/models/User';
import UserProfileModel from '@/models/UserProfile';
import UserSocialModel from '@/models/UserSocial';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    throw new Error('No authentication token');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET - Fetch user's friends
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Get user's profile to access friends
    const userProfile = await UserProfileModel.findOne({ userId }).populate({
      path: 'friends',
      model: UserModel,
      select: 'name email avatar bio isOnline createdAt updatedAt',
    });

    if (!userProfile) {
      return NextResponse.json({ friends: [] });
    }

    let friends = userProfile.friends || [];

    // Apply search filter if provided
    if (search) {
      friends = friends.filter(
        (friend: any) =>
          friend.name.toLowerCase().includes(search.toLowerCase()) ||
          friend.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Transform friends to match the User interface
    const transformedFriends = friends.map((friend: any) => ({
      _id: friend._id.toString(),
      id: friend._id.toString(), // Add id field for compatibility
      name: friend.name,
      email: friend.email,
      phone: friend.phone || '',
      avatar: friend.avatar,
      bio: friend.bio,
      isOnline: friend.isOnline || false,
      createdAt: friend.createdAt,
      updatedAt: friend.updatedAt,
    }));

    return NextResponse.json({ friends: transformedFriends });
  } catch (error) {
    console.error('Get friends error:', error);
    return NextResponse.json({ message: 'Failed to fetch friends', friends: [] }, { status: 500 });
  }
}

// POST - Add friend
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const { friendId, email } = await request.json();

    let targetUser;

    // Find friend by ID or email
    if (friendId) {
      targetUser = await UserModel.findById(friendId);
    } else if (email) {
      targetUser = await UserModel.findOne({ email });
    } else {
      return NextResponse.json({ message: 'Friend ID or email is required' }, { status: 400 });
    }

    if (!targetUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (targetUser._id.toString() === userId) {
      return NextResponse.json({ message: 'Cannot add yourself as a friend' }, { status: 400 });
    }

    // Get both user profiles
    const [userProfile, friendProfile] = await Promise.all([
      UserProfileModel.findOne({ userId }),
      UserProfileModel.findOne({ userId: targetUser._id }),
    ]);

    if (!userProfile || !friendProfile) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    // Check if already friends
    const isAlreadyFriend = userProfile.friends.some(
      (friendId: any) => friendId.toString() === targetUser._id.toString()
    );

    if (isAlreadyFriend) {
      return NextResponse.json({ message: 'Already friends' }, { status: 400 });
    }

    // Add each other as friends
    await Promise.all([
      UserProfileModel.findOneAndUpdate({ userId }, { $push: { friends: targetUser._id } }),
      UserProfileModel.findOneAndUpdate({ userId: targetUser._id }, { $push: { friends: userId } }),
    ]);

    // Update friend counts
    await Promise.all([
      UserSocialModel.findOneAndUpdate({ _id: userProfile.social }, { $inc: { friendsCount: 1 } }),
      UserSocialModel.findOneAndUpdate(
        { _id: friendProfile.social },
        { $inc: { friendsCount: 1 } }
      ),
    ]);

    return NextResponse.json({
      message: 'Friend added successfully',
      friend: {
        _id: targetUser._id.toString(),
        id: targetUser._id.toString(),
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone || '',
        avatar: targetUser.avatar,
        bio: targetUser.bio,
        isOnline: targetUser.isOnline || false,
        createdAt: targetUser.createdAt,
        updatedAt: targetUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Add friend error:', error);
    return NextResponse.json({ message: 'Failed to add friend' }, { status: 500 });
  }
}

// DELETE - Remove friend
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const { searchParams } = new URL(request.url);
    const friendId = searchParams.get('friendId');

    if (!friendId) {
      return NextResponse.json({ message: 'Friend ID is required' }, { status: 400 });
    }

    // Get both user profiles
    const [userProfile, friendProfile] = await Promise.all([
      UserProfileModel.findOne({ userId }),
      UserProfileModel.findOne({ userId: friendId }),
    ]);

    if (!userProfile || !friendProfile) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    // Remove each other from friends lists
    await Promise.all([
      UserProfileModel.findOneAndUpdate({ userId }, { $pull: { friends: friendId } }),
      UserProfileModel.findOneAndUpdate({ userId: friendId }, { $pull: { friends: userId } }),
    ]);

    // Update friend counts
    await Promise.all([
      UserSocialModel.findOneAndUpdate({ _id: userProfile.social }, { $inc: { friendsCount: -1 } }),
      UserSocialModel.findOneAndUpdate(
        { _id: friendProfile.social },
        { $inc: { friendsCount: -1 } }
      ),
    ]);

    return NextResponse.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    return NextResponse.json({ message: 'Failed to remove friend' }, { status: 500 });
  }
}

// PUT - Block/Unblock user
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromToken(request);
    const { friendId, action } = await request.json();

    if (!friendId || !action || !['block', 'unblock'].includes(action)) {
      return NextResponse.json(
        { message: 'Friend ID and valid action (block/unblock) are required' },
        { status: 400 }
      );
    }

    const userProfile = await UserProfileModel.findOne({ userId });
    if (!userProfile) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    const userSocial = await UserSocialModel.findById(userProfile.social);
    if (!userSocial) {
      return NextResponse.json({ message: 'User social data not found' }, { status: 404 });
    }

    if (action === 'block') {
      // Add to blocked users if not already blocked
      if (!userSocial.blockedUsers?.includes(friendId)) {
        await UserSocialModel.findByIdAndUpdate(userProfile.social, {
          $push: { blockedUsers: friendId },
        });

        // Remove from friends if they are friends
        await UserProfileModel.findOneAndUpdate({ userId }, { $pull: { friends: friendId } });
        await UserProfileModel.findOneAndUpdate(
          { userId: friendId },
          { $pull: { friends: userId } }
        );
      }
    } else {
      // Remove from blocked users
      await UserSocialModel.findByIdAndUpdate(userProfile.social, {
        $pull: { blockedUsers: friendId },
      });
    }

    return NextResponse.json({
      message: `User ${action}ed successfully`,
    });
  } catch (error) {
    console.error('Block/Unblock user error:', error);
    return NextResponse.json({ message: 'Failed to update block status' }, { status: 500 });
  }
}
