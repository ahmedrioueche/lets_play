'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Users, Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import GamesMap from '@/components/games/GamesMap';
import { Game } from '@/types/explore';

// Mock data for testing
const mockGame: Game = {
  id: '1',
  title: 'Weekend Football Match',
  description: 'Casual football game for all skill levels. Join us for a fun afternoon of football! All skill levels are welcome. We\'ll split into teams based on skill level to ensure everyone has a good time.',
  location: 'Central Park',
  coordinates: { lat: 40.7829, lng: -73.9654 },
  date: '2024-03-20',
  time: '15:00',
  currentPlayers: 8,
  maxPlayers: 10,
  status: 'open',
  sport: 'football',
  skillLevel: 'intermediate',
  organizer: {
    id: '1',
    name: 'John Doe',
    avatar: '/images/avatars/john.jpg',
  },
  price: 5,
};

const GameDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleJoin = () => {
    // TODO: Implement join game functionality
    console.log('Joining game:', mockGame.id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Explore</span>
        </button>

        {/* Game Image */}
        <div className="relative h-[300px] rounded-2xl overflow-hidden">
          <Image
            src="/images/game-placeholder.jpg"
            alt={mockGame.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-2xl font-bold text-white mb-2">{mockGame.title}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{mockGame.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{mockGame.currentPlayers}/{mockGame.maxPlayers} players</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                About the Game
              </h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                {mockGame.description}
              </p>
            </div>

            {/* Game Details */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Game Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                  <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Date
                    </p>
                    <p className="text-light-text-primary dark:text-dark-text-primary">
                      {mockGame.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                  <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Time
                    </p>
                    <p className="text-light-text-primary dark:text-dark-text-primary">
                      {mockGame.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                  <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Players
                    </p>
                    <p className="text-light-text-primary dark:text-dark-text-primary">
                      {mockGame.currentPlayers}/{mockGame.maxPlayers}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                  <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Location
                    </p>
                    <p className="text-light-text-primary dark:text-dark-text-primary">
                      {mockGame.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Location
              </h2>
              <div className="h-[300px] rounded-lg overflow-hidden">
                <GamesMap
                  games={[mockGame]}
                  selectedGame={mockGame}
                  onGameSelect={() => {}}
                  userLocation={null}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Organizer
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={mockGame.organizer.avatar}
                    alt={mockGame.organizer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                    {mockGame.organizer.name}
                  </p>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Organizer
                  </p>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <button
              onClick={handleJoin}
              className="w-full py-3 px-6 bg-light-primary dark:bg-dark-primary text-white rounded-xl font-medium hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 transition-colors"
            >
              Join Game - ${mockGame.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage; 