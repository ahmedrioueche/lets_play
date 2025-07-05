import UserAvatar from '@/components/ui/UserAvatar';
import useTranslator from '@/hooks/useTranslator';
import { Message } from '@/types/chat';
import { User } from '@/types/user';
import { capitalize } from '@/utils/helper';
import { AlertCircle, ChevronUp, MessageCircle, RefreshCw, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Extended message type for optimistic updates
interface OptimisticMessage extends Message {
  isOptimistic?: boolean;
  error?: string;
  retryCount?: number;
}

interface ChatWindowProps {
  friend: User | null;
  messages: OptimisticMessage[];
  loading: boolean;
  error: string | null;
  onSendMessage: (msg: string) => void;
  sending: boolean;
  inputValue: string;
  onInputChange: (v: string) => void;
  currentUserId: string;
  isMobileFriendsOpen?: boolean;
  onMobileFriendsToggle?: () => void;
  // Real-time chat props
  isConnected?: boolean;
  isTyping?: boolean;
  onTypingChange?: (isTyping: boolean) => void;
  onEditMessage?: (messageId: string, newContent: string) => Promise<any>;
  onDeleteMessage?: (messageId: string) => Promise<boolean>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  // Pagination props
  hasMoreMessages?: boolean;
  loadingOlderMessages?: boolean;
  onLoadOlderMessages?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  friend,
  messages,
  loading,
  error,
  onSendMessage,
  sending,
  inputValue,
  onInputChange,
  currentUserId,
  isMobileFriendsOpen,
  onMobileFriendsToggle,
  // Real-time chat props
  isConnected,
  isTyping,
  onTypingChange,
  onEditMessage,
  onDeleteMessage,
  onRetryMessage,
  // Pagination props
  hasMoreMessages = false,
  loadingOlderMessages = false,
  onLoadOlderMessages,
}) => {
  const text = useTranslator();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingStateRef = useRef<boolean>(false);
  const shouldAutoScrollRef = useRef<boolean>(true);
  const [showNewMessagesIndicator, setShowNewMessagesIndicator] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const prevMessageCountRef = useRef<number>(0);

  // Sort messages by creation date to ensure proper ordering
  const sortedMessages = React.useMemo(() => {
    return [...messages].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB;
    });
  }, [messages]);

  // Function to scroll to bottom
  const scrollToBottom = useCallback((smooth: boolean = false) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const scrollOptions: ScrollToOptions = {
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      };

      container.scrollTo(scrollOptions);

      // Hide indicators when scrolling to bottom
      setShowNewMessagesIndicator(false);
      setUnreadMessageCount(0);
      setShowScrollToBottom(false);
      shouldAutoScrollRef.current = true;
    }
  }, []);

  // Check if user is near bottom to determine if we should auto-scroll
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      shouldAutoScrollRef.current = isNearBottom;

      // Show scroll to bottom button when user scrolls up
      setShowScrollToBottom(!isNearBottom && scrollHeight > clientHeight);

      // Hide new messages indicator if user scrolls near bottom
      if (isNearBottom) {
        setShowNewMessagesIndicator(false);
        setUnreadMessageCount(0);
      }
    }
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    const currentMessageCount = sortedMessages.length;
    const hasNewMessages = currentMessageCount > prevMessageCountRef.current;

    if (hasNewMessages && currentMessageCount > 0) {
      if (shouldAutoScrollRef.current || initialLoad) {
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          scrollToBottom(false);
        });
      } else {
        // User is not at bottom, show new messages indicator
        const newMessageCount = currentMessageCount - prevMessageCountRef.current;
        setShowNewMessagesIndicator(true);
        setUnreadMessageCount((prev) => prev + newMessageCount);
      }
    }

    prevMessageCountRef.current = currentMessageCount;
  }, [sortedMessages.length, scrollToBottom, initialLoad]);

  // Initial load scroll to bottom
  useEffect(() => {
    if (sortedMessages.length > 0 && initialLoad) {
      // Use a longer timeout for initial load to ensure everything is rendered
      const timer = setTimeout(() => {
        scrollToBottom(false);
        setInitialLoad(false);
        shouldAutoScrollRef.current = true;
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [sortedMessages.length, initialLoad, scrollToBottom]);

  // Debounced typing detection
  const debouncedTypingChange = useCallback(
    (isTyping: boolean) => {
      // Only send if the state actually changed
      if (lastTypingStateRef.current === isTyping) {
        return;
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        if (onTypingChange) {
          onTypingChange(isTyping);
          lastTypingStateRef.current = isTyping;
        }
      }, 500); // 500ms debounce
    },
    [onTypingChange]
  );

  // Handle input change with debounced typing
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onInputChange(newValue);

      // Send typing status with debouncing
      const hasContent = newValue.length > 0;
      debouncedTypingChange(hasContent);
    },
    [onInputChange, debouncedTypingChange]
  );

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to bottom when sending a message
  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() && !sending) {
      onSendMessage(inputValue);
      // Force scroll to bottom when sending a message
      shouldAutoScrollRef.current = true;
      // Use multiple RAF calls to ensure the message is rendered first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom(true);
        });
      });
    }
  }, [inputValue, sending, onSendMessage, scrollToBottom]);

  if (!friend) {
    return (
      <div className='flex flex-col items-center justify-center h-full bg-light-background dark:bg-dark-background text-light-text-secondary dark:text-dark-text-secondary'>
        <MessageCircle className='w-16 h-16 mb-4 text-light-text-muted dark:text-dark-text-muted opacity-50' />
        <h3 className='text-xl font-medium mb-2 text-light-text-primary dark:text-dark-text-primary'>
          Select a conversation
        </h3>
        <p className='text-center max-w-md'>Choose a friend from the sidebar to start messaging</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border shadow-lg relative'>
      {!isMobileFriendsOpen && (
        <button
          className='md:hidden absolute top-4 right-4 z-20 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
          onClick={onMobileFriendsToggle}
        >
          <div className='flex items-center gap-2'>
            <MessageCircle className='w-4 h-4' />
            <span className='text-sm font-medium'>Chats</span>
          </div>
        </button>
      )}

      <div
        className='flex items-center gap-4 cursor-pointer select-none px-2 py-3 bg-gradient-to-r from-light-primary/5 to-light-secondary/5 dark:from-dark-primary/10 dark:to-dark-secondary/10 rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-200'
        onClick={() => router.push(`/profile/${friend._id}`)}
      >
        <div className='relative flex-shrink-0 z-10'>
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
        <div className='flex-1 min-w-0 z-10'>
          <div
            className={`font-semibold truncate transition-all duration-300 cursor-pointer hover:underline ${
              friend.isOnline
                ? 'text-light-primary dark:text-dark-primary'
                : 'text-light-text-primary dark:text-dark-text-primary'
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
        {/* Connection status indicator */}
        {isConnected !== undefined && (
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        )}
      </div>

      <div
        ref={messagesContainerRef}
        className='flex-1 overflow-y-auto px-6 py-8 space-y-3 bg-light-background/60 dark:bg-dark-background/60 rounded-b-2xl relative'
        onScroll={handleScroll}
      >
        {/* New Messages Indicator */}
        {showNewMessagesIndicator && (
          <button
            onClick={() => scrollToBottom(true)}
            className='sticky top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-bounce'
          >
            <MessageCircle className='w-4 h-4' />
            <span className='text-sm font-medium'>
              {unreadMessageCount} new message{unreadMessageCount !== 1 ? 's' : ''}
            </span>
          </button>
        )}

        {/* Scroll to Bottom Button */}
        {showScrollToBottom && !showNewMessagesIndicator && (
          <button
            onClick={() => scrollToBottom(true)}
            className='fixed bottom-24 right-8 z-10 flex items-center justify-center w-10 h-10 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-200'
          >
            <ChevronUp className='w-5 h-5 rotate-180' />
          </button>
        )}

        {loading ? (
          <div className='flex items-center justify-center h-full text-light-text-secondary dark:text-dark-text-secondary'>
            Loading messages...
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-full text-red-500'>
            Failed to load messages
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className='flex items-center justify-center h-full text-light-text-secondary dark:text-dark-text-secondary'>
            No messages yet
          </div>
        ) : (
          <div className='space-y-3'>
            {/* Load Older Messages Button */}
            {hasMoreMessages && (
              <div className='flex justify-center py-2'>
                <button
                  onClick={onLoadOlderMessages}
                  disabled={loadingOlderMessages}
                  className='flex items-center gap-2 px-4 py-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loadingOlderMessages ? (
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></div>
                  ) : (
                    <ChevronUp className='w-4 h-4' />
                  )}
                  <span className='text-sm'>
                    {loadingOlderMessages ? 'Loading...' : 'Load Older Messages'}
                  </span>
                </button>
              </div>
            )}

            {/* Messages */}
            {sortedMessages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div className='relative'>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.senderId === currentUserId
                        ? 'bg-light-primary dark:bg-dark-primary text-white rounded-br-none'
                        : 'bg-light-card dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border rounded-bl-none'
                    } ${msg.isOptimistic ? 'opacity-70' : ''}`}
                  >
                    <p className='text-sm whitespace-pre-line break-words'>{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === currentUserId
                          ? 'text-white/70'
                          : 'text-light-text-muted dark:text-dark-text-muted'
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {msg.isOptimistic && ' • Sending...'}
                    </p>
                  </div>

                  {/* Error state for failed messages */}
                  {msg.error && (
                    <div className='mt-2 flex items-center gap-2 text-red-500 text-xs'>
                      <AlertCircle className='w-3 h-3' />
                      <span>{msg.error}</span>
                      {onRetryMessage && (
                        <button
                          onClick={() => onRetryMessage(msg._id)}
                          className='flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors'
                        >
                          <RefreshCw className='w-3 h-3' />
                          Retry
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className='px-6 py-2 text-sm text-light-text-muted dark:text-dark-text-muted italic'>
          {capitalize(friend.name)} is typing...
        </div>
      )}

      <form className='flex items-center gap-2 p-4 border-t border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card rounded-b-2xl shadow-md'>
        <div className='flex-1'>
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder='Type a message...'
            rows={1}
            className='w-full px-4 py-3 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent resize-none transition-all duration-200 scrollbar-hide'
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            style={{
              minHeight: '48px',
              maxHeight: '120px',
            }}
          />
        </div>

        <button
          type='button'
          onClick={handleSendMessage}
          disabled={sending || !inputValue.trim()}
          className='px-4 py-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center'
        >
          {sending ? (
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
          ) : (
            <Send className='w-5 h-5' />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
