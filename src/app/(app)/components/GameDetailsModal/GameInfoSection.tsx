import { Game } from '@/types/game';
import { Calendar, Clock, User, Users } from 'lucide-react';

interface GameInfoSectionProps {
  game: Game;
}

const GameInfoSection: React.FC<GameInfoSectionProps> = ({ game }) => (
  <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 py-4 bg-light-hover/50 dark:bg-dark-hover/50 rounded-xl'>
    <div className='flex items-center gap-3'>
      <div className='p-2 bg-white dark:bg-dark-card rounded-lg'>
        <Users className='w-5 h-5 text-light-primary dark:text-dark-primary' />
      </div>
      <div>
        <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          Participants
        </p>
        <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
          {game.participants.length}/{game.maxParticipants}
        </p>
      </div>
    </div>
    <div className='flex items-center gap-3'>
      <div className='p-2 bg-white dark:bg-dark-card rounded-lg'>
        <Calendar className='w-5 h-5 text-light-primary dark:text-dark-primary' />
      </div>
      <div>
        <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>Date</p>
        <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
          {game.date}
        </p>
      </div>
    </div>
    <div className='flex items-center gap-3'>
      <div className='p-2 bg-white dark:bg-dark-card rounded-lg'>
        <Clock className='w-5 h-5 text-light-primary dark:text-dark-primary' />
      </div>
      <div>
        <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>Time</p>
        <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
          {game.time}
        </p>
      </div>
    </div>
    <div className='flex items-center gap-3'>
      <div className='p-2 bg-white dark:bg-dark-card rounded-lg'>
        <User className='w-5 h-5 text-light-primary dark:text-dark-primary' />
      </div>
      <div>
        <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          Skill Level
        </p>
        <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
          {game.skillLevel.charAt(0).toUpperCase() + game.skillLevel.slice(1)}
        </p>
      </div>
    </div>

    {/* Age Range */}
    {(game.ageMin || game.ageMax) && (
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-white dark:bg-dark-card rounded-lg'>
          <svg
            className='w-5 h-5 text-light-primary dark:text-dark-primary'
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
        </div>
        <div>
          <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
            Age Range
          </p>
          <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
            {game.ageMin && game.ageMax
              ? `${game.ageMin}-${game.ageMax} years`
              : game.ageMin
                ? `${game.ageMin}+ years`
                : `Up to ${game.ageMax} years`}
          </p>
        </div>
      </div>
    )}
  </div>
);

export default GameInfoSection;
