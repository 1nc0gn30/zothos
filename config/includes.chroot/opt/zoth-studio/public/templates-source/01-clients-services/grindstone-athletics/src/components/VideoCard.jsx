import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const StyledPaper = styled(Paper)({
  overflow: 'hidden',
  borderRadius: '15px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  marginTop: '60px',
});

const VideoContainer = styled(Box)({
  position: 'relative',
  paddingTop: '56.25%', // 16:9 aspect ratio
  '& video': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

const Caption = styled(Typography)({
  padding: '16px',
  backgroundColor: '#f5f5f5',
});

const ChipContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  padding: '16px',
  '& > *': {
    margin: '4px',
  },
});

const videoVariants = {
  hover: { scale: 1.05 },
};

const VideoCard = ({ videoSrc, caption, tags }) => {
  return (
    <StyledPaper component={motion.div} whileHover="hover" variants={videoVariants}>
      <VideoContainer>
        <video controls>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </VideoContainer>
      <Caption variant="h6">{caption}</Caption>
      <ChipContainer>
        {tags.map((tag, index) => (
          <Chip key={index} label={tag} />
        ))}
      </ChipContainer>
    </StyledPaper>
  );
};

export default VideoCard;
