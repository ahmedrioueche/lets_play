'use client';

import React, { useState } from 'react';
import GamesMap from '@/components/games/GamesMap';
import GameCard from '@/components/games/GameCard';
import SearchSection from '@/components/explore/SearchSection';
import FilterModal from '@/components/explore/FilterModal';
import CalendarView from '@/components/explore/CalendarView';
import { useExplore } from '@/hooks/useExplore';

export default function ExplorePage() {
  const {
    state,
    setViewMode,
    setFilters,
    setSearchQuery,
    setUserLocation,
    handleGameSelect,
  } = useExplore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const renderContentView = () => {
    switch (state.viewMode) {
      case 'map':
        return (
          <div className="h-[calc(100vh-200px)] rounded-2xl overflow-hidden">
            <GamesMap
              games={state.filteredGames}
              selectedGame={state.selectedGame}
              onGameSelect={handleGameSelect}
              userLocation={state.userLocation}
            />
          </div>
        );
      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => handleGameSelect(game)}
                userLocation={state.userLocation}
              />
            ))}
          </div>
        );
      case 'calendar':
        return (
          <div className="h-[calc(100vh-200px)] rounded-2xl overflow-hidden">
            <CalendarView
              games={state.filteredGames}
              onGameSelect={handleGameSelect}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto md:px-4 p-1">
      <div className="flex flex-col gap-6">
        {/* Search Section */}
        <SearchSection
          searchQuery={state.searchQuery}
          onSearchChange={setSearchQuery}
          onLocationClick={() => {
            if (navigator.geolocation) {
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
          }}
          currentView={state.viewMode}
          onViewChange={setViewMode}
          onFilterClick={() => setIsFilterOpen(true)}
        />

        {/* Content Section */}
        {renderContentView()}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={state.filters}
        onFilterChange={setFilters}
      />
    </div>
  );
}
