import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { styled } from '@mui/system';
import { Cloud, Security, Build, AutoFixHigh, PhoneInTalk } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TechCanvas from './TechCanvas';

const HeroBox = styled(Box)(({ theme, backgroundImage }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '65vh',
  background: `linear-gradient(180deg, rgba(10, 10, 16, 0.7) 0%, rgba(10, 10, 16, 0.95) 100%), url(${backgroundImage}) no-repeat center center/cover`,
  color: 'white',
  textAlign: 'center',
  padding: '60px 20px',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    minHeight: '55vh',
    padding: '40px 20px',
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  marginTop: '20px',
  [theme.breakpoints.down('md')]: {
    gap: '10px',
  },
}));

const HeroSection = ({ backgroundImage, mainText, subText, buttonText, buttonRoute }) => {
  return (
    <HeroBox backgroundImage={backgroundImage} role="banner">
      <TechCanvas height="100%" minHeight="400px" opacity={0.7} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<AutoFixHigh sx={{ color: '#FFD700 !important' }} />}
            label="NEW: Interactive AI Repair Estimator"
            component="a"
            href="#estimator"
            clickable
            sx={{
              backgroundColor: 'rgba(255, 215, 0, 0.15)',
              color: '#FFD700',
              border: '1px solid rgba(255, 215, 0, 0.4)',
              fontWeight: 600,
              fontSize: '0.85rem',
              backdropFilter: 'blur(8px)',
              '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.25)' }
            }}
          />
          <Chip
            icon={<PhoneInTalk sx={{ color: '#00D2FF !important' }} />}
            label="Serving All Hampton Roads, VA"
            sx={{
              backgroundColor: 'rgba(0, 210, 255, 0.15)',
              color: '#00D2FF',
              border: '1px solid rgba(0, 210, 255, 0.4)',
              fontWeight: 600,
              fontSize: '0.85rem',
              backdropFilter: 'blur(8px)'
            }}
          />
        </Box>

        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontSize: { xs: '2.2rem', sm: '3.2rem', md: '4.2rem' },
            fontWeight: 800,
            lineHeight: 1.15,
            wordBreak: 'break-word',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #FFD700 80%, #00D2FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          {mainText}
        </Typography>

        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mt: 2, 
            mb: 4, 
            fontSize: { xs: '1.1rem', sm: '1.35rem', md: '1.6rem' },
            color: '#D0D7DE',
            fontWeight: 400,
            maxWidth: '750px',
            mx: 'auto'
          }}
        >
          {subText}
        </Typography>

        <IconBox sx={{ mb: 3 }}>
          <Cloud fontSize="large" sx={{ color: '#00D2FF', filter: 'drop-shadow(0 0 8px rgba(0,210,255,0.6))' }} />
          <Security fontSize="large" sx={{ color: '#FFD700', filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))' }} />
          <Build fontSize="large" sx={{ color: '#00FF99', filter: 'drop-shadow(0 0 8px rgba(0,255,153,0.6))' }} />
        </IconBox>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                backgroundColor: '#FFD700', 
                color: '#000',
                borderRadius: '30px',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                '&:hover': {
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.7)'
                },
                '&:focus-visible': {
                  outline: '3px solid #00D2FF',
                  outlineOffset: '2px'
                }
              }}
              component={Link}
              to={buttonRoute}
            >
              {buttonText}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              size="large"
              component="a"
              href="#estimator"
              sx={{ 
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#00D2FF', 
                borderColor: '#00D2FF',
                borderRadius: '30px',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  borderColor: '#FFFFFF',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(0, 210, 255, 0.15)',
                  boxShadow: '0 0 20px rgba(0, 210, 255, 0.4)'
                },
                '&:focus-visible': {
                  outline: '3px solid #FFD700',
                  outlineOffset: '2px'
                }
              }}
            >
              Launch AI Estimator
            </Button>
          </motion.div>
        </Box>
      </motion.div>
    </HeroBox>
  );
};

export default HeroSection;
