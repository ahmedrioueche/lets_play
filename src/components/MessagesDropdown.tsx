'use client';

import { useAuth } from '@/context/AuthContext';
import useTranslator from '@/hooks/useTranslator';
import { Conversation } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dropdown from './ui/BaseDropdown';
import UserAvatar from './ui/UserAvatar';

interface MessagesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
  onRefreshBadges?: () => void;
}

const MessagesDropdown: React.FC<MessagesDropdownProps> = ({
  isOpen,
  onClose,
  onUnreadCountChange,
  onRefreshBadges,
}) => {
  const { user } = useAuth();
  const text = useTranslator();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?._id) {
      fetchConversations();
    }
  }, [isOpen, user?._id]);

  const fetchConversations = async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/chat/conversations?userId=${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);

        // Update parent's unread count
        const totalUnread =
          data.conversations?.reduce((sum: number, conv: any) => sum + conv.unreadCount, 0) || 0;
        onUnreadCountChange?.(totalUnread);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = async (friendId: string) => {
    // Mark conversation as read
    if (user?._id) {
      try {
        await fetch(`/api/chat/${friendId}/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id }),
        });

        // Update local state to remove unread count
        setConversations((prev) =>
          prev.map((conv) => (conv.friendId === friendId ? { ...conv, unreadCount: 0 } : conv))
        );

        // Update parent's unread count
        const updatedTotal = conversations.reduce(
          (sum, conv) => (conv.friendId === friendId ? sum : sum + conv.unreadCount),
          0
        );
        onUnreadCountChange?.(updatedTotal);

        // Refresh badges
        onRefreshBadges?.();

        // Trigger global badge update event
        window.dispatchEvent(new CustomEvent('badge-update'));
      } catch (error) {
        console.error('Failed to mark conversation as read:', error);
      }
    }

    router.push(`/chat?user=${friendId}`);
    onClose();
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (!message) return '';
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  return (
    <Dropdown isOpen={isOpen} onClose={onClose} width='w-80'>
      <div className='p-4'>
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-light-text dark:text-dark-text'>
            {text.general.messages || 'Messages'}
          </h3>
          <button
            onClick={onClose}
            className='p-1 rounded-full hover:bg-light-background dark:hover:bg-dark-background'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Content */}
        <div className='max-h-96 overflow-y-auto'>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-light-primary dark:border-dark-primary'></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className='text-center py-8'>
              <MessageSquare className='h-12 w-12 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-3' />
              <p className='text-light-text-secondary dark:text-dark-text-secondary'>
                {text.general.noMessages || 'No messages yet'}
              </p>
            </div>
          ) : (
            <div className='space-y-2'>
              {conversations.map((conversation) => (
                <button
                  key={conversation._id}
                  onClick={() => handleConversationClick(conversation.friendId)}
                  className='w-full p-3 rounded-lg hover:bg-light-background dark:hover:bg-dark-background text-left transition-colors'
                >
                  <div className='flex items-start gap-3'>
                    <div className='relative flex-shrink-0'>
                      <UserAvatar avatar={conversation.friendAvatar} className='h-10 w-10' />
                      {conversation.unreadCount > 0 && (
                        <span className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center'>
                          {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-1'>
                        <h4 className='font-medium text-light-text dark:text-dark-text truncate'>
                          {conversation.friendName}
                        </h4>
                        <span className='text-xs text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0'>
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary truncate'>
                        {truncateMessage(conversation.lastMessage)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='border-t border-light-border dark:border-dark-border mt-4 pt-4'>
          <button
            onClick={() => {
              router.push('/chat');
              onClose();
            }}
            className='w-full text-center text-sm text-light-primary dark:text-dark-primary hover:underline'
          >
            {text.general.viewAllMessages || 'View all messages'}
          </button>
        </div>
      </div>
    </Dropdown>
  );
};

export default MessagesDropdown;
