import Navbar from '@/components/Navbar';
import SideBar from '@/components/Sidebar';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from '../ProtectedRoute';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className='flex flex-col h-screen bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary'>
        <Navbar />
        <div className='flex flex-1 overflow-hidden'>
          <SideBar />
          <main className='flex-1 overflow-y-auto p-6 scrollbar-hide'>{children}</main>
        </div>
        <Toaster position='top-right' />
      </div>
    </ProtectedRoute>
  );
}
