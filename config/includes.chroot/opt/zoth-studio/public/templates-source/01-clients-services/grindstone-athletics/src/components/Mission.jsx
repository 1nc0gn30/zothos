import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import manlogohero from './assets/images/man-bg-hero.svg';
import { DeviceFrameset } from 'react-device-frameset';
import { motion, useAnimation } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './styles/Mission.css';

const Mission = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const imgControls = useAnimation();

  const handleLearnMoreClick = () => {
    navigate('/classes');
  };

  const handleViewScheduleClick = () => {
    navigate('/classes#schedule');
  };

  useEffect(() => {
    AOS.init({ duration: 500 });

    const loadStyleSheet = () => {
      import('./styles/Mission.css');
    };

    loadStyleSheet();

    window.addEventListener('resize', loadStyleSheet);

    return () => {
      window.removeEventListener('resize', loadStyleSheet);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const missionElement = document.querySelector('#mission-section');
      const imgElement = document.querySelector('#mission-image');

      if (missionElement && AOS.refresh()) {
        controls.start({ x: 0 });
      } else {
        controls.start({ x: '-100vw' });
      }

      if (imgElement && AOS.refresh()) {
        imgControls.start({ y: 0 });
      } else {
        imgControls.start({ y: '100vh' });
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [controls, imgControls]);

  return (
    <div className="bg-wallpaper">
      <motion.div
        id="mission-section"
        data-aos="fade-in"
        initial={{ x: '-100vw' }}
        animate={controls}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <DeviceFrameset device="iPhone X" color="gold" portrait="true">
          <Box className="mission-container" textAlign="center" color="white">
            <Typography variant="h4" gutterBottom className="mission-title">
              Our Mission
            </Typography>
            <Typography variant="body1" className="mission-text">
              GrindStone Athletics (GSA) will assist athletes in setting and achieving personal objectives through rigorous and goal-oriented training in a safe, respectful, and positive environment. GSA will provide a place for all athletes to attain their highest level of personal growth and physical improvement regardless of athletic background.
            </Typography>
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleLearnMoreClick}
                className="mission-button"
                sx={{ marginRight: 2, color: '#fff' }}
              >
                Learn More
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleViewScheduleClick}
                className="mission-button"
                sx={{ color: '#fff' }}
              >
                View Schedule
              </Button>
            </Box>
          </Box>
        </DeviceFrameset>
      </motion.div>
      <motion.img
        id="mission-image"
        src={manlogohero}
        alt="Grindstone Athletics"
        className="man-logo-hero"
        data-aos="fade-in"
        initial={{ y: '100vh' }}
        animate={imgControls}
        transition={{ type: 'spring', stiffness: 100 }}
      />
    </div>
  );
};

export default Mission;
