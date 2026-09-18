import React, { useState } from 'react';
import { Container, Grid, Card, Box, Typography, Avatar, Divider, Chip, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const teamMembers = [
  {
    name: 'Ted Bautista',
    role: 'Founder & CEO',
    image: 'https://via.placeholder.com/150',
    bio: 'With over 15 years of experience in metal fabrication, Ted founded Bautista Built to bring exceptional craftsmanship to Virginia Beach.',
    expertise: ['Metal Art', 'Business Strategy', 'Custom Design'],
    linkedin: 'https://linkedin.com',
    email: 'ted@bautistabuilt.com'
  },
  {
    name: 'Jane Doe',
    role: 'Lead Fabricator',
    image: 'https://via.placeholder.com/150',
    bio: 'Jane combines technical precision with artistic vision to create stunning custom metalwork that exceeds client expectations.',
    expertise: ['Precision Cutting', 'Welding', 'CAD Design'],
    linkedin: 'https://linkedin.com',
    email: 'jane@bautistabuilt.com'
  },
];

const TeamSection = () => {
  const [activeTeamMember, setActiveTeamMember] = useState(null);
  
  return (
    <Box 
      py={12} 
      sx={{
        background: 'linear-gradient(to bottom, #121212, #1e1e1e)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23333" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")',
          opacity: 0.4,
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box mb={10} textAlign="center">
          <Typography 
            variant="h3" 
            component="h2"
            sx={{ 
              fontWeight: 800, 
              color: 'white',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, #f50057, #8c24aa)',
                bottom: '-15px',
                left: 'calc(50% - 30px)'
              }
            }}
          >
            Meet Our Team
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#aaa', 
              mt: 4, 
              mb: 2, 
              maxWidth: '700px', 
              mx: 'auto',
              opacity: 0.8
            }}
          >
            Our talented team brings together exceptional craftsmanship and innovative design to create metalwork that stands the test of time.
          </Typography>
        </Box>
        
        <Grid container spacing={5} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div 
                whileHover={{ y: -15, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }} 
                transition={{ type: "spring", stiffness: 300 }}
                onHoverStart={() => setActiveTeamMember(index)} 
                onHoverEnd={() => setActiveTeamMember(null)}
              >
                <Card 
                  sx={{ 
                    background: 'linear-gradient(145deg, rgba(25,25,25,0.95), rgba(15,15,15,0.95))',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    borderRadius: '16px',
                    textAlign: 'center', 
                    p: 4, 
                    height: '100%',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '3px',
                      width: '100%',
                      background: 'linear-gradient(90deg, #f50057, #8c24aa)'
                    }
                  }}
                >
                  <Avatar 
                    src={member.image} 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto', 
                      mb: 3,
                      border: '4px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                    }} 
                  />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                    {member.name}
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: '#f50057', 
                      mb: 2,
                      fontWeight: 500,
                      letterSpacing: 0.5
                    }}
                  >
                    {member.role}
                  </Typography>
                  
                  <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.08)' }} />
                  
                  <AnimatePresence>
                    {activeTeamMember === index && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#bbb', 
                            mb: 3, 
                            lineHeight: 1.7,
                            fontSize: '0.95rem'
                          }}>
                          {member.bio}
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          {member.expertise.map((skill, i) => (
                            <Chip 
                              key={i} 
                              label={skill} 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(255,255,255,0.05)', 
                                color: '#ddd', 
                                m: 0.5,
                                borderRadius: '4px',
                                '&:hover': {
                                  bgcolor: 'rgba(255,255,255,0.1)',
                                }
                              }} 
                            />
                          ))}
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            aria-label="linkedin" 
                            sx={{ 
                              color: '#bbb',
                              '&:hover': { color: '#0077b5', bgcolor: 'rgba(255,255,255,0.05)' }
                            }}
                          >
                            <LinkedInIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            aria-label="email" 
                            sx={{ 
                              color: '#bbb',
                              '&:hover': { color: '#f50057', bgcolor: 'rgba(255,255,255,0.05)' }
                            }}
                          >
                            <EmailIcon />
                          </IconButton>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;