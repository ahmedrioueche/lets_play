import SearchBar from '@/components/ui/SearchBar';
import UserAvatar from '@/components/ui/UserAvatar';
import { User } from '@/types/user';
import { MessageCircle, MoreVertical, Search, Shield, UserMinus, Users, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface FriendsListProps {
  friends: User[];
  selectedFriendId: string | null;
  onSelectFriend: (id: string) => void;
  loading: boolean;
  error: string | null;
  searchValue: string;
  onSearchChange: (v: string) => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
  onRemoveFriend?: (friendId: string) => void;
  onBlockUser?: (friendId: string) => void;
  targetUser?: User | null;
}

const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  selectedFriendId,
  onSelectFriend,
  loading,
  error,
  searchValue,
  onSearchChange,
  isMobile = false,
  onMobileClose,
  onRemoveFriend,
  onBlockUser,
  targetUser,
}) => {
  let displayFriends = friends;
  if (targetUser && !friends.some((f) => f._id === targetUser._id)) {
    displayFriends = [targetUser, ...friends];
  }
  const onlineFriends = displayFriends.filter((f) => f.isOnline);
  const offlineFriends = displayFriends.filter((f) => !f.isOnline);

  return (
    <div
      className={`flex flex-col ${isMobile ? 'h-[720px]' : 'h-full'} bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border rounded-2xl shadow-lg`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className='flex items-center justify-between p-4 bg-gradient-to-r from-light-primary/10 to-light-secondary/10 dark:from-dark-primary/20 dark:to-dark-secondary/20 border-b border-light-border dark:border-dark-border rounded-t-2xl'>
          <h3 className='text-lg font-bold text-light-text-primary dark:text-dark-text-primary'>
            Friends
          </h3>
          <button
            onClick={onMobileClose}
            className='p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-colors'
          >
            <span className='text-2xl'>×</span>
          </button>
        </div>
      )}

      {/* Header with gradient background */}
      <div
        className={`flex-shrink-0 p-6 bg-gradient-to-r from-light-primary/5 to-light-secondary/5 dark:from-dark-primary/10 dark:to-dark-secondary/10 border-b border-light-border dark:border-dark-border ${isMobile ? 'rounded-none' : 'rounded-lg'}`}
      >
        <div className='flex items-center gap-3 mb-6'>
          <div className='relative'>
            <MessageCircle className='w-7 h-7 text-light-primary dark:text-dark-primary' />
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-light-accent dark:bg-dark-accent rounded-full animate-pulse'></div>
          </div>
          <div>
            <h2 className='text-xl font-bold text-light-text-primary dark:text-dark-text-primary'>
              Messages
            </h2>
            <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              {onlineFriends.length} online
            </p>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className='mt-4'>
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            actionIcon={
              <Search className='w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary' />
            }
            onActionClick={() => {}}
          />
        </div>
      </div>

      {/* Friends List */}
      <div className='flex-1 overflow-y-auto scrollbar-hide'>
        {loading ? (
          <div className='flex flex-col items-center justify-center h-full text-light-text-secondary dark:text-dark-text-secondary p-8'>
            <div className='relative'>
              <div className='animate-spin w-8 h-8 border-3 border-light-primary/30 dark:border-dark-primary/30 border-t-light-primary dark:border-t-dark-primary rounded-full'></div>
              <div className='absolute inset-0 animate-ping w-8 h-8 border-2 border-light-primary/20 dark:border-dark-primary/20 rounded-full'></div>
            </div>
            <p className='mt-4 font-medium animate-pulse'>Loading conversations...</p>
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-full text-light-danger dark:text-dark-danger px-6'>
            <div className='text-center p-6 bg-light-danger/10 dark:bg-dark-danger/10 rounded-xl border border-light-danger/20 dark:border-dark-danger/20'>
              <div className='w-12 h-12 bg-light-danger/20 dark:bg-dark-danger/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                <Zap className='w-6 h-6' />
              </div>
              <p className='font-semibold text-lg'>Connection Error</p>
              <p className='text-sm mt-2 text-light-text-secondary dark:text-dark-text-secondary'>
                {error}
              </p>
            </div>
          </div>
        ) : displayFriends.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-light-text-muted dark:text-dark-text-muted p-8'>
            <div className='w-20 h-20 bg-light-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mb-4'>
              <Users className='w-10 h-10 opacity-50' />
            </div>
            <p className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
              No chats yet.
            </p>
            <p className='text-sm text-center'>Your conversations will appear here.</p>
          </div>
        ) : (
          <div className='p-4 space-y-6'>
            {/* Online Friends */}
            {onlineFriends.length > 0 && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2 px-3 py-1'>
                  <div className='w-2 h-2 bg-light-accent dark:bg-dark-accent rounded-full animate-pulse'></div>
                  <h3 className='text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider'>
                    Online — {onlineFriends.length}
                  </h3>
                </div>
                <div className='space-y-1'>
                  {onlineFriends.map((friend) => (
                    <FriendItem
                      key={friend._id}
                      friend={friend}
                      isSelected={selectedFriendId === friend._id}
                      onSelect={onSelectFriend}
                      onRemoveFriend={onRemoveFriend}
                      onBlockUser={onBlockUser}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Offline Friends */}
            {offlineFriends.length > 0 && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2 px-3 py-1'>
                  <div className='w-2 h-2 bg-light-text-muted dark:bg-dark-text-muted rounded-full opacity-50'></div>
                  <h3 className='text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider'>
                    Offline — {offlineFriends.length}
                  </h3>
                </div>
                <div className='space-y-1'>
                  {offlineFriends.map((friend) => (
                    <FriendItem
                      key={friend._id}
                      friend={friend}
                      isSelected={selectedFriendId === friend._id}
                      onSelect={onSelectFriend}
                      onRemoveFriend={onRemoveFriend}
                      onBlockUser={onBlockUser}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FriendItem: React.FC<{
  friend: User;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemoveFriend?: (friendId: string) => void;
  onBlockUser?: (friendId: string) => void;
}> = ({ friend, isSelected, onSelect, onRemoveFriend, onBlockUser }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className='relative'>
      <button
        onClick={() => onSelect(friend._id)}
        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-left group relative overflow-hidden ${
          isSelected
            ? 'bg-gradient-to-r from-light-primary/15 to-light-secondary/10 dark:from-dark-primary/20 dark:to-dark-secondary/15 shadow-lg shadow-light-primary/10 dark:shadow-dark-primary/10'
            : 'hover:bg-light-background/80 dark:hover:bg-dark-background/50 hover:shadow-md'
        }`}
      >
        {/* Background decoration for selected state */}
        {isSelected && (
          <div className='absolute inset-0 bg-gradient-to-r from-light-primary/5 to-transparent dark:from-dark-primary/10 dark:to-transparent'></div>
        )}

        <div className='relative flex-shrink-0 z-10 cursor-pointer'>
          <div className='relative'>
            {friend.avatar ? (
              <img
                src={friend.avatar}
                alt={friend.name}
                className={`w-12 h-12 rounded-full object-cover transition-all duration-300 ${
                  friend.isOnline
                    ? 'border-2 border-light-accent/50 dark:border-dark-accent/50 shadow-lg shadow-light-accent/20 dark:shadow-dark-accent/20'
                    : 'border-2 border-light-border dark:border-dark-border grayscale-[20%] dark:grayscale-[40%]'
                }`}
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-full transition-all duration-300 ${
                  friend.isOnline
                    ? 'border-2 border-light-accent/50 dark:border-dark-accent/50 shadow-lg shadow-light-accent/20 dark:shadow-dark-accent/20'
                    : 'border-2 border-light-border dark:border-dark-border grayscale-[20%] dark:grayscale-[40%]'
                }`}
              >
                <UserAvatar className='w-full h-full' />
              </div>
            )}
            {friend.isOnline && (
              <>
                <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-light-accent dark:bg-dark-secondary border-2 border-light-card dark:border-dark-card rounded-full animate-bounce-in'></div>
                <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-light-accent/30 dark:bg-dark-secondary/30 rounded-full animate-ping'></div>
              </>
            )}
          </div>
        </div>

        <div className='flex-1 min-w-0 z-10'>
          <div
            className={`font-semibold truncate transition-all duration-300 cursor-pointer ${
              isSelected
                ? 'text-light-primary dark:text-dark-primary'
                : 'text-light-text-primary dark:text-dark-text-primary group-hover:text-light-primary dark:group-hover:text-dark-primary'
            }`}
          >
            {friend.name}
          </div>
          <div
            className={`text-sm transition-all duration-300 ${
              friend.isOnline
                ? 'text-light-accent dark:text-dark-secondary font-medium'
                : 'text-light-text-muted dark:text-dark-text-muted'
            }`}
          >
            {friend.isOnline ? 'Online' : 'Offline'}
          </div>
        </div>

        {isSelected && (
          <div className='flex-shrink-0 z-10'>
            <div className='w-2 h-2 bg-light-primary dark:text-dark-primary rounded-full animate-pulse shadow-lg shadow-light-primary/50 dark:shadow-dark-primary/50'></div>
          </div>
        )}
      </button>

      {/* Friend Actions Menu */}
      {(onRemoveFriend || onBlockUser) && (
        <div className='absolute top-2 right-2 z-20'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className='p-1 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-colors opacity-0 group-hover:opacity-100'
          >
            <MoreVertical className='w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary' />
          </button>

          {showMenu && (
            <div className='absolute right-0 top-8 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg z-30 min-w-[120px]'>
              {onRemoveFriend && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFriend(friend._id);
                    setShowMenu(false);
                  }}
                  className='w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-t-lg'
                >
                  <UserMinus className='w-4 h-4' />
                  Remove Friend
                </button>
              )}
              {onBlockUser && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBlockUser(friend._id);
                    setShowMenu(false);
                  }}
                  className='w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg'
                >
                  <Shield className='w-4 h-4' />
                  Block User
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && <div className='fixed inset-0 z-10' onClick={() => setShowMenu(false)} />}
    </div>
  );
};

export default FriendsList;
