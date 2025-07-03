import { Game } from '@/types/game';
import { capitalize } from '@/utils/helper';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface GameCardProps {
  game: Game;
  onClick: () => void;
  userLocation: { lat: number; lng: number } | null;
}

const availableSports = [
  'football',
  'american-football',
  'basketball',
  'tennis',
  'volleyball',
  'baseball',
];

const GameCard: React.FC<GameCardProps> = ({ game, onClick, userLocation }) => {
  // Check if the sport exists in our available list
  const sportImageExists = availableSports.includes(game.sport.toLowerCase());
  const imageSrc = sportImageExists
    ? `/images/sports/${game.sport.toLowerCase()}.svg`
    : '/images/fun.svg';

  return (
    <div
      onClick={onClick}
      className='bg-white dark:bg-dark-card rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow'
    >
      {/* Game Image */}
      <div className='relative h-48'>
        <Image
          src={imageSrc}
          alt={game.title}
          fill
          className='object-cover'
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/fun.svg';
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
        <div className='absolute bottom-4 left-4 right-4'>
          <h3 className='text-lg font-semibold text-white mb-1'>{game.title}</h3>
          <div className='flex items-center gap-2 text-white/80'>
            <MapPin className='w-4 h-4' />
            <span className='text-sm'>{game.location}</span>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className='p-4 space-y-3'>
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary'>
            <Users className='w-4 h-4' />
            <span>
              {game.participants.length}/{game.maxParticipants} Participants
            </span>
          </div>
          <span className='px-2 py-1 rounded-full text-xs font-medium bg-light-secondary/10 dark:bg-dark-secondary/10 text-light-secondary dark:text-dark-secondary'>
            {typeof game.organizer === 'string'
              ? capitalize(game.organizer)
              : capitalize(game.organizer.name)}
          </span>
        </div>
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary'>
            <Calendar className='w-4 h-4' />
            <span>{game.date}</span>
          </div>
          <div className='flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary'>
            <Clock className='w-4 h-4' />
            <span>{game.time}</span>
          </div>
        </div>
        <div className='flex items-center justify-between text-sm'>
          <span className='px-2 py-1 rounded-full text-xs font-medium bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary'>
            {game.skillLevel.charAt(0).toUpperCase() + game.skillLevel.slice(1)}
          </span>
          {(game.ageMin || game.ageMax) && (
            <div className='flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              <span>
                {game.ageMin && game.ageMax
                  ? `${game.ageMin}-${game.ageMax} years`
                  : game.ageMin
                    ? `${game.ageMin}+ years`
                    : `Up to ${game.ageMax} years`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
