import React from 'react';
import { Container, Grid, Card, Typography, Box, Avatar, Divider, Rating, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const testimonials = [
  { 
    name: "Sarah Thompson", 
    company: "Coastal Cafe", 
    text: "Bautista Built exceeded all our expectations. Their craftsmanship is unmatched and attention to detail is extraordinary. The custom metalwork they created has become the centerpiece of our cafe.",
    image: "https://via.placeholder.com/50",
    rating: 5,
    project: "Custom Coffee Bar & Signage"
  },
  { 
    name: "Robert Wilson", 
    company: "Wilson Industrial", 
    text: "Professional from design to installation. Our custom sign is amazing and has dramatically improved our brand visibility. The team was responsive and delivered exactly what we envisioned.",
    image: "https://via.placeholder.com/50",
    rating: 5,
    project: "Industrial Signage"
  },
];

const TestimonialsSection = () => {
  return (
    <Box 
      py={12} 
      sx={{
        background: 'linear-gradient(to bottom, #121212, #1e1e1e)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23333" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")',
          opacity: 0.4,
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box mb={10} textAlign="center">
          <Typography 
            variant="h3" 
            component="h2"
            sx={{ 
              fontWeight: 800, 
              color: 'white',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, #f50057, #8c24aa)',
                bottom: '-15px',
                left: 'calc(50% - 30px)'
              }
            }}
          >
            What Our Clients Say
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#aaa', 
              mt: 4, 
              mb: 2, 
              maxWidth: '700px', 
              mx: 'auto',
              opacity: 0.8
            }}
          >
            Our reputation is built on client satisfaction. Here's what some of our valued customers have to say about their experience with Bautista Built.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={6} key={index} sx={{ display: 'flex' }}>
              <motion.div 
                whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ display: 'flex', width: '100%' }}
              >
                <Card 
                  sx={{ 
                    background: 'linear-gradient(145deg, rgba(25,25,25,0.95), rgba(15,15,15,0.95))',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    borderRadius: '16px',
                    p: 4, 
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '3px',
                      width: '100%',
                      background: 'linear-gradient(90deg, #f50057, #8c24aa)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <FormatQuoteIcon 
                      sx={{ 
                        position: 'absolute', 
                        fontSize: '40px', 
                        opacity: 0.1, 
                        color: '#f50057',
                        top: -33,
                        left: -15
                      }} 
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip 
                        label={testimonial.project} 
                        size="small" 
                        variant="outlined" 
                        sx={{ 
                          color: '#8c24aa', 
                          borderColor: 'rgba(140, 36, 170, 0.3)',
                          backgroundColor: 'rgba(140, 36, 170, 0.05)'
                        }} 
                      />
                      <Rating 
                        value={testimonial.rating} 
                        readOnly 
                        size="small" 
                        sx={{ color: '#f50057' }} 
                      />
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontStyle: 'italic', 
                        color: '#ddd',
                        fontWeight: 300,
                        lineHeight: 1.7,
                        position: 'relative',
                        zIndex: 1,
                        letterSpacing: 0.3
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 'auto' }}>
                    <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.08)' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={testimonial.image} 
                        sx={{ 
                          mr: 2, 
                          width: 56, 
                          height: 56,
                          border: '2px solid rgba(255,255,255,0.1)'
                        }} 
                      />
                      <Box>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'white' 
                          }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#f50057',
                            fontWeight: 500
                          }}
                        >
                          {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;