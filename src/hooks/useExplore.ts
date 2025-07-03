import { useSettings } from '@/context/SettingsContext';
import { gamesApi } from '@/lib/api/gamesApi';
import { ExploreState, FilterOptions, Game, SkillLevel, SportType, ViewMode } from '@/types/game';
import { getDistanceFromLatLonInKm } from '@/utils/helper';
import { useCallback, useEffect, useState } from 'react';

export const useExplore = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const settings = useSettings();

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
  const [state, setState] = useState<ExploreState>(initialState);

  // Ensure we're on the client side before making API calls
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Fetch games from API when user location changes (only after mounting)
  useEffect(() => {
    if (!hasMounted) return;

    async function fetchGames() {
      const games = await gamesApi.getGames();
      setState((prev) => ({ ...prev, games }));
    }
    fetchGames();
  }, [state.userLocation, hasMounted]);

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
      filtered = filtered.filter((game) => state.filters.sports.includes(game.sport as SportType));
    }

    // Skill level filter
    if (state.filters.skillLevels.length > 0) {
      filtered = filtered.filter((game) =>
        state.filters.skillLevels.includes(game.skillLevel as SkillLevel)
      );
    }

    // Date filter
    if (state.filters.date) {
      filtered = filtered.filter((game) => game.date === state.filters.date);
    }

    const maxDistance = settings.maxDistanceForVisibleGames ?? 300;
    if (state.userLocation && maxDistance > 0) {
      filtered = filtered.filter((game) => {
        const distance = getDistanceFromLatLonInKm(
          state.userLocation!.lat,
          state.userLocation!.lng,
          game.coordinates.lat,
          game.coordinates.lng
        );
        return distance <= maxDistance;
      });
    }

    setState((prev) => ({ ...prev, filteredGames: filtered }));
  }, [
    state.games,
    state.searchQuery,
    state.filters,
    state.userLocation,
    settings.maxDistanceForVisibleGames,
  ]);

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
