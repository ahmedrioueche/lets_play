import Pusher from 'pusher-js';

// Check if Pusher environment variables are set
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

if (!pusherKey || !pusherCluster) {
  console.error('Pusher environment variables are missing!');
  console.error('NEXT_PUBLIC_PUSHER_KEY:', pusherKey ? 'SET' : 'MISSING');
  console.error('NEXT_PUBLIC_PUSHER_CLUSTER:', pusherCluster ? 'SET' : 'MISSING');
}

export const pusherClient = new Pusher(pusherKey!, {
  cluster: pusherCluster!,
  forceTLS: true,
});
