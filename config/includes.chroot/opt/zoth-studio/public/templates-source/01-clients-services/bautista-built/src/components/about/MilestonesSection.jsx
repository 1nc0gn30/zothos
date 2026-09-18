import React, { useEffect } from 'react';
import { Container, Box, Typography, Grid, useMediaQuery, useTheme } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';

const milestones = [
  { 
    year: '2015', 
    title: 'Founded in Virginia Beach', 
    description: 'Ted Bautista established the company with a focus on quality craftsmanship and a vision to blend industrial precision with artistic expression.',
    icon: '🔨'
  },
  { 
    year: '2017', 
    title: 'First Major Commercial Project', 
    description: 'Completed custom signage for the Virginia Beach Boardwalk renovation, establishing our reputation for distinctive metalwork that captures local character.',
    icon: '🏢'
  },
  { 
    year: '2019', 
    title: 'Workshop Expansion', 
    description: 'Tripled workspace and added state-of-the-art fabrication equipment, including CNC plasma cutting and powder coating facilities to elevate our capabilities.',
    icon: '🏗️'
  },
  { 
    year: '2021', 
    title: 'Award-Winning Design', 
    description: 'Received regional recognition for innovative metal art installations at the Eastern Seaboard Design Excellence Awards, highlighting our creative approach.',
    icon: '🏆'
  },
  { 
    year: '2023', 
    title: 'Sustainability Initiative', 
    description: 'Implemented eco-friendly practices and materials throughout operations, including solar power and a material reclamation program reducing waste by 75%.',
    icon: '🌱'
  },
];

const MilestonesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const controls = useAnimation();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 12
      }
    }
  };

  return (
    <Box 
      py={{ xs: 10, md: 16 }} 
      position="relative"
      sx={{
        background: 'linear-gradient(180deg, rgba(25,25,30,0.95) 0%, rgba(20,20,25,0.97) 100%)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://www.transparenttextures.com/patterns/cross-stripes.png)',
          opacity: 0.03,
          zIndex: 1
        }
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          left: '-10%',
          width: '30%',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(120,120,140,0.03) 0%, rgba(0,0,0,0) 70%)',
          transform: 'rotate(-30deg)',
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              color: 'white',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Our Journey
          </Typography>
          
          <Box sx={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, transparent, rgba(200,200,200,0.5), transparent)', mx: 'auto', mb: 2 }} />
          
          <Typography 
            variant="subtitle1" 
            align="center" 
            sx={{ 
              maxWidth: '750px', 
              mx: 'auto', 
              mb: 10, 
              color: '#b0b0b0',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.6
            }}
          >
            From humble beginnings to award-winning craftsmanship, our metal fabrication journey has been defined by dedication to quality and innovative vision.
          </Typography>
        </motion.div>

        {/* Timeline with connecting line */}
        <Box sx={{ position: 'relative' }}>
          {/* Vertical timeline line for desktop */}
          {!isMobile && (
            <Box 
              sx={{ 
                position: 'absolute', 
                left: '50%', 
                top: 0, 
                bottom: 0, 
                width: '2px', 
                bgcolor: 'rgba(100,100,120,0.2)',
                zIndex: 0
              }} 
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: '-4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  bgcolor: '#C5A47E'
                }}
              />
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: '-4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  bgcolor: '#C5A47E'
                }}
              />
            </Box>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            viewport={{ once: true, amount: 0.05 }}
          >
            {milestones.map((milestone, index) => (
              <Grid 
                container 
                key={index} 
                spacing={4} 
                sx={{ 
                  mb: { xs: 6, md: 8 },
                  flexDirection: isMobile ? 'row' : index % 2 === 0 ? 'row' : 'row-reverse' 
                }}
              >
                {/* Year indicator */}
                {!isMobile && (
                  <Grid item xs={12} md={2} sx={{ textAlign: index % 2 === 0 ? 'right' : 'left' }}>
                    <motion.div variants={itemVariants}>
                      <Box 
                        sx={{ 
                          display: 'inline-block',
                          position: 'relative',
                          bgcolor: 'rgba(197,164,126,0.1)', 
                          border: '1px solid rgba(197,164,126,0.3)',
                          color: '#C5A47E',
                          px: 2.5, 
                          py: 1.5, 
                          borderRadius: '30px',
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        }}
                      >
                        {milestone.year}
                      </Box>
                    </motion.div>
                  </Grid>
                )}

                {/* Timeline dot and connecting line for desktop */}
                {!isMobile && (
                  <Grid item xs={12} md={1} sx={{ position: 'relative' }}>
                    <motion.div 
                      variants={itemVariants}
                      style={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)' 
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(30,32,35,0.9)',
                          border: '2px solid rgba(197,164,126,0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          boxShadow: '0 0 0 6px rgba(30,32,35,0.5)',
                          zIndex: 2
                        }}
                      >
                        {milestone.icon}
                      </Box>
                    </motion.div>
                    
                    {/* Horizontal connector line */}
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: 0, 
                        right: 0, 
                        height: '2px', 
                        bgcolor: 'rgba(100,100,120,0.2)',
                        zIndex: 0 
                      }} 
                    />
                  </Grid>
                )}

                {/* Content card */}
                <Grid item xs={12} md={isMobile ? 12 : 9}>
                  <motion.div variants={itemVariants}>
                    <Box
                      sx={{
                        bgcolor: 'rgba(30,32,35,0.7)',
                        p: { xs: 3, md: 4 },
                        borderRadius: 2,
                        boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(45deg, rgba(197,164,126,0.03) 0%, rgba(0,0,0,0) 70%)',
                          zIndex: 0
                        }
                      }}
                    >
                      {/* Mobile year badge */}
                      {isMobile && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: -10, 
                            left: 20, 
                            bgcolor: 'rgba(197,164,126,0.9)', 
                            px: 2, 
                            py: 1, 
                            borderRadius: 2,
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700 }}>
                            {milestone.year}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Mobile icon */}
                      {isMobile && (
                        <Box sx={{ position: 'absolute', top: 10, right: 15, fontSize: '1.5rem' }}>
                          {milestone.icon}
                        </Box>
                      )}
                      
                      <Box sx={{ position: 'relative', zIndex: 1, pt: isMobile ? 3 : 1 }}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            color: '#fff', 
                            mb: 2,
                            paddingBottom: 1.5,
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              width: '40px',
                              height: '3px',
                              bgcolor: 'rgba(197,164,126,0.6)'
                            }
                          }}
                        >
                          {milestone.title}
                        </Typography>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#bbb',
                            lineHeight: 1.7
                          }}
                        >
                          {milestone.description}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            ))}
          </motion.div>
        </Box>
        
        {/* Future milestone teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Box 
            sx={{ 
              textAlign: 'center', 
              mt: 8, 
              mb: 3,
              p: 4,
              borderRadius: 3,
              bgcolor: 'rgba(30,32,35,0.5)',
              border: '1px dashed rgba(197,164,126,0.3)',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#C5A47E',
                fontWeight: 600,
                mb: 1
              }}
            >
              The next chapter awaits...
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#bbb',
                maxWidth: 700,
                mx: 'auto'
              }}
            >
              With every project, we continue to push the boundaries of metalwork and design. 
              Stay tuned as our journey unfolds with new innovations and creative solutions in 2025.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default MilestonesSection;