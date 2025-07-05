import { User } from '@/types/user';
import React from 'react';
import UserCard from './UserCard';

interface FriendsSectionProps {
  friends: User[];
  onAddFriend: (id: string) => void;
  onMessage: (id: string) => void;
  relationship?: 'friend' | 'pending' | 'not_friend' | 'self';
  getRelationship?: (user: User) => 'friend' | 'pending' | 'not_friend' | 'self';
  onCardClick?: (id: string) => void;
  onRequestRemove?: (user: User) => void;
}

const FriendsSection: React.FC<FriendsSectionProps> = ({
  friends,
  onAddFriend,
  onMessage,
  relationship = 'friend',
  getRelationship,
  onCardClick,
  onRequestRemove,
}) => {
  return friends.length === 0 ? null : (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
      {friends.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          relationship={getRelationship ? getRelationship(user) : relationship}
          onAddFriend={onAddFriend}
          onMessage={onMessage}
          onCardClick={onCardClick}
          onRequestRemove={onRequestRemove}
        />
      ))}
    </div>
  );
};

export default FriendsSection;
