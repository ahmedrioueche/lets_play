import useTranslator from '@/hooks/useTranslator';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, User } from 'lucide-react';
import { useRef, useState } from 'react';

const TestimonialsSection = () => {
  const t = useTranslator();

  const testimonials = [
    {
      name: t.landing?.testimonial_alex_name || 'Alex P.',
      role: t.landing?.testimonial_alex_role || 'Football Player',
      text:
        t.landing?.testimonial_alex_text ||
        'This platform made it so easy to find pickup games in my city! The real-time updates and chat feature are game-changers.',
      color: 'from-blue-200 to-pink-100',
      rating: 5,
    },
    {
      name: t.landing?.testimonial_samira_name || 'Samira K.',
      role: t.landing?.testimonial_samira_role || 'Tennis Coach',
      text:
        t.landing?.testimonial_samira_text ||
        'I met so many new friends and teammates. The chat is seamless and the community is incredibly supportive.',
      color: 'from-yellow-200 to-blue-100',
      rating: 5,
    },
    {
      name: t.landing?.testimonial_jordan_name || 'Jordan L.',
      role: t.landing?.testimonial_jordan_role || 'Basketball Player',
      text:
        t.landing?.testimonial_jordan_text ||
        'The design is beautiful and everything just works. Love the intuitive interface and how easy it is to organize games.',
      color: 'from-pink-200 to-yellow-100',
      rating: 5,
    },
    {
      name: t.landing?.testimonial_maria_name || 'Maria S.',
      role: t.landing?.testimonial_maria_role || 'Volleyball Enthusiast',
      text:
        t.landing?.testimonial_maria_text ||
        'Finally found a platform that connects sports lovers worldwide. The map feature helps me discover new courts and players.',
      color: 'from-green-200 to-blue-100',
      rating: 5,
    },
  ];

  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={containerRef} className='relative py-32 px-4 overflow-hidden'>
      {/* Parallax Background */}
      <motion.div className='absolute inset-0 opacity-20' style={{ y }}>
        <motion.div
          className='absolute -top-16 left-1/4 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-2xl'
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ repeat: Infinity, duration: 15 }}
        />
        <motion.div
          className='absolute -bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-2xl'
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
          }}
          transition={{ repeat: Infinity, duration: 20 }}
        />
        <motion.div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400 to-green-400 rounded-full blur-3xl opacity-30'
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{ repeat: Infinity, duration: 25 }}
        />
      </motion.div>

      {/* Floating Particles */}
      <motion.div className='absolute inset-0 pointer-events-none' style={{ opacity }}>
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
              opacity: [0.2, 0.8, 0.2],
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
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-20'
        >
          <h2 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
            {t.landing?.testimonials_title}
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
            {t.landing?.testimonials_subtitle}
          </p>
        </motion.div>

        {/* 3D Carousel Container */}
        <div className='relative flex justify-center items-center'>
          {/* Navigation Buttons */}
          <motion.button
            onClick={prev}
            aria-label='Previous testimonial'
            className='absolute left-4 lg:left-8 z-30 rounded-full p-4 bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-400/50'
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className='w-6 h-6 text-white' />
          </motion.button>

          <motion.button
            onClick={next}
            aria-label='Next testimonial'
            className='absolute right-4 lg:right-8 z-30 rounded-full p-4 bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-400/50'
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className='w-6 h-6 text-white' />
          </motion.button>

          {/* Testimonials Display */}
          <div className='relative w-full max-w-4xl h-[500px] perspective-1000'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={index}
                initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
                className='w-full h-full flex items-center justify-center'
              >
                {/* Main Testimonial Card */}
                <motion.div
                  className='relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-2 border-white/30 dark:border-gray-700/50 rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto transform-style-preserve-3d'
                  whileHover={{
                    rotateY: 5,
                    scale: 1.02,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Glowing Background */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${testimonials[index].color} opacity-10 blur-xl`}
                  />

                  {/* Quote Icon */}
                  <motion.div
                    className='absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg'
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: 'easeInOut',
                    }}
                  >
                    <Quote className='w-6 h-6 text-white' />
                  </motion.div>

                  {/* User Avatar */}
                  <motion.div
                    className='absolute -top-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800'
                    whileHover={{
                      scale: 1.1,
                      rotate: 360,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <User className='w-8 h-8 text-white' />
                  </motion.div>

                  {/* Rating Stars */}
                  <motion.div
                    className='flex justify-center gap-1 mb-6'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {[...Array(testimonials[index].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.5, type: 'spring' }}
                      >
                        <Star className='w-6 h-6 text-yellow-400 fill-current' />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Testimonial Text */}
                  <motion.p
                    className='text-xl lg:text-2xl italic mb-8 text-gray-800 dark:text-white leading-relaxed text-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    "{testimonials[index].text}"
                  </motion.p>

                  {/* User Info */}
                  <motion.div
                    className='text-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className='font-bold text-xl text-gray-800 dark:text-white mb-1'>
                      {testimonials[index].name}
                    </div>
                    <div className='text-gray-600 dark:text-gray-300 font-medium'>
                      {testimonials[index].role}
                    </div>
                  </motion.div>

                  {/* Hover Effect Overlay */}
                  <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 to-white/5 dark:from-gray-800/0 dark:to-gray-800/5 opacity-0 hover:opacity-100 transition-opacity duration-500' />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Indicator */}
        <motion.div
          className='flex justify-center gap-3 mt-8'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className='flex flex-wrap justify-center gap-8 mt-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {[
            { label: t.landing?.stats_happy_players || 'Happy Players', value: '10K+' },
            { label: t.landing?.stats_games_played || 'Games Played', value: '50K+' },
            { label: t.landing?.stats_cities_covered || 'Cities Covered', value: '500+' },
            { label: t.landing?.stats_rating || 'Rating', value: '4.9★' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className='text-center'
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
            >
              <div className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                {stat.value}
              </div>
              <div className='text-gray-600 dark:text-gray-300 text-sm'>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
