import dbConnect from '@/config/db';
import UserModel from '@/models/User';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (token) {
      try {
        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

        // Connect to database
        await dbConnect();

        // Update user online status to false
        await UserModel.findByIdAndUpdate(decoded.userId, { isOnline: false });
      } catch (jwtError) {
        // Token is invalid, but we still want to clear the cookie
        console.log('Invalid token during logout:', jwtError);
      }
    }

    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
