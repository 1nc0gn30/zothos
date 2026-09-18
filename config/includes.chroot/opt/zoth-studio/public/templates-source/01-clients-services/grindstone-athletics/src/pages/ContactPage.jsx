import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Paper, TextField, Button, MenuItem } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import './styles/ContactPage.css';
import logo from './assets/logo.png';
import Map from '../components/Map';

const contactOptions = [
  { label: 'I want to take a class', value: 'class' },
  { label: 'I want to be a member', value: 'member' },
  { label: 'I want to help', value: 'help' },
  { label: 'Other', value: 'other' },
];

const ContactPage = () => {
  const springProps = useSpring({ opacity: 1, from: { opacity: 0 }, config: { duration: 1000 } });
  const [selectedReason, setSelectedReason] = useState(contactOptions[0].value);

  return (
    <Container id="page-top" maxWidth={false} disableGutters className="contact-page-container">
      <Box className="contact-hero-section">
        <Typography variant="h2" className="contact-hero-title">
          Contact Us
        </Typography>
      </Box>
      <Container maxWidth="lg" className="contact-details-section">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} className="contact-info">
            <Paper elevation={3} className="contact-info-paper">
              <Box p={3} display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                <img src={logo} alt="GrindStone Athletics Logo" className="contact-logo" />
                <Typography variant="h6">205 Pennsylvania Avenue</Typography>
                <Typography variant="h6">Virginia Beach, Virginia 23462</Typography>
                <Typography variant="h6">
                  <a href="mailto:gsa@grindstoneathleticsvb.com">gsa@grindstoneathleticsvb.com</a>
                </Typography>
                <Typography variant="h6">757-351-1975</Typography>
                <Box mt={2} display="flex" justifyContent="center">
                  <a href="https://www.facebook.com/grindstoneathleticsgym" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="contact-icon" style={{ color: 'red' }} />
                  </a>
                  <a href="https://www.instagram.com/grindstoneathletics" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="contact-icon" style={{ color: 'red' }} />
                  </a>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} className="contact-form">
            <Paper elevation={3} className="contact-form-paper">
              <Box p={3}>
                <Typography variant="h6" mb={2}>Get in Touch</Typography>
                <form noValidate autoComplete="off">
                  <TextField label="Name" fullWidth margin="normal" variant="outlined" />
                  <TextField label="Phone" fullWidth margin="normal" variant="outlined" />
                  <TextField label="Email" fullWidth margin="normal" variant="outlined" />
                  <TextField
                    label="Reason for Contact"
                    select
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  >
                    {contactOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button variant="contained" color="primary" fullWidth type="submit" className="contact-submit-button">
                    Send
                  </Button>
                </form>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="map-section">
          <Grid item xs={12}>
            <animated.div style={springProps} className="map-container">
              <Map />
            </animated.div>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

export default ContactPage;
