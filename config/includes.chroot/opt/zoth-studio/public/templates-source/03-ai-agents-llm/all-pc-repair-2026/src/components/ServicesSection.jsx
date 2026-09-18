import React from 'react';
import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import { Security, Cloud, BusinessCenter, Phone } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <Security fontSize="large" />,
    title: 'CyberSecurity',
    description: 'Our experts can identify vulnerabilities, assess risks, and implement robust security measures to safeguard your systems and data.',
  },
  {
    icon: <Cloud fontSize="large" />,
    title: 'Cloud Services',
    description: 'With our expertise in cloud technologies, we can help you find the right cloud solutions that meet your business needs and goals.',
  },
  {
    icon: <BusinessCenter fontSize="large" />,
    title: 'IT Consulting & Advisory',
    description: 'The right technology, implemented properly, appropriately managed and monitored, can lead to significant gains in growth.',
  },
  {
    icon: <Phone fontSize="large" />,
    title: 'VOIP Business Phones',
    description: 'Explore VoIP Business Phones as a cost-effective and scalable communication solution specifically designed to meet the unique needs of small businesses.',
  },
];

const ServicesSection = () => {
  return (
    <Box sx={{ bgcolor: 'black', color: 'white', py: 8 }}>
      <Container>
        <Typography sx={{ textAlign: 'center', color: 'gold' }} variant="h3" component="h2" gutterBottom>
          Some of our services
        </Typography>
        <Carousel
          indicators={true}
          navButtonsAlwaysVisible={true}
          animation="slide"
          autoPlay={true}
          interval={5000}
          indicatorIconButtonProps={{
            style: {
              color: 'gold',
            },
          }}
          activeIndicatorIconButtonProps={{
            style: {
              color: 'white',
            },
          }}
          navButtonsProps={{
            style: {
              backgroundColor: 'transparent',
              color: 'gold',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'gold',
              },
            },
          }}
          navButtonsWrapperProps={{
            style: {
              top: '50%',
              transform: 'translateY(-50%)',
            },
          }}
        >
          {services.map((service, index) => (
            <Grid container key={index} justifyContent="center">
              <Grid item xs={12} sm={10} md={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: 'white', color: 'black', height: '100%' }}>
                    <Box>
                      <Box sx={{ color: 'gold', mb: 2 }}>
                        {service.icon}
                      </Box>
                      <Typography variant="h6" component="h3" sx={{ mt: 2, color: 'black' }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1, color: 'gray' }}>
                        {service.description}
                      </Typography>
                      <Button
                        component={Link}
                        to="/what-we-do"
                        variant="contained"
                        sx={{
                          backgroundColor: 'gold',
                          color: 'black',
                          mt: 2,
                          '&:hover': {
                            backgroundColor: '#FFD700',
                          },
                        }}
                      >
                        Explore our services
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
};

export default ServicesSection;
