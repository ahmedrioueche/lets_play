'use client';

import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { useBadges } from '@/hooks/useBadges';
import useTranslator from '@/hooks/useTranslator';
import { capitalize } from '@/utils/helper';
import {
  Bell,
  LogOut,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  Palette,
  Settings,
  Sun,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import MessagesDropdown from './MessagesDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';
import Dropdown from './ui/BaseDropdown';
import UserAvatar from './ui/UserAvatar';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNotificationsOpen, setMobileNotificationsOpen] = useState(false);
  const [mobileMessagesOpen, setMobileMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const { toggle, isOpen } = useSidebar();
  const text = useTranslator();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { badges, refreshBadges, updateBadge } = useBadges();

  // Stable callbacks to prevent infinite loop
  const handleNotificationsUnreadCountChange = useCallback(
    (count: number) => {
      updateBadge('notifications', count);
    },
    [updateBadge]
  );

  const handleChatUnreadCountChange = useCallback(
    (count: number) => {
      updateBadge('chat', count);
    },
    [updateBadge]
  );

  const handleSettingsClick = () => {
    router.push('/dashboard/settings');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
    setMobileMenuOpen(false);
  };

  const mobileMenuItems = [
    {
      id: 'profile',
      icon: <UserAvatar avatar={user?.avatar} className='h-7 w-7' />,
      label: capitalize(user?.name || 'profile'),
      onClick: () => {
        router.push(`/dashboard/profile/${user?._id}`);
        setMobileMenuOpen(false);
      },
      showNotification: false,
    },
    {
      id: 'notifications',
      icon: <Bell className='h-5 w-5' />,
      label: text.general.notifications,
      onClick: () => {
        setMobileMenuOpen(false);
        setTimeout(() => setMobileNotificationsOpen(true), 300);
      },
      showNotification: true,
    },
    {
      id: 'messages',
      icon: <MessageSquare className='h-5 w-5' />,
      label: text.general.messages || 'Messages',
      onClick: () => {
        setMobileMenuOpen(false);
        setTimeout(() => setMobileMessagesOpen(true), 300);
      },
      showNotification: badges.chat > 0,
      notificationCount: badges.chat,
    },
    {
      id: 'settings',
      icon: <Settings className='h-5 w-5' />,
      label: text.general.settings,
      onClick: () => {
        handleSettingsClick();
        setMobileMenuOpen(false);
      },
      showNotification: false,
    },
  ];

  const themeOptions = [
    {
      id: 'system',
      icon: <Monitor className='h-4 w-4' />,
      label: 'System theme',
      value: 'system',
    },
    {
      id: 'light',
      icon: <Sun className='h-4 w-4' />,
      label: 'Light theme',
      value: 'light',
    },
    {
      id: 'dark',
      icon: <Moon className='h-4 w-4' />,
      label: 'Dark theme',
      value: 'dark',
    },
  ];

  const bottomMenuItems = [
    {
      id: 'logout',
      icon: <LogOut className='h-5 w-5' />,
      label: 'Logout',
      onClick: handleLogout,
      className: 'text-red-500',
    },
  ];

  return (
    <>
      <header className='sticky top-0 z-50 w-full border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-background backdrop-blur-md'>
        <div className='flex h-16 items-center justify-between px-4 sm:px-6 w-full'>
          {/* Left Section - Logo and Mobile Sidebar Toggle */}
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            <button
              onClick={toggle}
              className='md:hidden p-2 rounded-full hover:bg-light-card dark:hover:bg-dark-card flex-shrink-0'
            >
              {isOpen ? (
                <X className='h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary' />
              ) : (
                <Menu className='h-6 w-6 text-light-text-secondary dark:text-dark-text-secondary' />
              )}
            </button>
            <div
              onClick={() => router.push('/dashboard')}
              className='cursor-pointer flex items-center gap-2 min-w-0'
            >
              <Image
                src='/images/logo.svg'
                alt='Logo'
                width={50}
                height={50}
                className='h-10 w-auto flex-shrink-0'
              />
              <span className='font-bold text-lg md:text-xl truncate font-dancing ml-1 mt-1 '>
                {text.app.name}
              </span>
            </div>
          </div>

          {/* Right Section - Icons and User */}
          <div className='flex items-center justify-end gap-2 flex-shrink-0'>
            {/* Desktop Icons */}
            <div className='hidden md:flex items-center gap-2'>
              {/* Notification Dropdown */}
              <div className='relative'>
                <button
                  className='p-2 rounded-full hover:bg-light-card dark:hover:bg-dark-card relative'
                  aria-label='Notifications'
                  onClick={() => setIsNotificationsOpen((prev) => !prev)}
                >
                  <Bell className='h-6 w-6' />
                  {badges.notifications > 0 && (
                    <span className='absolute -top-2 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center'>
                      {badges.notifications > 9 ? '9+' : badges.notifications}
                    </span>
                  )}
                </button>
                <NotificationsDropdown
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                  onUnreadCountChange={handleNotificationsUnreadCountChange}
                />
              </div>

              {/* Messages Dropdown */}
              <div className='relative'>
                <button
                  className='p-2 rounded-full hover:bg-light-card dark:hover:bg-dark-card relative'
                  aria-label='Messages'
                  onClick={() => setIsMessagesOpen((prev) => !prev)}
                >
                  <MessageSquare className='h-6 w-6' />
                  {badges.chat > 0 && (
                    <span className='absolute -top-3 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center'>
                      {badges.chat > 9 ? '9+' : badges.chat}
                    </span>
                  )}
                </button>
                <MessagesDropdown
                  isOpen={isMessagesOpen}
                  onClose={() => setIsMessagesOpen(false)}
                  onUnreadCountChange={handleChatUnreadCountChange}
                  onRefreshBadges={refreshBadges}
                />
              </div>

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className='ml-2'
                aria-label='Profile'
              >
                <UserAvatar avatar={user?.avatar} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className='md:hidden p-2 rounded-full hover:bg-light-card dark:hover:bg-dark-card flex-shrink-0'
            >
              {mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          <Dropdown isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} width='w-56'>
            <div className='flex flex-col py-2'>
              {/* Main Menu Items */}
              {mobileMenuItems.map((item) => (
                <button
                  key={item.id}
                  className='p-3 hover:bg-light-background dark:hover:bg-dark-background flex items-center gap-3 text-left'
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {typeof item.notificationCount === 'number' && item.notificationCount > 0 && (
                    <span className='ml-auto text-red-500 font-bold'>
                      {item.notificationCount > 99 ? '99+' : item.notificationCount}
                    </span>
                  )}
                </button>
              ))}

              {/* Separator */}
              <div className='border-t border-light-border dark:border-dark-border my-1'></div>

              {/* Theme Toggle */}
              <div className='p-3 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Palette className='h-5 w-5' />
                  <span>Theme</span>
                </div>
                <div className='flex gap-1 bg-light-card dark:bg-dark-card p-1 rounded-lg'>
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.value)}
                      className={`p-1.5 rounded-md ${
                        theme === option.value
                          ? 'bg-white dark:bg-dark-background shadow-sm'
                          : 'hover:bg-light-background dark:hover:bg-dark-background'
                      }`}
                      aria-label={option.label}
                    >
                      <div
                        className={`${
                          theme === option.value
                            ? 'text-light-primary dark:text-dark-primary'
                            : 'text-light-text-secondary dark:text-dark-text-secondary'
                        }`}
                      >
                        {option.icon}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Menu Items */}
              {bottomMenuItems.map((item) => (
                <button
                  key={item.id}
                  className={`p-3 hover:bg-light-card dark:hover:bg-dark-card flex items-center gap-3 text-left ${item.className || ''}`}
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </Dropdown>

          {/* Mobile Notifications Dropdown as fixed overlay */}
          {mobileNotificationsOpen && (
            <div className='fixed top-0 left-0 w-full z-[100] flex justify-center items-start pt-4'>
              <div className='w-full max-w-md'>
                <NotificationsDropdown
                  isOpen={mobileNotificationsOpen}
                  onClose={() => setMobileNotificationsOpen(false)}
                  onUnreadCountChange={handleNotificationsUnreadCountChange}
                />
              </div>
            </div>
          )}

          {/* Mobile Messages Dropdown as fixed overlay */}
          {mobileMessagesOpen && (
            <div className='fixed top-0 left-0 w-full z-[100] flex justify-center items-start pt-4'>
              <div className='w-full max-w-md'>
                <MessagesDropdown
                  isOpen={mobileMessagesOpen}
                  onClose={() => setMobileMessagesOpen(false)}
                  onUnreadCountChange={handleChatUnreadCountChange}
                  onRefreshBadges={refreshBadges}
                />
              </div>
            </div>
          )}

          {/* Profile Dropdown */}
          <ProfileDropdown isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
        </div>
      </header>
    </>
  );
};

export default Navbar;
