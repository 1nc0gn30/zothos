import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Security, Assessment, VerifiedUser, Shield, Search, Insights } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FeatureCard from '../../components/FeaturedCard';// Import FeatureCard component

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const CyberSecurityRiskAssessment = () => {
  const initialServices = [
    {
      icon: <Security fontSize="large" />,
      title: 'Thorough IT Infrastructure Evaluation',
      description: 'We conduct a thorough evaluation of your IT infrastructure, identifying potential vulnerabilities and offering actionable recommendations to enhance your security.',
    },
    {
      icon: <Assessment fontSize="large" />,
      title: 'Customized Services',
      description: 'Our services are tailored to meet your specific needs, ensuring you get the most value from our assessment, with personalized solutions that align perfectly with your goals and help you achieve optimal results.',
    },
    {
      icon: <VerifiedUser fontSize="large" />,
      title: 'Compliance Assurance',
      description: 'Our assessments help you comply with industry standards like PCI DSS and HIPAA, ensuring your business is secure and compliant with all regulatory requirements, providing peace of mind and protecting your reputation.',
    },
  ];

  const solutionServices = [
    {
      icon: <Shield fontSize="large" />,
      title: 'Uncover Vulnerabilities',
      description: 'Our team of IT security experts conducts a comprehensive risk, threat, and vulnerability assessment of your IT infrastructure. We identify potential weaknesses and provide actionable recommendations to enhance your security.',
    },
    {
      icon: <Search fontSize="large" />,
      title: 'Proactive Approach',
      description: 'Our risk assessments help you stay ahead of evolving threats by uncovering potential security gaps before attackers exploit them, enabling you to implement preventative measures and fortify your defenses proactively.',
    },
    {
      icon: <Insights fontSize="large" />,
      title: 'Informed Decisions',
      description: 'Our assessments provide a clear picture of your risk landscape, allowing you to allocate resources effectively and prioritize the most impactful security measures, ensuring that your investments yield maximum protection and efficiency.',
    },
  ];

  return (
    <>
    <Helmet>
  <title>Cybersecurity Risk Assessment | All PC Repair</title>
  <meta name="description" content="Ensure your business is protected with All PC Repair's comprehensive cybersecurity risk assessment services. Identify vulnerabilities, ensure compliance, and safeguard your assets." />
  <meta name="keywords" content="Cybersecurity Risk Assessment, IT Security, Vulnerability Assessment, Compliance Assurance, Cyber Threats, Cybersecurity Services, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/cybersecurity-services/risk-assessment" />
  <meta property="og:title" content="Cybersecurity Risk Assessment | All PC Repair" />
  <meta property="og:description" content="Ensure your business is protected with All PC Repair's comprehensive cybersecurity risk assessment services. Identify vulnerabilities, ensure compliance, and safeguard your assets." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/cybersecurity-services/risk-assessment" />
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
            Cybersecurity Risk Assessments
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Safeguarding the invisible doors and windows through which cyber threats can infiltrate. Are you confident that your business is truly shielded from these unseen dangers?
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
          Are You Confident That Your Business Is Truly Protected?
        </Typography>
        <Typography paragraph align="center">
          At All PC Repair, we understand the unique challenges you face as a small business owner. You’re not just the CEO; you’re the HR manager, the marketing director, and the IT specialist. While you’re juggling these roles, cyber threats are lurking in the shadows, ready to strike when least expected.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {initialServices.map((service, index) => (
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
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <img src="/assets/risk-assessment.jpg" alt="Cyber Threat" style={{ width: '100%', borderRadius: '8px' }} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          The Solution: Cyber Security Assessment Services
        </Typography>
        <Typography paragraph align="center">
          Lift the burden of IT security off your shoulders with our comprehensive cybersecurity assessment services. Gain peace of mind knowing that your business is protected from cyber threats.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {solutionServices.map((service, index) => (
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
          Peace of Mind for Your Business
        </Typography>
        <Typography paragraph align="center">
          All PC Repair empowers you to confidently navigate the cybersecurity landscape with a customized plan to safeguard your valuable assets.
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

export default CyberSecurityRiskAssessment;
