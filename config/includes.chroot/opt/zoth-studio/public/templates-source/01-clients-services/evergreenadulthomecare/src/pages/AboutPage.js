import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import Testimonials from '../components/Testimonials'; // Import Testimonials
import AboutSection from '../components/AboutSection';
import ContactForm from '../components/ContactForm';
import ParallaxImageSection from '../components/ParallaxImageSection';
import FancyDivider from '../components/FancyDivider';
import AboutPageHero from '../components/AboutPageHero';
import CTASection from '../components/CTASection';

const StyledPage = styled(Box)({
  backgroundColor: '#F5F5F5',
  minHeight: '100vh',
  overflowX: 'hidden',
});


const Section = styled(motion.div)({
  marginTop: '32px',
  marginBottom: '32px',
  textAlign: 'center',
});

const fadeIn = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AboutPage = () => (
  <>
  <StyledPage>
    {/* Hero Section */}
   <AboutPageHero />

    {/* Who We Are Section */}
    <Section variants={fadeIn} initial="initial" animate="animate">
      <Typography variant="h6" align="center" sx={{ fontWeight: '600', color: '#0A4704' }}>
        Who We Are
      </Typography>
      <Typography variant="body1" sx={{ marginTop: '16px', lineHeight: 1.8, color: 'black' }}>
        At Evergreen Adult Home Care, we provide personalized and compassionate care tailored to meet the unique needs of every individual.
      </Typography>
    </Section>

    {/* Mission and Offerings Section */}
    <AboutSection />

    <FancyDivider />
    {/* Testimonials Section */}
    <Testimonials />
  </StyledPage>
  <Box sx={{marginTop: 5}}>
  <CTASection />
  </Box>
  <ContactForm />
  <ParallaxImageSection />
  </>
);

export default AboutPage;
