import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Assessment, VerifiedUser, Shield, School, Visibility, PhonelinkLock } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FeatureCard from '../../components/FeaturedCard'; 

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const CybersecurityManagement = () => {
  const initialServices = [
    {
      icon: <Visibility fontSize="large" />,
      title: 'Cybersecurity Monitoring',
      description: '24/7 monitoring of your IT infrastructure to detect and respond to threats in real-time. Our advanced monitoring systems ensure that any potential threats are identified and mitigated swiftly, reducing the risk of data breaches and downtime.',
    },
    {
      icon: <School fontSize="large" />,
      title: 'Employee Cybersecurity Training',
      description: 'Equip your staff with the knowledge and tools to effectively protect sensitive information. Our training programs cover phishing attacks, safe browsing habits, and the importance of strong passwords.',
    },
    {
      icon: <Shield fontSize="large" />,
      title: 'Managed Cybersecurity Services',
      description: 'Comprehensive cybersecurity services to protect your business from cyber threats. Our managed services include firewall management, antivirus updates, and regular security audits to ensure your systems remain secure.',
    },
    {
      icon: <PhonelinkLock fontSize="large" />,
      title: 'Intrusion Detection',
      description: 'Detect and respond to unauthorized access attempts, ensuring your data remains secure. Our systems monitor for suspicious activity and alert our team to potential breaches.',
    },
  ];

  const solutionServices = [
    {
      icon: <Shield fontSize="large" />,
      title: 'Uncover Vulnerabilities',
      description: 'Our team of IT security experts conducts a comprehensive risk, threat, and vulnerability assessment of your IT infrastructure. We identify potential weaknesses and provide actionable recommendations to enhance your security.',
    },
    {
      icon: <Assessment fontSize="large" />,
      title: 'Proactive Approach',
      description: 'Our risk assessments help you stay ahead of evolving threats by uncovering potential security gaps before attackers exploit them, enabling you to implement preventative measures and fortify your defenses proactively.',
    },
    {
      icon: <VerifiedUser fontSize="large" />,
      title: 'Informed Decisions',
      description: 'Our assessments provide a clear picture of your risk landscape, allowing you to allocate resources effectively and prioritize the most impactful security measures, ensuring that your investments yield maximum protection and efficiency.',
    },
  ];

  return (
    <>
    <Helmet>
  <title>Cybersecurity Management Services | All PC Repair</title>
  <meta name="description" content="Protect your business with All PC Repair's comprehensive cybersecurity management services. Our solutions include continuous monitoring, employee training, and advanced threat detection." />
  <meta name="keywords" content="Cybersecurity Management, IT Security, Cyber Threats, Employee Training, Intrusion Detection, Vulnerability Assessment, Cybersecurity Services, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/cybersecurity-services/cybersecurity-management" />
  <meta property="og:title" content="Cybersecurity Management Services | All PC Repair" />
  <meta property="og:description" content="Protect your business with All PC Repair's comprehensive cybersecurity management services. Our solutions include continuous monitoring, employee training, and advanced threat detection." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/cybersecurity-services/cybersecurity-management" />
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
            Complete Cybersecurity Management
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Protect Your Business with All Repair PC's Advanced Cybersecurity Solutions
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
          Our Cybersecurity Services
        </Typography>
        <Typography paragraph align="center">
          At All PC Repair, we provide a range of cybersecurity services designed to protect your business from evolving cyber threats. Our solutions offer continuous monitoring, employee training, and advanced threat detection to ensure your business remains secure.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {initialServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <FeatureCard
                  height="270px"
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
                The Pain Of Cyber Threats
              </Typography>
              <Typography paragraph>
                Imagine arriving at work one morning to discover a breach in your systems. Confidential data has been compromised. Operations are at a standstill. The financial and reputational damage is immense. This isn’t a hypothetical scenario. It’s a harsh reality for many small businesses, with 43% of cyber attacks targeting small enterprises. The worst part? Many of these businesses remain unaware of the breach until it’s too late.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} component={Link} to="/blog">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <img src="/assets/cybersecurity-management.jpg" alt="Cyber Threat" style={{ width: '100%', borderRadius: '8px' }} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          The Solution: Cyber Security Assessment Services
        </Typography>
        <Typography paragraph align="center">
          But what if you could lift the burden of IT security off your shoulders? What if you could have peace of mind knowing that your business is protected from cyber threats? That’s where our cyber security assessment services come in.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {solutionServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard
                  height="300px"
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

export default CybersecurityManagement;
