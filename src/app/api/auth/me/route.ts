import UserModel from '@/models/User';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    // Find user by ID using Mongoose model
    const user = await UserModel.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Determine which ID to use - prefer MongoDB _id, fallback to custom id field
    const userId = user._id?.toString() || '';

    // Return user data with proper ID structure
    const userData = {
      _id: userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      isVerified: user.isVerified,
      isOnline: user.isOnline,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
