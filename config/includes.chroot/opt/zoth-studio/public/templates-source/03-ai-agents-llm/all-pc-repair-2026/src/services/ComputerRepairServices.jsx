import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import {
  Computer,
  Apple,
  Wifi,
  Print,
  VideogameAsset,
  Home,
  Backup,
  DataUsage
} from '@mui/icons-material';
import FeatureCard from '../components/FeaturedCard';
import { motion } from 'framer-motion';

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const services = [
  {
    icon: <Computer fontSize="large" />,
    title: 'In-Home Computer Service and Repair',
    description: 'Convenient and professional repair services at your home for both personal and small business systems. Experience hassle-free repair services at your doorstep.',
    delay: 0,
  },
  {
    icon: <Apple fontSize="large" />,
    title: 'Windows, Apple, and Linux Systems',
    description: 'Expert repair and support for all major operating systems, including Windows, macOS, and Linux. Get comprehensive support for your diverse tech needs.',
    delay: 0.1,
  },
  {
    icon: <Wifi fontSize="large" />,
    title: 'Home Networking',
    description: 'Setup and troubleshooting of home networks, including Wi-Fi and wired connections. Ensure reliable and fast connectivity throughout your home.',
    delay: 0.2,
  },
  {
    icon: <Print fontSize="large" />,
    title: 'Printers and Peripherals',
    description: 'Installation and troubleshooting for printers, scanners, and other peripheral devices. Keep your peripherals running smoothly and efficiently.',
    delay: 0.3,
  },
  {
    icon: <VideogameAsset fontSize="large" />,
    title: 'Gaming Systems',
    description: 'Setup and optimization of gaming systems for the best performance and experience. Enjoy a seamless and enhanced gaming experience.',
    delay: 0.4,
  },
  {
    icon: <Home fontSize="large" />,
    title: 'Home Theater Setup',
    description: 'Professional installation and configuration of home theater systems for an immersive entertainment experience. Transform your home into a cinematic haven.',
    delay: 0.5,
  },
  {
    icon: <Backup fontSize="large" />,
    title: 'Backup Solutions',
    description: 'Cost-effective backup solutions to protect your important data and memories from loss. Secure your data with reliable backup strategies.',
    delay: 0.6,
  },
  {
    icon: <DataUsage fontSize="large" />,
    title: 'Data Transfer and Recovery',
    description: 'Secure data transfer and recovery services to ensure your important files are safe and accessible. Retrieve and protect your valuable data effortlessly.',
    delay: 0.7,
  }
  
];

const ComputerRepairServices = () => {
  return (
    <>
    <Helmet>
  <title>Computer Repair Services | All PC Repair</title>
  <meta name="description" content="Discover comprehensive in-home computer repair services from All PC Repair. We offer expert repair for Windows, Apple, and Linux systems, home networking, gaming systems, and more." />
  <meta name="keywords" content="Computer repair, in-home computer repair, Windows repair, Apple repair, Linux repair, home networking, gaming systems, data recovery, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/computer-repair-services" />
  <meta property="og:title" content="Computer Repair Services | All PC Repair" />
  <meta property="og:description" content="Discover comprehensive in-home computer repair services from All PC Repair. We offer expert repair for Windows, Apple, and Linux systems, home networking, gaming systems, and more." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/computer-repair-services" />
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
            Computer Repair Services
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            In-Home Service and Repair for Personal and Small Business Systems
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
          Why Choose Our Computer Repair Services?
        </Typography>
        <Typography paragraph align="center">
          We understand that your time and technological needs are important and we're here to help. Why take your system into some shop and leave it, hoping that the technician later understands the problem, only to bring your system home days later and find it still doesn't work? Give us a call today and we'll schedule a technician to come to your home at your convenience, at rates comparable to the big impersonal chains, and provide you the one-on-one service that you deserve until you're satisfied that you have the solution you need.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          Our Specialties
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
          Protect Your Data and Memories
        </Typography>
        <Typography paragraph align="center">
          Don't risk losing your precious memories. Give us a call today before it's too late. Even if you're thinking of replacing that old obsolete computer, ask us how we can help preserve your pictures, music, email, contacts, and other irreplaceable content.
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

export default ComputerRepairServices;
