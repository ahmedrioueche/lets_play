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

      // For now, chat badge is hardcoded to 0 since we don't have a chat API yet
      const chatCount = 0;

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

  return {
    badges,
    isLoading,
    error,
    refreshBadges,
  };
};
