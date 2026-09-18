import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const newsItems = [
  "Security advisory: Update your passwords.",
  "Tips for enhancing your network security.",
  "Explore our new cybersecurity solutions.",
  "Introducing our new data center services.",
  "Check out our technology procurement services.",
  "Learn how we helped a client achieve compliance.",
];

const slideVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: '-100%', opacity: 0 },
};

const AlertNewsBanner = () => {
  const [currentItem, setCurrentItem] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItem((prevItem) => (prevItem + 1) % newsItems.length);
    }, 5000); // Change news item every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        color: 'gold',
        py: 2,
        px: 4,
        fontFamily: 'Roboto, sans-serif',
        overflow: 'hidden',
        height: '50px',
        position: 'relative',
        maxWidth: '100vw',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <motion.div
        key={currentItem}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideVariants}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
          {newsItems[currentItem]}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default AlertNewsBanner;
