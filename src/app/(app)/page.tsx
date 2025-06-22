'use client';

import { useHome } from '@/hooks/useHome';
import { Game } from '@/types/game';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  ErrorSection,
  MapSection,
  QuickActionsSection,
  RecentGamesSection,
  StatsSection,
  WelcomeSection,
} from './components/home';

const HomePage: React.FC = () => {
  const router = useRouter();
  const {
    stats,
    nearbyGames,
    userLocation,
    isLoadingStats,
    isLoadingGames,
    isLoadingLocation,
    error,
    refreshData,
  } = useHome();

  const handleGameSelect = (game: Game) => {
    router.push(`/explore?game=${game.id}`);
  };

  // Show error section if there's an error
  if (error) {
    return <ErrorSection error={error} onRetry={refreshData} />;
  }

  return (
    <div className='space-y-6'>
      {/* Welcome Section - Always visible, no loading */}
      <WelcomeSection />

      {/* Quick Stats - Show loading only for stats */}
      <StatsSection stats={stats} isLoading={isLoadingStats} />

      {/* Map and Games Section */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        {/* Map - Show loading only for location */}
        <div className='xl:col-span-2'>
          <MapSection
            games={nearbyGames}
            userLocation={userLocation}
            onGameSelect={handleGameSelect}
            onRefresh={refreshData}
            isLoadingLocation={isLoadingLocation}
            isLoadingGames={isLoadingGames}
          />
        </div>

        {/* Recent Games - Show loading only for games */}
        <div>
          <RecentGamesSection
            games={nearbyGames}
            onGameSelect={handleGameSelect}
            isLoading={isLoadingGames}
          />
        </div>
      </div>

      {/* Quick Actions - Always visible, no loading */}
      <QuickActionsSection />
    </div>
  );
};

export default HomePage;
