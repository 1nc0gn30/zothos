// MissionStatementMobile.js
import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MissionStatementMobile = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#0D4D31',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Ensures content and image are spaced
        alignItems: 'center',
        paddingTop: 5,
      }}
    >
      {/* Content Section */}
      <Container 
        maxWidth="sm" 
        sx={{ textAlign: 'center', zIndex: 2 }}
      >
        <Stack spacing={4} alignItems="center">
          <Typography variant="h4" color="white" fontWeight="bold">
            We Are Committed
          </Typography>
          <Typography variant="h2" color="white" fontWeight="bold">
            Our Mission Statement
          </Typography>
          <Typography variant="body1" color="white">
            These will soon be replaced with more details about our business.
          </Typography>
          <Button
            component={Link}
            to="/about"
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: '#56B435',
              '&:hover': { backgroundColor: '#56B430' },
            }}
          >
            About Us
          </Button>
        </Stack>
      </Container>

      {/* Image Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end', // Align image to the right
          alignItems: 'flex-end', // Align image to the bottom
          width: '100%', // Full width to allow right alignment
          paddingTop: 5,
        }}
      >
        <Box
          component="img"
          src="/assets/images/MissionImage.png"
          alt="Our mission"
          sx={{
            width: '100%', // Control width for mobile screens
            maxWidth: '850px', // Prevent it from being too large
            height: 'auto',
            objectFit: 'contain',
           
          }}
        />
      </Box>
    </Box>
  );
};

export default MissionStatementMobile;
