import { useAuth } from '@/context/AuthContext';
import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';
import { useRouter } from 'next/navigation';

interface ActionButtonsProps {
  game: Game;
  mode: 'explore' | 'games';
  isRegistered: boolean;
  hasJoinRequest?: boolean;
  onRegister: () => void;
  onCancelRegistration?: (gameId: string) => void;
  onCancelGame?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  game,
  mode,
  isRegistered,
  hasJoinRequest = false,
  onRegister,
  onCancelRegistration,
  onCancelGame,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslator();

  // Support both string and User object for user
  const userId = typeof user === 'string' ? user : user?._id;
  const organizerId = typeof game.organizer === 'string' ? game.organizer : game.organizer?._id;
  const isOrganizer = userId === organizerId;

  if (mode === 'games') {
    // Games mode - user is managing their games
    if (isOrganizer) {
      return (
        <div className='pt-4 space-y-3'>
          <div className='text-center py-2 text-light-text-secondary dark:text-dark-text-secondary'>
            {t.game_details.you_are_organizer}
          </div>
          <button
            onClick={() => router.push(`/dashboard/games/${game._id}/audit`)}
            className='w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-colors'
          >
            {t.game_details.manage_game}
          </button>
          {onCancelGame && (
            <button
              onClick={onCancelGame}
              className='w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-medium transition-colors'
            >
              {t.game_details.cancel_game}
            </button>
          )}
        </div>
      );
    } else {
      // User is registered for this game but not the organizer
      return (
        <div className='pt-4 space-y-3'>
          <div className='text-center py-2 text-light-text-secondary dark:text-dark-text-secondary'>
            {t.game_details.you_are_registered}
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
                onCancelRegistration(gameId);
              }}
              className='w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-medium transition-colors'
            >
              {t.game_details.cancel_registration}
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
            {t.game_details.you_are_organizer}
          </div>
          <button
            onClick={() => router.push(`/dashboard/games/${game._id}/audit`)}
            className='w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-colors'
          >
            {t.game_details.manage_game}
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
                onCancelRegistration(gameId);
              }}
              className='w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-medium transition-colors'
            >
              {t.game_details.cancel_registration}
            </button>
          )}
        </div>
      );
    } else {
      return (
        <div className='pt-4 space-y-3'>
          {/* Join Permission Notice */}
          {game.joinPermission && (
            <div className='text-center py-2 text-light-text-secondary dark:text-dark-text-secondary text-sm'>
              {t.game.join_permission_required}
            </div>
          )}

          {/* Join Request Status */}
          {hasJoinRequest && (
            <div className='text-center py-2 text-blue-600 dark:text-blue-400 text-sm'>
              {t.game.join_request_pending}
            </div>
          )}

          {hasJoinRequest ? (
            <button
              onClick={async () => {
                if (!userId) return;
                try {
                  const res = await fetch(`/api/games/${game._id}/join-request`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                  });
                  if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to cancel join request');
                  }
                  // Remove userId from joinRequests in local state (handled by parent)
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(
                      new CustomEvent('joinRequestCancelled', {
                        detail: { gameId: game._id, userId },
                      })
                    );
                  }
                } catch (error: any) {
                  alert(error.message || 'Failed to cancel join request');
                }
              }}
              className='w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-medium transition-colors'
            >
              {t.game.cancel_join_request || 'Cancel Request'}
            </button>
          ) : (
            <button
              onClick={onRegister}
              disabled={game.participants.length >= game.maxParticipants}
              className='w-full bg-light-primary dark:bg-dark-primary hover:opacity-90 text-white rounded-xl py-3 font-medium transition-opacity disabled:opacity-50'
            >
              {game.participants.length >= game.maxParticipants
                ? t.game_details.game_full
                : game.joinPermission
                  ? t.game.join_request
                  : t.game.join}
            </button>
          )}
        </div>
      );
    }
  }
};

export default ActionButtons;
