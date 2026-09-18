import React from 'react';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const portfolioData = [
  {
    title: "Oceanfront Restaurant Sign",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Commercial",
    description: "Custom illuminated signage for a high-end seafood restaurant."
  },
  {
    title: "Residential Gate Design",
    image:
      "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Residential",
    description: "Bespoke iron entrance gate with intricate details."
  },
  {
    title: "Corporate Office Sculpture",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Art Installation",
    description: "Modern metal sculpture for a corporate lobby."
  },
  {
    title: "Brewery Equipment",
    image:
      "https://images.unsplash.com/photo-1559526642-c3f001ea68ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Industrial",
    description: "Custom stainless steel brewing tanks and fixtures."
  }
];

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const PortfolioSection = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#111111' }}>
      <Container maxWidth="lg">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#757575',
              fontWeight: 600,
              letterSpacing: 2,
              display: 'block',
              textAlign: 'center',
              mb: 1
            }}
          >
            OUR WORK
          </Typography>
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 8,
              color: 'white',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                backgroundColor: '#757575'
              }
            }}
          >
            Featured Projects
          </Typography>
        </motion.div>
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Grid container spacing={3}>
            {portfolioData.map((project, index) => (
              <Grid item key={index} xs={12} sm={6} md={6} lg={3}>
                <motion.div variants={fadeInVariants}>
                  <Box
                    sx={{
                      position: 'relative',
                      height: 350,
                      overflow: 'hidden',
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover .overlay': { opacity: 1 },
                      '&:hover img': { transform: 'scale(1.1)' }
                    }}
                  >
                    <Box
                      component="img"
                      src={project.image}
                      alt={project.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease'
                      }}
                    />
                    <Box
                      className="overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 3,
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <Typography variant="overline" sx={{ color: '#757575', mb: 1, fontWeight: 600 }}>
                        {project.category}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center', fontWeight: 700 }}>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', opacity: 0.8 }}>
                        {project.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          mt: 3,
                          color: 'white',
                          borderColor: 'white',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'white' }
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.5,
                px: 4,
                bgcolor: '#424242',
                '&:hover': { bgcolor: '#616161', boxShadow: '0 5px 15px rgba(0,0,0,0.4)' },
                borderRadius: 1
              }}
            >
              View Full Portfolio
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default PortfolioSection;
