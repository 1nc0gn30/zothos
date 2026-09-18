import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Snackbar, 
} from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import { motion } from 'framer-motion';
import ContactPageHero from '../components/ContactPageHero';
import ParallaxImageSection from '../components/ParallaxImageSection';
import FancyDivider from '../components/FancyDivider';
import Grid from '@mui/material/Grid2';
import CTASection from '../components/CTASection';
import LearnMoreCTA from '../components/LearnMoreCTA';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ContactPage = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <>
      <ContactPageHero />

      {/* Sympathy Content */}
      <Container sx={{ marginTop: '48px', marginBottom: '48px', textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold', color: '#0D4D31', marginBottom: '24px' }}
        >
          Finding the Right Care Can Be a Journey
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ color: '#000000', maxWidth: '800px', margin: '0 auto', fontSize: '18px', lineHeight: 1.6 }}
        >
          We know that finding the right adult home care for yourself or your loved one isn’t always easy. 
          It’s a journey that can feel overwhelming, filled with uncertainties, and often requiring difficult decisions. 
          At Evergreen Adult Home Care, we understand the importance of finding care that feels just right—where dignity, 
          comfort, and personal connection are at the heart of every interaction.
          <br /><br />
          Whether you are looking for a peaceful environment for a loved one or in need of personalized care that supports 
          independence and well-being, we are here for you every step of the way. At Evergreen, we see each person as part 
          of our family, and our goal is to ensure they receive the care, kindness, and attention they deserve.
          <br /><br />
          Let us help guide you through this process and give you peace of mind. If you have any questions, or if you're ready 
          to discuss how we can meet your care needs, we invite you to reach out to us. You don't have to go through this alone. 
          Together, we can create a path to better care.
        </Typography>
      </Container>
    <FancyDivider />
      <Container 
        sx={{ 
          padding: { xs: '32px', md: '64px' }, 
          minHeight: '100vh',
          color: '#FFFFFF',
        }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.2 }}
        >
          <Paper 
            elevation={12} 
            sx={{ 
              padding: '48px', 
              background: 'rgba(255, 255, 255, 0.85)', 
              borderRadius: '24px', 
              marginBottom: '64px',
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ fontWeight: 'bold', color: '#0D4D31', marginBottom: '16px' }}
            >
              Let’s Connect
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: '#388E3C', marginBottom: '32px', fontSize: '18px' }}
            >
              Reach out to us, and we’ll get back to you with lightning speed!
            </Typography>

            {/* Contact Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                maxWidth: '700px',
                margin: '0 auto',
              }}
            >
              <TextField 
                label="Full Name" 
                variant="outlined" 
                fullWidth 
                required 
                InputProps={{ style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#56B435',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4CA730',
                    },
                  },
                }}
              />
              <TextField 
                label="Email Address" 
                variant="outlined" 
                fullWidth 
                required 
                type="email"
                InputProps={{ style: { color: 'black' } }}
              />
              <TextField 
                label="Phone Number" 
                variant="outlined" 
                fullWidth 
                type="tel" 
                InputProps={{ style: { color: 'black' } }}
              />
              <TextField 
                label="Your Message" 
                variant="outlined" 
                multiline 
                rows={4} 
                fullWidth 
                required 
                InputProps={{ style: { color: 'black' } }}
              />
              <Button 
                variant="contained" 
                type="submit"
                sx={{ 
                  alignSelf: 'center', 
                  width: '60%', 
                  backgroundColor: '#56B435', 
                  fontWeight: 'bold',
                  padding: '16px',
                  borderRadius: '32px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  '&:hover': { backgroundColor: '#4CA730' },
                }}
              >
                Send Message
              </Button>
            </Box>
          </Paper>

          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              Thank you! Your message was sent successfully.
            </Alert>
          </Snackbar>
        </motion.div>

        <Box sx={{ marginTop: '48px', textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 'bold', color: '#000000', marginBottom: '24px' }}
          >
            Contact Information
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <Phone sx={{ color: '#4CAF50' }} />
                <Typography sx={{ color: '#000000' }} variant="body1">(757) 555-1234</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <Email sx={{ color: '#4CAF50' }} />
                <Typography sx={{ color: '#000000'}}  variant="body1">contact@evergreen.com</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <LocationOn sx={{ color: '#4CAF50' }} />
                <Typography sx={{ color: '#000000' }} variant="body1">123 Evergreen St, Virginia Beach, VA</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Box sx={{marginBottom: 5}}>
        <LearnMoreCTA />1
                </Box>
      <Box sx={{marginBottom: 5}}>
        
        <CTASection />
        </Box>
        
      <ParallaxImageSection />
    </>
  );
};

export default ContactPage;
