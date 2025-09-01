
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import PricingSection from '@/components/PricingSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FlashcardGenerator />
      <PricingSection />
    </div>
  );
};

export default Index;
