'use client';

import GameDetailsModal from '@/app/dashboard/components/GameDetailsModal';
import useTranslator from '@/hooks/useTranslator';
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
  const t = useTranslator();
  const {
    createdGames,
    signedUpGames,
    selectedGame,
    modalOpen,
    warningOpen,
    warningMessage,
    userLocation,
    isLoading,
    setSelectedGame,
    setModalOpen,
    setWarningOpen,
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
        title={t.my_games.created_section}
        games={createdGames}
        isLoading={isLoading}
        emptyStateComponent={<EmptyCreatedGames onCreateGame={handleCreateGame} />}
        actionButton={{
          text: t.my_games.create_new_game,
          icon: <Plus className='w-4 h-4' />,
          onClick: handleCreateGame,
        }}
        onGameClick={handleGameClick}
        userLocation={userLocation}
      />

      <GamesSection
        title={t.my_games.joined_section}
        games={signedUpGames}
        isLoading={isLoading}
        emptyStateComponent={<EmptySignedUpGames onExploreGames={handleExploreGames} />}
        actionButton={{
          text: t.my_games.explore_more_games,
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
        warning={t.my_games.warning_credibility}
      />
    </div>
  );
}
