import { BadgeCheck, Heart, Target, Trophy, Users, Zap } from 'lucide-react';
import AchievementCard from './AchievementCard';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
  date?: string;
}

const AchievementsSection: React.FC = () => {
  const achievements: Achievement[] = [
    {
      id: 1,
      name: 'First Victory',
      description: 'Win your first game',
      icon: Trophy,
      earned: true,
      date: '2024-01-15',
    },
    {
      id: 2,
      name: 'Team Player',
      description: 'Play 10 games with different teams',
      icon: Users,
      earned: true,
      date: '2024-02-03',
    },
    {
      id: 3,
      name: 'Unstoppable',
      description: 'Win 5 games in a row',
      icon: Zap,
      earned: true,
      date: '2024-02-20',
    },
    {
      id: 4,
      name: 'Century Club',
      description: 'Score 100 points in a single game',
      icon: Target,
      earned: false,
    },
    {
      id: 5,
      name: 'Social Butterfly',
      description: 'Play with 50 different players',
      icon: Heart,
      earned: false,
    },
    {
      id: 6,
      name: 'Elite Player',
      description: 'Reach Diamond rank',
      icon: BadgeCheck,
      earned: false,
    },
  ];

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700'>
      <h3 className='text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200'>Achievements</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;
