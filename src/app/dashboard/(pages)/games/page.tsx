'use client';

import GameDetailsModal from '@/app/dashboard/components/GameDetailsModal';
import { Game } from '@/types/game';
import { User } from '@/types/user';
import { MapPin, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  EmptyCreatedGames,
  EmptySignedUpGames,
  GamesSection,
  PageHeader,
  StatsOverview,
  WarningModal,
} from './components';
import { useMyGames } from './hooks/useMyGames';

export default function MyGamesPage() {
  const router = useRouter();
  const {
    createdGames,
    signedUpGames,
    selectedGame,
    modalOpen,
    warningOpen,
    warningMessage,
    cancelType,
    userLocation,
    isLoading,
    setSelectedGame,
    setModalOpen,
    setWarningOpen,
    handleCancelRegistration,
    handleCancelGame,
    confirmCancel,
    refetchGames,
  } = useMyGames();

  const handleCreateGame = () => {
    router.push('/dashboard/create');
  };

  const handleExploreGames = () => {
    router.push('/dashboard/explore');
  };

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const handleRegister = async (gameId: string, user: User) => Promise.resolve();

  const handleCancelRegistrationWrapper = async (gameId: string, userId: string) => {
    handleCancelRegistration();
  };

  // Refetch games after registration/cancellation
  const handleGameChange = async () => {
    await refetchGames();
  };

  return (
    <div className='container mx-auto p-2'>
      <PageHeader />

      <StatsOverview
        createdGamesCount={createdGames.length}
        signedUpGamesCount={signedUpGames.length}
        isLoading={isLoading}
      />

      <GamesSection
        title='Games I Created'
        games={createdGames}
        isLoading={isLoading}
        emptyStateComponent={<EmptyCreatedGames onCreateGame={handleCreateGame} />}
        actionButton={{
          text: 'Create New Game',
          icon: <Plus className='w-4 h-4' />,
          onClick: handleCreateGame,
        }}
        onGameClick={handleGameClick}
        userLocation={userLocation}
      />

      <GamesSection
        title='Games I Joined'
        games={signedUpGames}
        isLoading={isLoading}
        emptyStateComponent={<EmptySignedUpGames onExploreGames={handleExploreGames} />}
        actionButton={{
          text: 'Explore More Games',
          icon: <MapPin className='w-4 h-4' />,
          onClick: handleExploreGames,
        }}
        onGameClick={handleGameClick}
        userLocation={userLocation}
      />

      {/* Modals */}
      {selectedGame && (
        <GameDetailsModal
          game={selectedGame}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onRegister={async (...args) => {
            await handleGameChange();
          }}
          onCancelRegistration={async (...args) => {
            await handleGameChange();
          }}
          onCancelGame={
            createdGames.some((g) => g.id === selectedGame.id) ? handleCancelGame : undefined
          }
          isRegistered={signedUpGames.some((g) => g.id === selectedGame.id)}
          mode='games'
        />
      )}

      <WarningModal
        isOpen={warningOpen}
        onConfirm={confirmCancel}
        onCancel={() => setWarningOpen(false)}
        message={warningMessage}
        warning='Warning: Canceling affects your credibility!'
      />
    </div>
  );
}
