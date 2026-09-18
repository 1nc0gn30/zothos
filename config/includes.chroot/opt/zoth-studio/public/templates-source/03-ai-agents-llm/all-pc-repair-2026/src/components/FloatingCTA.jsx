import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import PhoneIcon from '@mui/icons-material/Phone';

// Entrance animation: slides in from the top and fades in
const slideIn = keyframes`
  0% {
    transform: translateY(-30px) scale(0.9);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

// Enhanced Floating Button with a subtle ripple effect and hover interactions
const FloatingButton = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 20,
  right: 20,
  background: 'linear-gradient(135deg, #FFD700, #FFC107)',
  color: '#000',
  padding: '12px 24px',
  borderRadius: '30px',
  boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
  fontFamily: 'Poppins, sans-serif',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, background 0.3s ease, box-shadow 0.3s ease',
  zIndex: 1300,
  animation: `${slideIn} 0.5s ease-out forwards`,
  overflow: 'hidden',
  '&:hover': {
    transform: 'scale(1.06)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    background: 'linear-gradient(135deg, #FFC107, #FFD700)',
  },
  '&:active': {
    transform: 'scale(0.98)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  // Pseudo-element for a subtle ripple effect on hover
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    background: 'rgba(0, 0, 0, 0.15)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0,
    transition: 'width 0.4s ease, height 0.4s ease, opacity 0.4s ease',
  },
  '&:hover::after': {
    width: '200%',
    height: '200%',
    opacity: 0,
  },
}));

// Styled PhoneIcon with additional hover animation (rotate and scale)
const StyledPhoneIcon = styled(PhoneIcon)(({ theme }) => ({
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'rotate(20deg) scale(1.2)',
  },
}));

const FloatingCTA = ({ phoneNumber }) => {
  const handlePhoneCall = () => {
    window.location.href = `tel:${phoneNumber.replace(/-/g, '')}`;
  };

  return (
    <Tooltip title="Call us now!" arrow>
      <FloatingButton onClick={handlePhoneCall}>
        <StyledPhoneIcon />
        <span style={{ fontWeight: '600', fontSize: '1rem' }}>Call Now</span>
      </FloatingButton>
    </Tooltip>
  );
};

export default FloatingCTA;
