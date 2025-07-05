interface DetailedStatsProps {
  stats: {
    gamesWon: number;
    winRate: number;
    rank: string;
    level: number;
    favoriteSport: string;
  };
}

const DetailedStats: React.FC<DetailedStatsProps> = ({ stats }) => (
  <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700'>
    <h3 className='text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200'>Detailed Stats</h3>
    <div className='space-y-4'>
      <div className='flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
        <span className='text-gray-600 dark:text-gray-300'>Games Won</span>
        <span className='font-semibold text-green-600'>{stats.gamesWon}</span>
      </div>
      <div className='flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
        <span className='text-gray-600 dark:text-gray-300'>Win Rate</span>
        <span className='font-semibold text-blue-600'>{stats.winRate}%</span>
      </div>
      <div className='flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
        <span className='text-gray-600 dark:text-gray-300'>Current Rank</span>
        <span className='font-semibold text-purple-600'>{stats.rank}</span>
      </div>
      <div className='flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
        <span className='text-gray-600 dark:text-gray-300'>Level</span>
        <span className='font-semibold text-orange-600'>{stats.level}</span>
      </div>
      <div className='flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
        <span className='text-gray-600 dark:text-gray-300'>Favorite Sport</span>
        <span className='font-semibold text-indigo-600'>{stats.favoriteSport}</span>
      </div>
    </div>
  </div>
);

export default DetailedStats;
