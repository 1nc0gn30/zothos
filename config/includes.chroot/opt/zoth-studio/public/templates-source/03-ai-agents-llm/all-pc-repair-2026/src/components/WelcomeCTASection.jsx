import React, { useState } from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';
import WelcomePopup from './WelcomePopup';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Main CTA container with background image and gradient overlay
const CTASectionContainer = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.9)),
    url('https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundBlendMode: 'overlay',
  padding: theme.spacing(6),
  borderRadius: theme.spacing(4),
  margin: theme.spacing(8, 0),
  position: 'relative',
  overflow: 'hidden',
}));

// Content container for proper layering and centering
const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

// Badge style for the offer
const CTABadge = styled(Box)(({ theme }) => ({
  background: '#000',
  color: '#FFD700',
  borderRadius: '30px',
  padding: theme.spacing(0.5, 2),
  display: 'inline-flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
}));

// Title with gradient text
const CTATitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: '2.75rem',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #000 0%, #fff 50%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontFamily: "'Montserrat', sans-serif",
}));

// Subtitle styling
const CTASubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  maxWidth: '540px',
  marginBottom: theme.spacing(3),
  fontWeight: 500,
  lineHeight: 1.6,
  color: '#fff',
}));

// List container for features
const FeatureList = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

// Individual feature item style
const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.95rem',
  fontWeight: 600,
  padding: theme.spacing(0.5, 1.5),
  borderRadius: '20px',
  backgroundColor: 'rgba(255,255,255,0.4)',
}));

// Styled CTA button
const CTAButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.8, 4),
  backgroundColor: '#000',
  color: '#FFD700',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  transition: 'all 0.4s ease',
  '&:hover': {
    backgroundColor: '#222',
  },
}));

// Single decorative element
const DecorativeCircle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  background: '#FFF',
  opacity: 0.1,
  top: theme.spacing(2),
  right: theme.spacing(2),
}));

const WelcomeCTASection = () => {
  const [openPopup, setOpenPopup] = useState(false);

  const handleCTAButtonClick = () => {
    localStorage.removeItem('popupShown');
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
    localStorage.setItem('popupShown', 'true');
  };

  const features = [
    { icon: <SecurityIcon fontSize="small" />, text: 'Advanced Protection' },
    { icon: <BookmarkIcon fontSize="small" />, text: 'Expert Tips' },
    { icon: <SecurityIcon fontSize="small" />, text: 'Real Examples' },
  ];

  return (
    <Container maxWidth="lg">
      <CTASectionContainer elevation={10}>
        <DecorativeCircle />
        <ContentWrapper>
          <CTABadge>
            <BookmarkIcon fontSize="small" /> LIMITED TIME OFFER
          </CTABadge>
          <CTATitle variant="h2">
            Master Network Security With Our Free Guide
          </CTATitle>
          <CTASubtitle variant="body1">
            Unlock exclusive strategies used by security professionals to protect sensitive data and prevent cyber attacks.
          </CTASubtitle>
          <FeatureList>
            {features.map((feature, index) => (
              <FeatureItem key={index}>
                {feature.icon} {feature.text}
              </FeatureItem>
            ))}
          </FeatureList>
          <CTAButton
            variant="contained"
            onClick={handleCTAButtonClick}
            endIcon={<ArrowForwardIcon />}
          >
            Download Free eBook
          </CTAButton>
        </ContentWrapper>
      </CTASectionContainer>
      {openPopup && <WelcomePopup onClose={handlePopupClose} />}
    </Container>
  );
};

export default WelcomeCTASection;
