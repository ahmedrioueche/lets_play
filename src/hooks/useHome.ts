import { useAuth } from '@/context/AuthContext';
import { Game } from '@/types/game';
import { useEffect, useState } from 'react';

interface Stats {
  userGames: number;
  nearbyGames: number;
  activeGames: number;
  friendsOnline: number;
  totalUsers: number;
}

interface CachedData {
  stats: Stats | null;
  nearbyGames: Game[];
  userLocation: { lat: number; lng: number } | null;
  timestamp: number;
}

interface UseHomeReturn {
  stats: Stats | null;
  nearbyGames: Game[];
  userLocation: { lat: number; lng: number } | null;
  isLoadingStats: boolean;
  isLoadingGames: boolean;
  isLoadingLocation: boolean;
  error: string | null;
  refreshData: () => void;
}

const CACHE_KEY = 'home_data_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (): CachedData | null => {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - data.timestamp < CACHE_DURATION) {
      return data;
    }

    // Remove expired cache
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

const setCachedData = (data: Omit<CachedData, 'timestamp'>) => {
  if (typeof window === 'undefined') return;

  try {
    const cacheData: CachedData = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

export const useHome = (): UseHomeReturn => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [nearbyGames, setNearbyGames] = useState<Game[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (useCache = true) => {
    if (!user?.id) {
      // Set default stats for new users or when user is not available
      const defaultStats = {
        userGames: 0,
        nearbyGames: 0,
        activeGames: 0,
        friendsOnline: 5, // Mock data
        totalUsers: 0,
      };
      setStats(defaultStats);
      return;
    }

    setIsLoadingStats(true);
    setError(null);

    try {
      const response = await fetch(`/api/stats?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);

      // Update cache
      const cached = getCachedData();
      setCachedData({
        stats: data,
        nearbyGames: cached?.nearbyGames || [],
        userLocation: cached?.userLocation || null,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Set default stats on error
      setStats({
        userGames: 0,
        nearbyGames: 0,
        activeGames: 0,
        friendsOnline: 5,
        totalUsers: 0,
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchNearbyGames = async (useCache = true) => {
    if (!userLocation) {
      return;
    }

    setIsLoadingGames(true);

    try {
      const response = await fetch(
        `/api/games/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&limit=6`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch nearby games');
      }

      const data = await response.json();
      setNearbyGames(data);

      // Update cache
      const cached = getCachedData();
      setCachedData({
        stats: cached?.stats || null,
        nearbyGames: data,
        userLocation: cached?.userLocation || userLocation,
      });
    } catch (err) {
      console.error('Error fetching nearby games:', err);
      // Set empty array on error - this is fine for new users
      setNearbyGames([]);
    } finally {
      setIsLoadingGames(false);
    }
  };

  const getLocation = () => {
    setIsLoadingLocation(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setIsLoadingLocation(false);

          // Update cache
          const cached = getCachedData();
          setCachedData({
            stats: cached?.stats || null,
            nearbyGames: cached?.nearbyGames || [],
            userLocation: location,
          });
        },
        () => {
          // Default to New York City if location access is denied
          const defaultLocation = { lat: 40.7128, lng: -74.006 };
          setUserLocation(defaultLocation);
          setIsLoadingLocation(false);

          // Update cache
          const cached = getCachedData();
          setCachedData({
            stats: cached?.stats || null,
            nearbyGames: cached?.nearbyGames || [],
            userLocation: defaultLocation,
          });
        }
      );
    } else {
      // Default to New York City if geolocation is not supported
      const defaultLocation = { lat: 40.7128, lng: -74.006 };
      setUserLocation(defaultLocation);
      setIsLoadingLocation(false);

      // Update cache
      const cached = getCachedData();
      setCachedData({
        stats: cached?.stats || null,
        nearbyGames: cached?.nearbyGames || [],
        userLocation: defaultLocation,
      });
    }
  };

  const refreshData = () => {
    setError(null);
    // Clear cache to force fresh data
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }

    fetchStats(false);
    fetchNearbyGames(false);
  };

  // Initialize data on mount
  useEffect(() => {
    // Try to load from cache first
    const cached = getCachedData();

    if (cached) {
      // Use cached data
      setStats(cached.stats);
      setNearbyGames(cached.nearbyGames);
      setUserLocation(cached.userLocation);
      setIsLoadingLocation(false);
      setIsLoadingStats(false);
      setIsLoadingGames(false);
    } else {
      // No cache available, fetch fresh data
      getLocation();
      fetchStats();
    }
  }, []);

  // Fetch nearby games when location is available (only if not from cache)
  useEffect(() => {
    if (userLocation && !getCachedData()) {
      fetchNearbyGames();
    }
  }, [userLocation]);

  // Fetch stats when user is available (only if not from cache)
  useEffect(() => {
    if (user && !getCachedData()) {
      fetchStats();
    }
  }, [user?.id]);

  return {
    stats,
    nearbyGames,
    userLocation,
    isLoadingStats,
    isLoadingGames,
    isLoadingLocation,
    error,
    refreshData,
  };
};
