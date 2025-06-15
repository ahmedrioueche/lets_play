import React from 'react';
import Image from 'next/image';
import { MapPin, Users, Calendar, Clock } from 'lucide-react';
import { Game } from '@/types/explore';

interface GameCardProps {
  game: Game;
  onClick: () => void;
  userLocation: { lat: number; lng: number } | null;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick, userLocation }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Game Image */}
      <div className="relative h-48">
        <Image
          src="/images/game-placeholder.jpg"
          alt={game.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white mb-1">{game.title}</h3>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{game.location}</span>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary">
            <Users className="w-4 h-4" />
            <span>{game.currentPlayers}/{game.maxPlayers} players</span>
          </div>
          <div className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>{game.date}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary">
            <Clock className="w-4 h-4" />
            <span>{game.time}</span>
          </div>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary">
            {game.sport}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameCard; 