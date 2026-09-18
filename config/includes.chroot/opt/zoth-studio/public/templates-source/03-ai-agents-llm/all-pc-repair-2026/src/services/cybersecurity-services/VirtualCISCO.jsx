import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Security, Assessment, VerifiedUser, Shield, WorkOutline, Gavel, SupervisorAccount, Cloud, AccountBalance, Storage } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FeatureCard from '../../components/FeaturedCard'; // Adjust the path as necessary

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const services1 = [
  {
    icon: <Security fontSize="large" />,
    title: 'Top-Tier Security Expertise',
    description: 'Provides top-tier security expertise without the cost of a full-time executive hire. Gain access to specialized knowledge and advanced strategies tailored to your specific security needs.',
  },
  {
    icon: <Assessment fontSize="large" />,
    title: 'Scalable Consultancy',
    description: 'Scalable consultancy adapts to organizational needs and changing threat landscapes. Ensure your security measures grow with your business and stay ahead of emerging threats.',
  },
  {
    icon: <VerifiedUser fontSize="large" />,
    title: 'Objective Insights',
    description: 'Offers objective insights, free from internal corporate biases. Benefit from an external perspective that brings fresh, unbiased recommendations to enhance your security posture.',
  },
  {
    icon: <Shield fontSize="large" />,
    title: 'Flexible, Rapid Response',
    description: 'Enables flexible, rapid response to evolving cyber threats and regulations. Stay protected with adaptable strategies that quickly address new vulnerabilities and compliance requirements.',
  }
  
];

const services2 = [
  {
    icon: <WorkOutline fontSize="large" />,
    title: 'Strategy Development',
    description: 'Establishing and maintaining a company’s security vision, strategy, and program to protect information assets and technologies. This involves creating a comprehensive roadmap that aligns with the organization’s objectives and addresses current and future security challenges.',
  },
  {
    icon: <Gavel fontSize="large" />,
    title: 'Risk Management',
    description: 'Identifying, evaluating, and reporting on information security risks in a manner that meets compliance and regulatory requirements. Our approach ensures that potential threats are systematically addressed and mitigated, safeguarding your organization’s critical assets.',
  },
  {
    icon: <SupervisorAccount fontSize="large" />,
    title: 'Security Policy and Procedure Creation',
    description: 'Developing, updating, and maintaining security policies, standards, guidelines, and procedures. This comprehensive documentation ensures that all security measures are clearly defined and consistently applied across the organization, enhancing overall protection.',
  },
  {
    icon: <Cloud fontSize="large" />,
    title: 'Compliance & Regulatory Guidance',
    description: 'Ensuring the company aligns with various industry regulations and standards, such as GDPR, HIPAA, PCI-DSS, etc. Our services help your organization navigate the complex regulatory landscape, ensuring full compliance and avoiding costly penalties.',
  },
  {
    icon: <AccountBalance fontSize="large" />,
    title: 'Budget Management',
    description: 'Aligning security initiatives with business goals and managing the security budget effectively. This involves strategic allocation of resources to ensure that security measures are both cost-effective and impactful, supporting the overall business strategy.',
  },
  {
    icon: <Storage fontSize="large" />,
    title: 'Security Technology Selection',
    description: 'Recommending and overseeing the implementation of appropriate security tools and technologies. Our experts ensure that the chosen solutions are best suited to address your organization’s specific security needs, providing robust protection against emerging threats.',
  }
  
];

const VirtualCISO = () => {
  return (
    <>
     <Helmet>
        <title>Virtual CISO Services | All PC Repair</title>
        <meta name="description" content="Affordable and flexible Virtual CISO (vCISO) services providing top-tier cybersecurity expertise and management for small businesses. Schedule a free consultation today!" />
        <meta name="keywords" content="Virtual CISO, vCISO, Cybersecurity, Risk Management, Security Strategy, Compliance, All PC Repair, Virginia Beach" />
        <link rel="canonical" href="https://www.allrepairpcva.com/services/cybersecurity-services/virtual-ciso" />
        <meta property="og:title" content="Virtual CISO Services | All PC Repair" />
        <meta property="og:description" content="Affordable and flexible Virtual CISO (vCISO) services providing top-tier cybersecurity expertise and management for small businesses. Schedule a free consultation today!" />
        <meta property="og:url" content="https://www.allrepairpcva.com/services/cybersecurity-services/virtual-ciso" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/3.png" />
      </Helmet>
      <Box sx={{ background: 'url(/bg.png) no-repeat center center', backgroundSize: 'cover', color: 'white', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography
            sx={{
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              lineHeight: 1.2,
              wordBreak: 'break-word',
            }}
            variant="h2"
            component="h1"
            gutterBottom
          >
            Virtual CISO (VCISO) Services
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Get Instant Cyber Expertise with All PC Repair's Virtual CISO. Affordable Security Leadership for Your Business. Act Now!
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
          Why A Virtual CISO Matters For Your Business
        </Typography>
        <Typography paragraph align="center">
          A Virtual Chief Information Security Officer is for businesses that don’t need or can’t afford a full-time CISO. Small businesses get advanced cybersecurity expertise and unbiased expert advice, ensuring their defenses are up-to-date and robust. For a small business, there are many benefits of a virtual CISO; they’re a strategic partner ensuring the digital enterprise is secured, leaving owners free to focus on growth and operations.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {services1.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard
                height={370}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  delay={index * 0.1}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                The Reality Of Cyber Threats
              </Typography>
              <Typography paragraph>
                Cyber threats have become an expensive reality to businesses large and small. Compliance, data classification, and managing risk aren’t just terms you read in tech magazines. They directly impact businesses like yours.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} component={Link} to="/blog">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <img src="/assets/virtual-ciso.jpg" alt="Cyber Threat" style={{ width: '100%', borderRadius: '8px' }} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          The Solution: Virtual CISO Consulting Service
        </Typography>
        <Typography paragraph align="center">
          A vCISO offers small businesses cost-effective cybersecurity leadership, eliminating the need for a pricey full-time executive. With flexibility and expertise, they provide tailored strategies and quickly address security gaps.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {services2.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard
                height={350}
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
          Peace of Mind for Your Business
        </Typography>
        <Typography paragraph align="center">
          All PC Repair empowers you to confidently navigate the cybersecurity landscape with a customized plan to safeguard your valuable assets.
        </Typography>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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

export default VirtualCISO;
