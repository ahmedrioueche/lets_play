import { useAuth } from '@/context/AuthContext';
import { HelpCircle, LogOut, MessageSquare, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Dropdown from './ui/BaseDropdown';

const ProfileDropdown = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
    onClose();
  };

  return (
    <Dropdown isOpen={isOpen} onClose={onClose} width='w-56'>
      {/* Profile */}
      <button
        className='p-3 hover:bg-light-card dark:hover:bg-dark-card flex items-center gap-3 text-left w-full'
        onClick={onClose}
      >
        <div className='h-5 w-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500'></div>
        <span className='text-sm'>Profile</span>
      </button>

      {/* Help */}
      <button
        className='p-3 hover:bg-light-card dark:hover:bg-dark-card flex items-center gap-3 text-left w-full'
        onClick={onClose}
      >
        <HelpCircle className='h-5 w-5' />
        <span className='text-sm'>Help</span>
      </button>

      {/* Feedback */}
      <button
        className='p-3 hover:bg-light-card dark:hover:bg-dark-card flex items-center gap-3 text-left w-full'
        onClick={onClose}
      >
        <MessageSquare className='h-5 w-5' />
        <span className='text-sm'>Feedback</span>
      </button>

      {/* Separator */}
      <div className='border-t border-light-border dark:border-dark-border my-1'></div>

      {/* Theme Toggle - Right-aligned */}
      <div className='p-3 flex items-center justify-between w-full'>
        <span className='text-sm'>Theme</span>
        <div className='flex gap-1 bg-light-card dark:bg-dark-card p-1 rounded-lg'>
          <button
            onClick={() => setTheme('system')}
            className={`p-1.5 rounded-md ${
              theme === 'system'
                ? 'bg-white dark:bg-dark-background shadow-sm'
                : 'hover:bg-light-background dark:hover:bg-dark-background'
            }`}
            aria-label='System theme'
          >
            <Monitor
              className={`h-4 w-4 ${
                theme === 'system'
                  ? 'text-light-primary dark:text-dark-primary'
                  : 'text-light-text-secondary dark:text-dark-text-secondary'
              }`}
            />
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-md ${
              theme === 'light'
                ? 'bg-white dark:bg-dark-background shadow-sm'
                : 'hover:bg-light-background dark:hover:bg-dark-background'
            }`}
            aria-label='Light theme'
          >
            <Sun
              className={`h-4 w-4 ${
                theme === 'light'
                  ? 'text-light-primary dark:text-dark-primary'
                  : 'text-light-text-secondary dark:text-dark-text-secondary'
              }`}
            />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-md ${
              theme === 'dark'
                ? 'bg-white dark:bg-dark-background shadow-sm'
                : 'hover:bg-light-background dark:hover:bg-dark-background'
            }`}
            aria-label='Dark theme'
          >
            <Moon
              className={`h-4 w-4 ${
                theme === 'dark'
                  ? 'text-light-primary dark:text-dark-primary'
                  : 'text-light-text-secondary dark:text-dark-text-secondary'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        className='p-3 text-red-500 hover:bg-light-card dark:hover:bg-dark-card flex items-center gap-3 text-left w-full'
        onClick={handleLogout}
      >
        <LogOut className='h-5 w-5' />
        <span className='text-sm'>Logout</span>
      </button>
    </Dropdown>
  );
};

export default ProfileDropdown;
