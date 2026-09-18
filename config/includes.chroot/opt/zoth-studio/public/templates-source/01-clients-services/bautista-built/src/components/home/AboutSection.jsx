import React from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }
  }
};

const AboutSection = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 12 }, backgroundColor: '#212121' }}>
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <Typography
            variant="overline"
            sx={{
              color: '#757575',
              fontWeight: 600,
              letterSpacing: 2,
              display: 'block',
              textAlign: 'center',
              mb: { xs: 1, md: 1.5 }
            }}
          >
            WHO WE ARE
          </Typography>
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: { xs: 4, md: 6 },
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              color: 'white',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: 60, md: 80 },
                height: 4,
                backgroundColor: '#757575'
              }
            }}
          >
            Craftsmanship Meets Innovation
          </Typography>
        </motion.div>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUpVariants}
            >
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  mb: { xs: 2, md: 3 },
                  color: 'white'
                }}
              >
                Founded in 2009, Bautista Built has grown from a small welding shop to Virginia Beach's premier metal fabrication studio.
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  mb: { xs: 2, md: 3 },
                  color: 'white'
                }}
              >
                Our team of skilled artisans, engineers, and designers work collaboratively on projects of any scale.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(117, 117, 117, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: '#757575',
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}
                    >
                      15
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Years of Experience
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(117, 117, 117, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: '#757575',
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}
                    >
                      500+
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Projects Completed
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(117, 117, 117, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: '#757575',
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}
                    >
                      98%
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Client Satisfaction
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUpVariants}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src="/metal-fabrication-shop.webp"
                  alt="Metal fabrication workshop"
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    color: 'white'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: -10, md: -20 },
                    right: { xs: -10, md: -20 },
                    width: { xs: 100, md: 160 },
                    height: { xs: 100, md: 160 },
                    borderRadius: '50%',
                    backgroundColor: '#757575',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(117, 117, 117, 0.4)',
                    zIndex: 2,
                    p: { xs: 1, md: 2 }
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', md: '1rem' } }}
                  >
                    FREE
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', md: '0.9rem' } }}
                  >
                    CONSULTATION
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
