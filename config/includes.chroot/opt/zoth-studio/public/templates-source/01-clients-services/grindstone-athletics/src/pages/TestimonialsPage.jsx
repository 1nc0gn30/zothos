import React from 'react';
import { Box, Container, Typography, Grid, Paper, Avatar, CardMedia } from '@mui/material';
import './styles/TestimonialsPage.css';
import CustomReviews from '../components/CustomReviews';
import Overlay from '../components/Overlay';

const testimonials = [
  {
    name: 'John Doe',
    text: 'GrindStone Athletics has transformed my life! The coaches are amazing and the community is incredibly supportive.',
    avatar: '/path/to/avatar1.jpg', // Replace with actual paths to avatar images
    video: '/path/to/video1.mp4', // Replace with actual paths to video clips
  },
  {
    name: 'Jane Smith',
    text: 'Joining GrindStone Athletics was the best decision I ever made. The training is top-notch and I have achieved my fitness goals.',
    avatar: '/path/to/avatar2.jpg', // Replace with actual paths to avatar images
    video: '/path/to/video2.mp4', // Replace with actual paths to video clips
  },
  // Add more testimonials as needed
];

const TestimonialsPage = () => {
  return (
    <Container id="page-top" maxWidth={false} disableGutters className="testimonials-container">
      <Box className="hero-small-testimonials">
        <Typography variant="h2" className="hero-title-testimonials">
          Testimonials
        </Typography>
        <Typography variant="subtitle1" className="hero-subtitle-testimonials">
          Hear stories from our fighters and members!
        </Typography>
      </Box>
      <Overlay />
      <Container maxWidth="lg" className="testimonials-content">
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid container item xs={12} key={index} className="testimonial-row">
              <Grid item xs={12} md={6}>
                <Paper elevation={3} className="testimonial-item">
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                    <Box ml={2}>
                      <Typography variant="h6" className="testimonial-name">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body1" className="testimonial-text">
                        {testimonial.text}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="video"
                  controls
                  className="testimonial-video"
                  src={testimonial.video}
                  title={`Testimonial from ${testimonial.name}`}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Container>
      <CustomReviews />
    </Container>
  );
};

export default TestimonialsPage;
