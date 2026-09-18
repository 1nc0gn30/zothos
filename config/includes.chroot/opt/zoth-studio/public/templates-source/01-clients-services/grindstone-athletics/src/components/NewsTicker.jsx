import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Slider from 'react-slick';
import './styles/NewsTicker.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const newsItems = [
  "Breaking News: Local gym wins national competition!",
  "Special Offer: Get 20% off on all memberships this month!",
  "Upcoming Event: Join us for a charity run this weekend!",
  "Reminder: The gym will be closed on public holidays.",
];

const NewsTicker = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    vertical: false,
    verticalSwiping: false,
    adaptiveHeight: true,
  };

  return (
    <Container maxWidth={false} className="news-ticker">
      <Slider {...settings}>
        {newsItems.map((item, index) => (
          <Box key={index} className="ticker-item">
            <Typography variant="h6" className="ticker-text">{item}</Typography>
          </Box>
        ))}
      </Slider>
    </Container>
  );
};

export default NewsTicker;
