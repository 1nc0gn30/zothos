import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Paper, Button, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import { Security, Computer, SupportAgent } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const FeaturePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease-in-out',
  },
}));

const DataCenterServices = () => {
  return (
    <>
    <Helmet>
  <title>Data Center Services | All PC Repair</title>
  <meta name="description" content="Discover why our Data Center Services are a strategic asset for transforming your business operations. We prioritize customer satisfaction, reliability, and security." />
  <meta name="keywords" content="Data Center Services, IT Infrastructure, Professional Support, Enhanced Security, Compliance Assurance, Operational Efficiency, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/datacenter-services/datacenter-services-management" />
  <meta property="og:title" content="Data Center Services | All PC Repair" />
  <meta property="og:description" content="Discover why our Data Center Services are a strategic asset for transforming your business operations. We prioritize customer satisfaction, reliability, and security." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/datacenter-services/datacenter-services-management" />
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
            Why Choose Our Data Center Services?
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Our Data Center Services are more than just a hosting solution. They are a strategic asset that can transform your business operations.
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
          Our Commitment to You
        </Typography>
        <Typography paragraph align="center">
          We prioritize customer satisfaction, ensuring you receive the best service and support tailored to your needs.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <FeaturePaper elevation={3}>
                  <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
                    <Computer fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                    Reliable Infrastructure
                  </Typography>
                  <Typography variant="body1" component="p" sx={{ mt: 1 }}>
                    We provide a stable, high-performance environment for your data and applications. Our data centers are equipped with state-of-the-art hardware and software, ensuring your business has the resources it needs to thrive.
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ mt: 1 }}>
                    Example: Our data centers feature redundant power supplies and network connections to ensure 99.9% uptime.
                  </Typography>
                </FeaturePaper>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <FeaturePaper elevation={3}>
                  <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
                    <SupportAgent fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                    Professional Support
                  </Typography>
                  <Typography variant="body1" component="p" sx={{ mt: 1 }}>
                    Our team of IT experts is always on hand to assist you. From routine management to emergency response, we’ve got you covered.
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ mt: 1 }}>
                    Example: Our support team is available 24/7 to address any issues promptly and efficiently.
                  </Typography>
                </FeaturePaper>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <FeaturePaper elevation={3}>
                  <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
                    <Security fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                    Enhanced Security
                  </Typography>
                  <Typography variant="body1" component="p" sx={{ mt: 1 }}>
                    We take security seriously. Our data centers are fortified with advanced security measures to protect your data from cyber threats.
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ mt: 1 }}>
                    Example: We employ multi-layered security protocols, including firewalls, intrusion detection systems, and 24/7 surveillance.
                  </Typography>
                </FeaturePaper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Compliance Assurance
              </Typography>
              <Typography paragraph>
                We help you meet industry standards like PCI DSS and HIPAA, ensuring your business stays compliant. Our experts guide you through the complexities of regulatory requirements, providing peace of mind.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} component={Link} to="/blog">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <img src="/assets/3.jpg" alt="Compliance Assurance" style={{ width: '100%', borderRadius: '8px' }} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Operational Efficiency
              </Typography>
              <Typography paragraph>
                By outsourcing your IT needs to us, you can focus on your core business operations. We handle the IT, so you don’t have to. Our services ensure that your technology infrastructure is efficient and effective.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} component={Link} to="/blog">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <img src="/assets/4.jpg" alt="Operational Efficiency" style={{ width: '100%', borderRadius: '8px' }} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

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

export default DataCenterServices;
