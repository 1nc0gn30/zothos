// components/LearnMoreCTA.js
import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const LearnMoreCTA = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        marginTop: '32px',
        padding: '24px',
        backgroundColor: '#e8f5e9',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: { xs: 'column' },
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 2, sm: 4 },
        maxWidth: { xs: '100%', md: '800px' },
        margin: '0 auto',
      }}
    >
        <Box 
        component="img"
        src="https://media.istockphoto.com/id/1413582316/photo/happy-seniors-talking-while-eating-lunch-at-residential-care-home.jpg?s=612x612&w=0&k=20&c=qDlk4uOaVc_BGlfBZfBkdz0wKz-N6TTpZGZSNDGNpz0="
        sx={{
            width: { xs: '100%', md: 'auto' },
            height: { xs: 200, md: 300 },
            borderRadius: '12px',
          }} />
      {/* Text Content */}
      <Box sx={{ flex: 1, textAlign: { xs: 'center' } }}>
        
        
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '8px' }}
        >
          Learn More About Us
        </Typography>
        <Typography variant="body2" sx={{ color: '#388E3C', marginBottom: '16px' }}>
          Explore how Evergreen Adult Home Care is committed to supporting your loved ones with
          care, compassion, and expertise.
        </Typography>
      </Box>

      {/* Button */}
      <Button
        variant="contained"
        href="/about"
        endIcon={<ArrowForwardIcon />}
        sx={{
          backgroundColor: '#388E3C',
          '&:hover': { backgroundColor: '#2e7d32' },
          borderRadius: '12px',
          paddingX: 3,
        }}
      >
        About Us
      </Button>
    </Paper>
  );
};

export default LearnMoreCTA;
