// components/Footer.js
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Stack, IconButton, Divider, Tabs, Tab 
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ArrowForward } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const year = currentTime.getFullYear();
  const time = currentTime.toLocaleTimeString();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const locations = [
    {
      name: 'Location 1',
      address: '362 N Swidler Street, Orange, CA 92869',
      phone: '951-893-0859',
      email: 'admin@evergreenahc.com',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509645!2d144.95373531531806!3d-37.8162797797517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5772f9e18f0c24b!2s362%20N%20Swidler%20St%2C%20Orange%2C%20CA%2092869%2C%20USA!5e0!3m2!1sen!2s!4v1637025855478!5m2!1sen!2s',
    },
    {
      name: 'Location 2',
      address: '1234 Evergreen Avenue, Los Angeles, CA 90001',
      phone: '310-555-1234',
      email: 'contact@evergreenahc.com',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509645!2d-118.243684!3d34.052235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c6348c6b9547%3A0xaceedc8a2843f7b1!2s1234%20Evergreen%20Ave%2C%20Los%20Angeles%2C%20CA%2090001%2C%20USA!5e0!3m2!1sen!2s!4v1637025877543!5m2!1sen!2s',
    },
  ];

  const selectedLocation = locations[tabValue];

  return (
    <Box
      sx={{
        backgroundColor: '#0D4D31',
        color: 'white',
        py: 8,
        px: { xs: 4, md: 12 },
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        textColor="inherit"
        indicatorColor="primary"
        sx={{ marginBottom: 4 }}
      >
        {locations.map((location, index) => (
          <Tab key={index} label={location.name} />
        ))}
      </Tabs>

      <Grid container spacing={4} sx={{ alignItems: 'center', justifyContent: 'space-around' }}>
        <Grid item xs={12} md={6}>
          <Box
            component="iframe"
            src={selectedLocation.mapUrl}
           
            sx={{ width: {xs: '80vw', md: '400px'}, height: {xs: '400px', md: '400px'}, borderRadius: '16px', border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={3} sx={{ textAlign: { xs: 'left', md: 'left' }, width: {xs: '90vw', md: '400px'} }}>
            <Typography variant="h4" fontWeight="bold">
              Get in Touch
            </Typography>
            <Typography variant="h6">{selectedLocation.name}</Typography>
            <Typography>{selectedLocation.address}</Typography>
            <Typography>Phone: {selectedLocation.phone}</Typography>
            <Typography>Email: {selectedLocation.email}</Typography>
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.3)' }} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-around',
          alignItems: {xs:'left', md: 'center'},
          mt: 2,
        }}
      >
        {[
          { name: 'Home', path: '/' },
          { name: 'About Us', path: '/about' },
          { name: 'Services', path: '/services' },
          { name: 'Locations', path: '/locations' },
          { name: 'Contact Us', path: '/contact' },
          { name: 'FAQ', path: '/faq'},
        ].map((item) => (
          <RouterLink key={item.name} to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
              <Typography variant="body1" sx={{ mr: 1 }}>{item.name}</Typography>
              <IconButton size="small" color="inherit">
                <ArrowForward />
              </IconButton>
            </Box>
          </RouterLink>
        ))}
      </Box>

      <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
        © Copyright {year} | Evergreen Adult Home Care | Current Time: {time}
      </Typography>
    </Box>
  );
};

export default Footer;
