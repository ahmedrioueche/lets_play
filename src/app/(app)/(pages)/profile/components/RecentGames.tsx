interface Game {
  id: number;
  sport: string;
  result: 'W' | 'L';
  score: string;
  date: string;
  location: string;
}

interface RecentGamesProps {
  games: Game[];
}

const RecentGames: React.FC<RecentGamesProps> = ({ games }) => (
  <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700'>
    <h3 className='text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200'>Recent Games</h3>
    <div className='space-y-4'>
      {games.map((game) => (
        <div
          key={game.id}
          className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl'
        >
          <div className='flex items-center gap-3'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                game.result === 'W' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {game.result}
            </div>
            <div>
              <div className='font-medium text-gray-800 dark:text-gray-200'>{game.sport}</div>
              <div className='text-sm text-gray-600 dark:text-gray-300'>{game.location}</div>
            </div>
          </div>
          <div className='text-right'>
            <div className='font-medium text-gray-800 dark:text-gray-200'>{game.score}</div>
            <div className='text-sm text-gray-600 dark:text-gray-300'>{game.date}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RecentGames;
