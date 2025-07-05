import useTranslator from '@/hooks/useTranslator';
import { ArrowRight, Globe, Star, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const CallToActionSection = () => {
  const t = useTranslator();

  return (
    <section className='relative pt-20 pb-0 px-4 overflow-hidden'>
      {/* Dramatic Background */}
      <div className='absolute inset-0 opacity-40 animate-pulse'>
        <div className='absolute -top-10 left-1/3 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl' />
        <div
          className='absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full blur-2xl'
          style={{ animationDelay: '1s' }}
        />
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30'
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Floating Particles */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-white/30 rounded-full animate-float'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className='max-w-4xl mx-auto relative z-10'>
        <div className='rounded-3xl border-2 border-white/20 dark:border-gray-700/50 shadow-2xl p-16 flex flex-col items-center text-center bg-white/10 dark:bg-gray-800/10 backdrop-blur-md animate-fade-in-scale'>
          {/* Glowing Background */}
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-xl' />

          {/* Heroic Icon */}
          <div className='relative mb-8 animate-fade-in-up delay-200'>
            <div className='w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl mb-4'>
              <Users className='w-12 h-12 text-white' />
            </div>
            <div className='absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse'>
              <Star className='w-4 h-4 text-white' />
            </div>
          </div>

          {/* Main Heading */}
          <h2 className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight animate-fade-in-up delay-400'>
            {t.landing?.cta_title}
          </h2>

          {/* Subtitle */}
          <p className='text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-12 max-w-3xl leading-relaxed animate-fade-in-up delay-600'>
            {t.landing?.cta_subtitle}
          </p>

          {/* Features Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-2xl animate-fade-in-up delay-800'>
            {[
              {
                icon: Zap,
                text: t.landing?.cta_feature_lightning_fast || 'Lightning Fast Setup',
                color: 'from-yellow-400 to-orange-500',
              },
              {
                icon: Globe,
                text: t.landing?.cta_feature_global_community || 'Global Community',
                color: 'from-blue-400 to-purple-500',
              },
              {
                icon: Star,
                text: t.landing?.cta_feature_premium_experience || 'Premium Experience',
                color: 'from-pink-400 to-purple-500',
              },
            ].map((feature, i) => (
              <div
                key={feature.text}
                className='flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20 transition-all duration-300 hover:scale-105'
                style={{ animationDelay: `${1 + i * 0.1}s` }}
              >
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                >
                  <feature.icon className='w-5 h-5 text-white' />
                </div>
                <span className='text-sm font-semibold text-gray-800 dark:text-white'>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-6 w-full justify-center animate-fade-in-up delay-1200'>
            <div className='transition-all duration-300 hover:scale-105 active:scale-95'>
              <Link
                href='/signup'
                className='inline-flex items-center justify-center gap-3 px-12 py-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 w-full sm:w-auto animate-pulse'
                aria-label='Get Started'
              >
                {t.landing?.cta_get_started_now}
                <ArrowRight className='w-6 h-6' />
              </Link>
            </div>

            <div className='transition-all duration-300 hover:scale-105 active:scale-95'>
              <Link
                href='#community'
                className='inline-flex items-center justify-center gap-3 px-12 py-6 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-800 dark:text-white font-bold text-xl shadow-2xl transition-all duration-300 border-2 border-white/30 w-full sm:w-auto'
                aria-label='Browse Games'
              >
                {t.landing?.cta_browse_games}
                <Globe className='w-6 h-6' />
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className='flex flex-wrap justify-center gap-8 mt-12 text-sm text-gray-600 dark:text-gray-300 animate-fade-in-up delay-1400'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span>{t.landing?.cta_trust_active_players}</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
              <span>{t.landing?.cta_trust_cities}</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
              <span>{t.landing?.cta_trust_support}</span>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 to-white/5 dark:from-gray-800/0 dark:to-gray-800/5 opacity-0 hover:opacity-100 transition-opacity duration-500' />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-40px);
            opacity: 0.9;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 1s ease-out;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-800 {
          animation-delay: 0.8s;
        }

        .delay-1200 {
          animation-delay: 1.2s;
        }

        .delay-1400 {
          animation-delay: 1.4s;
        }
      `}</style>
    </section>
  );
};

export default CallToActionSection;
