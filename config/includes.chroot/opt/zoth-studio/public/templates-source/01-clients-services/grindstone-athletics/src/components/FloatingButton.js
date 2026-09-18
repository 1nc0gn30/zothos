import React from 'react';
import { Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './styles/FloatingButton.css';

const FloatingButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="floating-button">
      <Fab color="primary" onClick={scrollToTop} aria-label="scroll to top">
        <KeyboardArrowUpIcon />
      </Fab>
    </div>
  );
};

export default FloatingButton;
