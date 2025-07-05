import GameCard from '@/components/games/GameCard';
import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';

interface GamesSectionProps {
  title?: string;
  games: Game[];
  isLoading: boolean;
  emptyStateComponent: React.ReactNode;
  actionButton: {
    text?: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
  onGameClick: (game: Game) => void;
  userLocation: { lat: number; lng: number } | null;
}

const GamesSection: React.FC<GamesSectionProps> = ({
  title,
  games,
  isLoading,
  emptyStateComponent,
  actionButton,
  onGameClick,
  userLocation,
}) => {
  const text = useTranslator();
  return (
    <div className='mb-12'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary'>
          {title || text.my_games.created_section}
        </h2>
        <button
          onClick={actionButton.onClick}
          className='inline-flex items-center gap-2 bg-light-primary dark:bg-dark-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity'
        >
          {actionButton.icon}
          {actionButton.text || text.my_games.create_new_game}
        </button>
      </div>

      {isLoading ? (
        <div className='animate-pulse'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-48 bg-gray-200 dark:bg-gray-700 rounded-xl'></div>
            ))}
          </div>
        </div>
      ) : games.length === 0 ? (
        <div className='bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border'>
          {emptyStateComponent}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => onGameClick(game)}
              userLocation={userLocation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesSection;
