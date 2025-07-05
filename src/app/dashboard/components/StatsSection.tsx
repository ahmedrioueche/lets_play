import useTranslator from '@/hooks/useTranslator';
import { Calendar, MapPin, TrendingUp, Users } from 'lucide-react';
import React from 'react';

interface Stats {
  userGames: number;
  activeGames: number;
  friendsOnline: number;
  totalUsers: number;
}

interface StatsSectionProps {
  stats: Stats | null;
  nearbyGamesCount: number;
  isLoading?: boolean;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  nearbyGamesCount,
  isLoading = false,
}) => {
  const text = useTranslator();

  const StatCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    iconColor,
  }: {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    bgColor: string;
    iconColor: string;
  }) => (
    <div className='bg-light-card dark:bg-dark-card p-4 rounded-xl border border-light-border dark:border-dark-border hover:border-light-primary/30 dark:hover:border-dark-primary/30 transition-all'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>{title}</p>
          <p className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary'>
            {value}
          </p>
        </div>
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <StatCard
        title={text.home.your_games}
        value={stats?.userGames || 0}
        icon={Calendar}
        bgColor='bg-blue-50 dark:bg-blue-900/20'
        iconColor='text-blue-500'
      />
      <StatCard
        title={text.home.nearby_games}
        value={nearbyGamesCount}
        icon={MapPin}
        bgColor='bg-green-50 dark:bg-green-900/20'
        iconColor='text-green-500'
      />
      <StatCard
        title={text.home.active_games}
        value={stats?.activeGames || 0}
        icon={TrendingUp}
        bgColor='bg-purple-50 dark:bg-purple-900/20'
        iconColor='text-purple-500'
      />
      <StatCard
        title={text.home.friends_online}
        value={stats?.friendsOnline || 0}
        icon={Users}
        bgColor='bg-orange-50 dark:bg-orange-900/20'
        iconColor='text-orange-500'
      />
    </div>
  );
};

export default StatsSection;
