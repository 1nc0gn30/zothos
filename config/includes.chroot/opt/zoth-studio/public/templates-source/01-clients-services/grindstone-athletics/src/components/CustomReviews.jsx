import React from 'react';
import { Box, Typography, Grid, Paper, Avatar, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import './styles/CustomReviews.css';

const reviews = [
  {
    name: 'Daniel Fornicola',
    text: 'The coaches are very knowledgeable and treat you with respect while pushing your limits. Everytime I show up everyone is really nice.',
    response: 'Thanks Daniel!',
    avatar: require('./assets/avatars/avatar1.png'),
  },
  {
    name: 'Gina G',
    text: 'Super cool gym with some awesome balls. Lol we had a comedy show there and it was packed!! Great night of Comedy! Thanks for having us.',
    response: 'Thank You for coming out! He hope to have more comedy nights in the future!',
    avatar: require('./assets/avatars/avatar2.png'),
  },
  {
    name: 'Steve Brown',
    text: 'Grindstone athletics is one of 757’s most legit training facilities offering top notch instruction in the combative arts and strength training.  Professor Will and Kru Chase are a wealth of knowledge with real world experience in the arena as high level competitors and instructors.  Highly recommended!!!',
    response: 'Thanks so much Steve!',
    avatar: require('./assets/avatars/avatar3.png'),
  },
  {
    name: 'Aj F',
    text: 'I was on vacation and looking for a place to train. Everybody at the gym was welcoming and fun to work with. Coach Chase gave clear instructions and was very knowledgeable.',
    response: 'Thanks so much AJ, we enjoyed having you train with us. You will always have a place to train when you are in town!',
    avatar: require('./assets/avatars/avatar4.png'),
  },
];

const CustomReviews = () => {
  return (
    <Box className="reviews-container">
      <Typography variant="h4" className="reviews-title">
        Reviews
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {reviews.map((review, index) => (
          <Grid item xs={12} md={6} key={index} className="review-item-container">
            <Paper elevation={3} className="review-item">
              <Box display="flex" alignItems="center" mb={2} className="review-header">
                <Avatar src={review.avatar} alt={review.name} className="review-avatar" />
                <Box ml={2}>
                  <Typography variant="h6" className="review-author">
                    {review.name}
                  </Typography>
                  <Box display="flex" alignItems="center" className="review-rating">
                    {Array(5).fill().map((_, i) => (
                      <StarIcon key={i} className="star-icon" />
                    ))}
                  </Box>
                </Box>
              </Box>
              <Typography variant="body1" className="review-text">
                {review.text}
              </Typography>
              {review.response && (
                <Typography variant="body2" color="textSecondary" className="review-response">
                  Response from the owner: {review.response}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          className="cta-button"
          href="https://www.google.com/search?q=GrindStone+Athletics+Virginia+reviews"
          target="_blank"
        >
          Check us out on Google!
        </Button>
      </Box>
    </Box>
  );
};

export default CustomReviews;
