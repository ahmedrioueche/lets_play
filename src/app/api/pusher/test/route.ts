import { generateConversationKey as serverGenerateKey } from '@/lib/encryption';
import { NextResponse } from 'next/server';

export async function GET() {
  const pusherConfig = {
    appId: process.env.PUSHER_APP_ID ? 'SET' : 'MISSING',
    key: process.env.PUSHER_KEY ? 'SET' : 'MISSING',
    secret: process.env.PUSHER_SECRET ? 'SET' : 'MISSING',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ? 'SET' : 'MISSING',
    publicKey: process.env.NEXT_PUBLIC_PUSHER_KEY ? 'SET' : 'MISSING',
  };

  const isConfigured = Object.values(pusherConfig).every((value) => value === 'SET');

  // Test encryption key generation
  const testUserId1 = 'test-user-1';
  const testUserId2 = 'test-user-2';
  const serverKey = serverGenerateKey(testUserId1, testUserId2);

  return NextResponse.json({
    status: isConfigured ? 'CONFIGURED' : 'NOT_CONFIGURED',
    message: isConfigured
      ? 'Pusher is properly configured and ready for real-time messaging!'
      : 'Pusher is not configured. Real-time messaging will use polling fallback.',
    configuration: pusherConfig,
    instructions: isConfigured
      ? 'Your chat should work with real-time updates!'
      : 'Add Pusher environment variables to .env.local for real-time messaging. See PUSHER_SETUP.md for details.',
    encryptionTest: {
      testUserIds: [testUserId1, testUserId2],
      serverGeneratedKey: serverKey,
      keyLength: serverKey.length,
      isValidFormat: /^[a-f0-9]{64}$/.test(serverKey),
    },
    paginationInfo: {
      defaultPageSize: 50,
      supportsPagination: true,
      message: 'Pagination is supported with page and limit parameters',
    },
  });
}
