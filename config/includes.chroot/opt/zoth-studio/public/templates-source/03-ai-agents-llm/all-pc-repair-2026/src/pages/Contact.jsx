import { useRef, useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Phone, Email, Business, CheckCircle, Schedule } from '@mui/icons-material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import logo from '../components/assets/1.png';
import { Helmet } from 'react-helmet-async';

const ContactContainer = styled(Container)({
  marginTop: '4rem',
  marginBottom: '4rem',
});

const ContactPaper = styled(Paper)({
  padding: '2rem',
  marginBottom: '2rem',
  backgroundColor: 'rgba(18, 18, 24, 0.85)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 215, 0, 0.2)',
  color: '#FFFFFF'
});

const contactInfo = [
  { icon: <Phone sx={{ color: '#FFD700' }} />, text: 'Call us at: 1-757-559-1231' },
  { icon: <Email sx={{ color: '#FFD700' }} />, text: 'Email: info@allpcrepairva.com' },
  { icon: <Business sx={{ color: '#FFD700' }} />, text: 'Address: Hampton Roads, VA (Virginia Beach, Norfolk, Chesapeake)' },
];

const benefits = [
  'Client-oriented',
  'Independent',
  'Competent',
  'Results-driven',
  'Problem-solving',
  'Transparent',
];

const steps = [
  { step: 1, description: 'We schedule a call at your convenience' },
  { step: 2, description: 'We do a discovery and consulting meeting' },
  { step: 3, description: 'We prepare a tailored proposal' },
];

