import GameCard from '@/components/games/GameCard';
import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, MapPin, TrendingUp, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

// Dynamically import GamesMap to avoid SSR issues
const GamesMap = dynamic(() => import('@/components/games/GamesMap'), { ssr: false });

const mockGames: Game[] = [
  {
    _id: '1',
    title: 'Sunset Football',
    location: 'Central Park',
    date: '2024-06-10',
    time: '18:00',
    sport: 'football',
    skillLevel: 'intermediate',
    ageMin: 16,
    ageMax: 35,
    description: 'Join us for a fun football match at sunset!',
    organizer: 'Alex',
    participants: ['Alex', 'Sam', 'Jordan'],
    maxParticipants: 12,
    coordinates: { lat: 40.785091, lng: -73.968285 },
    status: 'open',
    price: 0,
    joinPermission: true,
  },
  {
    _id: '2',
    title: 'Morning Tennis Doubles',
    location: 'Riverside Courts',
    date: '2024-06-11',
    time: '09:00',
    sport: 'tennis',
    skillLevel: 'beginner',
    ageMin: 18,
    ageMax: 50,
    description: 'Casual doubles tennis for all levels.',
    organizer: 'Samira',
    participants: ['Samira', 'Jordan'],
    maxParticipants: 4,
    coordinates: { lat: 40.800678, lng: -73.958889 },
    status: 'open',
    price: 0,
    joinPermission: true,
  },
  {
    _id: '3',
    title: 'Basketball Night',
    location: 'Downtown Gym',
    date: '2024-06-12',
    time: '20:00',
    sport: 'basketball',
    skillLevel: 'advanced',
    ageMin: 21,
    ageMax: 40,
    description: 'Competitive basketball for advanced players.',
    organizer: 'Jordan',
    participants: ['Jordan', 'Alex'],
    maxParticipants: 10,
    coordinates: { lat: 40.712776, lng: -74.005974 },
    status: 'open',
    price: 0,
    joinPermission: true,
  },
  {
    _id: '4',
    title: 'Volleyball Beach',
    location: 'Beach Courts',
    date: '2024-06-13',
    time: '16:00',
    sport: 'volleyball',
    skillLevel: 'intermediate',
    ageMin: 18,
    ageMax: 45,
    description: 'Beach volleyball with ocean views!',
    organizer: 'Maria',
    participants: ['Maria', 'Sam'],
    maxParticipants: 12,
    coordinates: { lat: 40.758896, lng: -73.98513 },
    status: 'open',
    price: 0,
    joinPermission: true,
  },
];

