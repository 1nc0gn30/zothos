import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Storage, Security, Cloud, Assessment, Update, Support } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeaturedCard';

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const webHostingServices = [
  {
    icon: <Storage fontSize="large" />,
    title: 'Secure and Reliable Hosting',
    description: 'We ensure your website is always up and running smoothly, fostering a positive user experience for your customers. Our robust hosting infrastructure guarantees maximum uptime and performance.',
    route: null,
  },
  {
    icon: <Cloud fontSize="large" />,
    title: 'Scalable Solutions',
    description: 'Our web hosting plans are designed to scale with your business. Whether you\'re a startup or a growing enterprise, we provide the right hosting solution to meet your current and future needs, ensuring seamless growth.',
    route: null,
  },
  {
    icon: <Security fontSize="large" />,
    title: 'Enhanced Security',
    description: 'Our hosting platforms are designed with security as the top priority, including malware scanning, DDoS protection, and firewalls. We proactively protect your site against potential threats and vulnerabilities.',
    route: null,
  },
  {
    icon: <Update fontSize="large" />,
    title: 'Automatic Updates',
    description: 'Benefit from automatic software updates and backups, ensuring your site is always running the latest features and security patches. This automated process minimizes risks and maximizes efficiency.',
    route: null,
  },
  {
    icon: <Assessment fontSize="large" />,
    title: 'Performance Monitoring',
    description: 'We monitor traffic and server health 24/7 to identify and resolve any issues promptly, avoiding downtime. Our continuous monitoring ensures optimal performance and user satisfaction.',
    route: null,
  },
  {
    icon: <Support fontSize="large" />,
    title: 'Expert Support',
    description: 'Our IT specialists handle server maintenance, security updates, and any technical hurdles, freeing you to focus on core business activities. Experience peace of mind with our dedicated and knowledgeable support team.',
    route: null,
  }
  
];

const WebHosting = () => {
  return (
    <>

<Helmet>
  <title>Web Hosting Services | All PC Repair</title>
  <meta name="description" content="Secure, scalable web hosting solutions from All PC Repair. Our services include secure and reliable hosting, scalable solutions, enhanced security, automatic updates, performance monitoring, and expert support." />
  <meta name="keywords" content="Web hosting services, secure hosting, scalable hosting, enhanced security, automatic updates, performance monitoring, expert support, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/web-hosting-services" />
  <meta property="og:title" content="Web Hosting Services | All PC Repair" />
  <meta property="og:description" content="Secure, scalable web hosting solutions from All PC Repair. Our services include secure and reliable hosting, scalable solutions, enhanced security, automatic updates, performance monitoring, and expert support." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/web-hosting-services" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/3.png" />
</Helmet>
      <Box sx={{ background: 'url(/bg.png) no-repeat center center', backgroundSize: 'cover', color: 'white', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Choose Your Web Hosting Plan
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Secure, Scalable Web Hosting Solutions for Your Business
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
          Our Web Hosting Services
        </Typography>
        <Typography paragraph align="center">
          Businesses require a steady online presence to connect with customers, and All Repair PC provides robust hosting services to keep your website available and secure. Whether you need shared hosting for basic websites or dedicated servers for complex applications, our team of experts can design a scalable solution tailored to your organization’s needs and budget.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {webHostingServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard
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
          Why Choose Our Web Hosting Services?
        </Typography>
        <Typography paragraph align="center">
          At All PC Repair, we empower your business with secure and reliable web hosting solutions. We prioritize keeping your website up and running smoothly, ensuring a positive user experience for your customers. Our scalable plans can grow alongside your business, whether you’re a startup or a well-established enterprise.
        </Typography>
        <Typography paragraph align="center">
          We take the burden of web hosting management off your plate. Our IT specialists handle server maintenance, security updates, and any technical hurdles that may arise, freeing you to focus on core business activities. We offer a variety of cost-effective plans to fit your budget, working with you to find the perfect solution that meets your specific website requirements.
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

export default WebHosting;
