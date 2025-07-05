import useTranslator from '@/hooks/useTranslator';
import { MessageCircle } from 'lucide-react';
import React from 'react';

interface Player {
  id: string;
  name: string;
  avatar?: string;
  lastPlayed: string;
}

interface PlayedWithSectionProps {
  players: Player[];
  onMessage: (id: string) => void;
}

const PlayedWithSection: React.FC<PlayedWithSectionProps> = ({ players, onMessage }) => {
  const text = useTranslator();

  return players.length === 0 ? null : (
    <div className='flex flex-wrap gap-6'>
      {players.map((player) => (
        <div
          key={player.id}
          className='flex items-center gap-4 rounded-xl p-4 shadow hover:shadow-lg transition-all border border-light-border dark:border-dark-border bg-white/60 dark:bg-gray-900/60 min-w-[220px]'
        >
          <img
            src={player.avatar || '/images/logo.svg'}
            alt={player.name}
            className='w-12 h-12 rounded-full object-cover border-2 border-purple-400 shadow'
          />
          <div className='flex-1'>
            <div className='font-semibold text-light-text-primary dark:text-dark-text-primary'>
              {player.name}
            </div>
            <div className='text-xs text-gray-400 dark:text-gray-500'>{player.lastPlayed}</div>
          </div>
          <button
            className='px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-1 text-sm font-medium transition-colors'
            onClick={() => onMessage(player.id)}
          >
            <MessageCircle className='w-4 h-4' /> {text.friends.message}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PlayedWithSection;
