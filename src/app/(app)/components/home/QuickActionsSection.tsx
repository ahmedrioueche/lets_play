import useTranslator from '@/hooks/useTranslator';
import { MapPin, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const QuickActionsSection: React.FC = () => {
  const text = useTranslator();
  const router = useRouter();

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <div
        className='bg-light-card dark:bg-dark-card p-6 rounded-xl border border-light-border dark:border-dark-border hover:border-light-primary/30 dark:hover:border-dark-primary/30 transition-all cursor-pointer group'
        onClick={() => router.push('/explore')}
      >
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform'>
            <MapPin className='w-6 h-6 text-white' />
          </div>
          <div>
            <h3 className='font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
              {text.home.explore_games}
            </h3>
            <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              {text.home.find_games_near_you}
            </p>
          </div>
        </div>
      </div>

      <div
        className='bg-light-card dark:bg-dark-card p-6 rounded-xl border border-light-border dark:border-dark-border hover:border-light-primary/30 dark:hover:border-dark-primary/30 transition-all cursor-pointer group'
        onClick={() => router.push('/create')}
      >
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform'>
            <Plus className='w-6 h-6 text-white' />
          </div>
          <div>
            <h3 className='font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors'>
              {text.home.create_game}
            </h3>
            <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              {text.home.organize_your_own_game}
            </p>
          </div>
        </div>
      </div>

      <div
        className='bg-light-card dark:bg-dark-card p-6 rounded-xl border border-light-border dark:border-dark-border hover:border-light-primary/30 dark:hover:border-dark-primary/30 transition-all cursor-pointer group'
        onClick={() => router.push('/friends')}
      >
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform'>
            <Users className='w-6 h-6 text-white' />
          </div>
          <div>
            <h3 className='font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'>
              {text.home.find_friends}
            </h3>
            <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              {text.home.connect_with_players}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsSection;
