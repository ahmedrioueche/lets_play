import { useState, useCallback } from 'react';
import { Game, FilterOptions, ViewMode, ExploreState } from '@/types/explore';

const initialState: ExploreState = {
  viewMode: 'map',
  filters: {
    sports: [],
    skillLevels: [],
    date: null,
    maxDistance: 50,
  },
  searchQuery: '',
  userLocation: null,
  selectedGame: null,
  filteredGames: [],
  games: [],
};

export const useExplore = () => {
  const [state, setState] = useState<ExploreState>(initialState);

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

// Helper function to calculate distance between two points using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
} 