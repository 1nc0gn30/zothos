import React from 'react';
import { Box, Typography, Grid, Paper, Avatar } from '@mui/material';
import Tilt from 'react-parallax-tilt';
import PunchCardLogo from './assets/logo.png';
import './styles/PunchCardComponent.css';

const PunchCardComponent = () => {
  return (
    <Grid item xs={12} md={6} className="punch-card-container">
      <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.5} glareColor="lightblue" glarePosition="all">
        <Paper elevation={3} className="punch-card">
          <Box p={3} display="flex" flexDirection="column" alignItems="center">
            <img src={PunchCardLogo} alt="Punch Card Logo" className="punch-card-logo" />
            <Typography variant="h5" className="punch-card-title">
              Punch Card
            </Typography>
            <Typography variant="body1" className="punch-card-details">
              5 sessions = $50 <br />
              10 sessions = $100
            </Typography>
            <Box mt={2} display="flex" justifyContent="space-between" width="100%">
              {Array(10).fill().map((_, i) => (
                <Box key={i} className="punch-card-slot">
                  {i < 5 && <Avatar className="punch-card-avatar" />}
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      </Tilt>
    </Grid>
  );
};

export default PunchCardComponent;
