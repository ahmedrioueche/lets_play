import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

interface BadgeData {
  explore: number; // nearby games count
  games: number; // user's active games count
  friends: number; // friends online count
  chat: number; // unread messages count
}

interface UseBadgesReturn {
  badges: BadgeData;
  isLoading: boolean;
  error: string | null;
  refreshBadges: () => void;
  updateBadge: (type: keyof BadgeData, value: number) => void;
}

export const useBadges = (): UseBadgesReturn => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<BadgeData>({
    explore: 0,
    games: 0,
    friends: 0,
    chat: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Ensure we're on the client side before making API calls
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Listen for new messages to update chat badge in real-time
  useEffect(() => {
    if (!user?._id || !hasMounted) return;

    // Check if Pusher is configured
    const isPusherConfigured =
      process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (isPusherConfigured) {
      // Set up periodic badge refresh every 30 seconds to ensure accuracy
      const refreshInterval = setInterval(() => {
        fetchBadges();
      }, 30000);

      // Also refresh badges when the window becomes visible (user returns to tab)
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          fetchBadges();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(refreshInterval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [user?._id, hasMounted]);

  // Add a global event listener for badge updates
  useEffect(() => {
    if (!hasMounted) return;

    const handleBadgeUpdate = () => {
      fetchBadges();
    };

    // Listen for custom badge update events
    window.addEventListener('badge-update', handleBadgeUpdate);

    return () => {
      window.removeEventListener('badge-update', handleBadgeUpdate);
    };
  }, [hasMounted]);

  const fetchBadges = async () => {
    if (!user?._id || !hasMounted) {
      setBadges({ explore: 0, games: 0, friends: 0, chat: 0 });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch stats for games and friends
      const statsResponse = await fetch(`/api/stats?userId=${user._id}`);
      const statsData = (await statsResponse.ok) ? await statsResponse.json() : null;

      // Fetch nearby games count for explore badge
      let nearbyGamesCount = 0;

      // Only use geolocation if we're on the client and it's available
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });

          const nearbyResponse = await fetch(
            `/api/games/nearby?lat=${position.coords.latitude}&lng=${position.coords.longitude}&limit=1`
          );
          if (nearbyResponse.ok) {
            const nearbyData = await nearbyResponse.json();
            nearbyGamesCount = Array.isArray(nearbyData) ? nearbyData.length : 0;
          }
        } catch (locationError) {
          // Use default location if geolocation fails
          const nearbyResponse = await fetch('/api/games/nearby?lat=40.7128&lng=-74.006&limit=1');
          if (nearbyResponse.ok) {
            const nearbyData = await nearbyResponse.json();
            nearbyGamesCount = Array.isArray(nearbyData) ? nearbyData.length : 0;
          }
        }
      } else {
        // Use default location for SSR or when geolocation is not available
        const nearbyResponse = await fetch('/api/games/nearby?lat=40.7128&lng=-74.006&limit=1');
        if (nearbyResponse.ok) {
          const nearbyData = await nearbyResponse.json();
          nearbyGamesCount = Array.isArray(nearbyData) ? nearbyData.length : 0;
        }
      }

      // Fetch unread messages count for chat badge
      let chatCount = 0;
      try {
        const conversationsResponse = await fetch(`/api/chat/conversations?userId=${user._id}`);
        if (conversationsResponse.ok) {
          const conversationsData = await conversationsResponse.json();
          chatCount =
            conversationsData.conversations?.reduce(
              (sum: number, conv: any) => sum + conv.unreadCount,
              0
            ) || 0;
        }
      } catch (chatError) {
        console.error('Error fetching chat count:', chatError);
        chatCount = 0;
      }

      setBadges({
        explore: nearbyGamesCount,
        games: statsData?.activeGames || 0,
        friends: statsData?.friendsOnline || 0,
        chat: chatCount,
      });
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError('Failed to fetch badge data');
      setBadges({ explore: 0, games: 0, friends: 0, chat: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBadges = () => {
    if (hasMounted) {
      fetchBadges();
    }
  };

  // Only fetch badges after component has mounted on the client
  useEffect(() => {
    if (hasMounted) {
      fetchBadges();
    }
  }, [user?._id, hasMounted]);

  const updateBadge = (type: keyof BadgeData, value: number) => {
    setBadges((prevBadges) => ({
      ...prevBadges,
      [type]: value,
    }));
  };

  return {
    badges,
    isLoading,
    error,
    refreshBadges,
    updateBadge,
  };
};
