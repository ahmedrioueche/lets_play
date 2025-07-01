import { useAuth } from '@/context/AuthContext';
import { Game } from '@/types/game';
import { useRouter } from 'next/navigation';

interface ActionButtonsProps {
  game: Game;
  mode: 'explore' | 'games';
  isRegistered: boolean;
  onRegister: () => void;
  onCancelRegistration?: (gameId: string, userId: string) => Promise<void>;
  onCancelGame?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  game,
  mode,
  isRegistered,
  onRegister,
  onCancelRegistration,
  onCancelGame,
}) => {
  const { user } = useAuth();
  const router = useRouter();

  const isOrganizer = user?._id === game.organizer._id;

  if (mode === 'games') {
    // Games mode - user is managing their games
    if (isOrganizer) {
      return (
        <div className='pt-4 space-y-3'>
          <div className='text-center py-2 text-light-text-secondary dark:text-dark-text-secondary'>
            You're the organizer of this game.
          </div>
          <button
            onClick={() => router.push(`/games`)}
            className='w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-colors'
          >
            Manage Game
          </button>
          {onCancelGame && (
            <button
              onClick={onCancelGame}
              className='w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-medium transition-colors'
            >
              Cancel Game
            </button>
          )}
        </div>
      );
    } else {
      // User is registered for this game but not the organizer
      return (
        <div className='pt-4 space-y-3'>
          <div className='text-center py-2 text-light-text-secondary dark:text-dark-text-secondary'>
            You're registered for this game.
          </div>
          {onCancelRegistration && (
            <button
              onClick={() => {
                // Use _id as fallback if id is not available
                const gameId = game.id || (game as any)._id;
                if (!gameId) {
                  console.error('Game ID not found in ActionButtons');
                  return;
                }
                onCancelRegistration(gameId, user?._id || '');
              }}
              className='w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-medium transition-colors'
            >
              Cancel Registration
            </button>
          )}
        </div>
      );
    }
  } else {
    // Explore mode - user can register for games
    if (isOrganizer) {
      return (
        <div className='pt-4 space-y-3'>
          <div className='text-center py-2 text-light-text-secondary dark:text-dark-text-secondary'>
            You're the organizer of this game.
          </div>
          <button
            onClick={() => router.push(`/games`)}
            className='w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-colors'
          >
            Manage Game
          </button>
        </div>
      );
    } else if (isRegistered) {
      return (
        <div className='pt-4 space-y-3'>
          {onCancelRegistration && (
            <button
              onClick={() => {
                // Use _id as fallback if id is not available
                const gameId = game.id || (game as any)._id;
                if (!gameId) {
                  console.error('Game ID not found in ActionButtons');
                  return;
                }
                onCancelRegistration(gameId, user?._id || '');
              }}
              className='w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-medium transition-colors'
            >
              Cancel Registration
            </button>
          )}
        </div>
      );
    } else {
      return (
        <div className='pt-4 space-y-3'>
          <button
            onClick={onRegister}
            disabled={game.currentPlayers >= game.maxPlayers}
            className='w-full bg-light-primary dark:bg-dark-primary hover:opacity-90 text-white rounded-xl py-3 font-medium transition-opacity disabled:opacity-50'
          >
            {game.currentPlayers >= game.maxPlayers ? 'Game Full' : 'Register for Game'}
          </button>
        </div>
      );
    }
  }
};

export default ActionButtons;
