import useTranslator from '@/hooks/useTranslator';
import { MessageCircle } from 'lucide-react';
import React from 'react';

const NoData: React.FC = () => {
  const text = useTranslator();
  return (
    <div className='flex flex-1 w-full h-full items-center justify-center'>
      <div className='flex flex-col items-center justify-center rounded-2xl shadow-lg px-8 py-10 min-w-[320px] max-w-full '>
        <MessageCircle className='w-14 h-14 mb-4 text-blue-500 dark:text-blue-400 drop-shadow' />
        <div className='text-xl font-bold text-blue-600 dark:text-blue-300 mb-1'>
          {text.general.noData || 'No data available.'}
        </div>
        <div className='text-base mt-1 text-gray-500 dark:text-gray-300'>
          {text.general.noDataDescription || 'There is nothing to show here yet.'}
        </div>
      </div>
    </div>
  );
};

export default NoData;
