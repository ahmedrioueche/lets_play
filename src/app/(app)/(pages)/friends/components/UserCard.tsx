import Button from '@/components/ui/Button';
import useTranslator from '@/hooks/useTranslator';
import { User } from '@/types/user';
import { BadgeCheck, Clock, MapPin, MessageCircle, Trash, UserPlus } from 'lucide-react';

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

  return (
    <div
      className='relative rounded-2xl bg-light-card dark:bg-dark-card overflow-hidden shadow hover:shadow-2xl hover:scale-[1.025] transition-all flex flex-col items-center p-6 border border-light-border dark:border-dark-border w-full max-w-md mx-auto bg-white/60 dark:bg-gray-900/60 cursor-pointer'
      onClick={() => onCardClick?.(user._id)}
    >
      <div className='relative mb-4'>
        <img
          src={user.avatar || '/images/logo.svg'}
          alt={user.name}
          className='w-20 h-20 rounded-full object-cover border-4 border-blue-400 shadow-lg'
        />
        {user.isOnline && (
          <span className='absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full' />
        )}
      </div>
      <div className='flex items-center gap-2 mb-1'>
        <span className='text-lg font-bold text-light-text-primary dark:text-dark-text-primary'>
          {user.name}
        </span>
        {user.isVerified && <BadgeCheck className='w-5 h-5 text-blue-500' />}
      </div>
      <div className='text-sm text-gray-500 dark:text-gray-400 mb-2 text-center'>
        {user.bio || 'No bio provided.'}
      </div>
      {locationString && (
        <div className='flex items-center gap-1 text-xs text-gray-400 mb-2'>
          <MapPin className='w-4 h-4' />
          {locationString}
        </div>
      )}
      {user.email && (
        <div className='text-xs text-gray-400 mb-2'>
          <span className='font-semibold'>Email:</span> {user.email}
        </div>
      )}
      {Array.isArray((user as any).favoriteSports) && (user as any).favoriteSports.length > 0 && (
        <div className='text-xs text-gray-400 mb-2'>
          <span className='font-semibold'>Favorite Sports:</span>{' '}
          {(user as any).favoriteSports.join(', ')}
        </div>
      )}
      {user.age && (
        <div className='text-xs text-gray-400 mb-2'>
          <span className='font-semibold'>Age:</span> {user.age}
        </div>
      )}
      <div className='flex gap-2 mt-3'>
        {relationship === 'friend' && (
          <>
            <Button
              variant='primary'
              size='sm'
              icon={<MessageCircle className='w-4 h-4' />}
              onClick={(e) => {
                e.stopPropagation();
                onMessage(user._id);
              }}
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
          >
            {text.friends.add_friend}
          </Button>
        )}
        {relationship === 'pending' && (
          <Button variant='ghost' size='sm' icon={<Clock className='w-4 h-4' />} disabled>
            Pending
          </Button>
        )}
        {/* No buttons for self */}
      </div>
    </div>
  );
};
export default UserCard;
