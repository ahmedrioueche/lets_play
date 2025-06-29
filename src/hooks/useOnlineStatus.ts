import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef } from 'react';

export const useOnlineStatus = () => {
  const { user } = useAuth();
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    // Send initial online status
    const sendOnlineStatus = async () => {
      try {
        await fetch('/api/users/offline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, isOnline: true }),
        });
      } catch (error) {
        console.error('Failed to send online status:', error);
      }
    };

    // Send initial status
    sendOnlineStatus();

    // Set up heartbeat every 5 minutes to keep user marked as online
    heartbeatIntervalRef.current = setInterval(sendOnlineStatus, 5 * 60 * 1000);

    // Handle page visibility change (user switches tabs or minimizes)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Send offline status when page is hidden
        if (navigator.sendBeacon) {
          const data = new FormData();
          data.append('userId', user._id);
          data.append('isOnline', 'false');
          navigator.sendBeacon('/api/users/offline', data);
        }
      } else {
        // Send online status when page becomes visible again
        sendOnlineStatus();
      }
    };

    // Handle beforeunload (user closes browser/tab)
    const handleBeforeUnload = () => {
      // Use sendBeacon for more reliable delivery when page is unloading
      if (navigator.sendBeacon) {
        const data = new FormData();
        data.append('userId', user._id);
        data.append('isOnline', 'false');
        navigator.sendBeacon('/api/users/offline', data);
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
      }

      // Send offline status when component unmounts
      if (navigator.sendBeacon) {
        const data = new FormData();
        data.append('userId', user._id);
        data.append('isOnline', 'false');
        navigator.sendBeacon('/api/users/offline', data);
      }
    };
  }, [user?._id]);
};
