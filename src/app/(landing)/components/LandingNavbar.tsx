import useTranslator from '@/hooks/useTranslator';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LandingNavbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslator();

  const navLinks = [
    { id: 'features', label: t.landing?.navbar_features || 'Features', href: '#features' },
    { id: 'how', label: t.landing?.navbar_how_it_works || 'How It Works', href: '#how' },
    { id: 'settings', label: t.landing?.navbar_settings || 'Settings', href: '#settings' },
    { id: 'community', label: t.landing?.navbar_community || 'Community', href: '#community' },
    { id: 'faq', label: t.landing?.navbar_faq || 'FAQ', href: '#faq' },
    { id: 'contact', label: t.landing?.navbar_contact || 'Contact', href: '#contact' },
  ];

  return (
    <nav className='fixed top-0 left-0 w-full z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg shadow-lg border-b border-blue-100 dark:border-blue-900 animate-fade-in-down'>
      <div className='max-w-7xl mx-auto flex items-center justify-between px-2 py-4'>
        <div onClick={() => router.push('/')} className='flex items-center gap-3 cursor-pointer'>
          <Image src='/images/logo.svg' alt='Logo' width={40} height={40} className='h-10 w-auto' />
          <span className='font-bold text-xl font-dancing bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            {t.app?.name}
          </span>
        </div>
        <div className='hidden lg:flex items-center gap-8'>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className='relative text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105 focus:outline-none'
              tabIndex={0}
              aria-label={link.label}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.location.assign(link.href);
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className='hidden lg:flex items-center gap-4'>
          <Link
            href='/auth/signup'
            className='px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
          >
            {t.landing?.navbar_get_started}
          </Link>
          <Link
            href='/auth/login'
            className='px-6 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400'
          >
            {t.landing?.navbar_login}
          </Link>
        </div>
        <button
          className='lg:hidden p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none'
          onClick={() => setOpen((v) => !v)}
          aria-label='Menu'
        >
          {open ? <X className='w-7 h-7' /> : <Menu className='w-7 h-7' />}
        </button>
      </div>
      {/* Mobile Menu */}
      {open && (
        <div className='lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-t border-blue-100 dark:border-blue-900 px-6 py-4 flex flex-col gap-4 animate-fade-in-down'>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className='text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
              tabIndex={0}
              aria-label={link.label}
              onClick={() => setOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.location.assign(link.href);
                }
              }}
            >
              {link.label}
            </a>
          ))}
          <Link
            href='/auth/signup'
            className='mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 text-center'
            onClick={() => setOpen(false)}
          >
            {t.landing?.navbar_get_started}
          </Link>
          <Link
            href='/auth/login'
            className='mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 text-center'
            onClick={() => setOpen(false)}
          >
            {t.landing?.navbar_login}
          </Link>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.7s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default LandingNavbar;
