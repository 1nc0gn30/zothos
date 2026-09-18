import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <Box sx={{ py: { xs: 12, md: 16 }, position: 'relative' }}>
      {/* Background with parallax effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1533106418989-88406c7cc8ca)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.2) grayscale(40%)',
          zIndex: 1,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              mb: 3,
              color: '#fff',
              textShadow: '0 5px 15px rgba(0,0,0,0.5)',
            }}
          >
            Ready to Bring Your Vision to Life?
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.9, 
              maxWidth: '700px', 
              mx: 'auto', 
              mb: 6,
              lineHeight: 1.8,
              textShadow: '0 2px 5px rgba(0,0,0,0.5)',
              color: '#bbb',
            }}
          >
            Whether you need a custom sign for your business, unique metal artwork, or precision industrial fabrication, our team is ready to transform your ideas into exceptional metal creations.
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#111',
                  padding: '15px 40px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  letterSpacing: 1,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  zIndex: 1,
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, #333, #555)',
                    transition: 'transform 0.3s ease',
                    transform: 'translateX(-100%)',
                    zIndex: -1,
                  },
                  '&:hover': {
                    color: '#fff',
                    '&:before': {
                      transform: 'translateX(0)',
                    }
                  }
                }}
              >
                GET A QUOTE
              </Box>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={{
                  backgroundColor: 'transparent',
                  color: '#fff',
                  padding: '13px 35px',
                  borderRadius: '50px',
                  border: '2px solid rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  letterSpacing: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: '#fff',
                  }
                }}
              >
                VIEW PORTFOLIO
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTASection;
