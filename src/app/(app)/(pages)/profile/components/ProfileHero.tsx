import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { BadgeCheck, Camera, Edit3, MapPin, Settings, Star, Trophy, User } from 'lucide-react';

interface ProfileHeroProps {
  stats: {
    rank: string;
    level: number;
    experience: number;
    location: string;
  };
}

const ProfileHero: React.FC<ProfileHeroProps> = ({ stats }) => {
  const { user } = useAuth();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='relative mb-8'
      >
        {/* Background Pattern */}
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl'></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg  rounded-3xl"></div>
        <div className='relative p-8 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20'>
          <div className='flex flex-col lg:flex-row items-center gap-8'>
            {/* Profile Image */}
            <motion.div whileHover={{ scale: 1.05 }} className='relative group'>
              <div className='w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1'>
                <div className='w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden'>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className='w-full h-full object-cover' />
                  ) : (
                    <User className='w-16 h-16 text-gray-400' />
                  )}
                </div>
              </div>
              <button className='absolute bottom-0 right-0 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors'>
                <Camera className='w-5 h-5' />
              </button>
            </motion.div>

            {/* Profile Info */}
            <div className='flex-1 text-center lg:text-left'>
              <div className='flex items-center justify-center lg:justify-start gap-3 mb-4'>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  {user?.name || 'Player Name'}
                </h1>
                <BadgeCheck className='w-6 h-6 text-blue-500' />
              </div>

              <div className='flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 text-sm text-gray-600 dark:text-gray-300'>
                <div className='flex items-center gap-2'>
                  <MapPin className='w-4 h-4' />
                  <span>{stats.location}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Trophy className='w-4 h-4' />
                  <span>{stats.rank} Rank</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Star className='w-4 h-4' />
                  <span>Level {stats.level}</span>
                </div>
              </div>

              {/* Level Progress */}
              <div className='mb-6'>
                <div className='flex justify-between text-sm mb-2'>
                  <span>Experience</span>
                  <span>{stats.experience}%</span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.experience}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full'
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-wrap gap-3 justify-center lg:justify-start'>
                <button className='px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2'>
                  <Edit3 className='w-4 h-4' />
                  Edit Profile
                </button>
                <button className='px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors flex items-center gap-2'>
                  <Settings className='w-4 h-4' />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProfileHero;
