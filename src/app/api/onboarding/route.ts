import UserModel from '@/models/User';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    const user = await UserModel.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { age, location, favoriteSports } = await request.json();
    if (!age || !location || !favoriteSports) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    user.age = age;
    user.location = location;
    user.favoriteSports = favoriteSports;
    user.hasCompletedOnboarding = true;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
