import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'how', label: 'How It Works', href: '#how' },
  { id: 'settings', label: 'Settings', href: '#settings' },
  { id: 'community', label: 'Community', href: '#community' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

const LandingNavbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className='fixed top-0 left-0 w-full z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg shadow-lg border-b border-blue-100 dark:border-blue-900'
    >
      <div className='max-w-7xl mx-auto flex items-center justify-between px-2 py-4'>
        <div onClick={() => router.push('/')} className='flex items-center gap-3 cursor-pointer'>
          <Image src='/images/logo.svg' alt='Logo' width={40} height={40} className='h-10 w-auto' />
          <span className='font-bold text-xl font-dancing bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Let's Play
          </span>
        </div>
        <div className='hidden lg:flex items-center gap-8'>
          {navLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.href}
              className='relative text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none'
              tabIndex={0}
              aria-label={link.label}
              whileHover={{ scale: 1.08 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.location.assign(link.href);
                }
              }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
        <div className='hidden lg:flex items-center gap-4'>
          <Link
            href='/auth/signup'
            className='px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
          >
            Get Started
          </Link>
          <Link
            href='/auth/login'
            className='px-6 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400'
          >
            Login
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
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className='lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-t border-blue-100 dark:border-blue-900 px-6 py-4 flex flex-col gap-4 animate-fade-in-down'
        >
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
            Get Started
          </Link>
          <Link
            href='/auth/login'
            className='mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 text-center'
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default LandingNavbar;
