import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import UserProfileModel from '@/models/UserProfile';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const skip = (page - 1) * PAGE_SIZE;

  // Build query
  const query: any = {};
  if (q) {
    query.name = { $regex: q, $options: 'i' };
  }

  // Find users
  const users = await UserModel.find(query)
    .sort({ name: 1 })
    .skip(skip)
    .limit(PAGE_SIZE)
    .select('_id name avatar bio location isOnline isVerified age email')
    .lean();

  // Fetch favoriteSports from UserProfile
  const userIds = users.map((u: any) => u._id);
  const profiles = await UserProfileModel.find({ userId: { $in: userIds } })
    .select('userId favoriteSports')
    .lean();
  const profileMap = new Map(profiles.map((p: any) => [p.userId.toString(), p]));

  const usersWithProfile = users.map((u: any) => ({
    ...u,
    favoriteSports: profileMap.get(u._id.toString())?.favoriteSports || [],
  }));

  // Check if there are more users
  const total = await UserModel.countDocuments(query);
  const hasMore = skip + usersWithProfile.length < total;

  return NextResponse.json({ users: usersWithProfile, hasMore });
}
