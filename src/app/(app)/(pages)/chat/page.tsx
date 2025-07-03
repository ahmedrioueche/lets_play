'use client';
import Loading from '@/components/ui/Loading';
import NoData from '@/components/ui/NoData';
import { useAuth } from '@/context/AuthContext';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { chatApi } from '@/lib/api/chatApi';
import { usersApi } from '@/lib/api/usersApi';
import { Message } from '@/types/chat';
import { User } from '@/types/user';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ChatWindow from './components/ChatWindow';
import FriendsList from './components/FriendsList';

// Extended message type for optimistic updates
interface OptimisticMessage extends Message {
  isOptimistic?: boolean;
  error?: string;
  retryCount?: number;
}

function ChatPage() {
  const { user: currentUser } = useAuth();
  const searchParams = useSearchParams();
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [errorFriends, setErrorFriends] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [messages, setMessages] = useState<OptimisticMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [isMobileFriendsOpen, setMobileFriendsOpen] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  // State for target user (if ?user= is present and not a friend)
  const [targetUser, setTargetUser] = useState<User | null>(null);

  // Get user ID from search params (for messaging any user)
  const userIdFromParams = searchParams.get('user');
  const friendIdFromParams = searchParams.get('friend');

  // Determine selected user (friend or any user)
  const selectedUserId = userIdFromParams || friendIdFromParams || selectedFriendId;

  const selectedUser =
    friends.find((f) => f._id === selectedUserId) ||
    (targetUser && targetUser._id === selectedUserId ? targetUser : null);

  // Real-time chat hook
  const {
    isConnected,
    isTyping,
    sendMessage,
    sendTypingStatus,
    editMessage,
    deleteMessage,
    markAsRead,
  } = useRealTimeChat({
    selectedFriend: selectedUser,
    onMessageReceived: (message) => {
      console.log('ChatPage: onMessageReceived called with:', message);
      // Add real-time messages to the beginning (since DB returns newest first)
      setMessages((prev) => {
        // Remove any optimistic message with same content
        const filtered = prev.filter((m) => !m.isOptimistic || m.content !== message.content);
        // Add new message to the beginning
        const newMessages = [message, ...filtered];
        console.log('ChatPage: Updated messages:', newMessages);
        return newMessages;
      });
    },
    onTypingStatusChange: (isTyping) => {
      // Handle typing status in UI if needed
    },
    onMessageStatusChange: (messageId, status) => {
      // Handle message status updates if needed
    },
    onOnlineStatusChange: (userId, isOnline) => {
      // Update friend's online status in real-time
      setFriends((prev) =>
        prev.map((friend) => (friend._id === userId ? { ...friend, isOnline } : friend))
      );
    },
  });

  const loadFriends = useCallback(async () => {
    if (!currentUser?._id) return;

    setLoadingFriends(true);
    setErrorFriends(null);

    try {
      const response = await fetch(`/api/users/${currentUser._id}/friends`);
      const data = await response.json();
      setFriends(data.friends || []);

      // Auto-select friend from URL params if provided and exists in friends list
      if (friendIdFromParams && data.friends) {
        const friendExists = data.friends.find((f: User) => f._id === friendIdFromParams);
        if (friendExists) {
          setSelectedFriendId(friendIdFromParams);
        }
      }
      // Otherwise, auto-select first friend if none selected and friends exist
      else if (!selectedFriendId && data.friends && data.friends.length > 0) {
        setSelectedFriendId(data.friends[0]._id);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
      setErrorFriends('Failed to load friends');
      toast.error('Failed to load friends');
    } finally {
      setLoadingFriends(false);
    }
  }, [currentUser?._id, selectedFriendId, friendIdFromParams]);

  const loadMessages = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (!selectedUserId || !currentUser?._id) return;

      if (page === 1) {
        setLoadingMessages(true);
      } else {
        setLoadingOlderMessages(true);
      }
      setErrorMessages(null);

      try {
        const messages = await chatApi.getMessages(selectedUserId, currentUser._id, page);

        if (append) {
          // Append older messages to the end
          setMessages((prev) => [...prev, ...(messages || [])]);
        } else {
          // Replace messages (first page)
          setMessages(messages || []);
        }

        // Check if there are more messages
        setHasMoreMessages(messages && messages.length >= 50); // Assuming 50 is the page size

        // Mark messages as read only for first page
        if (page === 1) {
          await markAsRead();
          // Trigger badge update when messages are read
          window.dispatchEvent(new CustomEvent('badge-update'));
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        setErrorMessages('Failed to load messages');
        toast.error('Failed to load messages');
      } finally {
        setLoadingMessages(false);
        setLoadingOlderMessages(false);
      }
    },
    [selectedUserId, currentUser?._id, markAsRead]
  );

  // Load friends on component mount
  useEffect(() => {
    if (currentUser?._id) {
      loadFriends();
    }
  }, [currentUser?._id, loadFriends]);

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUserId && currentUser?._id) {
      setCurrentPage(1);
      setHasMoreMessages(true);
      loadMessages(1, false);
    } else {
      setMessages([]);
      setCurrentPage(1);
      setHasMoreMessages(true);
    }
  }, [selectedUserId, currentUser?._id, loadMessages]);

  // Load older messages
  const handleLoadOlderMessages = useCallback(async () => {
    if (!hasMoreMessages || loadingOlderMessages) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await loadMessages(nextPage, true);
  }, [hasMoreMessages, loadingOlderMessages, currentPage, loadMessages]);

  // Handle URL parameter changes
  useEffect(() => {
    if (userIdFromParams) {
      setSelectedFriendId(userIdFromParams);
    } else if (friendIdFromParams && friends.length > 0) {
      const friendExists = friends.find((f) => f._id === friendIdFromParams);
      if (friendExists) {
        setSelectedFriendId(friendIdFromParams);
      } else {
        toast.error('Friend not found in your friends list');
      }
    }
  }, [userIdFromParams, friendIdFromParams, friends]);

  const handleSendMessage = useCallback(
    async (msg: string) => {
      const receiverId = selectedUser?._id;
      if (!receiverId || !currentUser?._id || !msg.trim()) return;

      const messageContent = msg.trim();
      setInputValue('');

      // Create optimistic message
      const optimisticMessage: OptimisticMessage = {
        _id: `optimistic-${Date.now()}`,
        senderId: currentUser._id,
        receiverId,
        content: messageContent,
        messageType: 'text',
        isRead: false,
        isEdited: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        isOptimistic: true,
      };

      // Add optimistic message immediately
      setMessages((prev) => [optimisticMessage, ...prev]);

      try {
        // Try to send the message
        const newMessage = await sendMessage(messageContent);

        if (newMessage) {
          // Remove optimistic message and add real message to the beginning
          setMessages((prev) => {
            const filtered = prev.filter((m) => m._id !== optimisticMessage._id);
            return [newMessage, ...filtered];
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);

        // Mark optimistic message as failed
        setMessages((prev) =>
          prev.map((m) =>
            m._id === optimisticMessage._id
              ? { ...m, error: 'Failed to send message', retryCount: (m.retryCount || 0) + 1 }
              : m
          )
        );

        toast.error('Failed to send message');
      }
    },
    [selectedUser, currentUser?._id, sendMessage]
  );

  // Retry sending a failed message
  const retryMessage = useCallback(
    async (messageId: string) => {
      const message = messages.find((m) => m._id === messageId);
      if (!message || !message.error) return;

      // Remove error state
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, error: undefined, isOptimistic: true } : m))
      );

      try {
        const newMessage = await sendMessage(message.content);

        if (newMessage) {
          // Remove optimistic message and add real message to the beginning
          setMessages((prev) => {
            const filtered = prev.filter((m) => m._id !== messageId);
            return [newMessage, ...filtered];
          });
        }
      } catch (error) {
        console.error('Error retrying message:', error);

        // Mark as failed again
        setMessages((prev) =>
          prev.map((m) =>
            m._id === messageId
              ? { ...m, error: 'Failed to send message', retryCount: (m.retryCount || 0) + 1 }
              : m
          )
        );

        toast.error('Failed to send message');
      }
    },
    [messages, sendMessage]
  );

  const handleRemoveFriend = useCallback(
    async (friendId: string) => {
      if (!currentUser?._id) return;

      try {
        await fetch(`/api/users/${currentUser._id}/friends`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ friendId, action: 'remove' }),
        });

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
        await fetch(`/api/users/${currentUser._id}/friends`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ friendId, action: 'block' }),
        });

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

  // Handle friend selection and clear URL params if needed
  const handleFriendSelection = useCallback(
    (friendId: string) => {
      setSelectedFriendId(friendId);
      // Clear URL search params when manually selecting a friend
      if (friendIdFromParams && friendIdFromParams !== friendId) {
        const url = new URL(window.location.href);
        url.searchParams.delete('friend');
        window.history.replaceState({}, '', url.toString());
      }
    },
    [friendIdFromParams]
  );

  // Filter friends by search
  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchTargetUser = async () => {
      if (userIdFromParams && !friends.some((f) => f._id === userIdFromParams)) {
        try {
          const user = await usersApi.getUserById(userIdFromParams);
          setTargetUser(user);
        } catch {
          setTargetUser({
            _id: userIdFromParams,
            name: 'User',
            avatar: '',
            email: '',
            phone: '',
            createdAt: '',
            updatedAt: '',
          });
        }
      } else {
        setTargetUser(null);
      }
    };
    fetchTargetUser();
  }, [userIdFromParams, friends]);

  // Build chat list
  let chatList: User[] = friends;
  if (userIdFromParams) {
    const alreadyInList = friends.some((f) => f._id === userIdFromParams);
    if (!alreadyInList && targetUser) {
      chatList = [targetUser, ...friends];
    } else if (alreadyInList) {
      chatList = [
        ...friends.filter((f) => f._id === userIdFromParams),
        ...friends.filter((f) => f._id !== userIdFromParams),
      ];
    }
  }

  // Ensure selectedFriendId is always set to the first chat if not set
  useEffect(() => {
    if (!selectedFriendId && chatList.length > 0) {
      setSelectedFriendId(chatList[0]._id);
    }
  }, [selectedFriendId, chatList]);

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

  if (!chatList || chatList.length === 0) {
    return <NoData />;
  }

  // Always render chat window if there is at least one chat
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
                handleFriendSelection(id);
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
              targetUser={targetUser}
            />
          </div>
        </div>

        {/* Friends List (Desktop) */}
        <div className='hidden md:block w-full md:w-1/3 min-w-[260px] max-w-sm h-full bg-transparent flex-shrink-0 overflow-auto mr-2'>
          <FriendsList
            friends={filteredFriends}
            selectedFriendId={selectedFriendId}
            onSelectFriend={handleFriendSelection}
            loading={loadingFriends}
            error={errorFriends}
            searchValue={search}
            onSearchChange={setSearch}
            onRemoveFriend={handleRemoveFriend}
            onBlockUser={handleBlockUser}
            targetUser={targetUser}
          />
        </div>

        {/* Chat Window - always render if chatList has at least one chat */}
        <div className='flex-1 h-full bg-transparent overflow-auto'>
          <ChatWindow
            friend={selectedUser}
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
            isConnected={isConnected}
            isTyping={isTyping}
            onTypingChange={sendTypingStatus}
            onEditMessage={editMessage}
            onDeleteMessage={deleteMessage}
            onRetryMessage={retryMessage}
            hasMoreMessages={hasMoreMessages}
            loadingOlderMessages={loadingOlderMessages}
            onLoadOlderMessages={handleLoadOlderMessages}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
