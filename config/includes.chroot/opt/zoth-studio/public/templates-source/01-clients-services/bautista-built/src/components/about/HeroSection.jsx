import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VideoModal from './VideoModal';

const HeroSection = ({ scrollPosition }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Delay the animation for a better entrance effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoModal = () => {
    setIsVideoOpen(!isVideoOpen);
  };

  return (
    <>
      <Box 
        height="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        position="relative" 
        overflow="hidden"
        sx={{
          "&::before": {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1
          }
        }}
      >
        {/* Background with enhanced parallax effect */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.2)),
              url(https://images.unsplash.com/photo-1592194996308-7b43878e84a2)
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(110%) brightness(90%)',
            transform: `scale(1.1) translateY(${scrollPosition * 0.3}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        
        {/* Decorative overlay elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)',
            zIndex: 1,
          }}
        />
        
        {/* Metal texture subtle overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            backgroundImage: 'url(https://www.transparenttextures.com/patterns/brushed-alum.png)',
            zIndex: 1,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', textAlign: 'center', zIndex: 2 }}>
          <AnimatePresence>
            {isVisible && (
              <motion.div 
                initial={{ opacity: 0, y: 80 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ 
                  duration: 1.2,
                  staggerChildren: 0.2
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Typography 
                    component="h1" 
                    sx={{ 
                      fontWeight: 900, 
                      fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem' }, 
                      letterSpacing: { xs: '0.1em', md: '0.15em' },
                      textTransform: 'uppercase',
                      textShadow: '0 5px 25px rgba(0,0,0,0.7)',
                      mb: 1,
                      background: 'linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))'
                    }}
                  >
                    BAUTISTA BUILT
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  <Box 
                    sx={{ 
                      width: '80px', 
                      height: '4px', 
                      background: 'linear-gradient(90deg, transparent, #fff, transparent)',
                      margin: '0 auto 20px'
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 300, 
                      maxWidth: 800, 
                      mx: 'auto', 
                      mb: 8,
                      textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                      fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                      letterSpacing: '0.05em'
                    }}
                  >
                    Exceptional metal fabrication where precision meets artistry
                  </Typography>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <Box
                    onClick={handleVideoModal}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      p: { xs: 1.5, md: 2 },
                      px: { xs: 3, md: 4 },
                      borderRadius: '50px',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: { xs: 36, md: 48 }, 
                        height: { xs: 36, md: 48 }, 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      <PlayArrowIcon sx={{ color: '#111', fontSize: { xs: 20, md: 24 } }} />
                    </Box>
                    <Typography 
                      variant="button" 
                      sx={{ 
                        fontWeight: 600, 
                        letterSpacing: '0.1em',
                        fontSize: { xs: '0.8rem', md: '0.95rem' },
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      WATCH OUR STORY
                    </Typography>
                  </Box>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2
          }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Box 
              sx={{ 
                width: '30px', 
                height: '50px', 
                border: '2px solid rgba(255,255,255,0.3)', 
                borderRadius: '20px',
                display: 'flex',
                justifyContent: 'center',
                padding: '8px 0'
              }}
            >
              <Box 
                sx={{ 
                  width: '6px', 
                  height: '10px', 
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderRadius: '4px'
                }} 
              />
            </Box>
          </motion.div>
        </motion.div>
      </Box>

      {/* Video Modal Component */}
      <VideoModal isOpen={isVideoOpen} onClose={handleVideoModal} />
    </>
  );
};

export default HeroSection;