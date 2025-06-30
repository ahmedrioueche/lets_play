import Button from '@/components/ui/Button';
import useTranslator from '@/hooks/useTranslator';
import { User } from '@/types/user';
import { BadgeCheck, MapPin, MessageCircle, Trash } from 'lucide-react';
import React, { useState } from 'react';
import WarningModal from '../../games/components/WarningModal';

interface FriendsSectionProps {
  friends: User[];
  onAddFriend: (id: string) => void;
  onMessage: (id: string) => void;
  onRemoveFriend: (id: string) => void;
}

const UserCard: React.FC<{
  friend: User;
  onAddFriend: (id: string) => void;
  onMessage: (id: string) => void;
  onRemoveFriend: (id: string) => void;
  onCardClick?: (id: string) => void;
  onRequestRemove?: (friend: User) => void;
}> = ({ friend, onAddFriend, onMessage, onRemoveFriend, onCardClick, onRequestRemove }) => {
  const text = useTranslator();

  // Convert location to string for display
  const locationString = friend.location?.address || '';

  return (
    <div
      className='relative rounded-2xl overflow-hidden shadow hover:shadow-2xl hover:scale-[1.025] transition-all flex flex-col items-center p-6 border border-light-border dark:border-dark-border w-full max-w-md mx-auto bg-white/60 dark:bg-gray-900/60 cursor-pointer'
      onClick={() => onCardClick?.(friend._id)}
    >
      <div className='relative mb-4'>
        <img
          src={friend.avatar || '/images/logo.svg'}
          alt={friend.name}
          className='w-20 h-20 rounded-full object-cover border-4 border-blue-400 shadow-lg'
        />
        {friend.isOnline && (
          <span className='absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full' />
        )}
      </div>
      <div className='flex items-center gap-2 mb-1'>
        <span className='text-lg font-bold text-light-text-primary dark:text-dark-text-primary'>
          {friend.name}
        </span>
        {friend.isVerified && <BadgeCheck className='w-5 h-5 text-blue-500' />}
      </div>
      <div className='text-sm text-gray-500 dark:text-gray-400 mb-2 text-center'>
        {friend.bio || 'No bio provided.'}
      </div>
      {locationString && (
        <div className='flex items-center gap-1 text-xs text-gray-400 mb-2'>
          <MapPin className='w-4 h-4' />
          {locationString}
        </div>
      )}
      {friend.email && (
        <div className='text-xs text-gray-400 mb-2'>
          <span className='font-semibold'>Email:</span> {friend.email}
        </div>
      )}
      <div className='flex gap-2 mt-3'>
        <Button
          variant='primary'
          size='sm'
          icon={<MessageCircle className='w-4 h-4' />}
          onClick={(e) => {
            e.stopPropagation();
            onMessage(friend._id);
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
            onRequestRemove?.(friend);
          }}
        >
          {text.friends.remove || 'Remove Friend'}
        </Button>
      </div>
    </div>
  );
};

const FriendsSection: React.FC<FriendsSectionProps & { onCardClick?: (id: string) => void }> = ({
  friends,
  onAddFriend,
  onMessage,
  onRemoveFriend,
  onCardClick,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<User | null>(null);

  const handleRequestRemove = (friend: User) => {
    setPendingRemove(friend);
    setModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (pendingRemove) {
      onRemoveFriend(pendingRemove._id);
      setModalOpen(false);
      setPendingRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setModalOpen(false);
    setPendingRemove(null);
  };

  return friends.length === 0 ? null : (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
        {friends.map((friend) => (
          <UserCard
            key={friend._id}
            friend={friend}
            onAddFriend={onAddFriend}
            onMessage={onMessage}
            onRemoveFriend={onRemoveFriend}
            onCardClick={onCardClick}
            onRequestRemove={handleRequestRemove}
          />
        ))}
      </div>
      <WarningModal
        isOpen={modalOpen}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        message={
          pendingRemove
            ? `Are you sure you want to remove ${pendingRemove.name} from your friends?`
            : ''
        }
        warning={'Remove Friend'}
      />
    </>
  );
};

export default FriendsSection;
