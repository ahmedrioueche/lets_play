'use client';
import CommunitySection from './components/CommunitySection';
import FAQSection from './components/FAQSection';
import FeaturesSection from './components/FeaturesSection';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import LandingFooter from './components/LandingFooter';
import LandingNavbar from './components/LandingNavbar';
import TestimonialsSection from './components/TestimonialsSection';

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <div className='bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900 min-h-screen'>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CommunitySection />
        <FAQSection />
        <LandingFooter />
      </div>
    </>
  );
}
