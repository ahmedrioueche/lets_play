import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe, Heart, MessageCircle, Rocket, ShieldCheck, Users, Zap } from 'lucide-react';
import { useRef } from 'react';

const features = [
  {
    icon: Rocket,
    title: 'Lightning Fast',
    desc: 'Instantly find and join games near you with real-time updates.',
    color: 'from-pink-400 to-yellow-300',
    featured: true,
    delay: 0,
  },
  {
    icon: Users,
    title: 'Vibrant Community',
    desc: 'Meet, chat, and play with players from all over the world.',
    color: 'from-blue-400 to-purple-400',
    featured: false,
    delay: 0.2,
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    desc: 'Your data and privacy are protected with industry-leading security.',
    color: 'from-green-400 to-blue-300',
    featured: false,
    delay: 0.4,
  },
  {
    icon: MessageCircle,
    title: 'Seamless Chat',
    desc: 'Message friends and new players with our integrated chat.',
    color: 'from-yellow-400 to-pink-400',
    featured: false,
    delay: 0.6,
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    desc: 'Get instant notifications about new games and player activities.',
    color: 'from-purple-400 to-pink-300',
    featured: false,
    delay: 0.8,
  },
  {
    icon: Globe,
    title: 'Global Reach',
    desc: 'Connect with players worldwide and discover new gaming communities.',
    color: 'from-indigo-400 to-purple-300',
    featured: false,
    delay: 1.0,
  },
];

const FeaturesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id='features' ref={containerRef} className='relative py-32 px-4 overflow-hidden'>
      {/* Parallax Background Elements */}
      <motion.div className='absolute inset-0 opacity-20' style={{ y }}>
        <div className='absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl' />
        <div className='absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full blur-3xl' />
        <div className='absolute bottom-20 left-1/4 w-56 h-56 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-3xl' />
        <div className='absolute bottom-40 right-1/3 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl' />
      </motion.div>

      {/* Floating Particles */}
      <motion.div className='absolute inset-0 pointer-events-none' style={{ opacity }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-white/30 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-20'
        >
          <h2 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
            Why Choose Us?
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
            Experience the future of social gaming with cutting-edge features designed for modern
            players.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: feature.delay,
                  duration: 0.8,
                  type: 'spring',
                  bounce: 0.4,
                }}
                whileHover={{
                  y: -15,
                  rotateY: 5,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                className={`relative group perspective-1000 ${feature.featured ? 'lg:col-span-2' : ''}`}
              >
                {/* 3D Card Container */}
                <div
                  className={`relative transform-style-preserve-3d transition-all duration-500 group-hover:rotate-y-5 ${feature.featured ? 'lg:col-span-2' : ''}`}
                >
                  <motion.div
                    className={`relative border-2 border-white/20 dark:border-gray-700/50 rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center transition-all duration-500 cursor-pointer hover:z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md ${feature.featured ? 'ring-4 ring-pink-300/50 dark:ring-yellow-400/50' : ''}`}
                    whileHover={{
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    {/* Glowing Background */}
                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500`}
                    />

                    {/* Icon Container */}
                    <motion.div
                      className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                      }}
                    >
                      <Icon className='w-10 h-10 text-white drop-shadow-lg' />
                      {feature.featured && (
                        <motion.div
                          className='absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center'
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Heart className='w-3 h-3 text-white' />
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Featured Badge */}
                    {feature.featured && (
                      <motion.span
                        className='absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg'
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: 'easeInOut',
                        }}
                      >
                        Featured
                      </motion.span>
                    )}

                    {/* Content */}
                    <h3 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500'>
                      {feature.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-500'>
                      {feature.desc}
                    </p>

                    {/* Hover Effect Overlay */}
                    <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 to-white/5 dark:from-gray-800/0 dark:to-gray-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className='absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20'
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    delay: feature.delay,
                  }}
                />
                <motion.div
                  className='absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-20'
                  animate={{
                    y: [0, 10, 0],
                    scale: [1, 0.8, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    delay: feature.delay + 0.5,
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
          transition={{ delay: 1.2, duration: 0.8 }}
          className='text-center mt-16'
        >
          <motion.div
            className='inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-xl cursor-pointer'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className='w-5 h-5' />
            Explore All Features
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
