import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Email, DesktopWindows, TransferWithinAStation, AccountTree, Support, HeadsetMic } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeaturedCard';
import { Helmet } from 'react-helmet-async';

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const CloudServices = () => {
  const services = [
    {
      icon: <TransferWithinAStation fontSize="large" />,
      title: 'Cloud Migrations',
      description: 'Our cloud migration services elevate your infrastructure to the cloud—providing fast, on-demand access so workers can reach system resources from anywhere. Experience a smooth and efficient transition.',
      buttonText: 'Learn More',
      buttonLink: '/services/cloud-migrations',
      delay: 0,
    },
    {
      icon: <Email fontSize="large" />,
      title: 'Business Email Solutions',
      description: 'Get instant access to the best email tools without overhead expenses. Stay connected and productive with our email solutions. Benefit from reliable and secure email services.',
      buttonText: 'Learn More',
      buttonLink: '/services/email-solutions',
      delay: 0.1,
    },
    {
      icon: <DesktopWindows fontSize="large" />,
      title: 'Virtual Desktop Access',
      description: 'Connect your employees to important programs from any device at any location, ensuring seamless productivity. Enhance your team\'s flexibility and efficiency.',
      buttonText: 'Learn More',
      buttonLink: '/services/virtual-desktop',
      delay: 0.2,
    },
    {
      icon: <AccountTree fontSize="large" />,
      title: 'Infrastructure as a Service (IaaS)',
      description: 'Deploy and manage virtualized computing resources over the cloud with our IaaS solutions, reducing the need for physical hardware. Optimize your IT infrastructure with ease.',
      buttonText: 'Learn More',
      buttonLink: '/services/iaas',
      delay: 0.3,
    },
    {
      icon: <Support fontSize="large" />,
      title: '24/7 Support',
      description: 'Our dedicated support team is available 24/7 to assist with any issues, ensuring your cloud services are always running smoothly. Enjoy peace of mind with round-the-clock support.',
      buttonText: 'Learn More',
      buttonLink: '/services/support',
      delay: 0.4,
    },
    {
      icon: <HeadsetMic fontSize="large" />,
      title: 'Consultation Services',
      description: 'Get expert advice on how to optimize your cloud infrastructure and leverage the latest technologies to drive your business forward. Achieve your goals with tailored consulting.',
      buttonText: 'Learn More',
      buttonLink: '/services/consultation',
      delay: 0.5,
    },
    
  ];

  return (
    <>
    <Helmet>
  <title>Cloud Services | All PC Repair</title>
  <meta name="description" content="Discover comprehensive cloud computing services at All PC Repair. Improve productivity and cut costs with our cloud migration, email solutions, virtual desktop access, IaaS, 24/7 support, and consultation services." />
  <meta name="keywords" content="Cloud services, cloud computing, cloud migration, business email solutions, virtual desktop access, IaaS, 24/7 support, consultation services, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/cloud-services" />
  <meta property="og:title" content="Cloud Services | All PC Repair" />
  <meta property="og:description" content="Discover comprehensive cloud computing services at All PC Repair. Improve productivity and cut costs with our cloud migration, email solutions, virtual desktop access, IaaS, 24/7 support, and consultation services." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/cloud-services" />
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
            Cloud Computing Services
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            All PC Repair powers your business to improve productivity and cut costs. Make your business work from anywhere with our cloud computing services.
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
          Our Cloud Computing Services
        </Typography>
        <Typography paragraph align="center">
          At All PC Repair, we provide comprehensive cloud computing services designed to enhance your business operations. Our solutions offer fast, on-demand access to system resources, ensuring that your team can work efficiently from anywhere.
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

export default CloudServices;
