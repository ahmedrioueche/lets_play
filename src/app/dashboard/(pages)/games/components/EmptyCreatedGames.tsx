import useTranslator from '@/hooks/useTranslator';
import { Plus, Trophy } from 'lucide-react';

interface EmptyCreatedGamesProps {
  onCreateGame: () => void;
}

const EmptyCreatedGames: React.FC<EmptyCreatedGamesProps> = ({ onCreateGame }) => {
  const text = useTranslator();
  return (
    <div className='text-center py-16'>
      <div className='w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center'>
        <Trophy className='w-16 h-16 text-blue-500 dark:text-blue-400' />
      </div>
      <h3 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3'>
        {text.my_games.empty_created_title}
      </h3>
      <p className='text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-md mx-auto leading-relaxed'>
        {text.my_games.empty_created_desc}
      </p>
      <div className='space-y-4'>
        <button
          onClick={onCreateGame}
          className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg'
        >
          <Plus className='w-5 h-5' />
          {text.my_games.empty_created_button}
        </button>
        <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          {text.my_games.empty_created_bullets.map((b, i) => (
            <p key={i}>{b}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyCreatedGames;
