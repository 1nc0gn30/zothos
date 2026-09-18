// ParallaxImageSection.js
import React from 'react';
import { Parallax } from 'react-parallax';
import { Box } from '@mui/material';

const ParallaxImageSection = () => {
  return (
    <Parallax
      bgImage="/assets/images/HomeShot.png" // Replace with your image path
      strength={300} // Controls the parallax strength
      bgImageAlt="Parallax Background"
      style={{ height: '40vh' }} // Height of the section
    >
      <Box
        sx={{
          height: '40vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      >
       
      </Box>
    </Parallax>
  );
};

export default ParallaxImageSection;