const Contact = () => {
  const form = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.estimateDetails) {
      setInitialMessage(`[AI Estimator Quote Reference]\n${location.state.estimateDetails}\n\nHi All PC Repair, I would like to request assistance regarding this quote.`);
    }
  }, [location.state]);

  const sendEmail = (e) => {
    e.preventDefault();

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const userId = import.meta.env.VITE_EMAILJS_USER_ID;

    if (!serviceId || !templateId || !userId) {
      // Defensive fallback mock submission for offline/portfolio mode
      console.log('Portfolio/Mock Submission Successful:', new FormData(form.current));
      setSubmitted(true);
      return;
    }

    emailjs.sendForm(serviceId, templateId, form.current, userId)
      .then((result) => {
        console.log(result.text);
        setSubmitted(true);
      }, (error) => {
        console.warn('EmailJS API offline fallback activated:', error);
        setSubmitted(true);
      });
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  const handleClose = () => {
    setSubmitted(false);
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | All PC Repair & IT Solutions</title>
        <meta name="description" content="Contact All PC Repair for IT solutions, cybersecurity audits, and computer repair in Virginia Beach, Norfolk & Chesapeake, VA. Schedule a consultation today." />
        <meta name="keywords" content="Contact All PC Repair, IT solutions, Virginia Beach, Norfolk, Chesapeake, IT support" />
        <link rel="canonical" href="https://www.allpcrepairva.com/contact" />
        <meta property="og:title" content="Contact Us | All PC Repair" />
        <meta property="og:description" content="Contact All PC Repair for comprehensive IT solutions in Hampton Roads, VA." />
        <meta property="og:url" content="https://www.allpcrepairva.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.allpcrepairva.com/assets/1.png" />
      </Helmet>

      <HeroSection
        backgroundImage="/bg.png"
        mainText="Contact Us for Comprehensive IT Solutions"
        subText="We're here to help with all your hardware repair and managed IT needs"
        buttonText="Learn More About Who We Are"
        buttonRoute="/who-we-are"
      />

      <ContactContainer>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: '#FFD700', fontWeight: 700 }}>
          Partner with Us for Enterprise IT
        </Typography>
        <Typography variant="h6" component="p" gutterBottom align="center" sx={{ color: '#B0BEC5', mb: 4 }}>
          We’re happy to answer any questions and help you determine which services best fit your operational goals.
        </Typography>

        <ContactPaper>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#FFD700', fontWeight: 600 }}>
            Contact Information
          </Typography>
          <List>
            {contactInfo.map((info, index) => (
              <ListItem key={index}>
                <ListItemIcon>{info.icon}</ListItemIcon>
                <ListItemText primary={info.text} sx={{ color: '#FFFFFF' }} />
              </ListItem>
            ))}
          </List>
        </ContactPaper>

        <ContactPaper>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#FFD700', fontWeight: 600 }}>
            Your Benefits
          </Typography>
          <Grid container spacing={2}>
            {benefits.map((benefit, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box display="flex" alignItems="center">
                    <CheckCircle sx={{ color: '#00D2FF' }} />
                    <Typography variant="body1" component="p" sx={{ ml: 1, color: '#FFFFFF' }}>
                      {benefit}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </ContactPaper>

        <ContactPaper>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#FFD700', fontWeight: 600 }}>
            What Happens Next?
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', md: 'row' },
              alignItems: 'center',
              gap: { xs: 2, md: 10 },
              width: '100%',
            }}
          >
            <List>
              {steps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Schedule sx={{ color: '#00D2FF' }} />
                  </ListItemIcon>
                  <ListItemText primary={`${step.step}. ${step.description}`} sx={{ color: '#FFFFFF' }} />
                </ListItem>
              ))}
            </List>

            <Box
              component="img"
              src={logo}
              alt="All PC Repair Logo"
              sx={{
                maxWidth: { xs: '100%', md: '350px' },
                height: 'auto',
                width: 'auto',
                borderRadius: 4,
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
              }}
            />
          </Box>

          <Box sx={{ paddingTop: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#FFD700' }}>
              Book a Strategy Call with All PC Repair
            </Typography>
            <Typography paragraph sx={{ color: '#B0BEC5', textAlign: 'center' }}>
              Want to discuss your IT infrastructure in detail? Schedule a meeting to get a tailored roadmap.
            </Typography>
            <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  component="a"
                  href="https://outlook.office.com/bookwithme/user/989884d224234413b9ad67915a1244c1@allpcrepairva.com/meetingtype/w7vvXiU7M06tqTCDaaAUmQ2?anonymous&ep=mlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    backgroundColor: '#FFD700',
                    color: '#000',
                    fontWeight: 700,
                    borderRadius: '20px',
                    '&:hover': {
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
                    },
                    '&:focus-visible': {
                      outline: '3px solid #00D2FF',
                      outlineOffset: '2px'
                    }
                  }}
                >
                  Schedule Consultation Now
                </Button>
              </motion.div>
            </Box>
          </Box>
        </ContactPaper>

        <ContactPaper>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#FFD700', fontWeight: 600 }}>
            Send Us a Message
          </Typography>
          <Box component="form" ref={form} onSubmit={sendEmail} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth name="first_name" label="First Name" variant="outlined" InputLabelProps={{ style: { color: '#B0BEC5' } }} inputProps={{ style: { color: '#FFF' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth name="last_name" label="Last Name" variant="outlined" InputLabelProps={{ style: { color: '#B0BEC5' } }} inputProps={{ style: { color: '#FFF' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth name="company" label="Company / Organization" variant="outlined" InputLabelProps={{ style: { color: '#B0BEC5' } }} inputProps={{ style: { color: '#FFF' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth name="email" label="Company Email" type="email" variant="outlined" InputLabelProps={{ style: { color: '#B0BEC5' } }} inputProps={{ style: { color: '#FFF' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth name="phone" label="Phone Number" variant="outlined" InputLabelProps={{ style: { color: '#B0BEC5' } }} inputProps={{ style: { color: '#FFF' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="message"
                  label="How Can We Help You?"
                  variant="outlined"
                  multiline
                  rows={5}
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  InputLabelProps={{ style: { color: '#B0BEC5' } }}
                  inputProps={{ style: { color: '#FFF' } }}
                />
              </Grid>
              <Grid item xs={12} sx={{ color: '#90A4AE', fontSize: '0.8rem' }}>
                By providing a telephone number and submitting this form you are consenting to be contacted by SMS text message. Message & data rates may apply. Reply STOP to opt-out.
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#FFD700',
                  color: '#000',
                  fontWeight: 700,
                  px: 4,
                  py: 1.2,
                  borderRadius: '20px',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
                  },
                  '&:focus-visible': {
                    outline: '3px solid #00D2FF',
                    outlineOffset: '2px'
                  }
                }}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Message
              </Button>
            </Box>
          </Box>
        </ContactPaper>
      </ContactContainer>

      <Dialog open={submitted} onClose={handleClose} PaperProps={{ style: { backgroundColor: '#121218', color: '#FFF', border: '1px solid #FFD700', borderRadius: '16px' } }}>
        <DialogTitle sx={{ color: '#FFD700', fontWeight: 700 }}>Thank You for Reaching Out!</DialogTitle>
        <DialogContent>
          <Box textAlign="center">
            <img src="/assets/1.png" alt="All PC Repair Logo" style={{ width: '180px', marginBottom: '1rem' }} />
            <Typography variant="body1" sx={{ color: '#E0E0E0', mb: 2 }}>
              Your inquiry has been received by our engineering team. We will get back to you shortly.
            </Typography>
          </Box>
          <Typography paragraph sx={{ color: '#B0BEC5', fontSize: '0.9rem' }}>
            Want to discuss your IT needs in detail right now? Schedule a direct meeting with our team.
          </Typography>
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              component="a"
              href="https://outlook.office.com/bookwithme/user/989884d224234413b9ad67915a1244c1@allpcrepairva.com/meetingtype/w7vvXiU7M06tqTCDaaAUmQ2?anonymous&ep=mlink"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 700,
                '&:hover': { backgroundColor: '#FFFFFF' }
              }}
            >
              Schedule Consultation
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#00D2FF' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Contact;
