import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Button, Modal } from '@mui/material';
import video1 from '../components/assets/videos/video1.mp4'; // Adjust the path as necessary
import { motion, useCycle } from 'framer-motion';
import './styles/AboutPage.css';
import BlankAvatar from '../components/BlankAvatar'; 
import Overlay from '../components/Overlay';

const workers = [
  {
    name: 'Thomas E. Lenhart II',
    position: 'Owner, Operator, Trainer, Coach',
    description: `Tom is a native of Virginia Beach, Virginia where he had a successful football career...`,
    video: video1,
    avatar: '', // Add an empty string for now
  },
  {
    name: 'Chase Walden',
    position: 'Muay Thai Head Coach, Owner/Operator',
    description: `Chase "The Weapon" Walden is GrindStone's Muay Thai Head Coach...`,
    video: video1,
    avatar: '', // Add an empty string for now
  },
  {
    name: 'Helena C. Wallis',
    position: 'NASM CPT, Personal Trainer',
    description: `Helping others find inner joy and reach their goals through the gateway of fitness is my passion...`,
    video: video1,
    avatar: '', // Add an empty string for now
  },
  {
    name: 'Corey Hubbard',
    position: 'Trainer, Coach',
    description: `Introducing Corey Hubbard, the newest addition to the dynamic team at Grindstone Athletics...`,
    video: video1,
    avatar: '', // Add an empty string for now
  },
];

const titles = [
  "Owners",
  "Operators",
  "Trainers",
  "Coaches",
  "Fighters"
];

const AboutPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [titleIndex, cycleTitleIndex] = useCycle(...titles);

  const handleOpen = (worker) => {
    setSelectedWorker(worker);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedWorker(null);
  };

  return (
    <Container id="page-top" maxWidth={false} disableGutters className="about-container">
      <Box className="about-hero-small">
        <motion.div
          key={titleIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          onAnimationComplete={() => {
            setTimeout(() => {
              cycleTitleIndex();
            }, 1000); // Adjust delay between title transitions as necessary
          }}
        >
          <Typography variant="h2" className="hero-subtitle">
            {titleIndex}
          </Typography>
        </motion.div>
        <Typography variant="body1" className="hero-text">
          GrindStone Athletics (GSA) will assist athletes in setting and achieving personal objectives through rigorous and goal-oriented training in a safe, respectful, and positive environment. GSA will provide a place for all athletes to attain their highest level of personal growth and physical improvement regardless of athletic background.
        </Typography>
      </Box>
      <Overlay />
      <Container maxWidth="lg" className="worker-container">
        {workers.map((worker, index) => (
          <Box key={worker.name} className="worker-section">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} order={{ xs: 1, md: index % 2 === 0 ? 1 : 2 }}>
                <Box className="worker-info" onClick={() => handleOpen(worker)}>
                  <BlankAvatar src={worker.avatar} />
                  <Typography variant="h5">{worker.name}</Typography>
                  <Typography variant="subtitle1">{worker.position}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} order={{ xs: 2, md: index % 2 === 0 ? 2 : 1 }}>
                <Box className="worker-video">
                  <video controls className="video-element">
                    <source src={worker.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Container>
      <Modal open={open} onClose={handleClose}>
        <Box className="modal-box">
          {selectedWorker && (
            <>
              <BlankAvatar src={selectedWorker.avatar} />
              <Typography variant="h4" gutterBottom>{selectedWorker.name}</Typography>
              <Typography variant="subtitle1" gutterBottom>{selectedWorker.position}</Typography>
              <Typography variant="body1">{selectedWorker.description}</Typography>
              <Button onClick={handleClose} variant="contained" color="primary">Close</Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default AboutPage;
