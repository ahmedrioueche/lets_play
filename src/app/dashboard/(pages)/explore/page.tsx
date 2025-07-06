'use client';

import GameDetailsModal from '@/app/dashboard/components/GameDetailsModal';
import GameCard from '@/components/games/GameCard';
import GamesMap from '@/components/games/GamesMap';
import NotFound from '@/components/ui/NotFound';
import { useAuth } from '@/context/AuthContext';
import { useExplore } from '@/hooks/useExplore';
import useTranslator from '@/hooks/useTranslator';
import { gamesApi } from '@/lib/api/gamesApi';
import { Game } from '@/types/game';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import WarningModal from '../games/components/WarningModal';
import CalendarView from './components/CalendarView';
import FilterModal from './components/FilterModal';
import SearchSection from './components/SearchSection';

export default function ExplorePage() {
  const { state, setViewMode, setFilters, setSearchQuery, setUserLocation, setSelectedGame } =
    useExplore();
  const text = useTranslator();
  const { user } = useAuth();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningTitle, setWarningTitle] = useState('');
  const [cancelType, setCancelType] = useState<'signup' | 'game' | null>(null);
  const [gameToCancel, setGameToCancel] = useState<Game | null>(null);

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

  // Listen for joinRequestCancelled event to update selectedGame
  useEffect(() => {
    const handleCancel = (e: any) => {
      if (!e.detail || !state.selectedGame) return;
      if (e.detail.gameId === state.selectedGame._id && user) {
        setSelectedGame({
          ...state.selectedGame,
          joinRequests: (state.selectedGame.joinRequests || []).filter((id) => id !== user._id),
        });
      }
    };
    window.addEventListener('joinRequestCancelled', handleCancel);
    return () => window.removeEventListener('joinRequestCancelled', handleCancel);
  }, [state.selectedGame, user, setSelectedGame]);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setIsDetailsModalOpen(true);
  };

  const handleRegister = async (gameId: string, userObj: User) => {
    if (!userObj) return;

    // Find the game to check if it requires join permission
    const game = state.filteredGames.find((g) => g._id === gameId || g.id === gameId);

    try {
      if (game?.joinPermission) {
        // Send join request instead of direct registration
        const res = await fetch(`/api/games/${gameId}/join-request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userObj._id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Join request failed');
        toast.success(text.home.explore_join_request_sent);
        // Immediate reactivity: update selectedGame.joinRequests
        if (state.selectedGame) {
          setSelectedGame({
            ...state.selectedGame,
            joinRequests: Array.isArray(state.selectedGame.joinRequests)
              ? [...state.selectedGame.joinRequests, userObj._id]
              : [userObj._id],
          });
        }
      } else {
        // Direct registration
        const res = await fetch(`/api/games/${gameId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userObj._id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        const updatedRes = await fetch(`/api/games/${gameId}`);
        const updatedGame = await updatedRes.json();
        setSelectedGame(updatedGame);
        toast.success(text.messages.success.game_registration);
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  };

  const handleCancelRegistration = (game: Game) => {
    if (!game) return;

    setWarningMessage(
      'Are you sure you want to cancel your signup for this game? Canceling may affect your credibility.'
    );
    setWarningTitle('Cancel Registration');
    setCancelType('signup');
    setGameToCancel(game);
    setWarningModalOpen(true);
  };

  const handleCancelGame = (game: Game) => {
    if (!game) return;

    setWarningMessage(
      'Are you sure you want to cancel this game? This action cannot be undone. Canceling may affect your credibility.'
    );
    setWarningTitle('Cancel Game');
    setCancelType('game');
    setGameToCancel(game);
    setWarningModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!gameToCancel || !user?._id) return;

    try {
      if (cancelType === 'signup') {
        // Cancel registration for the game
        await gamesApi.cancelRegistration(gameToCancel._id, user._id);
        toast.success(text.home.explore_registration_cancelled);

        // Fetch updated game and update selectedGame
        const updatedRes = await fetch(`/api/games/${gameToCancel._id}`);
        const updatedGame = await updatedRes.json();
        setSelectedGame(updatedGame);
      } else if (cancelType === 'game') {
        // Delete the entire game
        await gamesApi.deleteGame(gameToCancel._id, user._id);
        toast.success('Game cancelled successfully');

        // Close the details modal since the game is deleted
        setIsDetailsModalOpen(false);
        setSelectedGame(null);
      }
    } catch (error: any) {
      console.error('Error canceling:', error);
      toast.error(error.message || 'Cancellation failed');
    } finally {
      setWarningModalOpen(false);
      setWarningMessage('');
      setWarningTitle('');
      setCancelType(null);
      setGameToCancel(null);
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
                    key={game._id}
                    game={game}
                    onClick={() => handleGameClick(game)}
                    userLocation={state.userLocation}
                  />
                ))}
              </div>
            ) : (
              <div className='min-h-[50vh] flex items-center justify-center'>
                <NotFound
                  text={text.home.explore_no_games_found}
                  subtext={
                    state.searchQuery ||
                    state.filters.sports.length > 0 ||
                    state.filters.skillLevels.length > 0
                      ? text.home.explore_no_games_subtext_filters
                      : text.home.explore_no_games_subtext_default
                  }
                />
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
          onRegister={(gameId, user) => handleRegister(gameId, user)}
          onCancelRegistration={() => handleCancelRegistration(state.selectedGame!)}
          isRegistered={
            user
              ? state.selectedGame.participants?.some(
                  (p: any) => (typeof p === 'object' ? p._id : p) === user._id
                )
              : false
          }
          mode='explore'
          onCancelGame={() => handleCancelGame(state.selectedGame!)}
        />
      )}
      <div className='flex-1 relative mt-4'>{renderContentView()}</div>

      <WarningModal
        isOpen={warningModalOpen}
        onConfirm={confirmCancel}
        onCancel={() => {
          setWarningModalOpen(false);
          setWarningMessage('');
          setWarningTitle('');
          setCancelType(null);
          setGameToCancel(null);
        }}
        message={warningMessage}
        warning={warningTitle}
      />
    </div>
  );
}
