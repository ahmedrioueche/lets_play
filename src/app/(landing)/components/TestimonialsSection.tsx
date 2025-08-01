import useTranslator from '@/hooks/useTranslator';
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

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={containerRef} className='relative py-32 px-4 overflow-hidden'>
      {/* Parallax Background */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute -top-16 left-1/4 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-2xl animate-pulse' />
        <div
          className='absolute -bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-2xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400 to-green-400 rounded-full blur-3xl opacity-30 animate-pulse'
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Floating Particles */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-white/20 rounded-full animate-float'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className='max-w-6xl mx-auto relative z-10'>
        <div className='text-center mb-20 animate-fade-in-up'>
          <h2 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
            {t.landing?.testimonials_title}
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
            {t.landing?.testimonials_subtitle}
          </p>
        </div>

        {/* 3D Carousel Container */}
        <div className='relative flex justify-center items-center'>
          {/* Navigation Buttons */}
          <button
            onClick={prev}
            aria-label='Previous testimonial'
            className='absolute left-4 lg:left-8 z-30 rounded-full p-4 bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-400/50 hover:-translate-x-1 active:scale-95'
          >
            <ChevronLeft className='w-6 h-6 text-light-text-primary dark:text-dark-text-primary' />
          </button>

          <button
            onClick={next}
            aria-label='Next testimonial'
            className='absolute right-4 lg:right-8 z-30 rounded-full p-4 bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-400/50 hover:translate-x-1 active:scale-95'
          >
            <ChevronRight className='w-6 h-6 text-light-text-primary dark:text-dark-text-primary' />
          </button>

          {/* Testimonials Display */}
          <div className='relative w-full max-w-4xl h-[500px] perspective-1000'>
            <div
              key={index}
              className='w-full h-full flex items-center justify-center animate-testimonial-in'
            >
              {/* Main Testimonial Card */}
              <div className='relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-2 border-white/30 dark:border-gray-700/50 rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto transform-style-preserve-3d transition-all duration-300 hover:scale-102 hover:rotate-y-5'>
                {/* Glowing Background */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${testimonials[index].color} opacity-10 blur-xl`}
                />

                {/* Quote Icon */}
                <div className='absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse'>
                  <Quote className='w-6 h-6 text-white' />
                </div>

                {/* User Avatar */}
                <div className='absolute -top-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800 transition-all duration-500 hover:scale-110 hover:rotate-360'>
                  <User className='w-8 h-8 text-white' />
                </div>

                {/* Rating Stars */}
                <div className='flex justify-center gap-1 mb-6 animate-fade-in-up delay-300'>
                  {[...Array(testimonials[index].rating)].map((_, i) => (
                    <div
                      key={i}
                      className='animate-star-in'
                      style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                    >
                      <Star className='w-6 h-6 text-yellow-400 fill-current' />
                    </div>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className='text-xl lg:text-2xl italic mb-8 text-gray-800 dark:text-white leading-relaxed text-center animate-fade-in-up delay-500'>
                  "{testimonials[index].text}"
                </p>

                {/* User Info */}
                <div className='text-center animate-fade-in-up delay-600'>
                  <div className='font-bold text-xl text-gray-800 dark:text-white mb-1'>
                    {testimonials[index].name}
                  </div>
                  <div className='text-gray-600 dark:text-gray-300 font-medium'>
                    {testimonials[index].role}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 to-white/5 dark:from-gray-800/0 dark:to-gray-800/5 opacity-0 hover:opacity-100 transition-opacity duration-500' />
              </div>
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className='flex justify-center gap-3 mt-8 animate-fade-in-up delay-800'>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-120 active:scale-90 ${
                i === index
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className='flex flex-wrap justify-center gap-8 mt-16 animate-fade-in-up delay-1000'>
          {[
            { label: t.landing?.stats_happy_players || 'Happy Players', value: '10K+' },
            { label: t.landing?.stats_games_played || 'Games Played', value: '50K+' },
            { label: t.landing?.stats_cities_covered || 'Cities Covered', value: '500+' },
            { label: t.landing?.stats_rating || 'Rating', value: '4.9★' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className='text-center animate-fade-in-up'
              style={{ animationDelay: `${1.2 + i * 0.1}s` }}
            >
              <div className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                {stat.value}
              </div>
              <div className='text-gray-600 dark:text-gray-300 text-sm'>{stat.label}</div>
            </div>
          ))}
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
            transform: translateY(-8px);
            opacity: 0.6;
          }
        }

        @keyframes testimonialIn {
          from {
            opacity: 0;
            transform: rotateY(-90deg) scale(0.8);
          }
          to {
            opacity: 1;
            transform: rotateY(0deg) scale(1);
          }
        }

        @keyframes starIn {
          from {
            transform: scale(0) rotate(-180deg);
          }
          to {
            transform: scale(1) rotate(0deg);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-testimonial-in {
          animation: testimonialIn 0.6s ease-out;
        }

        .animate-star-in {
          animation: starIn 0.5s ease-out;
        }

        .scale-102 {
          transform: scale(1.02);
        }

        .rotate-y-5 {
          transform: rotateY(5deg);
        }

        .rotate-360 {
          transform: rotate(360deg);
        }

        .scale-120 {
          transform: scale(1.2);
        }

        .scale-90 {
          transform: scale(0.9);
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-800 {
          animation-delay: 0.8s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
