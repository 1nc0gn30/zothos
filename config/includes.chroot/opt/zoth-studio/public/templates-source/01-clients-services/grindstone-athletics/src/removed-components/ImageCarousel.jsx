// src/components/ImageCarousel.jsx
import React from 'react';
import Slider from 'react-slick';
import './styles/ImageCarousel.css';

// Dynamically import all images from the specified folder
const importAll = (requireContext) => requireContext.keys().map(requireContext);
const images = importAll(require.context('./assets/images', false, /\.(png|jpe?g|svg)$/));

const ImageCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Slide ${index}`} className="carousel-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;
