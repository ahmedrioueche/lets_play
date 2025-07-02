import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import useTranslator from '@/hooks/useTranslator';
import { User } from '@/types/user';
import { capitalize } from '@/utils/helper';
import { BadgeCheck, Clock, MessageCircle, Trash, UserPlus } from 'lucide-react';

interface UserCardProps {
  user: User;
  relationship: 'friend' | 'pending' | 'not_friend' | 'self';
  onAddFriend: (id: string) => void;
  onMessage: (id: string) => void;
  onCardClick?: (id: string) => void;
  onRequestRemove?: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  relationship,
  onAddFriend,
  onMessage,
  onCardClick,
  onRequestRemove,
}) => {
  const text = useTranslator();
  const locationString = user.location?.address || '';
  const { user: currentUser } = useAuth();

  return (
    <div
      className={`relative rounded-2xl bg-light-card dark:bg-dark-card overflow-hidden shadow-lg hover:shadow-xl transition-all
      flex flex-col items-center p-6 border border-light-border dark:border-dark-border w-full max-w-md mx-auto
      bg-white/80 dark:bg-gray-900/80 cursor-pointer hover:scale-[1.02] animate-fade-in`}
      onClick={() => onCardClick?.(user._id)}
    >
      {/* Online status badge */}
      {user.isOnline && (
        <div className='absolute top-4 right-4 z-10'>
          <span className='relative flex h-3 w-3'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
          </span>
        </div>
      )}

      {/* Avatar with glow effect */}
      <div className='relative mb-4 group'>
        <div
          className={`absolute inset-0 rounded-full bg-light-primary dark:bg-dark-primary opacity-0
          group-hover:opacity-20 blur-md transition-opacity duration-300`}
        ></div>
        <img
          src={user.avatar || '/images/logo.svg'}
          alt={user.name}
          className='w-20 h-20 rounded-full object-cover border-4 border-light-primary dark:border-dark-primary shadow-lg relative z-0'
        />
      </div>

      {/* User info */}
      <div className='flex flex-col items-center text-center w-full'>
        <div className='flex items-center gap-2 mb-1'>
          <span className='text-xl font-bold text-light-text-primary dark:text-dark-text-primary'>
            {capitalize(user.name)}
          </span>
          {user.isVerified && (
            <BadgeCheck className='w-5 h-5 text-light-primary dark:text-dark-primary' />
          )}
        </div>

        {/* Bio with fade animation */}
        <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3 max-w-xs animate-inplace-fade'>
          {user.bio || 'No bio provided.'}
        </div>

        {/* Details section */}
        <div className='w-full space-y-2 mb-4'>
          {locationString && (
            <div className='flex items-center justify-center gap-1 text-sm text-light-text-muted dark:text-dark-text-muted'>
              <span>{locationString}</span>
            </div>
          )}

          {user.email && (
            <div className='text-xs text-light-text-muted dark:text-dark-text-muted'>
              <span className='font-semibold'>Email:</span> {user.email}
            </div>
          )}

          {Array.isArray((user as any).favoriteSports) &&
            (user as any).favoriteSports.length > 0 && (
              <div className='text-xs text-light-text-muted dark:text-dark-text-muted'>
                <span className='font-semibold'>Favorite Sports:</span>{' '}
                {(user as any).favoriteSports.join(', ')}
              </div>
            )}

          {user.age && (
            <div className='text-xs text-light-text-muted dark:text-dark-text-muted'>
              <span className='font-semibold'>Age:</span> {user.age}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className='flex gap-3 mt-2 w-full justify-center'>
        {relationship === 'friend' && currentUser?._id !== user._id && (
          <>
            <Button
              variant='primary'
              size='sm'
              icon={<MessageCircle className='w-4 h-4' />}
              onClick={(e) => {
                e.stopPropagation();
                onMessage(user._id);
              }}
              className='animate-slide-up'
            >
              {text.friends.message}
            </Button>
            <Button
              variant='danger'
              size='sm'
              icon={<Trash className='w-4 h-4' />}
              onClick={(e) => {
                e.stopPropagation();
                onRequestRemove?.(user);
              }}
              className='animate-slide-up delay-100'
            >
              {text.friends.remove || 'Remove Friend'}
            </Button>
          </>
        )}
        {relationship === 'not_friend' && (
          <Button
            variant='primary'
            size='sm'
            icon={<UserPlus className='w-4 h-4' />}
            onClick={(e) => {
              e.stopPropagation();
              onAddFriend(user._id);
            }}
            className='animate-slide-up'
          >
            {text.friends.add_friend}
          </Button>
        )}
        {relationship === 'pending' && (
          <Button
            variant='ghost'
            size='sm'
            icon={<Clock className='w-4 h-4' />}
            disabled
            className='animate-slide-up text-light-text-muted dark:text-dark-text-muted'
          >
            Pending
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
