// src/components/InstagramFeed.jsx
import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Container, Typography } from '@mui/material';
import './styles/InstagramFeed.css';
import { FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Dynamically import all media files from the instagram-grindstone folder
const requireMedia = require.context('./instagram-grindstone', false, /\.(jpg|mp4)$/);

const mediaFiles = requireMedia.keys().map((file) => {
  const type = file.endsWith('.mp4') ? 'video' : 'image';
  return { type, src: requireMedia(file) };
});

const InstagramFeed = () => {
  return (
    <Container maxWidth="sm" className="instagram-feed">
      <Typography variant="h4" className="feed-title">
        Follow Us On Instagram <FaInstagram />
      </Typography>
      <Carousel
        autoPlay
        animation="fade"
        navButtonsAlwaysVisible={false}
        indicators={false}
        interval={3000}
        stopAutoPlayOnHover
      >
        {mediaFiles.map((media, index) => (
          <Box key={index} className="instagram-post" display="flex" justifyContent="center" alignItems="center">
            {media.type === 'image' ? (
              <img src={media.src} alt={`Instagram post ${index + 1}`} className="media-content" />
            ) : (
              <video controls muted className="media-content">
                <source src={media.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </Box>
        ))}
      </Carousel>
      <Link className="no-decoration" to="https://instagram.com/grindstoneathletics" target="_blank"  rel="noreferrer nofollow" >
      <Typography variant="h4" className="feed-title">
        @grindstoneathletics
      </Typography>
      </Link>
    </Container>
  );
};

export default InstagramFeed;
