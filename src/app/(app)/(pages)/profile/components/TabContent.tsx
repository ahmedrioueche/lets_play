import { motion } from 'framer-motion';
import AchievementsSection from './AchievementsSection';
import DetailedStats from './DetailedStats';
import PerformanceChart from './PerformanceChart';
import QuickStats from './QuickStats';
import RecentGames from './RecentGames';

interface TabContentProps {
  activeTab: 'overview' | 'stats' | 'achievements';
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
    totalPoints: number;
    rank: string;
    level: number;
    experience: number;
    streak: number;
    favoriteSport: string;
    location: string;
  };
  recentGames: Array<{
    id: number;
    sport: string;
    result: 'W' | 'L';
    score: string;
    date: string;
    location: string;
  }>;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, stats, recentGames }) => (
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className='space-y-8'
  >
    {activeTab === 'overview' && (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <QuickStats stats={stats} />
        <RecentGames games={recentGames} />
      </div>
    )}

    {activeTab === 'stats' && (
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <PerformanceChart />
        <DetailedStats stats={stats} />
      </div>
    )}

    {activeTab === 'achievements' && <AchievementsSection />}
  </motion.div>
);

export default TabContent;
