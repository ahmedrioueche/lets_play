import { Game } from '@/types/game';
import { Clock, MapPin, Users } from 'lucide-react';
import React from 'react';

interface GameCardProps {
  game: Game;
  onClick?: () => void;
}

const SimpleGameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='w-full p-4 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover transition-colors text-left'
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <h3 className='font-medium text-light-text-primary dark:text-dark-text-primary'>
            {game.title}
          </h3>
          {game.description && (
            <p className='mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              {game.description}
            </p>
          )}
        </div>
        <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary ml-4'>
          {game.time}
        </span>
      </div>

      <div className='mt-3 flex items-center gap-4 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
        <div className='flex items-center gap-1'>
          <MapPin className='w-4 h-4' />
          <span>{game.location}</span>
        </div>
        <div className='flex items-center gap-1'>
          <Users className='w-4 h-4' />
          <span>
            {game.currentPlayers}/{game.maxPlayers} players
          </span>
        </div>
        <div className='flex items-center gap-1'>
          <Clock className='w-4 h-4' />
          <span>{game.time}</span>
        </div>
      </div>
    </button>
  );
};

export default SimpleGameCard;
