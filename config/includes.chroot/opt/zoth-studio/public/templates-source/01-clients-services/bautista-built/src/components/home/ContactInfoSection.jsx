import React from 'react';
import { Container, Box, Typography, Grid, IconButton, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }
  }
};

const ContactInfoSection = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUpVariants}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: 'white',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: 0,
                    width: 60,
                    height: 4,
                    backgroundColor: '#64b5f6',
                    
                  }
                }}
              >
                Get In Touch
              </Typography>
              <Typography variant="body1" sx={{color: 'white'}} paragraph>
                Have questions about our services or ready to start your project? Reach out to us using any of the contact methods below.
              </Typography>
              <Box sx={{ mt: 5 }}>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Box sx={{ mr: 3 }}>
                    <Box
                      sx={{
                        color: 'white',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <LocationOnIcon sx={{ color: '#64b5f6' }} />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'white' }}>Our Workshop</Typography>
                    <Typography variant="body2" sx={{ color: 'white'}}>
                      1234 Industrial Way<br />
                      Virginia Beach, VA 23456
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 4, color: 'white' }}>
                  <Box sx={{ mr: 3 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <PhoneIcon sx={{ color: '#64b5f6' }} />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Call Us</Typography>
                    <Typography variant="body2">
                      (757) 555-1234<br />
                      Monday-Friday, 8am-6pm
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ mr: 3 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <EmailIcon sx={{ color: '#64b5f6' }} />
                    </Box>
                  </Box>
                  <Box sx={{color: 'white'}}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Email Us</Typography>
                    <Typography variant="body2">
                      info@bautistabuilt.com<br />
                      quotes@bautistabuilt.com
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mt: 6 }}>
                  <IconButton
                    aria-label="Facebook"
                    sx={{
                      mr: 2,
                      bgcolor: '#212529',
                      color: 'white',
                      '&:hover': { bgcolor: '#f5a623', transform: 'translateY(-3px)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Instagram"
                    sx={{
                      mr: 2,
                      bgcolor: '#212529',
                      color: 'white',
                      '&:hover': { bgcolor: '#f5a623', transform: 'translateY(-3px)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <InstagramIcon />
                  </IconButton>
                </Box>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUpVariants} style={{ height: '100%' }}>
              <Box
                sx={{
                  bgcolor: '#f8f9fa',
                  p: 4,
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  height: '100%'
                }}
              >
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                  Our Business Hours
                </Typography>
                {[
                  { day: 'Monday', hours: '8:00 AM - 6:00 PM' },
                  { day: 'Tuesday', hours: '8:00 AM - 6:00 PM' },
                  { day: 'Wednesday', hours: '8:00 AM - 6:00 PM' },
                  { day: 'Thursday', hours: '8:00 AM - 6:00 PM' },
                  { day: 'Friday', hours: '8:00 AM - 6:00 PM' },
                  { day: 'Saturday', hours: '9:00 AM - 3:00 PM' },
                  { day: 'Sunday', hours: 'Closed' }
                ].map((schedule, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      py: 1.5,
                      borderBottom: index < 6 ? '1px solid #e0e0e0' : 'none'
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: schedule.day === 'Sunday' ? 700 : 400, color: schedule.day === 'Sunday' ? '#f44336' : 'inherit' }}>
                      {schedule.day}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: schedule.day === 'Sunday' ? 700 : 400, color: schedule.day === 'Sunday' ? '#f44336' : 'inherit' }}>
                      {schedule.hours}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Service Areas
                  </Typography>
                  <Typography variant="body2" paragraph>
                    We proudly serve the greater Hampton Roads area.
                  </Typography>
                  <Typography variant="body2">
                    For projects outside our area, please contact us.
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactInfoSection;
