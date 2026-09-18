// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/Hero';
import Mission from '../components/Mission';
import VideoCard from '../components/VideoCard';
import { Container, Grid } from '@mui/material';
import videoFile from './assets/videos/video1.mp4';
import Overlay from '../components/Overlay';

const HomePage = () => {
  const videoData = [
    {
      src: videoFile,
      caption: 'Exciting Training Session',
      tags: ['Fitness', 'Training', 'Session'],
    },
  ];
  return (
    <div id="page-top">
      <Hero />
      <Overlay />
      <Mission />
      <Overlay />
      <Container  sx={{ paddingBottom: '10vh', background: 'black'}} maxWidth={false}>
      <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}} container spacing={2}>
        {videoData.map((video, index) => (
          <Grid item xs={12} md={6} key={index}>
            <VideoCard videoSrc={video.src} caption={video.caption} tags={video.tags} />
          </Grid>
        ))}
      </Grid>
    </Container>
    </div>
  );
};

export default HomePage;
