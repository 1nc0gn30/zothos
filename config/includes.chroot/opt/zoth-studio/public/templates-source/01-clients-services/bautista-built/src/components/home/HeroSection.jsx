import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { blueGrey } from '@mui/material/colors';

const HeroSection = () => {
  const { scrollYProgress } = useScroll();
  const yPosAnim = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate asset loading delay
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', height: { xs: '85vh', md: '90vh' } }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url("/metal-bg.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: yPosAnim
        }}
      />
      <Container
        maxWidth="lg"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            BAUTISTA BUILT
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 300,
              mb: 4,
              fontSize: { xs: '1.5rem', md: '2rem' },
              textShadow: '1px 1px 3px rgba(0,0,0,0.6)'
            }}
          >
            Crafting Metal Art in Virginia Beach
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              mb: 6,
              maxWidth: '650px',
              fontSize: { xs: '1rem', md: '1.25rem' },
              textShadow: '1px 1px 2px rgba(0,0,0,0.6)'
            }}
          >
            We specialize in custom metal fabrication, artisanal signs, and expert installations that bring your vision to life.
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '4px',
                textTransform: 'none',
                backgroundColor: '#424242',
                '&:hover': {
                  backgroundColor: '#616161',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              View Our Work
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '4px',
                textTransform: 'none',
                borderColor: 'white',
                color: 'white',
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 20px rgba(255, 255, 255, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Contact Us
            </Button>
          </Box>
        </motion.div>
      </Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 60,
              border: '2px solid white',
              borderRadius: 20,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                width: 6,
                height: 10,
                backgroundColor: 'white',
                borderRadius: 3,
                marginTop: 8
              }}
            />
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default HeroSection;
