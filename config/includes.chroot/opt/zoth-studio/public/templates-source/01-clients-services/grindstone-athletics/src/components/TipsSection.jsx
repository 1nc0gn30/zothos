import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, SwipeableDrawer, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Typewriter from 'typewriter-effect';
import { animated } from '@react-spring/web';
import * as Icons from '@mui/icons-material';
import './styles/TipsSection.css';

const TipsSection = () => {
  const [open, setOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    fetch('/data/tips.json')
      .then((response) => response.json())
      .then((data) => setTips(data))
      .catch((error) => console.error('Error fetching tips:', error));
  }, []);

  const handleClickOpen = (tip) => {
    setSelectedTip(tip);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <Box className="tips-section">
      <Typography variant="h4" className="tips-title" color="primary">
        Tips and Tutorials
      </Typography>
      <Typography variant="body1" className="tips-description">
        Learn from professionals with these helpful tips and tutorials to improve your training.
      </Typography>
      <Grid container spacing={4}>
        {tips.map((tip, index) => {
          const IconComponent = Icons[tip.icon] || Icons.HelpOutline; // Fallback icon
          return (
            <Grid item xs={12} md={6} key={index}>
              <animated.div style={{ cursor: "pointer", height: '100%' }}>
                <Paper elevation={3} className="tip-item" onClick={() => handleClickOpen(tip)} style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    {IconComponent && <IconComponent style={{ marginRight: 8, color: '#d32f2f' }} />}
                    <Typography variant="h6" className="tip-title">
                      {tip.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" className="tip-description">
                    {tip.description}
                  </Typography>
                  <Box mt={2}>
                    {tip.categories && tip.categories.map((category, index) => (
                      <Chip key={index} label={category} color="primary" style={{ margin: '2px' }} />
                    ))}
                  </Box>
                </Paper>
              </animated.div>
            </Grid>
          );
        })}
      </Grid>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        onOpen={() => {}}
        PaperProps={{
          style: {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <Box
          sx={{
            width: 'auto',
            padding: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" color="primary">{selectedTip?.title}</Typography>
          <Typography variant="body1">
            <Typewriter
              options={{
                strings: [selectedTip?.details],
                autoStart: true,
                delay: 25,
                cursor: '|',
                loop: false,
                pauseFor: 20000,
              }}
            />
          </Typography>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default TipsSection;
