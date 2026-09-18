import React, { useState } from 'react';
import { 
  Typography, 
  Container, 
  Box, 
  Button, 
  Paper, 
  Divider, 
  Chip, 
  Collapse 
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import ContactForm from '../components/ContactForm';
import ParallaxImageSection from '../components/ParallaxImageSection';
import LocationsPageHero from '../components/LocationsPageHero';
import CTASection from '../components/CTASection';
import LearnMoreCTA from '../components/LearnMoreCTA';
import FancyDivider from '../components/FancyDivider';

const locations = [
  {
    name: 'Evergreen Adult Home Care Inc.',
    address: 'Placeholder St, Placeholder City State Zip',
    phone: '(757) 555-1234',
    email: 'contact@evergreeninc.com',
    description:
      'Located in the heart of the city, our Placeholder City location offers exceptional care and a tranquil environment for your loved ones.',
    img: 'https://media.istockphoto.com/id/157677909/photo/nurse-or-doctor-pushing-a-wheelchair-outdoors.jpg?s=2048x2048&w=is&k=20&c=ra-SRibIMWxxCtD8Z02pESI_d8ixNeb3pFCOT_b4R2I=',
    services: ['24/7 Nursing', 'Therapeutic Care', 'Assisted Living', 'Memory Care'],
    mapEmbed: 'https://maps.google.com/maps?q=Virginia%20Beach&t=&z=13&ie=UTF8&iwloc=&output=embed',
  },
  {
    name: 'Evergreen Adult Home Care at Hudson',
    address: 'Hudson Ave, Placeholder City, State Zip',
    phone: '(757) 555-5678',
    email: 'hudson@evergreen.com',
    description:
      'Our Hudson location provides high-quality care in a supportive and comfortable environment for seniors and adults.',
    img: 'https://media.istockphoto.com/id/172253165/photo/modern-condo-building.jpg?s=2048x2048&w=is&k=20&c=55ZdZ9Ip-Exc0hMf2HK_Y9zda6q1UpdrwD1LuAybgKI=',
    services: ['Respite Care', 'Personalized Meals', 'Senior Activities', 'Rehabilitation'],
    mapEmbed: 'https://maps.google.com/maps?q=Norfolk&t=&z=13&ie=UTF8&iwloc=&output=embed',
  },
];

const LocationsPage = () => {
  const [expandedLocation, setExpandedLocation] = useState(null);

  const handleToggleExpand = (index) => {
    setExpandedLocation(expandedLocation === index ? null : index);
  };

  return (
    <>
    {/* Hero Section */}
    <LocationsPageHero />
    <Container sx={{ padding: { xs: '24px', md: '48px' }, minHeight: '100vh' }}>
      
     

      {/* Locations with Banner Titles, Images, and Descriptions */}
      {locations.map((location, index) => (
        <Box key={index} sx={{ marginBottom: '60px' }}>
          {/* Banner Title */}
          <Box 
            sx={{ 
              backgroundColor: '#81C784', 
              padding: { xs: '16px', md: '32px' }, 
              textAlign: 'center', 
              borderRadius: '8px',
              marginBottom: '24px',
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ fontWeight: 'bold', color: '#fff', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}
            >
              {location.name}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item="true" size={{ xs: 12 }}>
              <img 
                src={location.img} 
                alt={location.name} 
                style={{ 
                  width: '100%', 
                  maxWidth: '600px', 
                  borderRadius: '12px', 
                  objectFit: 'cover', 
                  margin: '0 auto', 
                  display: 'block', 
                  boxShadow: '0px 8px 16px rgba(0,0,0,0.1)',
                }} 
              />
            </Grid>
          </Grid>

          {/* Description and More Info Section */}
          <Grid container spacing={4} sx={{ marginTop: '24px' }}>
            <Grid item="true" size={{ xs: 12 }}>
              <Paper 
                elevation={4} 
                sx={{ 
                  padding: '24px', 
                  borderRadius: '12px', 
                  backgroundColor: '#f7f7f7',
                  boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '16px' }}>
                  <ArrowRightIcon sx={{ verticalAlign: 'middle', marginRight: '8px', color: '#4CAF50' }} />
                  {location.description}
                </Typography>
                <Divider sx={{ marginY: '16px' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CallIcon sx={{ color: '#4CAF50' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {location.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ color: '#4CAF50' }} />
                    <Typography variant="body2">
                      {location.email}
                    </Typography>
                  </Box>
                </Box>

                <Button 
                  variant="outlined" 
                  color="success" 
                  sx={{ 
                    marginTop: '16px', 
                    borderRadius: '20px', 
                    textTransform: 'none',
                  }}
                  onClick={() => handleToggleExpand(index)}
                >
                  {expandedLocation === index ? 'Hide Details' : 'Learn More'}
                </Button>

                {/* Expandable Section */}
                <Collapse in={expandedLocation === index} timeout="auto" unmountOnExit>
                  <Box sx={{ marginTop: '16px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                      Services Offered:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {location.services.map((service, i) => (
                        <Chip key={i} label={service} color="success" />
                      ))}
                    </Box>

                    <Box sx={{ marginTop: '16px', position: 'relative' }}>
                      <iframe 
                        src={location.mapEmbed} 
                        width="100%" 
                        height="300" 
                        style={{ borderRadius: '12px', border: 'none' }} 
                        title="Map"
                      ></iframe>
                      <Button 
                        startIcon={<CloseIcon />} 
                        sx={{ position: 'absolute', top: 8, right: 8 }} 
                        onClick={() => handleToggleExpand(index)}
                      >
                        Close
                      </Button>
                    </Box>
                  </Box>
                </Collapse>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ))}
      
    </Container>
    <FancyDivider />
    <Box sx={{marginBottom: 5, marginTop: 5}}>
    <LearnMoreCTA />
    </Box>
    <CTASection />
    <ContactForm />
      <ParallaxImageSection />
    </>
  );
};

export default LocationsPage;
