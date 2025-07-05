import useTranslator from '@/hooks/useTranslator';
import { ArrowRight, CheckCircle, Play, Rocket, Star, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HowItWorksSection = () => {
  const t = useTranslator();

  const steps = [
    {
      icon: Star,
      title: t.landing?.step_signup_title || 'Sign Up',
      desc:
        t.landing?.step_signup_desc ||
        'Create your free account in seconds with just a few clicks.',
      color: 'from-yellow-400 to-orange-500',
      delay: 0,
    },
    {
      icon: Users,
      title: t.landing?.step_connect_title || 'Connect',
      desc: t.landing?.step_connect_desc || 'Find and connect with players nearby or worldwide.',
      color: 'from-blue-400 to-purple-500',
      delay: 0.3,
    },
    {
      icon: Rocket,
      title: t.landing?.step_play_title || 'Play',
      desc: t.landing?.step_play_desc || 'Join or organize games and start playing instantly.',
      color: 'from-green-400 to-blue-500',
      delay: 0.6,
    },
  ];

  const router = useRouter();

  return (
    <section id='how' className='relative py-32 px-4 overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 opacity-30'>
        <div className='absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-2xl animate-pulse' />
        <div
          className='absolute -bottom-20 right-10 w-56 h-56 bg-gradient-to-r from-blue-400 to-green-400 rounded-full blur-2xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse'
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Floating Elements */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className='absolute w-3 h-3 bg-white/20 rounded-full animate-float'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className='max-w-6xl mx-auto relative z-10'>
        <div className='text-center mb-20 animate-fade-in-up'>
          <h2 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'>
            {t.landing?.how_title}
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
            {t.landing?.how_subtitle}
          </p>
        </div>

        {/* Timeline Container */}
        <div className='relative'>
          {/* Timeline Line */}
          <div
            className='absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent transform -translate-y-1/2 hidden lg:block animate-timeline-line'
            style={{ animationDelay: '0.5s' }}
          />

          <div className='flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16'>
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className='relative group animate-fade-in-up'
                  style={{ animationDelay: `${step.delay}s` }}
                >
                  {/* Step Card */}
                  <div className='relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-white/20 dark:border-gray-700/50 rounded-3xl shadow-2xl p-8 text-center max-w-sm hover:shadow-3xl transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:scale-105'>
                    {/* Glowing Background */}
                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500`}
                    />

                    {/* Step Number */}
                    <div
                      className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-500 group-hover:scale-120 group-hover:rotate-360`}
                    >
                      {i + 1}
                    </div>

                    {/* Icon Container */}
                    <div
                      className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-500 mt-4 group-hover:scale-110 group-hover:rotate-5`}
                    >
                      <Icon className='w-10 h-10 text-white drop-shadow-lg' />

                      {/* Animated Ring */}
                      <div
                        className='absolute inset-0 rounded-2xl border-2 border-white/30 animate-pulse-ring'
                        style={{ animationDelay: `${step.delay}s` }}
                      />
                    </div>

                    {/* Content */}
                    <h3 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-500'>
                      {step.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-500'>
                      {step.desc}
                    </p>

                    {/* Success Checkmark */}
                    <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-100'>
                      <CheckCircle className='w-6 h-6 text-green-500' />
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 to-white/5 dark:from-gray-800/0 dark:to-gray-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  </div>

                  {/* Connection Arrow (Desktop) */}
                  {i < steps.length - 1 && (
                    <div
                      className='hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-20 animate-fade-in-left'
                      style={{ animationDelay: `${step.delay + 0.5}s` }}
                    >
                      <div className='w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110'>
                        <ArrowRight className='w-6 h-6 text-white' />
                      </div>
                    </div>
                  )}

                  {/* Connection Line (Mobile) */}
                  {i < steps.length - 1 && (
                    <div
                      className='lg:hidden w-1 h-16 bg-gradient-to-b from-purple-500 to-pink-500 mx-auto my-4 animate-timeline-line-vertical'
                      style={{ animationDelay: `${step.delay + 0.3}s` }}
                    />
                  )}

                  {/* Floating Elements */}
                  <div
                    className='absolute -top-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 animate-float'
                    style={{ animationDelay: `${step.delay}s` }}
                  />
                  <div
                    className='absolute -bottom-4 -right-4 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 animate-float-reverse'
                    style={{ animationDelay: `${step.delay + 0.5}s` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className='text-center mt-16 animate-fade-in-up'
          style={{ animationDelay: '1.2s' }}
          onClick={() => router.push('/auth/signup')}
        >
          <div className='inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95'>
            <Play className='w-5 h-5' />
            {t.landing?.start_your_journey}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.8;
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(10px);
            opacity: 0.8;
          }
        }

        @keyframes pulseRing {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.3);
            opacity: 0;
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

        @keyframes timelineLineVertical {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.5s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: floatReverse 4s ease-in-out infinite;
        }

        .animate-pulse-ring {
          animation: pulseRing 2s ease-in-out infinite;
        }

        .animate-timeline-line {
          animation: timelineLine 1.5s ease-out;
        }

        .animate-timeline-line-vertical {
          animation: timelineLineVertical 0.5s ease-out;
        }

        .scale-120 {
          transform: scale(1.2);
        }

        .rotate-360 {
          transform: rotate(360deg);
        }

        .scale-100 {
          transform: scale(1);
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;
