import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import useTranslator from '@/hooks/useTranslator';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose?: () => void;
  onUnreadCountChange?: (count: number) => void;
}

const NotificationsDropdown = ({ isOpen, onClose }: NotificationsDropdownProps) => {
  const { user } = useAuth();
  const text = useTranslator();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(
    user?._id || ''
  );

  const hasMarkedAsRead = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen && onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && unreadCount > 0 && !hasMarkedAsRead.current) {
      markAllAsRead();
      hasMarkedAsRead.current = true;
    }
    if (!isOpen) {
      hasMarkedAsRead.current = false;
    }
  }, [isOpen, unreadCount, markAllAsRead]);

  const handleNotificationClick = async (notification: any) => {
    // Only mark as read if it's not already read
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    if (onClose) onClose();

    // Use custom route if provided in notification data
    if (notification.data?.route) {
      let route = notification.data.route;
      // Ensure /dashboard is prefixed
      if (!route.startsWith('/dashboard')) {
        if (route.startsWith('/')) {
          route = `/dashboard${route}`;
        } else {
          route = `/dashboard/${route}`;
        }
      }
      router.push(route);
      return;
    }

    // Handle navigation based on notification type
    switch (notification.type) {
      case 'friend_invitation':
        // Navigate to sender's profile to show accept/decline buttons
        if (notification.data?.fromUserId) {
          router.push(`/dashboard/profile/${notification.data.fromUserId}`);
        }
        break;
      case 'friend_accepted':
        // Navigate to the friend's profile
        if (notification.data?.fromUserId) {
          router.push(`/dashboard/profile/${notification.data.fromUserId}`);
        }
        break;
      case 'game_invitation':
        if (notification.data?.gameId) {
          router.push(`/dashboard/games/${notification.data?.gameId}`);
        }
        break;
      case 'game_join_request':
        if (
          notification.data?.gameId &&
          (notification.data?.type === 'join_request' ||
            notification.data?.type === 'join_request_cancel')
        ) {
          router.push(`/dashboard/games/${notification.data.gameId}/audit`);
        }
        break;
      default:
        // For other notifications, just mark as read
        break;
    }
  };

  const formatTime = (date: string | Date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_invitation':
        return '👥';
      case 'friend_accepted':
        return '✅';
      case 'game_invitation':
        return '🎮';
      case 'game_reminder':
        return '⏰';
      case 'game_registration':
        return '➕';
      case 'game_cancellation':
        return '➖';
      default:
        return '🔔';
    }
  };

  if (!user) return null;

  return (
    <div className='relative' ref={dropdownRef}>
      {isOpen && (
        <div className='absolute right-0 mt-10 md:mt-2 w-80 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg z-50 max-h-180 h-120 overflow-hidden'>
          <div className='p-4 border-b border-light-border dark:border-dark-border'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold text-light-text-primary dark:text-dark-text-primary'>
                {text.general.notifications}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className='text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200'
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className='max-h-80 overflow-y-auto'>
            {loading ? (
              <div className='p-4 text-center text-light-text-secondary dark:text-dark-text-secondary'>
                {text.general.loading}
              </div>
            ) : notifications.length === 0 ? (
              <div className='p-4 text-center text-light-text-secondary dark:text-dark-text-secondary'>
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-light-border dark:border-dark-border cursor-pointer hover:bg-light-background dark:hover:bg-dark-background transition-colors duration-200 ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className='flex items-start gap-3'>
                    <span className='text-lg'>{getNotificationIcon(notification.type)}</span>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium text-light-text-primary dark:text-dark-text-primary text-sm'>
                        {notification.title}
                      </h4>
                      <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1'>
                        {notification.message}
                      </p>
                      <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary mt-2'>
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1'></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
