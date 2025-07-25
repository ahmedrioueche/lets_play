import dbConnect from '@/config/db';
import UserModel from '@/models/User';
import UserAchievementsModel from '@/models/UserAchievements';
import UserAnalyticsModel from '@/models/UserAnalytics';
import UserGameHistoryModel from '@/models/UserGameHistory';
import UserProfileModel from '@/models/UserProfile';
import UserSocialModel from '@/models/UserSocial';
import UserStatsModel from '@/models/UserStats';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || '';
const BASE_URL = process.env.DOMAIN || 'http://localhost:3000';
const REDIRECT_URI = `${BASE_URL}/api/auth/google/callback`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const source = searchParams.get('source') || 'login';

    if (!code) {
      // Redirect based on where the auth was initiated
      const redirectPath = source === 'signup' ? '/auth/signup' : '/auth/login';
      return NextResponse.redirect(`${BASE_URL}${redirectPath}?error=authentication_cancelled`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      const redirectPath = source === 'signup' ? '/auth/signup' : '/auth/login';
      return NextResponse.redirect(`${BASE_URL}${redirectPath}?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error('User info fetch failed:', await userResponse.text());
      const redirectPath = source === 'signup' ? '/auth/signup' : '/auth/login';
      return NextResponse.redirect(`${BASE_URL}${redirectPath}?error=user_info_failed`);
    }

    const googleUser = await userResponse.json();

    // Connect to database
    await dbConnect();

    // Check if user exists
    let user = await UserModel.findOne({ email: googleUser.email });

    if (!user) {
      // Create new user
      const newUser = {
        id: googleUser.id,
        name: googleUser.name,
        email: googleUser.email,
        phone: '',
        avatar: googleUser.picture,
        bio: '',
        location: {
          lat: null,
          lng: null,
        },
        registeredGames: [],
        isOnline: true,
        isVerified: true,
      };

      user = await UserModel.create(newUser);

      // Create empty stats, social, history, achievements, analytics
      const stats = await UserStatsModel.create({});
      const social = await UserSocialModel.create({});
      const history = await UserGameHistoryModel.create({ userId: user._id, registeredGames: [] });
      const achievements = await UserAchievementsModel.create({
        userId: user._id,
        achievements: [],
      });
      const analytics = await UserAnalyticsModel.create({ userId: user._id, activityLog: [] });

      // Create user profile
      await UserProfileModel.create({
        userId: user._id,
        favoriteSports: [],
        stats: stats._id,
        social: social._id,
        history: history._id,
        achievements: achievements._id,
        analytics: analytics._id,
      });
    } else {
      // Update existing user's online status and ensure isVerified is true
      user.isOnline = true;
      if (!user.isVerified) user.isVerified = true;
      await user.save();

      // Ensure user has a UserProfile
      let userProfile = await UserProfileModel.findOne({ userId: user._id });
      if (!userProfile) {
        const stats = await UserStatsModel.create({});
        const social = await UserSocialModel.create({});
        const history = await UserGameHistoryModel.create({
          userId: user._id,
          registeredGames: [],
        });
        const achievements = await UserAchievementsModel.create({
          userId: user._id,
          achievements: [],
        });
        const analytics = await UserAnalyticsModel.create({ userId: user._id, activityLog: [] });
        await UserProfileModel.create({
          userId: user._id,
          favoriteSports: [],
          stats: stats._id,
          social: social._id,
          history: history._id,
          achievements: achievements._id,
          analytics: analytics._id,
        });
      }
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id?.toString() || '', email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Create response with redirect
    const response = NextResponse.redirect(`${BASE_URL}/dashboard`);

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Google callback error:', error);
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'login';
    const redirectPath = source === 'signup' ? '/auth/signup' : '/auth/login';
    return NextResponse.redirect(`${BASE_URL}${redirectPath}?error=authentication_failed`);
  }
}
