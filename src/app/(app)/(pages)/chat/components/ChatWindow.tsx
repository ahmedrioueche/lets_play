import UserAvatar from '@/components/ui/UserAvatar';
import useTranslator from '@/hooks/useTranslator';
import { Message, User } from '@/types/user';
import { MessageCircle, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

interface ChatWindowProps {
  friend: User | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  onSendMessage: (msg: string) => void;
  sending: boolean;
  inputValue: string;
  onInputChange: (v: string) => void;
  currentUserId: string;
  isMobileFriendsOpen?: boolean;
  onMobileFriendsToggle?: () => void;
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
}) => {
  const text = useTranslator();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
              <UserAvatar />
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
            {friend.isOnline ? 'Active now' : 'Offline'}
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-8 space-y-3 bg-light-background/60 dark:bg-dark-background/60 rounded-b-2xl'>
        {loading ? (
          <div className='flex items-center justify-center h-full text-light-text-secondary dark:text-dark-text-secondary'>
            Loading messages...
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-full text-red-500'>
            Failed to load messages
          </div>
        ) : messages.length === 0 ? (
          <div className='flex items-center justify-center h-full text-light-text-secondary dark:text-dark-text-secondary'>
            No messages yet
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto px-4 py-0 space-y-3'>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.senderId === currentUserId
                      ? 'bg-light-primary dark:bg-dark-primary text-white rounded-br-none'
                      : 'bg-light-card dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border rounded-bl-none'
                  }`}
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
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className='flex items-center gap-2 p-4 border-t border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card rounded-b-2xl shadow-md'>
        <div className='flex-1'>
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder='Type a message...'
            rows={1}
            className='w-full px-4 py-3 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent resize-none transition-all duration-200 scrollbar-hide'
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (inputValue.trim() && !sending) onSendMessage(inputValue);
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
          onClick={() => {
            if (inputValue.trim() && !sending) onSendMessage(inputValue);
          }}
          disabled={sending || !inputValue.trim()}
          className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
            sending || !inputValue.trim()
              ? 'bg-light-muted/20 dark:bg-dark-muted/20 text-light-text-muted dark:text-dark-text-muted cursor-not-allowed'
              : 'bg-light-primary dark:bg-dark-primary hover:bg-light-primary/80 dark:hover:bg-dark-primary/80 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
          }`}
        >
          {sending ? (
            <div className='animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full'></div>
          ) : (
            <Send className='w-5 h-5' />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
