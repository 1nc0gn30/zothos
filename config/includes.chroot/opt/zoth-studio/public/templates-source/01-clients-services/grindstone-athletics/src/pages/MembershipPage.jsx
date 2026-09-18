import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import Tilt from 'react-parallax-tilt';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PunchCardComponent from '../components/PunchCardComponent'; // Import the new punch card component
import './styles/MembershipPage.css';

const membershipDetails = [
  {
    title: 'Drop-In Rates',
    monthly: '',
    sixMonth: '',
    twelveMonth: '',
    perks: 'Drop in for any class= $10, For Military (active and retired)/First Responder/Student, Drop in for any class= $15',
    icon: <AttachMoneyIcon />,
  },
  {
    title: 'Muay Thai/Kickboxing',
    monthly: '$145.00',
    sixMonth: '$135.00',
    twelveMonth: '$125.00',
    perks: 'All Muay Thai/Kickboxing Classes',
    icon: <SportsMartialArtsIcon />,
  },
  {
    title: 'Strength Training & Conditioning',
    monthly: '$120.00',
    sixMonth: '$110.00',
    twelveMonth: '$100.00',
    perks: 'Full access to training equipment',
    icon: <FitnessCenterIcon />,
  },
  {
    title: 'Grappling',
    monthly: '$130.00',
    sixMonth: '$115.00',
    twelveMonth: '$100.00',
    perks: 'All Grappling classes',
    icon: <SportsMartialArtsIcon />,
  },
  {
    title: 'Pick 2',
    monthly: '$175.00',
    sixMonth: '$165.00',
    twelveMonth: '$155.00',
    perks: 'Muay Thai and Strength Training, Muay Thai/Kickboxing and Grappling, Grappling and Strength Training',
    icon: <FitnessCenterIcon />,
  },
  {
    title: 'GrindStone Unlimited',
    monthly: '$199.00',
    sixMonth: '$190.00',
    twelveMonth: '$179.00',
    perks: 'Full Access to All Programs',
    icon: <SportsMartialArtsIcon />,
  },
  
];

const MembershipPage = () => {
  return (
    <Container id="page-top" maxWidth={false} disableGutters className="membership-page-container">
      <Box className="membership-hero-section">
        <Typography variant="h2" className="membership-hero-title">
          Membership Pricing Info
        </Typography>
        <Typography variant="subtitle1" className="membership-hero-subtitle">
          First Class Free!!! 10% off all contracts for Military, First Responders, Students
        </Typography>
      </Box>
      <Container maxWidth="lg" className="membership-details-section">
        <Grid container spacing={4}>
          {membershipDetails.map((membership, index) => (
            <Grid item xs={12} md={6} key={index} className="membership-card-container">
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.5} glareColor="lightblue" glarePosition="all">
                <Paper elevation={3} className="membership-card">
                  <Box p={3}>
                    <Box display="flex" alignItems="center" mb={2}>
                      {membership.icon}
                      <Typography variant="h5" className="membership-card-title" ml={1}>
                        {membership.title}
                      </Typography>
                    </Box>
                    {membership.monthly && (
                      <Typography variant="h6" className="membership-card-price">
                        Monthly: {membership.monthly}
                      </Typography>
                    )}
                    {membership.sixMonth && (
                      <Typography variant="h6" className="membership-card-price">
                        6 Month: {membership.sixMonth}
                      </Typography>
                    )}
                    {membership.twelveMonth && (
                      <Typography variant="h6" className="membership-card-price">
                        12 Month: {membership.twelveMonth}
                      </Typography>
                    )}
                    <Typography variant="body1" className="membership-card-perks">
                      {membership.perks}
                    </Typography>
                  </Box>
                </Paper>
              </Tilt>
            </Grid>
          ))}
          {/* Add Punch Card component */}
          <PunchCardComponent />
        </Grid>
      </Container>
    </Container>
  );
};

export default MembershipPage;
