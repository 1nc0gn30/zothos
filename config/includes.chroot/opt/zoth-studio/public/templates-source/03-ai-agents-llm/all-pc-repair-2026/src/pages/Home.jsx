import React from 'react';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import TailoredServices from '../components/TailoredServices';
import AlertNewsBanner from '../components/AlertNewsBanner';
import OverviewSection from '../components/OverViewSection';
import MyDivider from '../components/MyDivider';
import AIEstimatorWidget from '../components/AIEstimatorWidget';
import { Container } from '@mui/material';

const Home = () => {
  return (
    <div className="white-bg">
      <HeroSection
        backgroundImage="/bg.png"
        mainText="IT & Cybersecurity Solutions For Your Business"
        subText="Managed IT Services, AI Diagnostics, Cloud Infrastructure & Hardware Repair in Hampton Roads"
        buttonText="Explore All Services"
        buttonRoute="/what-we-do"
      />
      <AlertNewsBanner />
      
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <AIEstimatorWidget />
        <TailoredServices />
        <MyDivider />
        <OverviewSection />
        <ServicesSection />
      </Container>
    </div>
  );
};

export default Home;
