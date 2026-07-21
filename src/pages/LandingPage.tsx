import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { CapabilitiesSection } from '../components/landing/CapabilitiesSection';
import { AIFeaturesSection } from '../components/landing/AIFeaturesSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { ServiceShowcaseSection } from '../components/landing/ServiceShowcaseSection';
import { TrustSection } from '../components/landing/TrustSection';
import { CTASection } from '../components/landing/CTASection';
import { LandingFooter } from '../components/landing/LandingFooter';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  // Ensure the page starts at the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-gray-800 flex flex-col relative overflow-x-hidden selection:bg-coral/20 selection:text-coral-deep" dir="rtl">
      
      {/* Premium Navigation Header */}
      <LandingNavbar onGetStarted={onGetStarted} />

      {/* Sections Sequence */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1"
      >
        <HeroSection onGetStarted={onGetStarted} />
        
        <CapabilitiesSection />
        
        <AIFeaturesSection />
        
        <WorkflowSection />
        
        <ServiceShowcaseSection />
        
        <TrustSection />
        
        <CTASection onGetStarted={onGetStarted} />
      </motion.main>

      {/* Footer */}
      <LandingFooter />

    </div>
  );
};

export default LandingPage;
