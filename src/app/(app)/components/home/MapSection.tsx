import GamesMap from '@/components/games/GamesMap';
import Button from '@/components/ui/Button';
import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';
import { RefreshCw } from 'lucide-react';
import React from 'react';

interface MapSectionProps {
  games: Game[];
  userLocation: { lat: number; lng: number } | null;
  onGameSelect: (game: Game) => void;
  onRefresh: () => void;
  isLoadingLocation?: boolean;
  isLoadingGames?: boolean;
}

const MapSection: React.FC<MapSectionProps> = ({
  games,
  userLocation,
  onGameSelect,
  onRefresh,
  isLoadingLocation = false,
  isLoadingGames = false,
}) => {
  const text = useTranslator();

  return (
    <div className='bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border overflow-hidden shadow-sm'>
      <div className='p-4 border-b border-light-border dark:border-dark-border flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary'>
          {text.home.games_near_you}
        </h2>
        <Button
          variant='default'
          size='sm'
          onClick={onRefresh}
          className='flex items-center gap-2'
          disabled={isLoadingLocation || isLoadingGames}
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoadingLocation || isLoadingGames ? 'animate-spin' : ''}`}
          />
          {text.home.refresh}
        </Button>
      </div>
      <div className='h-80 relative'>
        {isLoadingLocation ? (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800'>
            <div className='text-center'>
              <div className='w-8 h-8 border-2 border-light-primary dark:border-dark-primary border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
              <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                {text.home.getting_location}
              </p>
            </div>
          </div>
        ) : (
          <GamesMap
            games={games}
            selectedGame={null}
            onGameSelect={onGameSelect}
            userLocation={userLocation}
            onMapClick={() => {}}
            allowMapClick={false}
          />
        )}
        {isLoadingGames && !isLoadingLocation && (
          <div className='absolute top-2 right-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-light-border dark:border-dark-border'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 border border-light-primary dark:border-dark-primary border-t-transparent rounded-full animate-spin'></div>
              <span className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                {text.home.loading_games}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSection;
