// src/components/LoadingPage.jsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import logo from './assets/logo.png'; // Make sure to update the path to your logo

const LoadingPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <img src={logo} alt="Loading..." style={{ width: '150px', marginBottom: '20px' }} />
      <CircularProgress color="primary" size={60} />
      <Typography variant="h6" color="textSecondary" sx={{ marginTop: '20px' }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingPage;
