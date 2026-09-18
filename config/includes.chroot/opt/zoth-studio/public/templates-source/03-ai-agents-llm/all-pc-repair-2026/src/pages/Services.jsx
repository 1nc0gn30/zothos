import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid } from '@mui/material';
import { Cloud, Security, Build, NetworkCheck, ShoppingCart, Web, AddIcCall } from '@mui/icons-material';
import HeroSection from '../components/HeroSection';
import AlertNewsBanner from '../components/AlertNewsBanner';
import FeatureCard from '../components/FeaturedCard'; 
import AIEstimatorWidget from '../components/AIEstimatorWidget';

const services = [
  {
    icon: <NetworkCheck fontSize="large" />,
    title: 'Network Setup & Cabling',
    description: 'Professional installation and configuration of routers, switches, and structured cabling for seamless business connectivity.',
    route: '/services/network-setup-services',
  },
  {
    icon: <Build fontSize="large" />,
    title: 'Computer Repair & IT Support',
    description: 'Comprehensive hardware diagnostics, motherboard repair, malware removal, and helpdesk subcontracting.',
    route: '/services/it-services',
  },
  {
    icon: <Cloud fontSize="large" />,
    title: 'Cloud Solutions & Backup',
    description: 'Expert cloud migrations (Microsoft 365, Azure, AWS), automated backups, and scalable virtual desktop infrastructure.',
    route: '/services/cloud-services',
  },
  {
    icon: <Security fontSize="large" />,
    title: 'Cybersecurity & Risk Audits',
    description: 'Robust security audits, Virtual CISO consulting, endpoint detection (EDR), and HIPAA/CMMC compliance hardening.',
    route: '/services/cybersecurity-services',
  },
  {
    icon: <AddIcCall fontSize="large" />,
    title: 'VoIP Business Phone Systems',
    description: 'Cost-effective, crystal-clear cloud VoIP phone systems, interactive IVR, and SIP trunking for modern teams.',
    route: '/services/voip-services',
  },
  {
    icon: <ShoppingCart fontSize="large" />,
    title: 'Technology Procurement',
    description: 'Enterprise hardware sourcing, life-cycle asset management, vendor negotiations, and IT budgeting.',
    route: '/services/technology-procurement-services',
  },
  {
    icon: <Web fontSize="large" />,
    title: 'Managed Web Hosting & CDN',
    description: 'Premium ultra-fast managed website hosting with SSL, DDoS defense, high-speed CDN, and 99.9% uptime SLAs.',
    route: '/services/web-hosting-services',
  },
];

const Services = () => {
  return (
    <>
      <Helmet>
        <title>What We Do | Managed IT Services & PC Repair in Hampton Roads</title>
        <meta name="description" content="All PC Repair offers IT services, computer repair, cybersecurity audits, cloud migration, VoIP, and AI pricing estimates across Hampton Roads, VA." />
        <meta name="keywords" content="What We Do, IT services, cybersecurity, Virginia Beach, Norfolk, Chesapeake, computer repair, cloud services, VoIP, AI cost estimator" />
        <link rel="canonical" href="https://www.allpcrepairva.com/what-we-do" />
        <meta property="og:title" content="What We Do | Managed IT & Computer Repair in Hampton Roads, VA" />
        <meta property="og:description" content="All PC Repair offers comprehensive IT services, cybersecurity, and computer repair with instant AI estimator." />
        <meta property="og:url" content="https://www.allpcrepairva.com/what-we-do" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.allpcrepairva.com/assets/1.png" />
      </Helmet>

      <HeroSection
        backgroundImage="/bg.png"
        mainText="Our IT & Cybersecurity Services"
        subText="Enterprise-grade solutions and instant AI repair cost estimates tailored to your business"
        buttonText="Contact Us Today"
        buttonRoute="/contact"
      />

      <AlertNewsBanner />

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <AIEstimatorWidget />

        <Box sx={{ my: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: '#FFD700', fontWeight: 700 }}>
            What We Do
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ color: '#B0BEC5', mb: 4 }}>
            Information Technology Services Powered By AI Diagnostics & Uncompromising Values
          </Typography>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  route={service.route}
                  delay={index * 0.1}
                  buttonText="Learn more"
                  buttonLink={service.route}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Services;
