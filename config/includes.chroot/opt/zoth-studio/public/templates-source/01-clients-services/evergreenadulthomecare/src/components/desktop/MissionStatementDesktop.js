// MissionStatementDesktop.js
import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { ArrowForward, ContactMail } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MissionStatementDesktop = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#0D4D31',


        minHeight: '100vh',
        '@media (max-height: 670px)': {
          minHeight: '150vh', // For shorter screens
        },
        '@media (max-height: 500px)': {
          minHeight: '200vh', // For shorter screens
        },
        '@media (max-height: 370px)': {
          minHeight: '400vh', // For shorter screens
        },
        '@media (max-height: 170px)': {
          minHeight: '550vh', // For shorter screens
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden', // Ensures content stays within the boundaries
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <Stack
          spacing={4}
          textAlign="left"
          sx={{ flex: 1, position: 'absolute', top: '35%', left: { xl: '10vw', lg: '10vw' } }}
        >
          <Typography variant="h4" color="white" fontWeight="bold">
            We Are Committed
          </Typography>
          <Typography variant="h2" color="white" fontWeight="bold">
            Empowering Your Growth
          </Typography>
          <Typography variant="body1" color="white" sx={{ width: { md: '600px' } }}>
            Our mission is to provide exceptional services that inspire growth and success. We focus on fostering trust,
            transparency, and collaboration, ensuring every client achieves their goals with us.
          </Typography>
          <Button
            component={Link}
            to="/about"
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: '#56B435',
              '&:hover': { backgroundColor: '#56B430' },
              width: '200px',
            }}
          >
            About Us
          </Button>
        </Stack>
      </Container>

      {/* Image pinned to bottom-right corner */}
      <Box
        component="img"
        src="/assets/images/MissionImage.png"
        alt="Our mission"
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 'auto',
          height: { xl: '80vh', lg: '70vh' },
          objectFit: 'cover',
          zIndex: 1,
        }}
      />

      {/* Green Box at bottom-right */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: { xl: '90vw', lg: '90vw' },
          height: { xl: '190px', lg: '150px' },
          backgroundColor: '#56B435',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 2,
          borderTopLeftRadius: '80px',
          zIndex: 0,
        }}
      >
        {/* Pulsing Contact Button */}
        <Button
          component={Link}
          to="/contact"
          startIcon={<ContactMail />}
          variant="contained"
          sx={{
            backgroundColor: '#2e7d32',
            '&:hover': { backgroundColor: '#1b5e20' },
            animation: 'pulse 1.5s infinite',
            bottom: { lg: 7, xl: 14 },
            left: 55, // Adjust as needed
            position: 'absolute',
          }}
        >
          Contact Us
        </Button>

        <Typography
          variant="h6"
          color="white"
          fontWeight="bold"
          sx={{ width: { lg: '500px', xl: '600px' }, marginLeft: 5 }}
        >
          Ready to achieve your goals? Contact us today to learn more about our solutions!
        </Typography>
      </Box>
    </Box>
  );
};

export default MissionStatementDesktop;
