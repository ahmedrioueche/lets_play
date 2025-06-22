import { gamesApi } from '@/lib/api/client';
import { ExploreState, FilterOptions, Game, ViewMode } from '@/types/game';
import { useCallback, useEffect, useState } from 'react';

const initialState: ExploreState = {
  viewMode: 'map',
  filters: {
    sports: [],
    skillLevels: [],
    date: null,
    maxDistance: 300,
  },
  searchQuery: '',
  userLocation: null,
  selectedGame: null,
  filteredGames: [],
  games: [],
};

export const useExplore = () => {
  const [state, setState] = useState<ExploreState>(initialState);

  // Fetch games from API when user location changes
  useEffect(() => {
    async function fetchGames() {
      const games = await gamesApi.getGames();
      setState((prev) => ({ ...prev, games }));
    }
    fetchGames();
  }, [state.userLocation]);

  // Filter games based on current state
  useEffect(() => {
    let filtered = [...state.games];

    // Search query filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((game) => {
        // First check if the sport exactly matches the query
        if (game.sport.toLowerCase() === query) {
          return true;
        }

        // Then check if the sport starts with the query
        if (game.sport.toLowerCase().startsWith(query)) {
          return true;
        }

        // Finally check if the title contains the query
        if (game.title.toLowerCase().includes(query)) {
          return true;
        }

        return false;
      });
    }

    // Sport filter
    if (state.filters.sports.length > 0) {
      filtered = filtered.filter((game) => state.filters.sports.includes(game.sport));
    }

    // Skill level filter
    if (state.filters.skillLevels.length > 0) {
      filtered = filtered.filter((game) => state.filters.skillLevels.includes(game.skillLevel));
    }

    // Date filter
    if (state.filters.date) {
      filtered = filtered.filter((game) => game.date === state.filters.date);
    }

    // Distance filter
    if (state.userLocation && state.filters.maxDistance > 0) {
      filtered = filtered.filter((game) => {
        const distance = calculateDistance(
          state.userLocation!.lat,
          state.userLocation!.lng,
          game.coordinates.lat,
          game.coordinates.lng
        );
        return distance <= state.filters.maxDistance;
      });
    }

    setState((prev) => ({ ...prev, filteredGames: filtered }));
  }, [state.games, state.searchQuery, state.filters, state.userLocation]);

  const setViewMode = useCallback((viewMode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode }));
  }, []);

  const setFilters = useCallback((filters: FilterOptions) => {
    setState((prev) => ({ ...prev, filters }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setState((prev) => ({ ...prev, searchQuery }));
  }, []);

  const setUserLocation = useCallback((location: { lat: number; lng: number } | null) => {
    setState((prev) => ({ ...prev, userLocation: location }));
  }, []);

  const setSelectedGame = useCallback((game: Game | null) => {
    setState((prev) => ({ ...prev, selectedGame: game }));
  }, []);

  const handleGameSelect = useCallback((game: Game) => {
    setState((prev) => ({ ...prev, selectedGame: game }));
  }, []);

  const resetFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: initialState.filters,
    }));
  }, []);

  return {
    state,
    setViewMode,
    setFilters,
    setSearchQuery,
    setUserLocation,
    setSelectedGame,
    handleGameSelect,
    resetFilters,
  };
};

// Helper function to calculate distance between two points in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
