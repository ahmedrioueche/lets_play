import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className='space-y-6'>
      {/* Loading Skeletons */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border p-6'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2'></div>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='bg-light-card dark:bg-dark-card p-4 rounded-xl border border-light-border dark:border-dark-border'
          >
            <div className='animate-pulse'>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2'></div>
              <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3'></div>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        <div className='xl:col-span-2'>
          <div className='bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border overflow-hidden'>
            <div className='p-4 border-b border-light-border dark:border-dark-border'>
              <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse'></div>
            </div>
            <div className='h-80 bg-gray-200 dark:bg-gray-700 animate-pulse'></div>
          </div>
        </div>
        <div className='space-y-4'>
          <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse'></div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='bg-light-card dark:bg-dark-card p-4 rounded-xl border border-light-border dark:border-dark-border'
            >
              <div className='animate-pulse'>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
