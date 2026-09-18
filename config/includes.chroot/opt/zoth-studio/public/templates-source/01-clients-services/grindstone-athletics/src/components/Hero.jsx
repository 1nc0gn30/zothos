import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import heroImage from './assets/images/hero-bg4.png'; // Adjust the path as necessary
import './styles/Hero.css';

const Hero = () => {
  return (
    <Box className="hero-container" sx={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box className="overlay" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px', textAlign: 'center' }}>
        <Typography variant="h2" className="intro-text" sx={{  marginBottom: '20px' }}>
          Some people are lost in their fires.<br />
          OTHERS ARE <span className="forged-text">FORGED</span> IN THEM.
        </Typography>
        <Button
          component={Link}
          to="/classes#schedule"
          variant="contained"
          color="primary"
          size="large"
          className="cta-button"
        >
          View Schedule
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;
