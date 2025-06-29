import { notificationsApi } from '@/lib/api/notificationsApi';
import { pusherClient } from '@/lib/pusherClient';
import { Notification } from '@/types/user';
import { useCallback, useEffect, useRef, useState } from 'react';

// Simple cache to prevent duplicate API calls
const notificationCache = new Map<string, { data: Notification[]; timestamp: number }>();
const NOTIFICATION_CACHE_DURATION = 60000; // 1 minute

// Global flag to prevent multiple simultaneous fetches on page load
let isInitialNotificationFetching = false;

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);
  const hasInitializedRef = useRef<boolean>(false);

  const fetchNotifications = useCallback(
    async (forceRefresh = false) => {
      if (!userId) return;

      const now = Date.now();
      const cacheKey = `notifications-${userId}`;
      const cached = notificationCache.get(cacheKey);

      // Use cache if it's still valid and we're not forcing a refresh
      if (
        !forceRefresh &&
        cached &&
        now - cached.timestamp < NOTIFICATION_CACHE_DURATION &&
        now - lastFetchRef.current < 5000
      ) {
        setNotifications(cached.data);
        return;
      }

      // Prevent multiple simultaneous fetches on page load
      if (!forceRefresh && isInitialNotificationFetching && !hasInitializedRef.current) {
        return;
      }

      setLoading(true);
      setError(null);
      lastFetchRef.current = now;

      if (!forceRefresh) {
        isInitialNotificationFetching = true;
      }

      try {
        const data = await notificationsApi.getNotifications(userId);
        setNotifications(data);
        // Cache the result
        notificationCache.set(cacheKey, { data, timestamp: now });
        hasInitializedRef.current = true;

        // Calculate unread count
        const unread = data.filter((n: Notification) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      } finally {
        setLoading(false);
        if (!forceRefresh) {
          isInitialNotificationFetching = false;
        }
      }
    },
    [userId]
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!userId) return;

      try {
        await notificationsApi.markAsRead(notificationId);

        // Update local state
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
        );

        // Update unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));

        return { success: true };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to mark as read';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [userId]
  );

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      await notificationsApi.markAllAsRead(userId);

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      // Reset unread count
      setUnreadCount(0);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all as read';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [userId]);

  const addNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      if (!notification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
      // Clear cache to force refresh on next fetch
      notificationCache.delete(`notifications-${userId}`);
    },
    [userId]
  );

  const removeNotification = useCallback(
    (notificationId: string) => {
      setNotifications((prev) => {
        const notification = prev.find((n) => n._id === notificationId);
        if (notification && !notification.isRead) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        return prev.filter((n) => n._id !== notificationId);
      });
      // Clear cache to force refresh on next fetch
      notificationCache.delete(`notifications-${userId}`);
    },
    [userId]
  );

  useEffect(() => {
    fetchNotifications();

    // Set up periodic refresh every 2 minutes for real-time updates (reduced from 30 seconds)
    const interval = setInterval(() => {
      fetchNotifications();
    }, 120000); // 2 minutes instead of 30 seconds

    // Subscribe to Pusher for real-time notifications
    if (userId) {
      const channel = pusherClient.subscribe(`user-${userId}`);
      channel.bind('friend-invitation', (notification: Notification) => {
        addNotification(notification);
      });
      channel.bind('friend-response', (notification: Notification) => {
        addNotification(notification);
      });
      channel.bind('friend-invitation-cancelled', (data: any) => {
        // Handle invitation cancellation
        console.log('Friend invitation cancelled:', data);
      });
      channel.bind('friend-removed', (data: any) => {
        // Handle friend removal
        console.log('Friend removed:', data);
      });
      channel.bind('friend-added', (data: any) => {
        // Handle new friendship
        console.log('Friend added:', data);
      });
      channel.bind('notification-removed', (data: { invitationId: string; action: string }) => {
        // Remove the invitation notification from the list
        removeNotification(data.invitationId);
      });
      // Add more event bindings as needed
    }

    return () => {
      clearInterval(interval);
      if (userId) {
        pusherClient.unsubscribe(`user-${userId}`);
      }
    };
  }, [fetchNotifications, userId, addNotification, removeNotification]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    refresh: () => fetchNotifications(),
  };
};