const CommunitySection = () => {
  const t = useTranslator();

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const router = useRouter();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id='community' ref={containerRef} className='relative py-32 px-4 overflow-hidden'>
      {/* Animated Background */}
      <motion.div className='absolute inset-0 opacity-30' style={{ y }}>
        <motion.div
          className='absolute -top-16 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl'
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ repeat: Infinity, duration: 20 }}
        />
        <motion.div
          className='absolute -bottom-20 right-10 w-56 h-56 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full blur-2xl'
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
          }}
          transition={{ repeat: Infinity, duration: 25 }}
        />
        <motion.div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-3xl opacity-20'
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{ repeat: Infinity, duration: 30 }}
        />
      </motion.div>

      {/* Floating Particles */}
      <motion.div className='absolute inset-0 pointer-events-none' style={{ opacity }}>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-white/20 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
            {t.landing?.community_title}
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8'>
            {t.landing?.community_subtitle}
          </p>

          {/* Live Stats */}
          <motion.div
            className='flex flex-wrap justify-center gap-8 mb-12'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {[
              {
                icon: MapPin,
                label: t.landing?.stats_active_games || 'Active Games',
                value: '247',
                color: 'from-blue-500 to-purple-500',
              },
              {
                icon: Users,
                label: t.landing?.stats_online_players || 'Online Players',
                value: '1.2K',
                color: 'from-green-500 to-blue-500',
              },
              {
                icon: Calendar,
                label: t.landing?.stats_todays_events || "Today's Events",
                value: '89',
                color: 'from-pink-500 to-purple-500',
              },
              {
                icon: TrendingUp,
                label: t.landing?.stats_growth_rate || 'Growth Rate',
                value: '+23%',
                color: 'from-yellow-500 to-orange-500',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className='flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20'
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className='w-5 h-5 text-white' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-white'>{stat.value}</div>
                  <div className='text-sm text-gray-300'>{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Interactive Map Section */}
        <div className='relative'>
          {/* Main Map Container */}
          <motion.div
            className='relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900/50 dark:to-blue-900/50'
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: 'spring' }}
            whileHover={{ scale: 1.02 }}
          >
            <GamesMap
              games={mockGames}
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
              userLocation={null}
              allowMapClick={false}
            />

            {/* Desktop Floating Game Cards */}
            <div className='hidden lg:block absolute top-6 left-6 flex flex-col gap-4 z-20'>
              {mockGames.slice(0, 2).map((game, i) => (
                <motion.div
                  key={game._id}
                  initial={{ opacity: 0, x: -50, rotateY: -15 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.2, duration: 0.8, type: 'spring' }}
                  whileHover={{
                    x: 10,
                    rotateY: 5,
                    scale: 1.05,
                  }}
                  className='w-80 border-2 border-white/30 dark:border-gray-700/50 shadow-2xl rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md'
                >
                  <GameCard game={game} onClick={() => setSelectedGame(game)} userLocation={null} />
                </motion.div>
              ))}
            </div>

            <div className='hidden lg:block absolute bottom-6 right-6 z-20'>
              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: 15 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
                whileHover={{
                  x: -10,
                  rotateY: -5,
                  scale: 1.05,
                }}
                className='w-80 border-2 border-white/30 dark:border-gray-700/50 shadow-2xl rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md'
              >
                <GameCard
                  game={mockGames[2]}
                  onClick={() => setSelectedGame(mockGames[2])}
                  userLocation={null}
                />
              </motion.div>
            </div>

            {/* Floating Action Button */}
            <motion.div
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30'
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5, duration: 0.8, type: 'spring' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className='w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl cursor-pointer border-4 border-white/30'>
                <MapPin className='w-6 h-6 md:w-8 md:h-8 text-white' />
              </div>
            </motion.div>

            {/* Animated Game Markers */}
            {mockGames.map((game, i) => (
              <motion.div
                key={game._id}
                className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full shadow-lg z-10`}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + i,
                  delay: i * 0.5,
                }}
              >
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-r ${
                    i === 0
                      ? 'from-blue-500 to-purple-500'
                      : i === 1
                        ? 'from-green-500 to-blue-500'
                        : i === 2
                          ? 'from-pink-500 to-purple-500'
                          : 'from-yellow-500 to-orange-500'
                  }`}
                />
                <div
                  className={`absolute -top-1 -left-1 w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-r ${
                    i === 0
                      ? 'from-blue-500/30 to-purple-500/30'
                      : i === 1
                        ? 'from-green-500/30 to-blue-500/30'
                        : i === 2
                          ? 'from-pink-500/30 to-purple-500/30'
                          : 'from-yellow-500/30 to-orange-500/30'
                  } animate-ping`}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Game Cards - Stacked below map */}
          <div className='lg:hidden mt-8 space-y-4'>
            {mockGames.map((game, i) => (
              <motion.div
                key={game._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className='w-full border-2 border-white/30 dark:border-gray-700/50 shadow-xl rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md overflow-hidden'
              >
                <GameCard game={game} onClick={() => setSelectedGame(game)} userLocation={null} />
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className='text-center mt-12'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <motion.button
              className='inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-xl cursor-pointer'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/auth/signup')}
            >
              <MapPin className='w-5 h-5' />
              {t.landing?.explore_more_games}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
