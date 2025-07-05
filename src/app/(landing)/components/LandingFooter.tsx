import { contacts } from '@/data/contact';
import useTranslator from '@/hooks/useTranslator';
import { motion } from 'framer-motion';
import { Facebook, Github, Instagram, Linkedin, Mail } from 'lucide-react';

const LandingFooter = () => {
  const t = useTranslator();

  const footerLinks = [
    { label: t.landing?.footer_features || 'Features', href: '#features' },
    { label: t.landing?.footer_how_it_works || 'How It Works', href: '#how' },
    { label: t.landing?.footer_settings || 'Settings', href: '#settings' },
    { label: t.landing?.footer_community || 'Community', href: '#community' },
    { label: t.landing?.footer_faq || 'FAQ', href: '#faq' },
    { label: t.landing?.footer_contact || 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Github, href: contacts.github, label: 'GitHub' },
    { icon: Linkedin, href: contacts.linkedin, label: 'LinkedIn' },
    { icon: Facebook, href: contacts.facebook, label: 'Facebook' },
    { icon: Instagram, href: contacts.instagram, label: 'Instagram' },
    { icon: Mail, href: `mailto:${contacts.email}`, label: 'Email' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className='w-full border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 px-4'
    >
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 mb-8'>
          {/* Logo and Name */}
          <motion.div
            className='flex items-center gap-3'
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img src='/images/logo.svg' alt='Logo' className='h-10 w-auto' />
            <span className='font-bold text-xl font-dancing bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              {t.app?.name}
            </span>
          </motion.div>

          {/* Links */}
          <motion.div
            className='flex flex-wrap gap-8 justify-center'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {footerLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className='text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-lg px-2 py-1'
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                tabIndex={0}
                aria-label={link.label}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Socials */}
          <motion.div
            className='flex gap-4'
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {socialLinks.map((social, i) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={social.label}
                  className='p-3 rounded-full bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 border border-gray-200 dark:border-gray-700'
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                >
                  <Icon className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className='w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-6'
        />

        {/* Copyright */}
        <motion.div
          className='text-center text-gray-500 dark:text-gray-400 text-sm'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          &copy; {new Date().getFullYear()} {t.app?.name}. {t.landing?.footer_copyright}
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default LandingFooter;
