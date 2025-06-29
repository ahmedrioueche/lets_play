'use client';
import Loading from '@/components/ui/Loading';
import { useAuth } from '@/context/AuthContext';
import { friendsApi } from '@/lib/api/friendsApi';
import { Message, User } from '@/types/user';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ChatWindow from './components/ChatWindow';
import FriendsList from './components/FriendsList';

function ChatPage() {
  const { user: currentUser } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [errorFriends, setErrorFriends] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [isMobileFriendsOpen, setMobileFriendsOpen] = useState(false);

  const loadFriends = useCallback(async () => {
    if (!currentUser?._id) return;

    setLoadingFriends(true);
    setErrorFriends(null);

    try {
      const response = await friendsApi.getFriends(currentUser._id);
      setFriends(response || []);

      // Auto-select first friend if none selected and friends exist
      if (!selectedFriendId && response && response.length > 0) {
        setSelectedFriendId(response[0]._id);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
      setErrorFriends('Failed to load friends');
      toast.error('Failed to load friends');
    } finally {
      setLoadingFriends(false);
    }
  }, [currentUser?._id, selectedFriendId]);

  const loadMessages = useCallback(async () => {
    if (!selectedFriendId || !currentUser?._id) return;

    setLoadingMessages(true);
    setErrorMessages(null);

    try {
      const messages = await friendsApi.getMessages(selectedFriendId, currentUser._id);
      setMessages(messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setErrorMessages('Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedFriendId, currentUser?._id]);

  // Load friends on component mount
  useEffect(() => {
    if (currentUser?._id) {
      loadFriends();
    }
  }, [currentUser?._id, loadFriends]);

  // Load messages when friend is selected
  useEffect(() => {
    if (selectedFriendId && currentUser?._id) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [selectedFriendId, currentUser?._id, loadMessages]);

  const handleSendMessage = useCallback(
    async (msg: string) => {
      if (!selectedFriendId || !currentUser?._id || !msg.trim()) return;

      setSending(true);

      try {
        const newMessage = await friendsApi.sendMessage(selectedFriendId, msg, currentUser._id);
        if (newMessage) {
          setMessages((prev) => [...prev, newMessage]);
          setInputValue('');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
      } finally {
        setSending(false);
      }
    },
    [selectedFriendId, currentUser?._id]
  );

  const handleRemoveFriend = useCallback(
    async (friendId: string) => {
      if (!currentUser?._id) return;

      try {
        await friendsApi.removeFriend(currentUser._id, friendId);
        setFriends((prev) => prev.filter((f) => f._id !== friendId));

        // If the removed friend was selected, clear selection
        if (selectedFriendId === friendId) {
          setSelectedFriendId(null);
          setMessages([]);
        }

        toast.success('Friend removed');
      } catch (error) {
        console.error('Error removing friend:', error);
        toast.error('Failed to remove friend');
      }
    },
    [currentUser?._id, selectedFriendId]
  );

  const handleBlockUser = useCallback(
    async (friendId: string) => {
      if (!currentUser?._id) return;

      try {
        await friendsApi.blockUser(currentUser._id, friendId);
        setFriends((prev) => prev.filter((f) => f._id !== friendId));

        // If the blocked friend was selected, clear selection
        if (selectedFriendId === friendId) {
          setSelectedFriendId(null);
          setMessages([]);
        }

        toast.success('User blocked');
      } catch (error) {
        console.error('Error blocking user:', error);
        toast.error('Failed to block user');
      }
    },
    [currentUser?._id, selectedFriendId]
  );

  // Filter friends by search
  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedFriend = friends.find((f) => f._id === selectedFriendId) || null;

  // Handle empty state
  if (loadingFriends) {
    return <Loading />;
  }

  if (errorFriends) {
    return (
      <div className='w-full flex-1 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>{errorFriends}</p>
          <button
            onClick={loadFriends}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <div className='w-full flex-1 flex items-center justify-center mt-20'>
        <div className='text-center max-w-md'>
          <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center'>
            <svg
              className='w-12 h-12 text-blue-500 dark:text-blue-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
              />
            </svg>
          </div>
          <h3 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3'>
            No Friends Yet
          </h3>
          <p className='text-light-text-secondary dark:text-dark-text-secondary mb-6'>
            Add some friends to start chatting! You can find people to connect with in the Friends
            section.
          </p>
          <button
            onClick={() => (window.location.href = '/friends')}
            className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
          >
            Find Friends
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full flex-1 flex h-full overflow-hidden'>
      <div className='flex flex-col md:flex-row h-full w-full relative'>
        {/* Mobile FriendsList Overlay */}
        <div
          className={`fixed inset-0 z-30 bg-black/50 md:hidden transition-opacity duration-300 ${isMobileFriendsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMobileFriendsOpen(false)}
        >
          <div
            className={`absolute top-0 left-0 w-full transition-transform duration-300 ease-out ${isMobileFriendsOpen ? 'translate-y-0' : '-translate-y-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <FriendsList
              friends={filteredFriends}
              selectedFriendId={selectedFriendId}
              onSelectFriend={(id) => {
                setSelectedFriendId(id);
                setMobileFriendsOpen(false);
              }}
              loading={loadingFriends}
              error={errorFriends}
              searchValue={search}
              onSearchChange={setSearch}
              isMobile={true}
              onMobileClose={() => setMobileFriendsOpen(false)}
              onRemoveFriend={handleRemoveFriend}
              onBlockUser={handleBlockUser}
            />
          </div>
        </div>

        {/* Friends List (Desktop) */}
        <div className='hidden md:block w-full md:w-1/3 min-w-[260px] max-w-sm h-full bg-transparent flex-shrink-0 overflow-auto mr-2'>
          <FriendsList
            friends={filteredFriends}
            selectedFriendId={selectedFriendId}
            onSelectFriend={setSelectedFriendId}
            loading={loadingFriends}
            error={errorFriends}
            searchValue={search}
            onSearchChange={setSearch}
            onRemoveFriend={handleRemoveFriend}
            onBlockUser={handleBlockUser}
          />
        </div>

        {/* Chat Window */}
        <div className='flex-1 h-full bg-transparent overflow-auto'>
          <ChatWindow
            friend={selectedFriend}
            messages={messages}
            loading={loadingMessages}
            error={errorMessages}
            onSendMessage={handleSendMessage}
            sending={sending}
            inputValue={inputValue}
            onInputChange={setInputValue}
            currentUserId={currentUser?._id || ''}
            isMobileFriendsOpen={isMobileFriendsOpen}
            onMobileFriendsToggle={() => setMobileFriendsOpen((v) => !v)}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
