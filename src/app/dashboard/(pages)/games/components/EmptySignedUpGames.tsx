import useTranslator from '@/hooks/useTranslator';
import { MapPin, Users } from 'lucide-react';

interface EmptySignedUpGamesProps {
  onExploreGames: () => void;
}

const EmptySignedUpGames: React.FC<EmptySignedUpGamesProps> = ({ onExploreGames }) => {
  const text = useTranslator();
  return (
    <div className='text-center py-16'>
      <div className='w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-full flex items-center justify-center'>
        <Users className='w-16 h-16 text-green-500 dark:text-green-400' />
      </div>
      <h3 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3'>
        {text.my_games.empty_joined_title}
      </h3>
      <p className='text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-md mx-auto leading-relaxed'>
        {text.my_games.empty_joined_desc}
      </p>
      <div className='space-y-4'>
        <button
          onClick={onExploreGames}
          className='inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg'
        >
          <MapPin className='w-5 h-5' />
          {text.my_games.empty_joined_button}
        </button>
        <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          {text.my_games.empty_joined_bullets.map((b, i) => (
            <p key={i}>{b}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptySignedUpGames;
