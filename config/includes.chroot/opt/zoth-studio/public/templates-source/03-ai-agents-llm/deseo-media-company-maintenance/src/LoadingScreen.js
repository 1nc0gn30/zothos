import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      role="status"
      aria-label="Loading Deseo Media Company Portal"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#0d0d11',
        color: '#ffffff',
        zIndex: 99999,
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: '#D4AF37',
          mb: 3,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontFamily: 'Ivy Presto, serif',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#D4AF37',
        }}
      >
        DESEO MEDIA COMPANY
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
        Initializing Media Production & Maintenance Hub...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
