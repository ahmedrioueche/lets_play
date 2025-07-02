import { Game, SportType } from '@/types/game';
import React from 'react';

interface MyGameCardProps {
  game: Game;
  isOrganizer?: boolean;
}

const sportIcons: Record<SportType, string> = {
  football: '/images/markers/football.svg',
  basketball: '/images/markers/basketball.svg',
  tennis: '/images/markers/tennis.svg',
  volleyball: '/images/markers/volleyball.svg',
  badminton: '/images/markers/tennis.svg', // fallback
};

export const MyGameCard: React.FC<MyGameCardProps> = ({ game, isOrganizer }) => {
  return (
    <div className='bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-light-border/30 dark:border-dark-border/30 hover:shadow-2xl transition'>
      <div className='flex items-center gap-4'>
        <img
          src={sportIcons[game.sport as SportType]}
          alt={game.sport}
          className='w-12 h-12 object-contain rounded-full border border-gray-200 dark:border-gray-700 bg-light-hover/30 dark:bg-dark-hover/30'
        />
        <div className='flex-1'>
          <h3 className='text-xl font-bold text-light-text-primary dark:text-dark-text-primary'>
            {game.title}
          </h3>
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-xs px-2 py-1 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary font-semibold'>
              {game.sport.charAt(0).toUpperCase() + game.sport.slice(1)}
            </span>
            <span className='text-xs px-2 py-1 rounded-full bg-light-success/10 dark:bg-dark-success/10 text-light-success dark:text-dark-success font-semibold'>
              {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
            </span>
          </div>
        </div>
        {isOrganizer && (
          <span className='ml-2 px-3 py-1 rounded-full bg-light-warning/10 dark:bg-dark-warning/10 text-light-warning dark:text-dark-warning text-xs font-semibold'>
            Organizer
          </span>
        )}
      </div>
      <div className='flex items-center gap-4 text-light-text-secondary dark:text-dark-text-secondary text-sm'>
        <span>
          <i className='fa-regular fa-calendar mr-1' />
          {game.date} {game.time}
        </span>
        <span>
          <i className='fa-regular fa-location-dot mr-1' />
          {game.location || 'No location'}
        </span>
        <span>
          <i className='fa-regular fa-users mr-1' />
          {game.participants.length}/{game.maxParticipants} participants
        </span>
      </div>
      <div className='flex items-center gap-3 mt-2'>
        <img
          src={
            typeof game.organizer === 'object' && 'avatar' in game.organizer
              ? game.organizer.avatar || '/images/avatars/default.jpg'
              : '/images/avatars/default.jpg'
          }
          alt={
            typeof game.organizer === 'object' && 'name' in game.organizer
              ? game.organizer.name
              : 'Organizer'
          }
          className='w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700'
        />
        <span className='text-sm text-light-text-primary dark:text-dark-text-primary font-medium'>
          {typeof game.organizer === 'object' && 'name' in game.organizer
            ? game.organizer.name
            : 'Organizer'}
        </span>
      </div>
    </div>
  );
};

export default MyGameCard;
