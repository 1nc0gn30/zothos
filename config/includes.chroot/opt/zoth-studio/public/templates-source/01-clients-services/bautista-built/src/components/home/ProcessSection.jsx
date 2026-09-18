import React from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const processSteps = [
  {
    step: 1,
    title: "Consultation",
    description: "We start with an in-depth consultation to understand your vision and requirements."
  },
  {
    step: 2,
    title: "Design & Engineering",
    description: "Our designers create detailed drafts and 3D models ensuring both aesthetics and integrity."
  },
  {
    step: 3,
    title: "Fabrication",
    description: "Using precision equipment, we bring your project to life with meticulous craftsmanship."
  },
  {
    step: 4,
    title: "Installation",
    description: "Our professional team ensures safe and secure installation meeting quality standards."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ProcessSection = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#121212' }}>
      <Container maxWidth="lg">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
        >
          <Typography
            variant="overline"
            sx={{
              color: '#90caf9',
              fontWeight: 600,
              letterSpacing: 2,
              display: 'block',
              textAlign: 'center',
              mb: 1
            }}
          >
            HOW WE WORK
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
                backgroundColor: '#90caf9'
              }
            }}
          >
            Our Process
          </Typography>
        </motion.div>
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.1 }}
        >
          <Grid container spacing={3}>
            {processSteps.map((step, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <motion.div variants={itemVariants}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: index % 2 === 0 ? '#90caf9' : '#424242',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        fontSize: 24,
                        fontWeight: 700,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        position: 'relative',
                        '&:after': index < processSteps.length - 1 ? {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '100%',
                          width: { xs: 0, sm: 50 },
                          height: 2,
                          bgcolor: '#757575',
                          transform: 'translateY(-50%)'
                        } : {}
                      }}
                    >
                      {step.step}
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      {step.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProcessSection;
