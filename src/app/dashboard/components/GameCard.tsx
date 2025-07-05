import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';
import { capitalize } from '@/utils/helper';
import { ArrowRight, Calendar, Users } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const text = useTranslator();

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'basketball':
        return '/images/sports/basketball.svg';
      case 'football':
        return '/images/sports/football.svg';
      case 'tennis':
        return '/images/sports/tennis.svg';
      case 'volleyball':
        return '/images/sports/volleyball.svg';
      default:
        return '/images/sports/football.svg';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'intermediate':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'advanced':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getSkillLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return text.game.skill_levels.beginner;
      case 'intermediate':
        return text.game.skill_levels.intermediate;
      case 'advanced':
        return text.game.skill_levels.advanced;
      default:
        return capitalize(level);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  };

  return (
    <div
      className='bg-light-card dark:bg-dark-card p-4 rounded-xl border border-light-border dark:border-dark-border hover:border-light-primary/30 dark:hover:border-dark-primary/30 transition-all cursor-pointer group'
      onClick={() => onClick(game)}
    >
      <div className='flex items-start gap-3'>
        <Image
          src={getSportIcon(game.sport)}
          alt={game.sport}
          width={20}
          height={20}
          className='w-5 h-5 mt-0.5'
        />
        <div className='flex-1 min-w-0'>
          <h4 className='font-medium text-light-text-primary dark:text-dark-text-primary truncate text-sm group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors'>
            {game.title}
          </h4>
          <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary truncate'>
            {game.location}
          </p>
          <div className='flex items-center gap-3 mt-2'>
            <span className='flex items-center gap-1 text-xs text-light-text-muted dark:text-dark-text-muted'>
              <Calendar className='w-3 h-3' />
              {formatDate(game.date)}
            </span>
            <span className='flex items-center gap-1 text-xs text-light-text-muted dark:text-dark-text-muted'>
              <Users className='w-3 h-3' />
              {game.currentPlayers}/{game.maxPlayers}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSkillLevelColor(game.skillLevel)}`}
            >
              {getSkillLevelText(game.skillLevel)}
            </span>
          </div>
        </div>
        <ArrowRight className='w-4 h-4 text-light-text-muted dark:text-dark-text-muted group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors flex-shrink-0' />
      </div>
    </div>
  );
};

export default GameCard;
