import React from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';

const FancyDivider = ({  icon = <StarIcon /> }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginY: '32px',
          paddingX: '24px',
        }}
      >
        {/* Left Gradient Line */}
        <Divider
          sx={{
            flexGrow: 1,
            height: '2px',
            background: `linear-gradient(90deg, #56b435, transparent)`,
            border: 'none',
          }}
        />

        {/* Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            backgroundColor: '#56b435',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            color: '#fff',
          }}
        >
          {icon}
        </Box>

        {/* Right Gradient Line */}
        <Divider
          sx={{
            flexGrow: 1,
            height: '2px',
            background: `linear-gradient(270deg, #0A4704, transparent)`,
            border: 'none',
          }}
        />
      </Box>

      {/* Optional Text Below Divider */}
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          marginTop: '-16px',
          color: theme.palette.text.primary,
        }}
      >
      </Typography>
    </motion.div>
  );
};

export default FancyDivider;
