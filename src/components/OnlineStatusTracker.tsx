'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function OnlineStatusTracker() {
  useOnlineStatus();
  return null; // This component doesn't render anything
}
