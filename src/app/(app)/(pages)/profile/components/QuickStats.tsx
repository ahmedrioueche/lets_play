interface QuickStatsProps {
  stats: {
    gamesPlayed: number;
    winRate: number;
    streak: number;
    totalPoints: number;
  };
}

const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => (
  <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700'>
    <h3 className='text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200'>Quick Stats</h3>
    <div className='grid grid-cols-2 gap-4'>
      <div className='text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl'>
        <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
          {stats.gamesPlayed}
        </div>
        <div className='text-sm text-gray-600 dark:text-gray-300'>Games Played</div>
      </div>
      <div className='text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl'>
        <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
          {stats.winRate}%
        </div>
        <div className='text-sm text-gray-600 dark:text-gray-300'>Win Rate</div>
      </div>
      <div className='text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl'>
        <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
          {stats.streak}
        </div>
        <div className='text-sm text-gray-600 dark:text-gray-300'>Day Streak</div>
      </div>
      <div className='text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl'>
        <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
          {stats.totalPoints}
        </div>
        <div className='text-sm text-gray-600 dark:text-gray-300'>Total Points</div>
      </div>
    </div>
  </div>
);

export default QuickStats;
