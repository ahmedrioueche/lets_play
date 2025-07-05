import { Activity } from 'lucide-react';

const PerformanceChart: React.FC = () => (
  <div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700'>
    <h3 className='text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200'>
      Performance Over Time
    </h3>
    <div className='h-64 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center'>
      <div className='text-center text-gray-500 dark:text-gray-400'>
        <Activity className='w-12 h-12 mx-auto mb-4' />
        <p>Performance chart coming soon</p>
      </div>
    </div>
  </div>
);

export default PerformanceChart;
