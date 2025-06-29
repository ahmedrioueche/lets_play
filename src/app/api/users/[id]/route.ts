import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
import UserModel from '@/models/User';
import UserAchievementsModel from '@/models/UserAchievements';
import UserAnalyticsModel from '@/models/UserAnalytics';
import UserGameHistoryModel from '@/models/UserGameHistory';
import UserProfileModel from '@/models/UserProfile';
import UserSocialModel from '@/models/UserSocial';
import UserStatsModel from '@/models/UserStats';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();

    const params = await context.params;
    const userId = params.id;

    // Try to find user by ObjectId first, then by email (for backward compatibility)
    let user;
    if (ObjectId.isValid(userId)) {
      user = await UserModel.findById(userId);
    }
    if (!user) {
      user = await UserModel.findOne({ email: userId });
    }
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const actualUserId = user._id?.toString();

    // Fetch profile and all related models
    const userProfile = await UserProfileModel.findOne({ userId: actualUserId })
      .populate('stats')
      .populate('social')
      .populate('history')
      .populate('analytics')
      .populate('achievements');

    if (!userProfile) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    // Compose the response according to the new UserProfile interface
    const response = {
      _id: userProfile._id,
      userId: userProfile.userId,
      favoriteSports: userProfile.favoriteSports,
      stats: userProfile.stats,
      social: userProfile.social,
      history: userProfile.history,
      analytics: userProfile.analytics,
      achievements: userProfile.achievements,
      // Optionally include core user fields
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      age: user.age,
      location: user.location,
      isVerified: user.isVerified,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      isOnline: user.isOnline,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const params = await context.params;
    const userId = params.id;
    let user;
    if (ObjectId.isValid(userId)) {
      user = await UserModel.findById(userId);
    }
    if (!user) {
      user = await UserModel.findOne({ email: userId });
    }
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const { bio, location } = await request.json();
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) {
      user.location = {
        cords: location,
        address: location.address || '',
      };
    }
    await user.save();
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const params = await context.params;
    const userId = params.id;
    let user;
    if (ObjectId.isValid(userId)) {
      user = await UserModel.findById(userId);
    }
    if (!user) {
      user = await UserModel.findOne({ email: userId });
    }
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Handle empty request body gracefully
    let update;
    try {
      update = await request.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    if (!update || typeof update !== 'object') {
      return NextResponse.json({ message: 'Request body must be a valid object' }, { status: 400 });
    }

    // Handle location field specially
    if (update.location) {
      user.location = {
        cords: update.location,
        address: update.location.address || '',
      };
      delete update.location;
    }

    // Update other fields
    Object.keys(update).forEach((key) => {
      if (key !== 'location') {
        user[key] = update[key];
      }
    });

    await user.save();
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error patching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const params = await context.params;
    const userId = params.id;

    // Get confirmation from request body
    const { confirmation } = await request.json();

    if (confirmation !== 'DELETE_MY_ACCOUNT') {
      return NextResponse.json(
        {
          message: 'Confirmation required. Send confirmation: "DELETE_MY_ACCOUNT"',
        },
        { status: 400 }
      );
    }

    console.log('DELETE user request for userId:', userId);

    // Find the user first
    let user;
    if (ObjectId.isValid(userId)) {
      user = await UserModel.findById(userId);
    }
    if (!user) {
      user = await UserModel.findOne({ email: userId });
    }
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const actualUserId = user._id.toString();

    // Clean up games where user is organizer
    const gamesAsOrganizer = await GameModel.find({ organizer: actualUserId });
    console.log(`Found ${gamesAsOrganizer.length} games where user is organizer`);

    // Delete games where user is organizer
    if (gamesAsOrganizer.length > 0) {
      await GameModel.deleteMany({ organizer: actualUserId });
      console.log('Deleted games where user was organizer');
    }

    // Remove user from participants in other games
    const gamesAsParticipant = await GameModel.find({ participants: actualUserId });
    console.log(`Found ${gamesAsParticipant.length} games where user is participant`);

    if (gamesAsParticipant.length > 0) {
      await GameModel.updateMany(
        { participants: actualUserId },
        { $pull: { participants: actualUserId } }
      );
      console.log('Removed user from participant lists');
    }

    // Delete user profile and all related data
    const userProfile = await UserProfileModel.findOne({ userId: actualUserId });
    if (userProfile) {
      // Delete all related subdocuments
      if (userProfile.stats) {
        await UserStatsModel.findByIdAndDelete(userProfile.stats);
      }
      if (userProfile.social) {
        await UserSocialModel.findByIdAndDelete(userProfile.social);
      }
      if (userProfile.history) {
        await UserGameHistoryModel.findByIdAndDelete(userProfile.history);
      }
      if (userProfile.analytics) {
        await UserAnalyticsModel.findByIdAndDelete(userProfile.analytics);
      }
      if (userProfile.achievements) {
        await UserAchievementsModel.findByIdAndDelete(userProfile.achievements);
      }

      // Delete the user profile
      await UserProfileModel.findByIdAndDelete(userProfile._id);
      console.log('Deleted UserProfile and related data');
    }

    // Delete the main user
    await UserModel.findByIdAndDelete(actualUserId);
    console.log('Deleted User');

    return NextResponse.json({
      success: true,
      message: 'User and all related data deleted successfully',
      deletedGames: gamesAsOrganizer.length,
      removedFromGames: gamesAsParticipant.length,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
