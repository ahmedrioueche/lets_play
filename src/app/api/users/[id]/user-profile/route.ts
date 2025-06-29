import dbConnect from '@/config/db';
import UserAchievementsModel from '@/models/UserAchievements';
import UserAnalyticsModel from '@/models/UserAnalytics';
import UserGameHistoryModel from '@/models/UserGameHistory';
import UserProfileModel from '@/models/UserProfile';
import UserSocialModel from '@/models/UserSocial';
import UserStatsModel from '@/models/UserStats';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const params = await context.params;
    const userId = params.id;

    console.log('UserProfile GET request for userId:', userId);

    // Try to find existing user profile
    let userProfile = await UserProfileModel.findOne({ userId: userId })
      .populate('stats')
      .populate('social')
      .populate('history')
      .populate('analytics')
      .populate('achievements');

    if (!userProfile) {
      console.log('UserProfile not found, creating new one for userId:', userId);

      // Create all required subdocuments
      const stats = await UserStatsModel.create({});
      const social = await UserSocialModel.create({});
      const history = await UserGameHistoryModel.create({ userId: userId, registeredGames: [] });
      const achievements = await UserAchievementsModel.create({
        userId: userId,
        achievements: [],
      });
      const analytics = await UserAnalyticsModel.create({ userId: userId, activityLog: [] });

      // Create new user profile
      userProfile = await UserProfileModel.create({
        userId: userId,
        favoriteSports: [],
        stats: stats._id,
        social: social._id,
        history: history._id,
        achievements: achievements._id,
        analytics: analytics._id,
      });

      // Populate the newly created profile
      userProfile = await UserProfileModel.findById(userProfile._id)
        .populate('stats')
        .populate('social')
        .populate('history')
        .populate('analytics')
        .populate('achievements');

      console.log('Created new UserProfile:', userProfile?._id);
    }

    return NextResponse.json({ success: true, userProfile });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const params = await context.params;
    const userId = params.id;
    const update = await request.json();

    console.log('UserProfile PATCH request:', { userId, update });

    // First try to find existing user profile
    let userProfile = await UserProfileModel.findOne({ userId: userId });

    if (!userProfile) {
      console.log('UserProfile not found, creating new one for userId:', userId);

      // Create all required subdocuments
      const stats = await UserStatsModel.create({});
      const social = await UserSocialModel.create({});
      const history = await UserGameHistoryModel.create({ userId: userId, registeredGames: [] });
      const achievements = await UserAchievementsModel.create({
        userId: userId,
        achievements: [],
      });
      const analytics = await UserAnalyticsModel.create({ userId: userId, activityLog: [] });

      // Create new user profile
      userProfile = await UserProfileModel.create({
        userId: userId,
        favoriteSports: [],
        stats: stats._id,
        social: social._id,
        history: history._id,
        achievements: achievements._id,
        analytics: analytics._id,
      });

      console.log('Created new UserProfile:', userProfile._id);
    }

    // Now update the user profile
    const updatedUserProfile = await UserProfileModel.findOneAndUpdate(
      { userId: userId },
      { $set: update },
      { new: true }
    );

    if (!updatedUserProfile) {
      return NextResponse.json({ message: 'Failed to update UserProfile' }, { status: 500 });
    }

    return NextResponse.json({ success: true, userProfile: updatedUserProfile });
  } catch (error) {
    console.error('Error patching user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
