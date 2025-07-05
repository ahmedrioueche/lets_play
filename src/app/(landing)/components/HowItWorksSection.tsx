import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle, Play, Rocket, Star, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

const steps = [
  {
    icon: Star,
    title: 'Sign Up',
    desc: 'Create your free account in seconds with just a few clicks.',
    color: 'from-yellow-400 to-orange-500',
    delay: 0,
  },
  {
    icon: Users,
    title: 'Connect',
    desc: 'Find and connect with players nearby or worldwide.',
    color: 'from-blue-400 to-purple-500',
    delay: 0.3,
  },
  {
    icon: Rocket,
    title: 'Play',
    desc: 'Join or organize games and start playing instantly.',
    color: 'from-green-400 to-blue-500',
    delay: 0.6,
  },
];

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const router = useRouter();

  return (
    <section id='how' ref={containerRef} className='relative py-32 px-4 overflow-hidden'>
      {/* Animated Background */}
      <motion.div className='absolute inset-0 opacity-30' style={{ y }}>
        <motion.div
          className='absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-2xl'
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ repeat: Infinity, duration: 20 }}
        />
        <motion.div
          className='absolute -bottom-20 right-10 w-56 h-56 bg-gradient-to-r from-blue-400 to-green-400 rounded-full blur-2xl'
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ repeat: Infinity, duration: 25 }}
        />
        <motion.div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur-3xl opacity-20'
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{ repeat: Infinity, duration: 15 }}
        />
      </motion.div>

      {/* Floating Elements */}
      <motion.div className='absolute inset-0 pointer-events-none' style={{ opacity }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-3 h-3 bg-white/20 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
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
          <h2 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'>
            How It Works
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
            Get started in just three simple steps and join the gaming revolution
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className='relative'>
          {/* Timeline Line */}
          <motion.div
            className='absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent transform -translate-y-1/2 hidden lg:block'
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          <div className='flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16'>
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: step.delay,
                    duration: 0.8,
                    type: 'spring',
                    bounce: 0.4,
                  }}
                  className='relative group'
                >
                  {/* Step Card */}
                  <motion.div
                    className='relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-white/20 dark:border-gray-700/50 rounded-3xl shadow-2xl p-8 text-center max-w-sm hover:shadow-3xl transition-all duration-500 cursor-pointer'
                    whileHover={{
                      y: -10,
                      scale: 1.05,
                      transition: { duration: 0.3 },
                    }}
                  >
                    {/* Glowing Background */}
                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500`}
                    />

                    {/* Step Number */}
                    <motion.div
                      className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                      whileHover={{
                        scale: 1.2,
                        rotate: 360,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {i + 1}
                    </motion.div>

                    {/* Icon Container */}
                    <motion.div
                      className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-500 mt-4`}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                      }}
                    >
                      <Icon className='w-10 h-10 text-white drop-shadow-lg' />

                      {/* Animated Ring */}
                      <motion.div
                        className='absolute inset-0 rounded-2xl border-2 border-white/30'
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: step.delay,
                        }}
                      />
                    </motion.div>

                    {/* Content */}
                    <h3 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-500'>
                      {step.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-500'>
                      {step.desc}
                    </p>

                    {/* Success Checkmark */}
                    <motion.div
                      className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <CheckCircle className='w-6 h-6 text-green-500' />
                    </motion.div>

                    {/* Hover Effect Overlay */}
                    <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 to-white/5 dark:from-gray-800/0 dark:to-gray-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  </motion.div>

                  {/* Connection Arrow (Desktop) */}
                  {i < steps.length - 1 && (
                    <motion.div
                      className='hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-20'
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: step.delay + 0.5, duration: 0.5 }}
                    >
                      <motion.div
                        className='w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg'
                        whileHover={{ scale: 1.1 }}
                      >
                        <ArrowRight className='w-6 h-6 text-white' />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Connection Line (Mobile) */}
                  {i < steps.length - 1 && (
                    <motion.div
                      className='lg:hidden w-1 h-16 bg-gradient-to-b from-purple-500 to-pink-500 mx-auto my-4'
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: step.delay + 0.3, duration: 0.5 }}
                    />
                  )}

                  {/* Floating Elements */}
                  <motion.div
                    className='absolute -top-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30'
                    animate={{
                      y: [0, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      delay: step.delay,
                    }}
                  />
                  <motion.div
                    className='absolute -bottom-4 -right-4 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30'
                    animate={{
                      y: [0, 10, 0],
                      scale: [1, 0.8, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      delay: step.delay + 0.5,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className='text-center mt-16'
          onClick={() => router.push('/auth/signup')}
        >
          <motion.div
            className='inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-xl cursor-pointer'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className='w-5 h-5' />
            Start Your Journey
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
