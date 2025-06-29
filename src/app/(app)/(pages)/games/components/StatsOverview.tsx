import useTranslator from '@/hooks/useTranslator';
import { Calendar, Trophy, Users } from 'lucide-react';
import StatsCard from './StatsCard';

interface StatsOverviewProps {
  createdGamesCount: number;
  signedUpGamesCount: number;
  isLoading: boolean;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  createdGamesCount,
  signedUpGamesCount,
  isLoading,
}) => {
  const text = useTranslator();
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
      <StatsCard
        title={text.my_games.stats_created}
        value={isLoading ? 0 : createdGamesCount}
        icon={Trophy}
        color='from-blue-500 to-blue-600'
      />
      <StatsCard
        title={text.my_games.stats_joined}
        value={isLoading ? 0 : signedUpGamesCount}
        icon={Users}
        color='from-green-500 to-green-600'
      />
      <StatsCard
        title={text.my_games.stats_total}
        value={isLoading ? 0 : createdGamesCount + signedUpGamesCount}
        icon={Calendar}
        color='from-purple-500 to-purple-600'
      />
    </div>
  );
};

export default StatsOverview;
