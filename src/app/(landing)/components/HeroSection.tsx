import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Rocket, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
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
];

const HeroSection = () => {
  const t = useTranslator();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className='relative flex items-center justify-center min-h-screen py-24 px-4 overflow-hidden'
    >
      {/* Background Elements */}
      <motion.div className='absolute inset-0 opacity-30' style={{ y }}>
        <div className='absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl' />
        <div className='absolute top-40 right-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl' />
        <div className='absolute bottom-20 left-1/4 w-40 h-40 bg-pink-400/20 rounded-full blur-xl' />
      </motion.div>

      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10'>
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className='text-left space-y-8'
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className='space-y-4'
          >
            <h1 className='text-5xl lg:text-7xl font-extrabold leading-tight text-center md:text-left'>
              <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                {t.app.slogan.split('.')[0]}
              </span>
              <br />
              <span className='bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent'>
                {t.app.slogan.split('.')[1]}
              </span>
              <br />
              <span className='bg-gradient-to-r from-pink-600 via-blue-600 to-purple-600 bg-clip-text text-transparent'>
                {t.app.slogan.split('.')[2]}
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className='text-xl lg:text-2xl text-gray-700 dark:text-gray-200 leading-relaxed text-center md:text-left'
          >
            {t.landing?.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className='flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-300 justify-center md:justify-start'
          >
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5 text-blue-500' />
              <span>{t.landing?.stats_active_players}</span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin className='w-5 h-5 text-purple-500' />
              <span>{t.landing?.stats_cities}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='w-5 h-5 text-pink-500' />
              <span>{t.landing?.stats_daily_games}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className='flex flex-col sm:flex-row gap-4'
          >
            <Link
              href='/auth/signup'
              className='inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400/50'
              aria-label={t.landing?.cta}
            >
              {t.landing?.cta}
              <Rocket className='w-6 h-6' />
            </Link>
            <Link
              href='/auth/login'
              className='inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-400/50'
            >
              <ArrowRight className='w-6 h-6' />
              {t.landing?.login}
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side - Interactive Map */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className='relative h-[500px] lg:h-[600px]'
        >
          {/* Map Container */}
          <div className='relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900/50 dark:to-blue-900/50'>
            <GamesMap
              games={mockGames}
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
              userLocation={null}
              allowMapClick={false}
            />

            {/* Floating Game Cards */}
            <motion.div
              className='absolute top-10 right-10 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 shadow-xl backdrop-blur-sm border border-white/20'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className='flex items-center gap-3'>
                <div className='w-3 h-3 bg-green-500 rounded-full' />
                <div className='text-sm font-semibold text-gray-800 dark:text-white'>
                  {t.landing?.floating_card_football}
                </div>
              </div>
              <div className='text-xs text-gray-600 dark:text-gray-300 mt-1'>
                {t.landing?.floating_card_location_central_park}
              </div>
            </motion.div>

            <motion.div
              className='absolute bottom-10 left-10 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 shadow-xl backdrop-blur-sm border border-white/20'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <div className='flex items-center gap-3'>
                <div className='w-3 h-3 bg-blue-500 rounded-full' />
                <div className='text-sm font-semibold text-gray-800 dark:text-white'>
                  {t.landing?.floating_card_basketball}
                </div>
              </div>
              <div className='text-xs text-gray-600 dark:text-gray-300 mt-1'>
                {t.landing?.floating_card_location_downtown_gym}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        style={{ opacity }}
      >
        <span className='text-gray-400 dark:text-gray-500 text-sm mb-2'>
          {t.landing?.scroll_down || 'Scroll Down'}
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className='w-6 h-6 rounded-full border-2 border-blue-400 flex items-center justify-center'
        >
          <span className='block w-2 h-2 rounded-full bg-blue-400' />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
