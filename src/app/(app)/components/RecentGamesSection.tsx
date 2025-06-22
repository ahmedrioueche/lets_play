import Button from '@/components/ui/Button';
import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import GameCard from './GameCard';

interface RecentGamesSectionProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
  isLoading?: boolean;
}

const RecentGamesSection: React.FC<RecentGamesSectionProps> = ({
  games,
  onGameSelect,
  isLoading = false,
}) => {
  const text = useTranslator();
  const router = useRouter();

  const GameSkeleton = () => (
    <div className='bg-light-card dark:bg-dark-card p-4 rounded-xl border border-light-border dark:border-dark-border'>
      <div className='flex items-center gap-3'>
        <div className='w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse'></div>
        <div className='flex-1 space-y-2'>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4'></div>
          <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2'></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between mb-4 mt-1'>
        <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary '>
          {text.home.recent_games}
        </h3>
        <Button
          variant='default'
          size='sm'
          onClick={() => router.push('/explore')}
          className='text-sm'
        >
          {text.home.view_all}
        </Button>
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          {[1, 2, 3, 4].map((i) => (
            <GameSkeleton key={i} />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className='bg-light-card dark:bg-dark-card p-6 rounded-xl border border-light-border dark:border-dark-border text-center'>
          <div className='w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3'>
            <MapPin className='w-6 h-6 text-gray-400' />
          </div>
          <h4 className='font-medium text-light-text-primary dark:text-dark-text-primary mb-1'>
            {text.home.no_games_nearby}
          </h4>
          <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4'>
            {text.home.be_first_to_create}
          </p>
          <Button
            variant='primary'
            size='sm'
            onClick={() => router.push('/create')}
            className='w-full'
          >
            {text.home.create_game}
          </Button>
        </div>
      ) : (
        <div className='space-y-3'>
          {games.slice(0, 3).map((game) => (
            <GameCard key={game.id} game={game} onClick={onGameSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentGamesSection;
