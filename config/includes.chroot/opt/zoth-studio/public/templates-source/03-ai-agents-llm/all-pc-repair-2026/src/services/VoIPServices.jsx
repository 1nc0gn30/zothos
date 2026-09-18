import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Phone, ExpandMore, MoneyOff, SettingsVoice, People, VerifiedUser } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeaturedCard';

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const voipServices = [
  {
    icon: <Phone fontSize="large" />,
    title: 'High-Quality Calls',
    description: 'Enjoy clear voice calls, ensuring effective communication with your team and clients.',
    route: '/services/voip-services/high-quality-calls',
  },
  {
    icon: <ExpandMore fontSize="large" />,
    title: 'Scalability',
    description: 'Easily add or remove users as your business grows or contracts.',
    route: '/services/voip-services/scalability',
  },
  {
    icon: <MoneyOff fontSize="large" />,
    title: 'Cost Savings',
    description: 'Say goodbye to expensive traditional phone lines. With our VoIP services, you only pay for what you use.',
    route: '/services/voip-services/cost-savings',
  },
  {
    icon: <SettingsVoice fontSize="large" />,
    title: 'Advanced Features',
    description: 'Benefit from features like call forwarding, voicemail-to-email, auto-attendant, and more.',
    route: '/services/voip-services/advanced-features',
  },
  {
    icon: <People fontSize="large" />,
    title: 'Trust and Reliability',
    description: 'We provide reliable, professional IT support that ensures your VoIP services are always running smoothly.',
    route: '/services/voip-services/trust-reliability',
  },
  {
    icon: <VerifiedUser fontSize="large" />,
    title: 'Expert Management',
    description: 'Our team of experts manages your VoIP infrastructure, ensuring optimal performance and security.',
    route: '/services/voip-services/expert-management',
  },
];

const additionalFeatures = [
  {
    title: 'Transparent Communication',
    description: 'We ensure that you are always in the loop with our transparent communication and detailed reporting.',
    route: '/services/voip-services/voip',
  },
  {
    title: 'Process and Accountability',
    description: 'Our process-oriented approach ensures that we provide accountable and reliable services every step of the way.',
    route: '/services/voip-services/voip',
  },
];

const VoIPServices = () => {
  return (
    <>

<Helmet>
  <title>VoIP Business Phone Services | All PC Repair</title>
  <meta name="description" content="Experience seamless, cost-effective, and scalable VoIP service for small businesses with All PC Repair's VoIP Business Phone Services. Enjoy high-quality calls, scalability, cost savings, advanced features, and expert management." />
  <meta name="keywords" content="VoIP business phone services, high-quality calls, scalability, cost savings, advanced features, expert management, VoIP support, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/voip-services" />
  <meta property="og:title" content="VoIP Business Phone Services | All PC Repair" />
  <meta property="og:description" content="Experience seamless, cost-effective, and scalable VoIP service for small businesses with All PC Repair's VoIP Business Phone Services. Enjoy high-quality calls, scalability, cost savings, advanced features, and expert management." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/voip-services" />
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
            VoIP Business Phone Services
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Experience seamless, cost-effective, and scalable VoIP service for small businesses with our VoIP Business Phone Services.
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
          Why VoIP Services?
        </Typography>
        <Typography paragraph align="center">
          Our VoIP service for businesses transforms your internet connection into a powerful communication hub, offering flexibility, scalability, and significant cost savings. Revolutionize your communication with our VoIP phone services.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {voipServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard
                height="200px"
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  delay={index * 0.1}
                 
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          Why Choose Our VoIP Services?
        </Typography>
        <Typography paragraph align="center">
          At All PC Repair, we understand that trust is earned, not given. We’re committed to providing reliable, professional IT support that delivers results. We value process and accountability and document our results so you can see exactly what we’re doing to protect your business.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {additionalFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
                buttonText="Learn more"
                buttonLink={feature.route}
                height={220}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          Ready to Transform Your Communication?
        </Typography>
        <Typography paragraph align="center">
          Don’t let outdated communication systems hold your business back. With our VoIP services, you can enhance communication, improve efficiency, and reduce costs. Contact us today to learn more about how our VoIP Business Phone Services can benefit your business.
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

export default VoIPServices;
