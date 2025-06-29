import dbConnect from '@/config/db';
import UserModel from '@/models/User';
import UserAchievementsModel from '@/models/UserAchievements';
import UserAnalyticsModel from '@/models/UserAnalytics';
import UserGameHistoryModel from '@/models/UserGameHistory';
import UserProfileModel from '@/models/UserProfile';
import UserSocialModel from '@/models/UserSocial';
import UserStatsModel from '@/models/UserStats';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create core user
    const newUser = await UserModel.create({
      name,
      email,
      phone: '',
      password: hashedPassword,
      isOnline: true,
    });

    // Create empty stats, social, history, achievements, analytics
    const stats = await UserStatsModel.create({});
    const social = await UserSocialModel.create({});
    const history = await UserGameHistoryModel.create({ userId: newUser._id, registeredGames: [] });
    const achievements = await UserAchievementsModel.create({
      userId: newUser._id,
      achievements: [],
    });
    const analytics = await UserAnalyticsModel.create({ userId: newUser._id, activityLog: [] });

    // Create user profile
    await UserProfileModel.create({
      userId: newUser._id,
      favoriteSports: [],
      stats: stats._id,
      social: social._id,
      history: history._id,
      achievements: achievements._id,
      analytics: analytics._id,
    });

    // Create JWT token
    const token = jwt.sign({ userId: newUser._id?.toString() || '', email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Create response with proper ID structure
    const response = NextResponse.json(newUser);

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
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
