import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, IconButton, Divider, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Phone, Email, LocationOn, SmartToy } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';

const FooterBox = styled(Box)(({ theme }) => ({
  color: 'white',
  borderTop: '4px solid #FFD700',
  padding: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
    textAlign: 'left',
  },
  textAlign: 'center',
  backgroundColor: '#0A0A10',
  transition: 'all 0.3s ease',
}));

const FooterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    alignItems: 'flex-start',
    textAlign: 'left',
  },
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#FFD700',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'left',
  },
}));

const ContactLink = styled(Typography)(({ theme }) => ({
  ml: 2,
  color: 'white',
  textDecoration: 'none',
  transition: 'color 0.3s ease-in-out',
  '&:hover': {
    color: '#FFD700',
  },
}));

const CustomDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: 'rgba(255, 215, 0, 0.4)',
  width: '50%',
  margin: `${theme.spacing(2)} auto`,
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    width: '100%',
  },
}));

const ServiceLink = styled(Link)(({ theme }) => ({
  color: '#D0D7DE',
  textDecoration: 'none',
  transition: 'color 0.3s ease-in-out',
  '&:hover': {
    color: '#FFD700',
  },
}));

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = ["Virginia Beach", "Norfolk", "Chesapeake", "Portsmouth", "Hampton", "Newport News", "Suffolk"];

  return (
    <FooterBox component="footer" role="contentinfo" aria-label="Site Footer">
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        <Grid item xs={12} sm={4}>
          <FooterSection>
            <FooterTitle variant="h6">Contact Us</FooterTitle>
            <CustomDivider />
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <IconButton color="inherit" aria-label="Call All PC Repair" sx={{ p: 0 }} component="a" href="tel:+17575591231">
                <Phone sx={{ color: '#FFD700' }} />
              </IconButton>
              <ContactLink variant="body2" component="a" href="tel:+17575591231">(757)-559-1231</ContactLink>
            </Box>
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <IconButton color="inherit" aria-label="Email All PC Repair" sx={{ p: 0 }} component="a" href="mailto:info@allpcrepairva.com">
                <Email sx={{ color: '#FFD700' }} />
              </IconButton>
              <ContactLink variant="body2" component="a" href="mailto:info@allpcrepairva.com">info@allpcrepairva.com</ContactLink>
            </Box>
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <IconButton color="inherit" aria-label="Location" sx={{ p: 0 }} component="a" href="https://www.google.com/maps/place/Hampton+Roads,+VA" target="_blank" rel="noopener noreferrer">
                <LocationOn sx={{ color: '#FFD700' }} />
              </IconButton>
              <ContactLink variant="body2" component="a" href="https://www.google.com/maps/place/Hampton+Roads,+VA" target="_blank" rel="noopener noreferrer">
                Hampton Roads, Virginia
              </ContactLink>
            </Box>
            <Typography variant="caption" sx={{ mt: 1, color: '#90A4AE' }}>
              Service Region: {cities.join(', ')}
            </Typography>
          </FooterSection>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FooterSection>
            <FooterTitle variant="h6">Services & AI Tools</FooterTitle>
            <CustomDivider />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ServiceLink to="/what-we-do#estimator">
                  <Typography variant="body2" sx={{ mb: 1, color: '#00D2FF', fontWeight: 600 }}>AI Estimator Widget</Typography>
                </ServiceLink>
                <ServiceLink to="/services/it-services">
                  <Typography variant="body2" sx={{ mb: 1 }}>IT Support & PC Repair</Typography>
                </ServiceLink>
                <ServiceLink to="/services/cloud-services">
                  <Typography variant="body2" sx={{ mb: 1 }}>Cloud Migration</Typography>
                </ServiceLink>
                <ServiceLink to="/services/cybersecurity-services">
                  <Typography variant="body2" sx={{ mb: 1 }}>Cybersecurity Audit</Typography>
                </ServiceLink>
                <ServiceLink to="/services/technology-procurement-services">
                  <Typography variant="body2" sx={{ mb: 1 }}>Tech Procurement</Typography>
                </ServiceLink>
                <ServiceLink to="/services/voip-services">
                  <Typography variant="body2" sx={{ mb: 1 }}>VoIP Phone Systems</Typography>
                </ServiceLink>
              </Grid>
              <Grid item xs={6}>
                <ServiceLink to="/services/network-setup-services">
                  <Typography variant="body2" sx={{ mb: 1 }}>Network Cabling</Typography>
                </ServiceLink>
                <ServiceLink to="/services/managed-it-services">
                  <Typography variant="body2" sx={{ mb: 1 }}>Managed IT Support</Typography>
                </ServiceLink>
                <ServiceLink to="/services/cybersecurity-services/risk-assessment">
                  <Typography variant="body2" sx={{ mb: 1 }}>Risk Assessment</Typography>
                </ServiceLink>
                <ServiceLink to="/services/cybersecurity-services/virtual-ciso">
                  <Typography variant="body2" sx={{ mb: 1 }}>Virtual CISO</Typography>
                </ServiceLink>
                <ServiceLink to="/services/datacenter-services/datacenter-services-management">
                  <Typography variant="body2" sx={{ mb: 1 }}>Data Center Mgmt</Typography>
                </ServiceLink>
              </Grid>
            </Grid>
          </FooterSection>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FooterSection>
            <FooterTitle variant="h6">AI Engine & Time</FooterTitle>
            <CustomDivider />
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 1, gap: 1 }}>
              <SmartToy sx={{ color: '#00D2FF' }} />
              <Typography variant="body2" sx={{ color: '#00D2FF' }}>
                AEO & LLM Context Ready
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>{currentTime.toLocaleTimeString()}</Typography>
            <Typography variant="body2" sx={{ color: '#90A4AE' }}>{currentTime.toLocaleDateString()}</Typography>
          </FooterSection>
        </Grid>
      </Grid>

      <Typography variant="body2" sx={{ mt: 4, color: '#90A4AE' }}>
        &copy; {new Date().getFullYear()} All PC Repair & IT Solutions. All rights reserved. |{' '}
        <Link to="/privacy-policy" style={{ color: '#FFD700', textDecoration: 'none' }}>
          Privacy Policy
        </Link>{' '}
        |{' '}
        <a href="/llms.txt" style={{ color: '#00D2FF', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
          llms.txt
        </a>{' '}
        |{' '}
        <a href="/ai.txt" style={{ color: '#00D2FF', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
          ai.txt
        </a>
      </Typography>

      <SocialLinks />
    </FooterBox>
  );
};

export default Footer;
