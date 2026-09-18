import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Router, SwitchAccessShortcut, Phone, NetworkCheck, SettingsEthernet, Computer } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeaturedCard';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

  const services = [
    {
      icon: <Router fontSize="large" />,
      title: 'Router Configuration',
      description: 'Professional installation and configuration of routers to ensure reliable and secure internet connectivity for your business. Keep your network running smoothly and securely.',
      delay: 0,
    },
    {
      icon: <SwitchAccessShortcut fontSize="large" />,
      title: 'Switch Setup',
      description: 'Efficient configuration of network switches to ensure optimal performance and connectivity of all your devices. Enhance your network\'s efficiency and reliability.',
      delay: 0.1,
    },
    {
      icon: <Phone fontSize="large" />,
      title: 'VoIP Systems',
      description: 'Seamless integration of VoIP systems to enhance your business communication with cost-effective and scalable solutions. Improve your communication infrastructure effortlessly.',
      delay: 0.2,
    },
    {
      icon: <NetworkCheck fontSize="large" />,
      title: 'Network Security',
      description: 'Comprehensive network security solutions to protect your business from cyber threats and ensure data integrity. Safeguard your network with robust security measures.',
      delay: 0.3,
    },
    {
      icon: <SettingsEthernet fontSize="large" />,
      title: 'Ethernet Cabling',
      description: 'Professional Ethernet cabling services to ensure stable and high-speed network connectivity across your office. Maintain high-speed and reliable connections throughout.',
      delay: 0.4,
    },
    {
      icon: <Computer fontSize="large" />,
      title: 'IT Support',
      description: 'Comprehensive IT support services to resolve any network issues promptly and efficiently. Get expert help to keep your network up and running.',
      delay: 0.5,
    }
  ];
  

const NetworkSetupServices = () => {
  return (
    <>
    <Helmet>
  <title>Network Setup Services | All PC Repair</title>
  <meta name="description" content="Professional network setup services by All PC Repair. We provide installation and configuration of routers, switches, VoIP systems, and comprehensive network security solutions to ensure your business runs smoothly and securely." />
  <meta name="keywords" content="Network setup services, router configuration, switch setup, VoIP systems, network security, Ethernet cabling, IT support, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/network-setup-services" />
  <meta property="og:title" content="Network Setup Services | All PC Repair" />
  <meta property="og:description" content="Professional network setup services by All PC Repair. We provide installation and configuration of routers, switches, VoIP systems, and comprehensive network security solutions to ensure your business runs smoothly and securely." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/network-setup-services" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/3.png" />
</Helmet>
      <Box sx={{ background: 'url(/bg.png) no-repeat center center', backgroundSize: 'cover', color: 'white', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography sx={{ 
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              lineHeight: 1.2,
              wordBreak: 'break-word'
            }} variant="h2" component="h1" gutterBottom>
            Network Setup Services
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Professional installation and configuration of routers, switches, and VoIP systems.
          </Typography>
          <Link to="/contact">
          <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
            Schedule a Free Consultation
          </Button>
          </Link>
        </Container>
      </Box>

      <SectionContainer>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Our Network Setup Services
        </Typography>
        <Typography paragraph align="center">
          At All PC Repair, we provide comprehensive network setup services designed to enhance your business operations. Our team of experts ensures seamless integration of routers, switches, and VoIP systems, tailored to meet your specific needs and budget.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  delay={service.delay}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          Why Choose Our Network Setup Services?
        </Typography>
        <Typography paragraph align="center">
          At All Repair PC, we provide professional network setup services to ensure your business has a reliable, secure, and efficient network infrastructure. Our experts handle everything from router and switch configuration to VoIP system integration and network security.
        </Typography>
        <Typography paragraph align="center">
          Our team is dedicated to providing tailored solutions that meet your specific needs and budget. With our network setup services, you can focus on running your business while we take care of your IT infrastructure.
        </Typography>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#FFD700',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#FFC107',
                },
              }}
              component={Link}
              to="/contact"
            >
              Request a Consultation
            </Button>
          </motion.div>
        </Box>
      </SectionContainer>
    </>
  );
};

export default NetworkSetupServices;
