'use client';

import GameDetailsModal from '@/app/(app)/components/GameDetailsModal';
import GameCard from '@/components/games/GameCard';
import GamesMap from '@/components/games/GamesMap';
import { useAuth } from '@/context/AuthContext';
import { useExplore } from '@/hooks/useExplore';
import { Game } from '@/types/game';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CalendarView from './components/CalendarView';
import FilterModal from './components/FilterModal';
import SearchSection from './components/SearchSection';

export default function ExplorePage() {
  const {
    state,
    setViewMode,
    setFilters,
    setSearchQuery,
    setUserLocation,
    setSelectedGame,
    handleGameSelect,
    resetFilters,
  } = useExplore();

  const { user } = useAuth();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Ensure we're on the client side before using geolocation
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Get user's location on component mount (only after client-side hydration)
  useEffect(() => {
    if (!hasMounted) return;

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to New York City if location access is denied
          setUserLocation({
            lat: 40.7128,
            lng: -74.006,
          });
        }
      );
    } else {
      // Use default location if geolocation is not available
      setUserLocation({
        lat: 40.7128,
        lng: -74.006,
      });
    }
  }, [setUserLocation, hasMounted]);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setIsDetailsModalOpen(true);
  };

  const handleRegister = async (gameId: string, userObj: User) => {
    if (!userObj) return;
    try {
      const res = await fetch(`/api/games/${gameId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userObj._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      toast.success('Registered successfully!');
      // Fetch updated game and update selectedGame
      const updatedRes = await fetch(`/api/games/${gameId}`);
      const updatedGame = await updatedRes.json();
      setSelectedGame(updatedGame);
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  };

  const handleCancelRegistration = async (gameId: string, userId: string) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Cancellation failed');
      toast.success('Registration cancelled!');
      // Fetch updated game and update selectedGame
      const updatedRes = await fetch(`/api/games/${gameId}`);
      const updatedGame = await updatedRes.json();
      setSelectedGame(updatedGame);
    } catch (err: any) {
      toast.error(err.message || 'Cancellation failed');
    }
  };

  const handleLocationClick = () => {
    if (!hasMounted) return;

    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const renderContentView = () => {
    switch (state.viewMode) {
      case 'map':
        return (
          <GamesMap
            games={state.filteredGames}
            selectedGame={state.selectedGame}
            onGameSelect={handleGameClick}
            userLocation={state.userLocation}
          />
        );
      case 'grid':
        return (
          <div className='py-4'>
            {state.filteredGames.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {state.filteredGames.map((game: Game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onClick={() => handleGameClick(game)}
                    userLocation={state.userLocation}
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-16 text-center'>
                <div className='w-24 h-24 rounded-full bg-light-hover/50 dark:bg-dark-hover/50 flex items-center justify-center'>
                  <svg
                    className='w-12 h-12 text-light-text-secondary dark:text-dark-text-secondary'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
                  No games found
                </h3>
                <p className='text-light-text-secondary dark:text-dark-text-secondary max-w-md'>
                  {state.searchQuery ||
                  state.filters.sports.length > 0 ||
                  state.filters.skillLevels.length > 0
                    ? 'Try adjusting your search or filters to find more games.'
                    : 'Be the first to create a game in your area!'}
                </p>
              </div>
            )}
          </div>
        );
      case 'calendar':
        return (
          <CalendarView
            games={state.filteredGames}
            onGameSelect={handleGameClick}
            userLocation={state.userLocation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col h-full'>
      <SearchSection
        searchQuery={state.searchQuery}
        onSearchChange={setSearchQuery}
        onLocationClick={handleLocationClick}
        currentView={state.viewMode}
        onViewChange={setViewMode}
        onFilterClick={() => setIsFilterModalOpen(true)}
      />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={state.filters}
        onFilterChange={setFilters}
      />
      {state.selectedGame && (
        <GameDetailsModal
          game={state.selectedGame}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedGame(null);
          }}
          userLocation={state.userLocation}
          onRegister={handleRegister}
          onCancelRegistration={handleCancelRegistration}
          isRegistered={
            user
              ? state.selectedGame.participants?.some(
                  (p: any) => (typeof p === 'object' ? p._id : p) === user._id
                )
              : false
          }
          mode='explore'
        />
      )}
      <div className='flex-1 relative mt-4'>{renderContentView()}</div>
    </div>
  );
}
