import useTranslator from '@/hooks/useTranslator';
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
  mode: 'explore' | 'games';
  isRegistered: boolean;
  hasJoinRequest?: boolean;
  onClose: () => void;
  onRegister: () => void;
  onCancelRegistration?: (gameId: string) => void;
  onCancelGame?: () => void;
}

const GameDetailsView: React.FC<GameDetailsViewProps> = ({
  game,
  mode,
  isRegistered,
  hasJoinRequest = false,
  onClose,
  onRegister,
  onCancelRegistration,
  onCancelGame,
}) => {
  const t = useTranslator();
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
        <OrganizerSection game={game} organizer={organizer} />

        {/* Description */}
        {game.description && (
          <div>
            <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
              {t.game_details.about}
            </h3>
            <p className='text-light-text-secondary dark:text-dark-text-secondary leading-relaxed'>
              {game.description}
            </p>
          </div>
        )}

        <MapSection game={game} />

        {/* Participants List */}
        <div>
          <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
            {t.game_details.participants}
          </h3>
          {organizer && (
            <ParticipantsList
              participants={participants.filter(
                (p): p is User => typeof p === 'object' && '_id' in p
              )}
              organizer={organizer}
            />
          )}
        </div>

        <ActionButtons
          game={game}
          mode={mode}
          isRegistered={isRegistered}
          hasJoinRequest={hasJoinRequest}
          onRegister={onRegister}
          onCancelRegistration={onCancelRegistration}
          onCancelGame={onCancelGame}
        />
      </div>
    </>
  );
};

export default GameDetailsView;
