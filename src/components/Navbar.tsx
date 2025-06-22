'use client';

import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import useTranslator from '@/hooks/useTranslator';
import { Bell, Menu, Settings, User, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';
import Dropdown from './ui/BaseDropdown';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { toggle, isOpen } = useSidebar();
  const text = useTranslator();
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
  };

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
            <div className='cursor-pointer flex items-center gap-2 min-w-0'>
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
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className='p-2 rounded-full hover:bg-light-card dark:hover:bg-dark-card relative'
                aria-label='Notifications'
              >
                <Bell className='h-5 w-5' />
                <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500'></span>
              </button>

              <button
                className='p-2 rounded-full hover:bg-light-card dark:hover:bg-dark-card'
                aria-label='Settings'
              >
                <Settings className='h-5 w-5' />
              </button>

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className='ml-2'
                aria-label='Profile'
              >
                {user ? (
                  <div className='h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500'></div>
                ) : (
                  <div className='h-8 w-8 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center'>
                    <User className='w-4 h-4 text-white' />
                  </div>
                )}
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
          <Dropdown isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
            <div className='flex flex-col py-2'>
              <button
                className='p-3 hover:bg-light-card dark:hover:bg-dark-card flex items-center gap-3 text-left'
                onClick={() => {
                  setMobileMenuOpen(false);
                  setNotificationsOpen(true);
                }}
              >
                <Bell className='h-5 w-5' />
                <span> {text.general.notifications}</span>
                <span className='ml-auto h-2 w-2 rounded-full bg-red-500'></span>
              </button>

              <button
                className='p-3 hover:bg-light-card dark:hover:bg-dark-card flex items-center gap-3 text-left'
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
              >
                <Settings className='h-5 w-5' />
                <span> {text.general.settings}</span>
              </button>

              <button
                className='p-3 hover:bg-light-card dark:hover:bg-dark-card flex items-center gap-3 text-left'
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProfileOpen(true);
                }}
              >
                <div className='h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500'></div>
                <span>{text.general.profile}</span>
              </button>
            </div>
          </Dropdown>

          {/* Notification Dropdown */}
          <NotificationsDropdown
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />

          {/* Profile Dropdown */}
          <ProfileDropdown isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
        </div>
      </header>
    </>
  );
};

export default Navbar;
