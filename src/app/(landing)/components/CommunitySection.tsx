import GameCard from '@/components/games/GameCard';
import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';
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
  const router = useRouter();

  return (
    <section id='community' ref={containerRef} className='relative py-32 px-4 overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 opacity-30'>
        <div className='absolute -top-16 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl animate-pulse' />
        <div
          className='absolute -bottom-20 right-10 w-56 h-56 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full blur-2xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-3xl opacity-20 animate-pulse'
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Floating Particles */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-white/20 rounded-full animate-float'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-16 animate-fade-in-up'>
          <h2 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
            {t.landing?.community_title}
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8'>
            {t.landing?.community_subtitle}
          </p>

          {/* Live Stats */}
          <div className='flex flex-wrap justify-center gap-8 mb-12 animate-fade-in-up delay-300'>
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
                label: t.landing?.stats_growth || 'Growth',
                value: '+23%',
                color: 'from-yellow-500 to-orange-500',
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className='text-center animate-fade-in-up'
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <Icon className='w-8 h-8 text-white' />
                  </div>
                  <div className='text-3xl font-bold text-gray-800 dark:text-white mb-2'>
                    {stat.value}
                  </div>
                  <div className='text-gray-600 dark:text-gray-300 text-sm font-medium'>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Left Column - Map */}
          <div className='animate-fade-in-up delay-600'>
            <div className='relative bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl'>
              <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl' />
              <div className='relative z-10'>
                <h3 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
                  {t.landing?.community_map_title || 'Live Game Map'}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 mb-6'>
                  {t.landing?.community_map_description ||
                    'Discover games happening right now in your area. Click on any marker to see details and join instantly.'}
                </p>
                <div className='h-96 rounded-2xl overflow-hidden border border-white/20'>
                  <GamesMap games={mockGames} onGameSelect={setSelectedGame} selectedGame={null} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Games */}
          <div className='animate-fade-in-up delay-800'>
            <div className='space-y-6'>
              <div>
                <h3 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
                  {t.landing?.community_recent_games || 'Recent Games'}
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  {t.landing?.community_recent_games_description ||
                    'Check out the latest games created by our community members.'}
                </p>
              </div>

              <div className='space-y-4'>
                {mockGames.slice(0, 3).map((game, index) => (
                  <div
                    key={game._id}
                    className='animate-fade-in-up'
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <GameCard game={game} onClick={() => {}} userLocation={null} />
                  </div>
                ))}
              </div>

              <div className='text-center pt-6'>
                <button
                  onClick={() => router.push('/dashboard/explore')}
                  className='inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95'
                >
                  <MapPin className='w-5 h-5' />
                  {t.landing?.community_explore_all || 'Explore All Games'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className='text-center mt-20 animate-fade-in-up delay-1000'>
          <div className='bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20'>
            <h3 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
              {t.landing?.community_join_title || 'Ready to Join the Community?'}
            </h3>
            <p className='text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto'>
              {t.landing?.community_join_description ||
                'Create your first game or join an existing one. Connect with players who share your passion for sports.'}
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={() => router.push('/dashboard/create')}
                className='inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95'
              >
                <Calendar className='w-5 h-5' />
                {t.landing?.community_create_game || 'Create Game'}
              </button>
              <button
                onClick={() => router.push('/dashboard/explore')}
                className='inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95'
              >
                <Users className='w-5 h-5' />
                {t.landing?.community_find_games || 'Find Games'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-8px);
            opacity: 0.6;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .delay-300 {
          animation-delay: 0.3s;
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
      `}</style>
    </section>
  );
};

export default CommunitySection;
