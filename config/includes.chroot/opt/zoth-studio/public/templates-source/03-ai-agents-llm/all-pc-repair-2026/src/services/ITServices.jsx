import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import {
  Cloud,
  Security,
  HelpOutline,
  Support,
  Gavel
} from '@mui/icons-material';
import FeatureCard from '../components/FeaturedCard';

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const ITServices = () => {
  const services = [
    {
      icon: <Cloud fontSize="large" />,
      title: 'Cloud Services',
      description: 'Reliable, scalable, and cost-effective cloud computing services with compliance baked in. Ensure seamless integration and optimal performance with our expert cloud solutions.',
      buttonText: 'Learn More',
      buttonLink: '/services/cloud-services',
      delay: 0,
    },
  
    {
      icon: <HelpOutline fontSize="large" />,
      title: 'Staff Augmentation Services',
      description: 'We provide skilled IT professionals who seamlessly integrate with your team, offering the expertise needed to tackle projects of any size. Ensuring timely and cost-effective project completion.',
      buttonText: 'Learn More',
      buttonLink: '/services/managed-it-services',
      delay: 0.2,
    },
    {
      icon: <Support fontSize="large" />,
      title: 'IT Support and Helpdesk Services',
      description: 'Comprehensive IT Support and Helpdesk Services designed to resolve issues quickly and efficiently, keeping your systems running smoothly.',
      buttonText: 'Learn More',
      buttonLink: '/services/managed-it-services',
      delay: 0.3,
    },
    {
      icon: <Gavel fontSize="large" />,
      title: 'Managed Compliance',
      description: 'Navigate the complexity of compliance with our Managed Compliance Services. Our expert team ensures your operations meet regulatory standards, reducing risks and safeguarding your business.',
      buttonText: 'Learn More',
      buttonLink: '/services/managed-it-services',
      delay: 0.4,
    },
    {
      icon: <Security fontSize="large" />,
      title: 'Managed IT Services',
      description: 'Free up internal resources by letting us handle support services, management, and monitoring of your IT. Enhance efficiency and productivity with our reliable IT support.',
      buttonText: 'Learn More',
      buttonLink: '/services/managed-it-services',
      delay: 0.5,
    },
  ];

  return (
    <>
    <Helmet>
  <title>IT Services | All PC Repair</title>
  <meta name="description" content="Explore the comprehensive IT services offered by All PC Repair. Our services include cloud computing, staff augmentation, IT support, managed compliance, and managed IT services to streamline your operations and boost productivity." />
  <meta name="keywords" content="IT services, cloud computing, staff augmentation, IT support, managed compliance, managed IT services, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/it-services" />
  <meta property="og:title" content="IT Services | All PC Repair" />
  <meta property="og:description" content="Explore the comprehensive IT services offered by All PC Repair. Our services include cloud computing, staff augmentation, IT support, managed compliance, and managed IT services to streamline your operations and boost productivity." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/it-services" />
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
            IT Services
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Imagine having a full team of IT experts at your disposal, but at a cost that won’t break the bank.
          </Typography>
          <Link to="/contact">
            <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
              Schedule a Free Consultation
            </Button>
          </Link>
        </Container>
      </Box>

      <SectionContainer>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Our Comprehensive IT Services
        </Typography>
        <Typography paragraph align="center">
          At All PC Repair, we understand the diverse needs of small and medium-sized businesses. Our comprehensive IT services are designed to streamline your operations, significantly boosting productivity and security.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard
                height="310px"
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  delay={service.delay}
                  buttonText={service.buttonText}
                  buttonLink={service.buttonLink}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </SectionContainer>
    </>
  );
};

export default ITServices;
