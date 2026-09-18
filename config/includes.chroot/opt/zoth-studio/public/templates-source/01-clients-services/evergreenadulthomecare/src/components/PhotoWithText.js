import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const PhotoWithText = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        borderRadius: '8px',
        maxWidth: '80vw',
        margin: '0 auto',
        paddingTop: '100px',
        paddingBottom: {md: '100px'},
        position: 'relative',
      }}
    >
      {/* Rotated Box Behind Image */}
      <Box
        sx={{
          position: 'absolute',
          top: isMobile ? '80px' : '0',
          left: isMobile ? '-10px' : '-30px',
          width: '50%',
          height: '400px',
          backgroundColor: 'rgba(0, 255, 0, 0.15)', // Retro green with transparency
          transform: 'rotate(45deg)',
          zIndex: -1,
          borderRadius: '16px',
        }}
      />

      {/* Image */}
      <Box
        component="img"
        src="https://plus.unsplash.com/premium_photo-1664302483064-30c28b002782?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Evergreen Adult Home Care"
        sx={{
          width: isMobile ? '100%' : '40%',
          height: '400px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: isMobile ? '16px' : '0',
          position: 'relative',
          zIndex: 2,
        }}
      />

      {/* Text Section */}
      <Box
        sx={{
          width: {xs: '80vw', md: '40vw'},
          paddingLeft: isMobile ? '0' : '0px',
          zIndex: 2, // Ensures it is above the rotated box
        }}
      >
        <Typography
          sx={{ textAlign: 'left' }}
          variant="h6"
          component="h2"
          gutterBottom
          id="#learn-more"
        >
          Introducing
        </Typography>
        <Typography
          sx={{ textAlign: 'left', fontWeight: 'bold' }}
          variant="h2"
          component="h2"
          gutterBottom
        >
          Evergreen Adult Home Care
        </Typography>
        <Typography sx={{ textAlign: 'left' }} variant="body1">
          Evergreen Adult Home Care provides compassionate, reliable home care
          services for the elderly. Our dedicated team ensures the comfort,
          safety, and well-being of your loved ones, offering personalized care
          in the comfort of their own home.
        </Typography>
      </Box>
    </Box>
  );
};

export default PhotoWithText;
