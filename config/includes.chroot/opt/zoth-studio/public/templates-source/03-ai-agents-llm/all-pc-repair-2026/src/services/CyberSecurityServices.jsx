import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import {
  Assessment,
  Monitor,
  Group,
  VerifiedUser,
  TrackChanges,
  Lock,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeaturedCard';

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const cybersecurityServices = [
  {
    icon: <Assessment fontSize="large" />,
    title: 'Cybersecurity Risk Assessment',
    description: 'Identify vulnerabilities in your IT infrastructure and receive actionable recommendations for enhanced security.',
    route: '/services/cybersecurity-services/risk-assessment',
  },
  {
    icon: <Monitor fontSize="large" />,
    title: 'Cybersecurity Monitoring',
    description: '24/7 monitoring of your IT infrastructure to detect and respond to threats in real-time, ensuring maximum security',
    route: '/services/cybersecurity-services/cybersecurity-management',
  },
  {
    icon: <Group fontSize="large" />,
    title: 'Employee Cybersecurity Training',
    description: 'Equip your staff with the knowledge and tools to effectively protect sensitive information.',
    route: '/services/cybersecurity-services/cybersecurity-management',
  },
  {
    icon: <VerifiedUser fontSize="large" />,
    title: 'Managed Cybersecurity Services',
    description: 'Comprehensive cybersecurity services to protect your business from cyber threats.',
    route: '/services/cybersecurity-services/cybersecurity-management',
  },
  {
    icon: <TrackChanges fontSize="large" />,
    title: 'Intrusion Detection',
    description: 'Detect and respond to unauthorized access attempts, ensuring your data remains secure and protected at all times.',
    route: '/services/cybersecurity-services/cybersecurity-management',
  },
  {
    icon: <Lock fontSize="large" />,
    title: 'Virtual CISO',
    description: 'Expert guidance to create a robust cybersecurity plan and significantly lower the risk of online threats.',
    route: '/services/cybersecurity-services/virtual-ciso',
  },
];

const CyberSecurityServices = () => {
  return (
    <>
    <Helmet>
  <title>Cybersecurity Services | All PC Repair</title>
  <meta name="description" content="Protect your business with tailored cybersecurity solutions from All PC Repair. Our services include risk assessments, monitoring, employee training, managed cybersecurity, intrusion detection, and virtual CISO services." />
  <meta name="keywords" content="Cybersecurity services, risk assessment, cybersecurity monitoring, employee training, managed cybersecurity, intrusion detection, virtual CISO, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/cybersecurity-services" />
  <meta property="og:title" content="Cybersecurity Services | All PC Repair" />
  <meta property="og:description" content="Protect your business with tailored cybersecurity solutions from All PC Repair. Our services include risk assessments, monitoring, employee training, managed cybersecurity, intrusion detection, and virtual CISO services." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/cybersecurity-services" />
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
            Cybersecurity Services
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Tailored Cybersecurity Solutions for Your Industry’s Unique Challenges
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
          Adamant Protection
        </Typography>
        <Typography paragraph align="center">
          We’re protecting more than your users, customers, and patients. We’re also taking a stand to safeguard the integrity and resilience of your business.
        </Typography>
        <Typography paragraph align="center">
          Our cybersecurity services help keep your private business information safe and away from competitors. The right cybersecurity measures mean less downtime for your systems, helping your employees work more efficiently. We work to make sure your website is always available for your customers.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {cybersecurityServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  delay={index * 0.1}
                  buttonText="Learn more"
                  buttonLink={service.route}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

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

export default CyberSecurityServices;
