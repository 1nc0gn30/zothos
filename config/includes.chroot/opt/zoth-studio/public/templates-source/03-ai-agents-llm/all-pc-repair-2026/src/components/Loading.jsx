// src/components/Loading.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import logo from './assets/1.png';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'black',
        color: 'white',
      }}
    >
      <img src={logo} alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
      <CircularProgress sx={{ color: '#FFD700' }} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;
