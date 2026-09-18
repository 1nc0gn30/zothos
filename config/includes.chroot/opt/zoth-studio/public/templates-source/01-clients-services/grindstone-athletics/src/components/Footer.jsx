import React from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { Facebook, Instagram } from '@mui/icons-material';
import logo from './assets/logo.png'; // Adjust the path as necessary
import './styles/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" py={2} bgcolor="#f5f5f5">
      <Container maxWidth="lg">
        <Grid container spacing={2} className="footer-contact" mt={4} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom className="footer-title">
              Not a Member? Take a Free Class!
            </Typography>
            <Typography variant="body1" mb={2} align="center">
              Fill out the form below and we'll be in touch shortly.
            </Typography>
            <form name="contact" method="POST" data-netlify="true">
              <input type="hidden" name="form-name" value="contact" />
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                  <input type="text" name="first-name" placeholder="First Name *" required className="footer-input" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <input type="text" name="last-name" placeholder="Last Name *" required className="footer-input" />
                </Grid>
                <Grid item xs={12}>
                  <input type="tel" name="phone" placeholder="Phone *" required className="footer-input" />
                </Grid>
                <Grid item xs={12}>
                  <input type="email" name="email" placeholder="Email *" required className="footer-input" />
                </Grid>
                <Grid item xs={12}>
                  <textarea name="message" placeholder="Add a message" className="footer-input" rows={3}></textarea>
                </Grid>
                <Grid item xs={12}>
                  <button type="submit" className="footer-submit">
                    Submit
                  </button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
        
        <Box my={4} className="footer-info">
          
          <Grid container alignItems="center" justifyContent="center" spacing={2}>
            <Grid item>
              <img src={logo} alt="GrindStone Athletics" className="footer-logo" />
              <Box textAlign="center">
                <IconButton aria-label="Instagram" href="https://www.instagram.com/grindstoneathletics" target="_blank" rel="noopener noreferrer">
                  <Instagram />
                </IconButton>
                <IconButton aria-label="Facebook" href="https://www.facebook.com/GrindStoneAthleticsGym" target="_blank" rel="noopener noreferrer">
                  <Facebook />
                </IconButton>
              </Box>
            </Grid>
            <Grid item>
            
              <Typography variant="body1" mt={2} align="center">
                205 Pennsylvania Avenue<br />
                Virginia Beach, Virginia 23462
              </Typography>
              <Typography variant="body1" align="center">
                <Link to="mailto:gsa@grindstoneathleticsvb.com">
                  gsa@grindstoneathleticsvb.com
                </Link><br />
                <Link to="tel:+17573511975">+1 (757)-351-1975</Link>
              </Typography>
              
            </Grid>
          </Grid>
        </Box>
        
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            © {currentYear} by Grindstone Athletics. All rights reserved. Designed and maintained by 
            <Link to="https://www.deseomediacompany.com" target="_blank" rel="noopener noreferrer"> Deseo Media Company</Link>.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <Link to="/privacy-policy" color="inherit">Privacy Policy</Link> | <Link to="/terms-of-service" color="inherit">Terms of Service</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
