import { contacts } from '@/data/contact';
import useTranslator from '@/hooks/useTranslator';
import { Facebook, Github, Instagram, Linkedin, Mail } from 'lucide-react';

const LandingFooter = () => {
  const t = useTranslator();

  const footerLinks = [
    { label: t.landing?.footer_features || 'Features', href: '#features' },
    { label: t.landing?.footer_how_it_works || 'How It Works', href: '#how' },
    { label: t.landing?.footer_settings || 'Settings', href: '#settings' },
    { label: t.landing?.footer_community || 'Community', href: '#community' },
    { label: t.landing?.footer_faq || 'FAQ', href: '#faq' },
  ];

  const socialLinks = [
    { icon: Github, href: contacts.github, label: 'GitHub' },
    { icon: Linkedin, href: contacts.linkedin, label: 'LinkedIn' },
    { icon: Facebook, href: contacts.facebook, label: 'Facebook' },
    { icon: Instagram, href: contacts.instagram, label: 'Instagram' },
    { icon: Mail, href: `mailto:${contacts.email}`, label: 'Email' },
  ];

  return (
    <footer className='w-full border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 animate-fade-in-up'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 mb-8'>
          {/* Logo and Name */}
          <div className='flex items-center gap-3 animate-fade-in-left delay-200'>
            <img src='/images/logo.svg' alt='Logo' className='h-10 w-auto' />
            <span className='font-bold text-xl font-dancing bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              {t.app?.name}
            </span>
          </div>

          {/* Links */}
          <div className='flex flex-wrap gap-8 justify-center animate-fade-in-up delay-300'>
            {footerLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className='text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-lg px-2 py-1'
                style={{ animationDelay: `${0.4 + i * 0.05}s` }}
                tabIndex={0}
                aria-label={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className='flex gap-4 animate-fade-in-right delay-400'>
            {socialLinks.map((social, i) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={social.label}
                  className='p-3 rounded-full bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/50 border border-gray-200 dark:border-gray-700'
                  style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                >
                  <Icon className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                </a>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className='w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-6 animate-timeline-line delay-600' />

        {/* Copyright */}
        <div className='text-center text-gray-500 dark:text-gray-400 text-sm animate-fade-in-up delay-700'>
          &copy; {new Date().getFullYear()} {t.app?.name}. {t.landing?.footer_copyright}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes timelineLine {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out;
        }

        .animate-timeline-line {
          animation: timelineLine 0.8s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </footer>
  );
};

export default LandingFooter;
