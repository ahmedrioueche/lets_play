import dbConnect from '@/config/db';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Check if user has password (for Google OAuth users who don't have passwords)
    if (!user.password) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Update user online status
    user.isOnline = true;
    await user.save();

    // Create JWT token
    const token = jwt.sign({ userId: user._id?.toString() || '', email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Create response
    const response = NextResponse.json(user);

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
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
