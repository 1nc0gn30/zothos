import React from 'react';
import { Container, Typography, Box, Paper, Avatar, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Devices, Security, Business, TrendingUp } from '@mui/icons-material';

const OverviewSection = () => {
  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Why Choose All PC Repair?
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Comprehensive IT Solutions for Your Business
        </Typography>
        <Typography variant="body1" paragraph>
          At All PC Repair, we specialize in providing tailored IT services that seamlessly integrate into your business operations. Our goal is to simplify IT management, boost productivity, and ensure your business stays ahead of the competition.
        </Typography>
      </Box>
    <Divider sx={{marginBottom: 5}} />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.3s ease-in-out',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
            <Devices fontSize="large" />
          </Avatar>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Streamlined Efficiency
          </Typography>
          <Typography variant="body1" component="p" paragraph>
            Boost productivity by automating routine tasks and enhancing system performance. For example, one of our clients was able to reduce manual data entry by 50% through our customized automation solutions, freeing up valuable time for more strategic activities.
          </Typography>
        </Paper>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.3s ease-in-out',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
            <Security fontSize="large" />
          </Avatar>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Cutting-Edge Technology
          </Typography>
          <Typography variant="body1" component="p" paragraph>
            Stay ahead with the latest technology, ensuring your business meets evolving demands. For instance, our implementation of advanced cybersecurity measures helped a financial firm protect sensitive data and meet regulatory compliance, avoiding potential fines.
          </Typography>
        </Paper>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.3s ease-in-out',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
            <Business fontSize="large" />
          </Avatar>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Industry-Tailored Expertise
          </Typography>
          <Typography variant="body1" component="p" paragraph>
            Receive customized IT and cybersecurity services that align with your industry-specific needs. For example, we developed a bespoke IT strategy for a healthcare provider, ensuring seamless integration with existing medical systems and improving patient care.
          </Typography>
        </Paper>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.3s ease-in-out',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
            <TrendingUp fontSize="large" />
          </Avatar>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Grow with Confidence
          </Typography>
          <Typography variant="body1" component="p" paragraph>
            Scale your IT infrastructure as your business grows, with expert support at every step. For instance, a retail chain expanded its operations to multiple locations with our scalable IT solutions, ensuring consistent performance and reliability.
          </Typography>
        </Paper>
      </motion.div>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Simplifying Your IT Management
        </Typography>
        <Typography variant="body1" paragraph>
          Our team of experts ensures that all these services integrate smoothly into your routine, making IT management effortless. From regular system maintenance to implementing the latest technology, we handle everything so you can focus on what you do best—running your business.
        </Typography>
      </Box>
    </Container>
  );
};

export default OverviewSection;
