import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './styles/CtaComponent.css';
import { Typography, Button } from '@mui/material';
import NewsTicker from './NewsTicker';



 

const CtaComponent = () => {
  const textRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(textRef.current, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1 });
  }, []);

  const handleButtonClick = () => {
    navigate('/membership');
  };

  return (
    <>
      <NewsTicker />
      <div className="cta-container">
        <motion.div ref={textRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cta-text">
          <Typography variant="h2" className="cta-heading">
            Join Grindstone Athletics Today!
          </Typography>
          <Typography variant="body1" className="cta-description">
            Sign up now and get access to exclusive training sessions, top-notch facilities, and a community of passionate fighters. Don't miss out on our special membership offers!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleButtonClick}
            className="cta-button"
            sx={{
              backgroundColor: 'primary',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
              mt: 2,
              px: 4,
              py: 1,
            }}
          >
            Sign Up Now
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default CtaComponent;
