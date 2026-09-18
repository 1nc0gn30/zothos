import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ConstructionIcon from '@mui/icons-material/Construction';

const serviceData = [
  {
    title: "Custom Signs",
    image:
      "/custom-signs-services.webp",
    description: "Elevate your brand with our custom metal signs crafted with precision.",
    icon: <DesignServicesIcon sx={{ fontSize: 40 }} />,
    features: ["LED Integration", "Rust-Resistant Finishes", "Custom Sizing"]
  },
  {
    title: "Metal Fabrication",
    image:
      "/metal-fabrication-services.webp",
    description: "Precision metal fabrication with state-of-the-art equipment.",
    icon: <EngineeringIcon sx={{ fontSize: 40 }} />,
    features: ["CNC Cutting", "Custom Welding", "Metal Finishing"]
  },
  {
    title: "Installation",
    image:
      "/installation-services.webp",
    description: "Professional installation services by our experienced team.",
    icon: <ConstructionIcon sx={{ fontSize: 40 }} />,
    features: ["Safety Certified", "Licensed Professionals", "Warranty Included"]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } }
};

const ServicesSection = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#121212' }}>
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={itemVariants}
        >
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
            WHAT WE OFFER
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
            Our Specialized Services
          </Typography>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Grid container spacing={4}>
            {serviceData.map((service, index) => (
              <Grid item key={index} xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.15}
                    scale={1.03}
                    tiltMaxAngleX={8}
                    tiltMaxAngleY={8}
                    transitionSpeed={1500}
                    perspective={800}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        overflow: 'hidden',
                        backgroundColor: '#1e1e1e',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-10px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          image={service.image}
                          alt={service.title}
                          sx={{ height: 220, filter: 'brightness(0.8)' }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 20,
                            left: 20,
                            backgroundColor: '#757575',
                            borderRadius: '50%',
                            width: 60,
                            height: 60,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                          }}
                        >
                          {service.icon}
                        </Box>
                      </Box>
                      <CardContent sx={{ p: 3, flexGrow: 1 }}>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{ mb: 2, fontWeight: 700, color: 'white' }}
                        >
                          {service.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mb: 3, color: '#b0b0b0' }}
                        >
                          {service.description}
                        </Typography>
                        <Divider sx={{ my: 2, borderColor: '#424242' }} />
                        <Box sx={{ mt: 2 }}>
                          {service.features.map((feature, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: '#757575',
                                  mr: 1.5
                                }}
                              />
                              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                {feature}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                      <CardActions sx={{ px: 3, pb: 3 }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: '#212121',
                              '&:hover': { bgcolor: '#000000', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
                              borderRadius: 1,
                              py: 1,
                              px: 3
                            }}
                            endIcon={<ArrowForwardIcon />}
                          >
                            Learn More
                          </Button>
                        </motion.div>
                      </CardActions>
                    </Card>
                  </Tilt>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ServicesSection;
