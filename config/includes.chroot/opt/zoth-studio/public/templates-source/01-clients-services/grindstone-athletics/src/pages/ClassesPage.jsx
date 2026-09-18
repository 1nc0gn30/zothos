// src/pages/ClassesPage.jsx
import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, CardMedia, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import './styles/ClassesPage.css';
import placeholderVideo from './assets/commercial-thumbnail.png'; // Placeholder image
import WeeklySchedule from '../components/WeeklySchedule';
import useScrollToHash from '../hooks/useScrollToHash';
import Overlay from '../components/Overlay';

const classes = [
  {
    title: 'Strength Training',
    description: `Strength Class guides athletes through a system of barbell exercises. This class is suited for competitive and casual lifters alike. The basic lifts and elements of our strength methodology are the squat, dead-lift, press, bench press, and power clean. Athletes will be coached through these lifts properly while learning the basics of barbell programing and bio-mechanics movements. This class is open for members interested in making strength gains under the barbell in a positive environment.`,
    icon: <FitnessCenterIcon />,
  },
  {
    title: 'Conditioning Through Kickboxing',
    description: `Conditioning through Kickboxing, also known as Bag Class, teaches basic, but effective techniques, drilled on the heavy bag to provide athletes with a unique cardiovascular workout while practicing basic striking movements. This workout is appropriate for all member levels and disciplines.`,
    icon: <DirectionsRunIcon />,
  },
  {
    title: 'MUAY THAI BASICS',
    description: `In this class, members will learn the fundamentals of ring sports/ring fighting. This technique-oriented class is tailored to fitness fanatics and fighters alike. Fundamentals include Muay Thai and kickboxing striking and the Muay Thai clinch. This class is open to all members.`,
    icon: <SportsMartialArtsIcon />,
  },
  {
    title: 'Personal Training',
    description: `Our experienced staff works one-on-one with you. We will establish personal goals and provide necessary motivation, feedback, and accountability to reach your desired level of fitness.`,
    icon: <FitnessCenterIcon />,
  },
  {
    title: 'Kombat Submission Wrestling',
    description: 'COMING SOON',
    icon: <SportsMartialArtsIcon />,
  },
  {
    title: 'Muay Thai Advanced',
    description: `This class is designed for athletes who want to take training to their Muay Thai training to the next level. A competitive based class designed to teach athletes effective Muay Thai techniques and skills in the ring. Six-months experience is required and/or instructor invite.`,
    icon: <SportsMartialArtsIcon />,
  },
  {
    title: 'Muay Thai | Junior Athletes',
    description: `Upon sign up you'll receive WRAPS, GLOVES, SHINS and a GSA SHIRT.\nCOST: $160 per month + first month sign up fee ($39.99)`,
    icon: <SportsMartialArtsIcon />,
  },
];

const ClassesPage = () => {
  useScrollToHash();
  const scrollToVideo = () => {
    document.getElementById('classes-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Container id="page-top" maxWidth={false} disableGutters className="classes-container">
      <Box className="classes-hero-small">
        <Typography variant="h2" className="classes-hero-title">
          Our Classes
        </Typography>
      </Box>
      <Overlay />
      <Box id="video-section" className="video-section">
        <Typography variant="h4" className="video-title">
          Our Commercial
        </Typography>
        <CardMedia
          component="img"
          alt="Commercial Video Placeholder"
          image={placeholderVideo}
          title="Commercial Video Placeholder"
          className="video-placeholder"
        />
        <Box className="scroll-section">
          <Typography variant="body1" className="scroll-text">
            Here is a list of our classes below
          </Typography>
          <Button variant="contained" color="primary" onClick={scrollToVideo} className="scroll-button">
            <ArrowDownwardIcon />
          </Button>
        </Box>
         <Container id="classes-section" maxWidth="md" className="classes-content">
          {classes.map((cls, index) => (
            <Accordion key={index} className="accordion-custom">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                {cls.icon}
                <Typography variant="h6" className="accordion-title">{cls.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" className="class-description">
                  {cls.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
     
      
       
     
    
      </Box>
      <div id="schedule">
      <WeeklySchedule />
      </div>
    </Container>
  );
};

export default ClassesPage;
