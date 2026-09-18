// src/components/YouTubeFeed.jsx
import React from 'react';
import YouTube from 'react-youtube';
import { Container, Box, Typography } from '@mui/material';
import './styles/YouTubeFeed.css';

const YouTubeFeed = () => {
  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <Container className="youtube-feed-container">
      <Typography variant="h4" className="feed-title">YouTube Feed</Typography>
      <Box className="youtube-feed">
        <YouTube videoId="xxxxxx" opts={opts} />
      </Box>
    </Container>
  );
};

export default YouTubeFeed;
