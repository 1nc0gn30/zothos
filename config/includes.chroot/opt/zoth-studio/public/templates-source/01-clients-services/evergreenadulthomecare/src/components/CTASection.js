// components/CTASection.js
import React from 'react';
import { Box, Paper, Typography, CardMedia, Button } from '@mui/material';

const CTASection = () => {
  return (
    <Paper
      elevation={4}
      sx={{
        marginTop: '40px',
        padding: '32px',
        backgroundColor: '#e8f5e9',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: { xs: 'column' },
        alignItems: 'center',
        justifyContent: 'center', // Center horizontally
        gap: { xs: 2, md: 4 },
        maxWidth: { xs: '100%', md: '800px' }, // Constrain width for desktop
        margin: '0 auto', // Center the entire Paper container
      }}
    >
      {/* Image on the Left */}
      <CardMedia
        component="img"
        image="https://media.istockphoto.com/id/1575920875/vector/elderly-people.jpg?s=2048x2048&w=is&k=20&c=5raJ6ARbtzkJmJVotfo_LTOtvJcIIt6xpGumpDxnjfU=" // Placeholder image
        alt="Home Care Services"
        sx={{
          width: { xs: '100%', md: 'auto' },
          height: { xs: 200, md: 300 },
          borderRadius: '12px',
        }}
      />

      {/* Content Stacked Vertically on the Right */}
      <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'center' } }}>
        
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '8px' }}
        >
          Learn More About Our Services
        </Typography>
        <Typography variant="body1" sx={{ color: '#388E3C', marginBottom: '16px' }}>
          Discover all the ways we can support your loved ones with our personalized home care plans.
        </Typography>
        <Button
          variant="contained"
          href="/services"
          sx={{
            backgroundColor: '#388E3C',
            '&:hover': { backgroundColor: '#2e7d32' },
            display: 'block',
            margin: '0 auto',
            borderRadius: 200,
            width: '200px',
          }}
        >
          View Services
        </Button>
      </Box>
    </Paper>
  );
};

export default CTASection;
