import { useAuth } from '@/context/AuthContext';
import { capitalize } from '@/utils/helper';
import { HelpCircle, LogOut, MessageSquare, Monitor, Moon, Palette, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Dropdown from './ui/BaseDropdown';
import UserAvatar from './ui/UserAvatar';

const ProfileDropdown = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
    onClose();
  };

  const menuItems = [
    {
      id: 'profile',
      icon: <UserAvatar avatar={user?.avatar} className='h-7 w-7' />,
      label: capitalize(user?.name || 'profile'),
      onClick: () => {
        router.push(`/profile/${user?._id}`);
        onClose();
      },
    },
    {
      id: 'help',
      icon: <HelpCircle className='h-5 w-5' />,
      label: 'Help',
      onClick: onClose,
    },
    {
      id: 'feedback',
      icon: <MessageSquare className='h-5 w-5' />,
      label: 'Feedback',
      onClick: onClose,
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
    <Dropdown
      isOpen={isOpen}
      onClose={onClose}
      width='w-72 px-1 bg-light-card dark:bg-dark-card border'
    >
      {/* Main Menu Items */}
      {menuItems.map((item) => (
        <button
          key={item.id}
          className='p-3 hover:bg-light-background dark:hover:bg-dark-background flex items-center gap-3 text-left w-full transition-colors duration-200 rounded-md mx-1 my-0.5'
          onClick={item.onClick}
        >
          {item.icon}
          <span className='text-sm'>{item.label}</span>
        </button>
      ))}

      {/* Separator */}
      <div className='border-t border-light-border dark:border-dark-border my-1'></div>

      {/* Theme Toggle - Right-aligned */}
      <div className='p-3 flex items-center justify-between w-full'>
        <div className='flex items-center gap-3'>
          <Palette className='h-5 w-5' />
          <span className='text-sm'>Theme</span>
        </div>
        <div className='flex gap-1 bg-light-card dark:bg-dark-card p-1 rounded-lg'>
          {themeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setTheme(option.value)}
              className={`p-1.5 rounded-md transition-all duration-200 ${
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
          className={`p-3 hover:bg-light-background dark:hover:bg-dark-background flex items-center gap-3 text-left w-full transition-colors duration-200 rounded-md mx-1 my-0.5 ${item.className || ''}`}
          onClick={item.onClick}
        >
          {item.icon}
          <span className='text-sm'>{item.label}</span>
        </button>
      ))}
    </Dropdown>
  );
};

export default ProfileDropdown;
