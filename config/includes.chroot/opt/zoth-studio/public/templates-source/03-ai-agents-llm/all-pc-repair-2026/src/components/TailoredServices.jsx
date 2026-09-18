import React, { useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Divider } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { Devices, Security, Business, TrendingUp } from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';

const services = [
  {
    icon: <Devices fontSize="large" />,
    title: 'Streamlined Efficiency',
    description: 'Our comprehensive IT solutions streamline your operations, significantly boosting productivity.',
    examples: [
      'Automate routine tasks to save time and reduce errors.',
      'Implement efficient workflows to improve collaboration.',
      'Enhance system performance with regular maintenance.'
    ]
  },
  {
    icon: <Security fontSize="large" />,
    title: 'Cutting-Edge Technology',
    description: 'Leverage the latest technology to stay ahead of competitors and meet evolving market demands.',
    examples: [
      'Adopt the newest cybersecurity measures to protect your data.',
      'Use advanced analytics to gain insights into your business performance.',
      'Upgrade to the latest hardware and software for optimal efficiency.'
    ]
  },
  {
    icon: <Business fontSize="large" />,
    title: 'Industry-Tailored Expertise',
    description: 'Customized IT and cybersecurity services for various sectors.',
    examples: [
      'Healthcare: Ensure HIPAA compliance and secure patient data.',
      'Finance: Protect sensitive financial information with top-tier security solutions.',
      'Manufacturing: Implement IoT solutions to streamline production.'
    ]
  },
  {
    icon: <TrendingUp fontSize="large" />,
    title: 'Grow with Confidence',
    description: 'Flexible IT solutions designed to grow with your business.',
    examples: [
      'Scale your IT infrastructure seamlessly as your business expands its operations.',
      'Access expert support and guidance whenever you need it to resolve issues quickly.',
      'Maximize your investment with cost-effective and scalable solutions tailored to your needs.'
    ]
  }
];

const TailoredServices = () => {
  return (
    <Container sx={{ background: 'white', py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Simplifying IT for a Complex World
      </Typography>
      <Divider sx={{marginBottom: 5}} />
      <Grid container spacing={4} justifyContent="center" gap={5}>
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} index={index} />
        ))}
      </Grid>
    </Container>
  );
};

const ServiceCard = ({ service, index }) => {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [controls, inView]);

  return (
    <Grid item xs={12} sm={6} md={4} ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        style={{ height: '100%' }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.3s ease-in-out',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Box sx={{ mb: 2 }}>{service.icon}</Box>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {service.title}
          </Typography>
          <Typography variant="body1" component="p" sx={{ mb: 2 }}>
            {service.description}
          </Typography>
          <Typography variant="body2" component="ul" sx={{ textAlign: 'left', pl: 2 }}>
            {service.examples.map((example, i) => (
              <li key={i}>{example}</li>
            ))}
          </Typography>
        </Paper>
      </motion.div>
    </Grid>
  );
};

export default TailoredServices;
