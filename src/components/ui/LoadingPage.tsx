import useTranslator from '@/hooks/useTranslator';
import { Loader } from 'lucide-react';
import React from 'react';

const LoadingPage: React.FC<{ type?: 'inner' | 'outer' }> = ({ type = 'outer' }) => {
  const text = useTranslator();

  return (
    <div
      className={`flex flex-col items-center text-dark-foreground justify-center min-h-screen transition-colors duration-300 ${type === 'inner' ? 'bg-light-background dark:bg-dark-background' : ' bg-gradient-to-br from-light-primary/10 to-light-secondary/10 dark:from-slate-800 dark:via-slate-700/20 dark:to-slate-900'} `}
    >
      {/* Loader Animation */}
      <Loader className='animate-spin rounded-full h-16 w-16 border-t-4 border-light-primary dark:border-dark-primary border-opacity-50 mb-4' />

      {/* Loading Text */}
      <h1 className='text-3xl font-dancing text-light-primary dark:text-dark-primary mb-2'>
        {text.app.name}
      </h1>
    </div>
  );
};

export default LoadingPage;
