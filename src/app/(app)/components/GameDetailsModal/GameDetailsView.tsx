import { Game } from '@/types/game';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import ActionButtons from './ActionButtons';
import GameInfoSection from './GameInfoSection';
import MapSection from './MapSection';
import ModalHeader from './ModalHeader';
import OrganizerSection from './OrganizerSection';
import ParticipantsList from './ParticipantsList';

interface GameDetailsViewProps {
  game: Game;
  userLocation: { lat: number; lng: number } | null;
  mode: 'explore' | 'games';
  isRegistered: boolean;
  onClose: () => void;
  onRegister: () => void;
  onCancelRegistration?: (gameId: string, userId: string) => Promise<void>;
  onCancelGame?: () => void;
}

const GameDetailsView: React.FC<GameDetailsViewProps> = ({
  game,
  userLocation,
  mode,
  isRegistered,
  onClose,
  onRegister,
  onCancelRegistration,
  onCancelGame,
}) => {
  const [organizer, setOrganizer] = useState<User | null>(null);
  const [participants, setParticipants] = useState(game.participants || []);

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        // Organizer should always be a populated User object from the API
        if (game.organizer && typeof game.organizer === 'object' && '_id' in game.organizer) {
          setOrganizer(game.organizer as User);
        }
      } catch (error) {
        console.error('Error setting organizer:', error);
        setOrganizer(null);
      }
    };
    fetchOrganizer();
  }, [game.organizer]);

  useEffect(() => {
    setParticipants(game.participants || []);
  }, [game.participants]);

  return (
    <>
      <ModalHeader game={game} onClose={onClose} />

      <div className='p-6 py-2 space-y-6'>
        <GameInfoSection game={game} />
        {/* Participants List */}
        <div>
          <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
            Participants
          </h3>
          <ParticipantsList participants={participants} />
        </div>
        {/* Description */}
        <div>
          <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
            About
          </h3>
          <p className='text-light-text-secondary dark:text-dark-text-secondary leading-relaxed'>
            {game.description}
          </p>
        </div>

        <MapSection game={game} userLocation={userLocation} />
        <OrganizerSection game={game} organizer={organizer} />

        <ActionButtons
          game={game}
          mode={mode}
          isRegistered={isRegistered}
          onRegister={onRegister}
          onCancelRegistration={onCancelRegistration}
          onCancelGame={onCancelGame}
        />
      </div>
    </>
  );
};

export default GameDetailsView;
