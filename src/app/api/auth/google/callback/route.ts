import dbConnect from '@/config/db';
import UserModel from '@/models/User';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const BASE_URL = process.env.DOMAIN || 'http://localhost:3000';
const REDIRECT_URI = `${BASE_URL}/api/auth/google/callback`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(`${BASE_URL}/auth?error=no_code`);
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
      return NextResponse.redirect(`${BASE_URL}/auth?error=token_exchange_failed`);
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
      return NextResponse.redirect(`${BASE_URL}/auth?error=user_info_failed`);
    }

    const googleUser = await userResponse.json();

    // Connect to database
    await dbConnect();

    // Check if user exists
    let user = await UserModel.findOne({ email: googleUser.email });

    if (!user) {
      // Create new user
      const newUser = {
        id: googleUser.id, // Use Google ID as the id field
        name: googleUser.name,
        email: googleUser.email,
        phone: '', // Required field, set empty for Google users
        avatar: googleUser.picture,
        bio: '',
        location: {
          lat: null,
          lng: null,
        },
        registeredGames: [],
        isOnline: true,
        isVerified: true, // Mark as verified for OAuth users
      };

      user = await UserModel.create(newUser);
    } else {
      // Update existing user's online status and ensure isVerified is true
      user.isOnline = true;
      if (!user.isVerified) user.isVerified = true;
      await user.save();
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id?.toString() || '', email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Create response with redirect
    const response = NextResponse.redirect(`${BASE_URL}/`);

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
    return NextResponse.redirect(`${BASE_URL}/auth?error=callback_failed`);
  }
}
