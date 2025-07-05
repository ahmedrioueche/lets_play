import Button from '@/components/ui/Button';
import useTranslator from '@/hooks/useTranslator';
import { Play, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const WelcomeSection: React.FC = () => {
  const text = useTranslator();
  const router = useRouter();

  return (
    <div className='bg-gradient-to-r from-light-primary/5 to-light-secondary/5 dark:from-dark-primary/5 dark:to-dark-secondary/5 rounded-2xl border border-light-border dark:border-dark-border p-6'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2'>
            {text.home.welcome_back}
          </h1>
          <p className='text-light-text-secondary dark:text-dark-text-secondary'>
            {text.home.ready_to_play}
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-3'>
          <Button
            variant='primary'
            onClick={() => router.push('/dashboard/explore')}
            className='flex items-center gap-2'
          >
            <Play className='w-4 h-4' />
            {text.home.explore_games}
          </Button>
          <Button
            variant='default'
            onClick={() => router.push('/dashboard/create')}
            className='flex items-center gap-2'
          >
            <Plus className='w-4 h-4' />
            {text.home.create_game}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
