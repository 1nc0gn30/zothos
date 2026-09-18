import React from 'react';
import { Container, Grid, Card, CardContent, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ConstructionIcon from '@mui/icons-material/Construction';
import ArchitectureIcon from '@mui/icons-material/Architecture';

const services = [
  { 
    title: 'Custom Signage', 
    icon: <BusinessCenterIcon sx={{ fontSize: 50 }} />, 
    description: 'Eye-catching business signage crafted from durable metals with precision cutting and premium finishes.',
    color: '#C5A47E'
  },
  { 
    title: 'Metal Artwork', 
    icon: <ArchitectureIcon sx={{ fontSize: 50 }} />, 
    description: 'Unique decorative pieces combining form and function, designed to transform spaces with artistic expression.',
    color: '#8E9DB3'
  },
  { 
    title: 'Fabrication', 
    icon: <EngineeringIcon sx={{ fontSize: 50 }} />, 
    description: 'Industrial-grade metal fabrication services using cutting-edge technology and expert craftsmanship.',
    color: '#A67D5D'
  },
  { 
    title: 'Installation', 
    icon: <ConstructionIcon sx={{ fontSize: 50 }} />, 
    description: 'Professional mounting ensuring safety and longevity with attention to detail and structural integrity.',
    color: '#799AA8'
  },
];

const ServicesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <Box 
      py={{ xs: 8, md: 16 }} 
      sx={{ 
        background: 'linear-gradient(to bottom, rgba(12,12,14,0.95), rgba(25,25,30,0.95))',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://www.transparenttextures.com/patterns/brushed-alum-dark.png)',
          opacity: 0.09,
          zIndex: 1
        }
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(200,160,120,0.05) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(100,150,180,0.05) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
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
            Our Services
          </Typography>
          
          <Box sx={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, transparent, #C5A47E, transparent)', mx: 'auto', mb: 2 }} />
          
          <Typography 
            variant="subtitle1" 
            align="center" 
            sx={{ 
              maxWidth: '750px', 
              mx: 'auto', 
              mb: 8, 
              color: '#b0b0b0',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.6
            }}
          >
            We combine traditional metalworking techniques with modern technology to deliver exceptional results for projects of any scale.
          </Typography>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ 
                    y: -12,
                    transition: { type: 'spring', stiffness: 300 }
                  }}
                >
                  <Card 
                    sx={{ 
                      height: '100%', 
                      borderRadius: 2, 
                      overflow: 'hidden', 
                      backgroundColor: 'rgba(30,32,35,0.7)', 
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                      position: 'relative',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        boxShadow: `0 20px 40px rgba(0,0,0,0.6), 0 0 15px rgba(${index % 2 === 0 ? '197,164,126' : '142,157,179'},0.1)`,
                      },
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '4px',
                        height: '60px',
                        background: service.color,
                        transition: 'height 0.3s ease',
                      },
                      '&:hover:before': {
                        height: '100%',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, zIndex: 1, position: 'relative' }}>
                      <Box 
                        sx={{ 
                          mb: 3,
                          color: service.color,
                          background: `rgba(${index % 2 === 0 ? '197,164,126' : '142,157,179'},0.08)`,
                          width: '70px',
                          height: '70px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 5px 15px rgba(0,0,0,0.1), 0 0 0 1px rgba(${index % 2 === 0 ? '197,164,126' : '142,157,179'},0.05)`
                        }}
                      >
                        {service.icon}
                      </Box>
                      
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          mb: 2, 
                          fontWeight: 700, 
                          color: '#fff',
                          position: 'relative',
                          paddingBottom: '12px',
                          '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '40px',
                            height: '2px',
                            background: `rgba(${index % 2 === 0 ? '197,164,126' : '142,157,179'},0.5)`,
                          }
                        }}
                      >
                        {service.title}
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#bbb',
                          fontSize: '0.95rem',
                          lineHeight: 1.7
                        }}
                      >
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
        
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Typography 
              variant="button" 
              component="div"
              sx={{ 
                display: 'inline-block',
                color: '#C5A47E',
                border: '1px solid rgba(197,164,126,0.3)',
                borderRadius: '30px',
                px: 3,
                py: 1.2,
                fontSize: '0.9rem',
                letterSpacing: 1,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(197,164,126,0.1)',
                  borderColor: 'rgba(197,164,126,0.5)',
                }
              }}
            >
              VIEW ALL SERVICES
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default ServicesSection;