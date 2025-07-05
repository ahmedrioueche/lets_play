import useTranslator from '@/hooks/useTranslator';
import { Globe, Heart, MessageCircle, Rocket, ShieldCheck, Users, Zap } from 'lucide-react';

const FeaturesSection = () => {
  const t = useTranslator();

  const features = [
    {
      icon: Rocket,
      title: t.landing?.feature_lightning_fast_title || 'Lightning Fast',
      desc:
        t.landing?.feature_lightning_fast_desc ||
        'Instantly find and join games near you with real-time updates.',
      color: 'from-pink-400 to-yellow-300',
      featured: true,
      delay: 0,
    },
    {
      icon: Users,
      title: t.landing?.feature_vibrant_community_title || 'Vibrant Community',
      desc:
        t.landing?.feature_vibrant_community_desc ||
        'Meet, chat, and play with players from all over the world.',
      color: 'from-blue-400 to-purple-400',
      featured: false,
      delay: 0.2,
    },
    {
      icon: ShieldCheck,
      title: t.landing?.feature_secure_private_title || 'Secure & Private',
      desc:
        t.landing?.feature_secure_private_desc ||
        'Your data and privacy are protected with industry-leading security.',
      color: 'from-green-400 to-blue-300',
      featured: false,
      delay: 0.4,
    },
    {
      icon: MessageCircle,
      title: t.landing?.feature_seamless_chat_title || 'Seamless Chat',
      desc:
        t.landing?.feature_seamless_chat_desc ||
        'Message friends and new players with our integrated chat.',
      color: 'from-yellow-400 to-pink-400',
      featured: false,
      delay: 0.6,
    },
    {
      icon: Zap,
      title: t.landing?.feature_realtime_updates_title || 'Real-time Updates',
      desc:
        t.landing?.feature_realtime_updates_desc ||
        'Get instant notifications about new games and player activities.',
      color: 'from-purple-400 to-pink-300',
      featured: false,
      delay: 0.8,
    },
    {
      icon: Globe,
      title: t.landing?.feature_global_reach_title || 'Global Reach',
      desc:
        t.landing?.feature_global_reach_desc ||
        'Connect with players worldwide and discover new gaming communities.',
      color: 'from-indigo-400 to-purple-300',
      featured: false,
      delay: 1.0,
    },
  ];

  return (
    <section id='features' className='relative py-32 px-4 overflow-hidden'>
      {/* Parallax Background Elements */}
      <div className='absolute inset-0 opacity-20 animate-pulse'>
        <div className='absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl' />
        <div className='absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full blur-3xl' />
        <div className='absolute bottom-20 left-1/4 w-56 h-56 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-3xl' />
        <div className='absolute bottom-40 right-1/3 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl' />
      </div>

      {/* Floating Particles */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-white/30 rounded-full animate-float'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-20 animate-fade-in-up'>
          <h2 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
            {t.landing?.features_title}
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`relative group perspective-1000 animate-fade-in-up ${feature.featured ? 'lg:col-span-2' : ''}`}
                style={{ animationDelay: `${feature.delay}s` }}
              >
                {/* 3D Card Container */}
                <div
                  className={`relative transform-style-preserve-3d transition-all duration-500 group-hover:rotate-y-5 ${feature.featured ? 'lg:col-span-2' : ''}`}
                >
                  <div
                    className={`relative border-2 border-white/20 dark:border-gray-700/50 rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center transition-all duration-500 cursor-pointer hover:z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:-translate-y-2 hover:scale-105 hover:shadow-3xl ${feature.featured ? 'ring-4 ring-pink-300/50 dark:ring-yellow-400/50' : ''}`}
                  >
                    {/* Glowing Background */}
                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500`}
                    />

                    {/* Icon Container */}
                    <div
                      className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-5`}
                    >
                      <Icon className='w-10 h-10 text-white drop-shadow-lg' />
                      {feature.featured && (
                        <div className='absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center animate-pulse'>
                          <Heart className='w-3 h-3 text-white' />
                        </div>
                      )}
                    </div>

                    {/* Featured Badge */}
                    {feature.featured && (
                      <span className='absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-bounce'>
                        {t.landing?.featured_badge}
                      </span>
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
                  </div>
                </div>

                {/* Floating Elements */}
                <div
                  className='absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-float'
                  style={{ animationDelay: `${feature.delay}s` }}
                />
                <div
                  className='absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-20 animate-float-reverse'
                  style={{ animationDelay: `${feature.delay + 0.5}s` }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className='text-center mt-16 animate-fade-in-up' style={{ animationDelay: '1.2s' }}>
          <div className='inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95'>
            <Zap className='w-5 h-5' />
            {t.landing?.explore_all_features}
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px);
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

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: floatReverse 4s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }

        .rotate-y-5 {
          transform: rotateY(5deg);
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
