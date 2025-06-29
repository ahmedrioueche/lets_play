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
  recentGames: Game[];
  userLocation: { lat: number; lng: number } | null;
  timestamp: number;
}

interface UseHomeReturn {
  stats: Stats | null;
  nearbyGames: Game[];
  recentGames: Game[];
  userLocation: { lat: number; lng: number } | null;
  isLoadingStats: boolean;
  isLoadingGames: boolean;
  isLoadingRecent: boolean;
  isLoadingLocation: boolean;
  error: string | null;
  refreshData: () => void;
}

const CACHE_KEY = 'home_data_cache';
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute

const getCachedData = (): CachedData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const data: CachedData = JSON.parse(cached);
    const now = Date.now();
    if (now - data.timestamp < CACHE_DURATION) {
      return data;
    }
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
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetchers ---
  const fetchStats = async () => {
    if (!user?._id) {
      const defaultStats = {
        userGames: 0,
        nearbyGames: 0,
        activeGames: 0,
        friendsOnline: 0,
        totalUsers: 0,
      };
      setStats(defaultStats);
      return;
    }
    setIsLoadingStats(true);
    setError(null);
    try {
      const response = await fetch(`/api/stats?userId=${user._id}`);
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
        recentGames: cached?.recentGames || [],
        userLocation: cached?.userLocation || null,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setStats({
        userGames: 0,
        nearbyGames: 0,
        activeGames: 0,
        friendsOnline: 0,
        totalUsers: 0,
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchNearbyGames = async (location: { lat: number; lng: number } | null) => {
    if (!location) return;
    setIsLoadingGames(true);
    try {
      const response = await fetch(
        `/api/games/nearby?lat=${location.lat}&lng=${location.lng}&limit=6`
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
        recentGames: cached?.recentGames || [],
        userLocation: cached?.userLocation || location,
      });
    } catch (err) {
      console.error('Error fetching nearby games:', err);
      setNearbyGames([]);
    } finally {
      setIsLoadingGames(false);
    }
  };

  const fetchRecentGames = async () => {
    setIsLoadingRecent(true);
    try {
      const response = await fetch(`/api/games/recent?limit=3`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent games');
      }
      const data = await response.json();
      setRecentGames(data);
      // Update cache
      const cached = getCachedData();
      setCachedData({
        stats: cached?.stats || null,
        nearbyGames: cached?.nearbyGames || [],
        recentGames: data,
        userLocation: cached?.userLocation || null,
      });
    } catch (err) {
      console.error('Error fetching recent games:', err);
      setRecentGames([]);
    } finally {
      setIsLoadingRecent(false);
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
            recentGames: cached?.recentGames || [],
            userLocation: location,
          });
        },
        () => {
          const defaultLocation = { lat: 40.7128, lng: -74.006 };
          setUserLocation(defaultLocation);
          setIsLoadingLocation(false);
          // Update cache
          const cached = getCachedData();
          setCachedData({
            stats: cached?.stats || null,
            nearbyGames: cached?.nearbyGames || [],
            recentGames: cached?.recentGames || [],
            userLocation: defaultLocation,
          });
        }
      );
    } else {
      const defaultLocation = { lat: 40.7128, lng: -74.006 };
      setUserLocation(defaultLocation);
      setIsLoadingLocation(false);
      // Update cache
      const cached = getCachedData();
      setCachedData({
        stats: cached?.stats || null,
        nearbyGames: cached?.nearbyGames || [],
        recentGames: cached?.recentGames || [],
        userLocation: defaultLocation,
      });
    }
  };

  const refreshData = () => {
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
    fetchStats();
    fetchNearbyGames(userLocation);
    fetchRecentGames();
  };

  // --- Initial load: cache-first strategy ---
  useEffect(() => {
    const cached = getCachedData();
    if (cached) {
      setStats(cached.stats);
      setNearbyGames(cached.nearbyGames);
      setRecentGames(cached.recentGames);
      setUserLocation(cached.userLocation);
      setIsLoadingLocation(false);
      setIsLoadingStats(false);
      setIsLoadingGames(false);
      setIsLoadingRecent(false);
      // Do NOT fetch fresh data if cache is valid
    } else {
      // No valid cache, fetch everything
      getLocation();
      fetchStats();
      fetchRecentGames();
    }
  }, []);

  // Fetch nearby games when location is available (only if no cache)
  useEffect(() => {
    const cached = getCachedData();
    if (userLocation && !cached) {
      fetchNearbyGames(userLocation);
    }
  }, [userLocation]);

  // Fetch stats when user is available (only if no cache)
  useEffect(() => {
    const cached = getCachedData();
    if (user && !cached) {
      fetchStats();
    }
  }, [user?._id]);

  return {
    stats,
    nearbyGames,
    recentGames,
    userLocation,
    isLoadingStats,
    isLoadingGames,
    isLoadingRecent,
    isLoadingLocation,
    error,
    refreshData,
  };
};
