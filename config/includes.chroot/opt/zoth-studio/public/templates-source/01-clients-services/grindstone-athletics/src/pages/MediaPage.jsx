import React from 'react';
import { Container, Box, Typography, Button, Grid } from '@mui/material';
import InstagramFeed from '../components/InstagramFeed';
import YouTubeFeed from '../components/YouTubeFeed';
import './styles/MediaPage.css';
import { Link } from 'react-router-dom';
import Overlay from '../components/Overlay';

const MediaPage = () => {
  return (
    <Container id="page-top" maxWidth={false} disableGutters className="media-page">
      <Box className="media-hero-section">
      
        <Typography variant="h2" className="media-hero-title">
          Grindstone Athletics Media
        </Typography>
      </Box>
      <Overlay />
      <Grid container spacing={2} className="media-section-container">
        <Grid item xs={12} md={6} className="media-section">
          <InstagramFeed />
        </Grid>
        <Grid item xs={12} md={6} className="media-section">
          <YouTubeFeed />
        </Grid>
      </Grid>
      <Box className="media-cta-button-container">
        <Button className="media-cta-button" component={Link} to="/classes" variant="contained" color="primary">
          Learn More By Joining Our Classes!
        </Button>
      </Box>
    </Container>
  );
};

export default MediaPage;
