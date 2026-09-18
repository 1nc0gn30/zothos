import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import Logo from './assets/1.png'; 

const CTABox = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  textAlign: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(8),
  },
}));

const LogoImage = styled('img')({
  height: '120px',
  marginBottom: '20px',
});

const CTAButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  backgroundColor: '#FFD700',
  color: '#000',
  '&:hover': {
    backgroundColor: '#FFC107',
  },
}));

const CTASection = () => {
  return (
    <CTABox>
      <Container>
        <LogoImage src={Logo} alt="All Repair PC" />
        <Typography variant="h4" component="h2" gutterBottom>
          Contact Us Today!
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          Receive a Free Consultation for Your IT/Network Services
        </Typography>
        <CTAButton component={Link} to="/contact" variant="contained">
          Get Your Free Consultation
        </CTAButton>
      </Container>
    </CTABox>
  );
};

export default CTASection;
