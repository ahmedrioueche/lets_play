import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Globe, Star, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

const CallToActionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className='relative pt-20 pb-0 px-4 overflow-hidden'>
      {/* Dramatic Background */}
      <motion.div className='absolute inset-0 opacity-40' style={{ y }}>
        <motion.div
          className='absolute -top-10 left-1/3 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl'
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ repeat: Infinity, duration: 15 }}
        />
        <motion.div
          className='absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full blur-2xl'
          animate={{
            scale: [1.5, 1, 1.5],
            rotate: [360, 180, 0],
          }}
          transition={{ repeat: Infinity, duration: 20 }}
        />
        <motion.div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30'
          animate={{
            scale: [1, 1.8, 1],
          }}
          transition={{ repeat: Infinity, duration: 25 }}
        />
      </motion.div>

      {/* Floating Particles */}
      <motion.div className='absolute inset-0 pointer-events-none' style={{ opacity }}>
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-white/30 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      <div className='max-w-4xl mx-auto relative z-10'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: 'spring' }}
          className='rounded-3xl border-2 border-white/20 dark:border-gray-700/50 shadow-2xl p-16 flex flex-col items-center text-center bg-white/10 dark:bg-gray-800/10 backdrop-blur-md'
        >
          {/* Glowing Background */}
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-xl' />

          {/* Heroic Icon */}
          <motion.div
            className='relative mb-8'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className='w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl mb-4'>
              <Users className='w-12 h-12 text-white' />
            </div>
            <motion.div
              className='absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center'
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Star className='w-4 h-4 text-white' />
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight'
          >
            Ready to get started?
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className='text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-12 max-w-3xl leading-relaxed'
          >
            Join the most vibrant play community. Find games, meet friends, and have fun—anytime,
            anywhere!
          </motion.p>

          {/* Features Grid */}
          <motion.div
            className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-2xl'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {[
              { icon: Zap, text: 'Lightning Fast Setup', color: 'from-yellow-400 to-orange-500' },
              { icon: Globe, text: 'Global Community', color: 'from-blue-400 to-purple-500' },
              { icon: Star, text: 'Premium Experience', color: 'from-pink-400 to-purple-500' },
            ].map((feature, i) => (
              <motion.div
                key={feature.text}
                className='flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20'
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                >
                  <feature.icon className='w-5 h-5 text-white' />
                </div>
                <span className='text-sm font-semibold text-gray-800 dark:text-white'>
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className='flex flex-col sm:flex-row gap-6 w-full justify-center'
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href='/signup'
                className='inline-flex items-center justify-center gap-3 px-12 py-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 w-full sm:w-auto animate-pulse'
                aria-label='Get Started'
              >
                Get Started Now
                <ArrowRight className='w-6 h-6' />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href='#community'
                className='inline-flex items-center justify-center gap-3 px-12 py-6 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-800 dark:text-white font-bold text-xl shadow-2xl transition-all duration-300 border-2 border-white/30 w-full sm:w-auto'
                aria-label='Browse Games'
              >
                Browse Games
                <Globe className='w-6 h-6' />
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className='flex flex-wrap justify-center gap-8 mt-12 text-sm text-gray-600 dark:text-gray-300'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span>10K+ Active Players</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
              <span>500+ Cities</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
              <span>24/7 Support</span>
            </div>
          </motion.div>

          {/* Hover Effect Overlay */}
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 to-white/5 dark:from-gray-800/0 dark:to-gray-800/5 opacity-0 hover:opacity-100 transition-opacity duration-500' />
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
