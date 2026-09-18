import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  IconButton, 
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EngineeringIcon from '@mui/icons-material/Engineering';

// Custom styled components to match header
const FooterWrapper = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  color: 'rgba(255, 255, 255, 0.7)',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(4)
}));

const FooterLogo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '1px',
  background: 'linear-gradient(45deg, #f5f5f5, #bdbdbd)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  marginBottom: theme.spacing(2)
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
  color: '#ffffff',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  position: 'relative',
  paddingBottom: theme.spacing(1),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '40px',
    height: '3px',
    backgroundColor: '#64b5f6',
    borderRadius: '2px'
  }
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  '&:hover': {
    '& .MuiListItemText-primary': {
      color: '#ffffff',
      transition: 'color 0.3s ease'
    }
  }
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: '#ffffff'
  }
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)'
  }
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(2),
    color: '#64b5f6'
  }
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];
  
  const services = [
    { name: 'Custom Signs', path: '/services#signs' },
    { name: 'Motorcycle Fabrication', path: '/services#bikes' },
    { name: 'Architectural Metals', path: '/services#architectural' },
    { name: 'Art Installations', path: '/services#art' },
    { name: 'Metal Furniture', path: '/services#furniture' }
  ];

  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={4}>
            <FooterLogo variant="h6">Bautista Built</FooterLogo>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.8 }}>
              Crafting precision metal works since 2010. From custom motorcycles to statement signs and 
              artistic installations, we bring your metal fabrication visions to life with skill and attention to detail.
            </Typography>
            <Box sx={{ mb: 2 }}>
              <SocialIconButton aria-label="Facebook">
                <FacebookIcon />
              </SocialIconButton>
              <SocialIconButton aria-label="Instagram">
                <InstagramIcon />
              </SocialIconButton>
              <SocialIconButton aria-label="Pinterest">
                <PinterestIcon />
              </SocialIconButton>
              <SocialIconButton aria-label="LinkedIn">
                <LinkedInIcon />
              </SocialIconButton>
            </Box>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterHeading variant="h6">Quick Links</FooterHeading>
            <List disablePadding>
              {quickLinks.map((link) => (
                <StyledListItem key={link.name} disableGutters>
                  <ListItemText 
                    primary={
                      <StyledLink to={link.path}>{link.name}</StyledLink>
                    } 
                  />
                </StyledListItem>
              ))}
            </List>
          </Grid>
          
          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterHeading variant="h6">Metal Services</FooterHeading>
            <List disablePadding>
              {services.map((service) => (
                <StyledListItem key={service.name} disableGutters>
                  <ListItemText 
                    primary={
                      <StyledLink to={service.path}>{service.name}</StyledLink>
                    } 
                  />
                </StyledListItem>
              ))}
            </List>
          </Grid>
          
          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterHeading variant="h6">Contact Our Shop</FooterHeading>
            <ContactItem>
              <LocationOnIcon />
              <Typography variant="body2">
                123 Metalworks Way, VA BEACH 12345
              </Typography>
            </ContactItem>
            <ContactItem>
              <PhoneIcon />
              <Typography variant="body2">
                (555) 123-4567
              </Typography>
            </ContactItem>
            <ContactItem>
              <EmailIcon />
              <Typography variant="body2">
                info@bautistabuilt.com
              </Typography>
            </ContactItem>
            <ContactItem>
              <EngineeringIcon />
              <Typography variant="body2">
                Mon-Fri: 8AM-6PM | Sat: 9AM-3PM
              </Typography>
            </ContactItem>
          </Grid>
        </Grid>
        
        <Divider sx={{ 
          mt: 4, 
          mb: 4, 
          backgroundColor: 'rgba(255, 255, 255, 0.1)' 
        }} />
        
        {/* Copyright */}
        <Box sx={{ 
          textAlign: 'center',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: 2
        }}>
          <Typography variant="body2">
            © {currentYear} Bautista Built Metal Fabrication. All rights reserved.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <StyledLink to="/privacy">Privacy Policy</StyledLink>
            <StyledLink to="/terms">Terms of Service</StyledLink>
          </Box>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;