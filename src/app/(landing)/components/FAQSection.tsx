import useTranslator from '@/hooks/useTranslator';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, HelpCircle, MapPin, Shield, Users, Zap } from 'lucide-react';
import { useState } from 'react';
import ContactSupportModal from './ContactSupportModal';

const faqs = [
  {
    id: 1,
    question: 'How do I find games near me?',
    answer:
      "Simply open the app and use our smart location feature. We'll show you all available games within your area, complete with details like skill level, number of players, and game type. You can also set up notifications for new games in your preferred sports.",
    icon: MapPin,
    category: 'Getting Started',
  },
  {
    id: 2,
    question: 'Is it safe to play with strangers?',
    answer:
      'Absolutely! We prioritize your safety with verified user profiles, community ratings, and secure messaging. All users go through a verification process, and you can read reviews from other players before joining any game.',
    icon: Shield,
    category: 'Safety',
  },
  {
    id: 3,
    question: 'Can I organize my own games?',
    answer:
      'Yes! Creating games is super easy. Just tap the "Create Game" button, choose your sport, set the location, time, and skill level. You can also set a maximum number of players and add special requirements if needed.',
    icon: Users,
    category: 'Organizing',
  },
  {
    id: 4,
    question: 'What sports are supported?',
    answer:
      'We support a wide range of sports including football, basketball, tennis, volleyball, badminton, and many more. New sports are added regularly based on community demand. You can also suggest new sports through our feedback system.',
    icon: Zap,
    category: 'Sports',
  },
  {
    id: 5,
    question: 'How do I communicate with other players?',
    answer:
      'Our built-in chat system allows you to message other players directly or in group chats for specific games. You can also share photos, locations, and coordinate meetups all within the app.',
    icon: Users,
    category: 'Communication',
  },
  {
    id: 6,
    question: 'What if I need to cancel a game?',
    answer:
      'No worries! You can cancel your participation up to 2 hours before the game starts. The organizer will be notified, and other players can take your spot. For organizers, you can cancel games with automatic notifications to all participants.',
    icon: Shield,
    category: 'Cancellations',
  },
];

const FAQSection = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const t = useTranslator();

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const handleContactSupport = () => {
    setIsContactModalOpen(true);
  };

  return (
    <>
      <section id='faq' className='relative py-32 px-4 overflow-hidden'>
        {/* Animated Background */}
        <motion.div
          className='absolute inset-0 opacity-20'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className='absolute -top-16 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl'
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ repeat: Infinity, duration: 20 }}
          />
          <motion.div
            className='absolute -bottom-20 right-10 w-56 h-56 bg-gradient-to-r from-blue-400 to-green-400 rounded-full blur-2xl'
            animate={{
              scale: [1.3, 1, 1.3],
              rotate: [360, 180, 0],
            }}
            transition={{ repeat: Infinity, duration: 25 }}
          />
          <motion.div
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-30'
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{ repeat: Infinity, duration: 30 }}
          />
        </motion.div>

        {/* Floating Particles */}
        <motion.div
          className='absolute inset-0 pointer-events-none'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className='absolute w-2 h-2 bg-white/20 rounded-full'
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -25, 0],
                x: [0, Math.random() * 15 - 7.5, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>

        <div className='max-w-6xl mx-auto relative z-10'>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent'>
              {t.landing?.faq_title || 'Frequently Asked Questions'}
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
              {t.landing?.faq_subtitle ||
                "Everything you need to know about Let's Play. Can't find what you're looking for? Contact our support team!"}
            </p>
          </motion.div>

          {/* FAQ Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className='relative group'
                >
                  {/* FAQ Card */}
                  <motion.div
                    className={`relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden ${
                      openId === faq.id ? 'ring-2 ring-purple-400/50' : ''
                    }`}
                    whileHover={{ y: -5 }}
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    {/* Glowing Background */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-xl transition-opacity duration-500 ${
                        openId === faq.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    />

                    {/* Category Badge */}
                    <div className='absolute top-4 right-4'>
                      <span className='px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full'>
                        {faq.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className='p-6'>
                      <div className='flex items-start gap-4'>
                        {/* Icon */}
                        <motion.div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg ${
                            openId === faq.id ? 'scale-110' : ''
                          }`}
                          animate={{
                            rotate: openId === faq.id ? 360 : 0,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className='w-6 h-6 text-white' />
                        </motion.div>

                        {/* Question and Answer */}
                        <div className='flex-1'>
                          <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3 pr-8'>
                            {faq.question}
                          </h3>

                          <AnimatePresence>
                            {openId === faq.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className='overflow-hidden'
                              >
                                <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                                  {faq.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Chevron Icon */}
                        <motion.div
                          className={`w-6 h-6 text-gray-400 transition-colors duration-300 ${
                            openId === faq.id ? 'text-purple-500' : ''
                          }`}
                          animate={{
                            rotate: openId === faq.id ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className='w-full h-full' />
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/5 dark:from-gray-800/0 dark:to-gray-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  </motion.div>

                  {/* Floating Elements */}
                  <motion.div
                    className='absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30'
                    animate={{
                      y: [0, -8, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      delay: index * 0.2,
                    }}
                  />
                  <motion.div
                    className='absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30'
                    animate={{
                      y: [0, 8, 0],
                      scale: [1, 0.8, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      delay: index * 0.2 + 0.5,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className='text-center mt-16'
          >
            <div className='bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20'>
              <HelpCircle className='w-16 h-16 text-purple-500 mx-auto mb-4' />
              <h3 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
                {t.landing?.faq_still_have_questions || 'Still have questions?'}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto'>
                {t.landing?.faq_support_description ||
                  "Our support team is here to help you get the most out of Let's Play. We're available 24/7 to answer any questions you might have."}
              </p>
              <motion.button
                onClick={handleContactSupport}
                className='inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-xl cursor-pointer'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HelpCircle className='w-5 h-5' />
                {t.landing?.faq_contact_support || 'Contact Support'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Support Modal */}
      <ContactSupportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};

export default FAQSection;
