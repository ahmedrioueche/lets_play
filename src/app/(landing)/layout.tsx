import React from 'react';

const LandingLayout = ({ children }: { children: React.ReactNode }) => (
  <main className='min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900 flex flex-col'>
    {children}
  </main>
);

export default LandingLayout;
