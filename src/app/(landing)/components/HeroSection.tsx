import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';
import { ArrowRight, Calendar, MapPin, Rocket, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';

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
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <section className='relative flex items-center justify-center min-h-screen py-24 px-4 overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0 opacity-30 animate-pulse'>
        <div className='absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl' />
        <div className='absolute top-40 right-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl' />
        <div className='absolute bottom-20 left-1/4 w-40 h-40 bg-pink-400/20 rounded-full blur-xl' />
      </div>

      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10'>
        {/* Left Side - Text Content */}
        <div className='text-left space-y-8 animate-fade-in-left'>
          <div className='space-y-4 animate-fade-in-up delay-200'>
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
          </div>

          <p className='text-xl lg:text-2xl text-gray-700 dark:text-gray-200 leading-relaxed text-center md:text-left animate-fade-in-up delay-400'>
            {t.landing?.hero_subtitle}
          </p>

          <div className='flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-300 justify-center md:justify-start animate-fade-in-up delay-600'>
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
          </div>

          <div className='flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-800'>
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
          </div>
        </div>

        {/* Right Side - Interactive Map */}
        <div className='relative h-[500px] lg:h-[600px] animate-fade-in-right delay-300'>
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
            <div className='absolute top-10 right-10 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 shadow-xl backdrop-blur-sm border border-white/20 animate-fade-in-scale delay-1000'>
              <div className='flex items-center gap-3'>
                <div className='w-3 h-3 bg-green-500 rounded-full' />
                <div className='text-sm font-semibold text-gray-800 dark:text-white'>
                  {t.landing?.floating_card_football}
                </div>
              </div>
              <div className='text-xs text-gray-600 dark:text-gray-300 mt-1'>
                {t.landing?.floating_card_location_central_park}
              </div>
            </div>

            <div className='absolute bottom-10 left-10 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 shadow-xl backdrop-blur-sm border border-white/20 animate-fade-in-scale delay-1500'>
              <div className='flex items-center gap-3'>
                <div className='w-3 h-3 bg-blue-500 rounded-full' />
                <div className='text-sm font-semibold text-gray-800 dark:text-white'>
                  {t.landing?.floating_card_basketball}
                </div>
              </div>
              <div className='text-xs text-gray-600 dark:text-gray-300 mt-1'>
                {t.landing?.floating_card_location_downtown_gym}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-fade-in-up delay-1500'>
        <span className='text-gray-400 dark:text-gray-500 text-sm mb-2'>
          {t.landing?.scroll_down || 'Scroll Down'}
        </span>
        <div className='w-6 h-6 rounded-full border-2 border-blue-400 flex items-center justify-center animate-bounce'>
          <span className='block w-2 h-2 rounded-full bg-blue-400' />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.8s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-800 {
          animation-delay: 0.8s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-1500 {
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
