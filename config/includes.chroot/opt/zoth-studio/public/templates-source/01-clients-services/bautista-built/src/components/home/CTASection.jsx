import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const CTASection = () => {
  const { scrollYProgress } = useScroll();
  const yPosAnim = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <Box sx={{ position: 'relative', py: { xs: 10, md: 14 }, overflow: 'hidden' }}>
     
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeInVariants}>
            <Typography
              variant="h2"
              align="center"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 4,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Ready to Bring Your Vision to Life?
            </Typography>
          </motion.div>
          <motion.div variants={fadeInVariants}>
            <Typography
              variant="h6"
              align="center"
              sx={{ color: 'white', opacity: 0.8, mb: 6, maxWidth: 700, mx: 'auto' }}
            >
              Contact us today for a free consultation and estimate.
            </Typography>
          </motion.div>
          <motion.div
            variants={fadeInVariants}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.1rem',
                fontWeight: 600,
                backgroundColor: '#424242',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#616161',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                },
                transition: 'all 0.3s ease',
                borderRadius: 1
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Get Free Estimate
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTASection;
