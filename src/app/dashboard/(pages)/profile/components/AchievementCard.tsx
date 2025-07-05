import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
  date?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`p-6 rounded-2xl border-2 transition-all ${
      achievement.earned
        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700'
        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
    }`}
  >
    <div className='flex items-center gap-4 mb-4'>
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          achievement.earned
            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
            : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
        }`}
      >
        <achievement.icon className='w-6 h-6' />
      </div>
      <div>
        <h4
          className={`font-semibold ${
            achievement.earned
              ? 'text-gray-800 dark:text-gray-200'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {achievement.name}
        </h4>
        {achievement.earned && achievement.date && (
          <p className='text-xs text-yellow-600 dark:text-yellow-400 font-medium'>
            Earned {achievement.date}
          </p>
        )}
      </div>
    </div>
    <p
      className={`text-sm ${
        achievement.earned ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      {achievement.description}
    </p>
  </motion.div>
);

export default AchievementCard;
