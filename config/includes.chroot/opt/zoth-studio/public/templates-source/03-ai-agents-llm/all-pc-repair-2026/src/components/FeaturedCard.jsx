import React from 'react';
import { Typography, Paper, Avatar, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const FeaturePaper = styled(Paper)(({ theme, height, width }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: height || '275px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: width || "auto",
  flexDirection: 'column',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease-in-out',
  },
}));

const FeatureCard = ({ icon, title, description, delay, buttonText, height, width, buttonLink }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <FeaturePaper elevation={3} height={height} width={width}>
        <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" component="p" sx={{ mt: 1 }}>
          {description}
        </Typography>
        {buttonText && buttonLink && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FFD700',
              color: '#000',
              position: 'absolute', 
              bottom: 25,
              left: '50%',
              transform: 'translateX(-50%)', 
              '&:hover': {
                backgroundColor: '#FFC107',
              },
            }}
            component={Link}
            to={buttonLink}
          >
            {buttonText}
          </Button>
        )}
      </FeaturePaper>
    </motion.div>
  );
};

export default FeatureCard;
