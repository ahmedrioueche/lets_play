'use client';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef } from 'react';

export const useOnlineStatus = () => {
  const { user } = useAuth();
  const hasInitializedRef = useRef<boolean>(false);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastOnlineUpdateRef = useRef<number>(0);
  const isOnlineRef = useRef<boolean>(false);

  useEffect(() => {
    if (!user?._id || hasInitializedRef.current) return;

    hasInitializedRef.current = true;
    isOnlineRef.current = true;

    // Send online status (only called every 5 minutes)
    const sendOnlineStatus = async () => {
      try {
        await fetch('/api/users/online', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, isOnline: true }),
        });
        lastOnlineUpdateRef.current = Date.now();
        console.log('Online status sent');
      } catch (error) {
        console.error('Failed to send online status:', error);
      }
    };

    // Send initial online status
    sendOnlineStatus();

    // Set up heartbeat every 5 minutes (matches server timeout)
    heartbeatIntervalRef.current = setInterval(
      () => {
        if (isOnlineRef.current) {
          sendOnlineStatus();
        }
      },
      5 * 60 * 1000 // 5 minutes
    );

    // Handle page visibility change (user switches tabs or minimizes)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Don't send offline immediately, let the 5-minute timeout handle it
        console.log('Page hidden, will go offline in 5 minutes if not active');
      } else {
        // Send online status when page becomes visible again
        if (isOnlineRef.current) {
          sendOnlineStatus();
        }
      }
    };

    // Handle beforeunload (user closes browser/tab)
    const handleBeforeUnload = () => {
      // Send offline status immediately when closing
      if (navigator.sendBeacon) {
        const data = new FormData();
        data.append('userId', user._id);
        data.append('isOnline', 'false');
        navigator.sendBeacon('/api/users/online', data);
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Clear heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      // Send offline status when component unmounts
      if (navigator.sendBeacon) {
        const data = new FormData();
        data.append('userId', user._id);
        data.append('isOnline', 'false');
        navigator.sendBeacon('/api/users/online', data);
      }

      hasInitializedRef.current = false;
      isOnlineRef.current = false;
    };
  }, [user?._id]);
};
