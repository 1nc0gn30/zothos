import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import HeroSection from '../components/about/HeroSection';
import ServicesSection from '../components/about/ServicesSection';
import TeamSection from '../components/about/TeamSection';
import MilestonesSection from '../components/about/MilestonesSection';
import TestimonialsSection from '../components/about/TestimonialsSection';
import CTASection from '../components/about/CTASection';
import VideoModal from '../components/about/VideoModal';

const About = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box bgcolor="#0a0a0a" color="white">
      <HeroSection scrollPosition={scrollPosition} onPlayVideo={() => setIsVideoPlaying(true)} />
      <ServicesSection />
      <MilestonesSection />
      <TeamSection />
      <TestimonialsSection />
      <CTASection />
      {isVideoPlaying && <VideoModal onClose={() => setIsVideoPlaying(false)} />}
    </Box>
  );
};

export default About;
