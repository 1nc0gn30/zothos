import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';

const TestimonialCard = styled(Card)({
  maxWidth: 400,
  margin: '16px auto',
  borderRadius: '16px',
  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
  background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
  padding: '16px',
  border: '1px solid #f0f0f0',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
  },
});

const TestimonialHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
});

const Badge = styled(Chip)({
  backgroundColor: '#56B435',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '0.9rem',
});

const Testimonials = () => (
  <Box sx={{ marginTop: '48px', textAlign: 'center' }}>
    <Typography variant="h4" sx={{ marginBottom: '24px', fontWeight: '600', color: '#0A4704' }}>
      Testimonials & Sponsorships
    </Typography>
    <Grid container spacing={4} justifyContent="center">
      {[
        { 
          name: 'John Doe', 
          text: 'Evergreen provided excellent care to my family.', 
          avatar: 'https://media.istockphoto.com/id/1744541392/photo/portrait-of-smiling-businessman.jpg?s=2048x2048&w=is&k=20&c=OhCRsCOoproE_rsgjf30SWv49kknAb09jksT2cgpG0A=',
          badge: 'Top Caregiver',
        },
        { 
          name: 'Jane Smith', 
          text: 'Highly recommend their compassionate service.', 
          avatar: 'https://media.istockphoto.com/id/1480574498/photo/happy-filipina-woman-having-fun-smiling-in-front-of-camera-in-the-city-center.jpg?s=612x612&w=0&k=20&c=XVaG6mtfm4NSCpGleHsQ8SzbGprdey2YO2DRfxjxhRQ=',
          badge: 'Client Favorite',
        },
        { 
          name: 'ACME Corp.', 
          text: 'Proud sponsors of quality care.', 
          avatar: 'https://media.istockphoto.com/id/2156062809/photo/headshot-closeup-portrait-middle-eastern-israel-businesswoman-business-lady-standing-isolated.jpg?s=2048x2048&w=is&k=20&c=snKnhFbdjOT5tMcMNl6ZAqNQY1b4UVv2beOp7wlhcmg=',
          badge: 'Official Sponsor',
        },
      ].map((testimonial, index) => (
        <Grid item xs={12} md={4} key={index}>
          <TestimonialCard>
            <TestimonialHeader>
              <Avatar 
                src={testimonial.avatar} 
                sx={{ width: 80, height: 80, border: '2px solid #0A4704' }} 
              />
              <Badge label={testimonial.badge} />
            </TestimonialHeader>
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ fontWeight: '600', color: '#0A4704', marginBottom: '8px' }}
              >
                {testimonial.name}
              </Typography>
              <Divider sx={{ margin: '8px 0' }} />
              <Typography variant="body2" sx={{ lineHeight: 1.6, fontStyle: 'italic' }}>
                "{testimonial.text}"
              </Typography>
            </CardContent>
            <Paper 
              elevation={4} 
              sx={{ marginTop: '16px', padding: '8px', borderRadius: '8px', backgroundColor: '#f0f0f0' }}
            >
              <Typography variant="caption" sx={{ color: '#616161' }}>
                Reviewed on: {new Date().toLocaleDateString()}
              </Typography>
            </Paper>
          </TestimonialCard>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default Testimonials;
