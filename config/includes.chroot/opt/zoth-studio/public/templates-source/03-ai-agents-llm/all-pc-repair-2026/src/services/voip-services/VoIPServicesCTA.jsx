import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Paper, Button, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import { Phone, VerifiedUser, AssignmentTurnedIn } from '@mui/icons-material';
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

const VoIPServicesCTA = () => {
  return (
    <>
    <Helmet>
  <title>VoIP Services CTA | All PC Repair</title>
  <meta name="description" content="Discover why you should choose All PC Repair for your VoIP services. We offer transparent communication, process and accountability, and expert support to ensure your business runs smoothly and efficiently." />
  <meta name="keywords" content="VoIP services, transparent communication, process and accountability, expert support, VoIP service provider, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/voip-services/voip" />
  <meta property="og:title" content="VoIP Services CTA | All PC Repair" />
  <meta property="og:description" content="Discover why you should choose All PC Repair for your VoIP services. We offer transparent communication, process and accountability, and expert support to ensure your business runs smoothly and efficiently." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/voip-services/voip" />
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
            Why Choose Our VoIP Services?
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            At All PC Repair, we understand that trust is earned, not given. We’re committed to providing reliable, professional IT support that delivers results.
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
          We value process and accountability and document our results so you can see exactly what we’re doing to protect your business.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <FeaturePaper elevation={3}>
                  <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
                    <VerifiedUser fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                    Transparent Communication
                  </Typography>
                  <Typography variant="body1" component="p" sx={{ mt: 1 }}>
                    We ensure that you are always in the loop with our transparent communication and detailed reporting. This means regular updates and reports on the status of your VoIP services, ensuring you are aware of every step we take.
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ mt: 1 }}>
                    Example: If there is an issue with call quality, we will notify you immediately and provide a detailed report on the cause and the steps we are taking to resolve it.
                  </Typography>
                </FeaturePaper>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <FeaturePaper elevation={3}>
                  <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
                    <AssignmentTurnedIn fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                    Process and Accountability
                  </Typography>
                  <Typography variant="body1" component="p" sx={{ mt: 1 }}>
                    Our process-oriented approach ensures that we provide accountable and reliable services every step of the way. From installation to maintenance, every action is documented and transparent.
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ mt: 1 }}>
                    Example: During the setup of your VoIP system, we provide a detailed project plan with timelines and responsibilities, so you know what to expect and when.
                  </Typography>
                </FeaturePaper>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <FeaturePaper elevation={3}>
                  <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
                    <Phone fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                    Expert Support
                  </Typography>
                  <Typography variant="body1" component="p" sx={{ mt: 1 }}>
                    Our team of experts is always available to provide support and answer any questions you may have. We are dedicated to ensuring that your VoIP service runs smoothly and efficiently.
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ mt: 1 }}>
                    Example: If you experience any issues with your VoIP service, our support team is available 24/7 to provide immediate assistance and resolve the problem quickly.
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
                Transparent Communication
              </Typography>
              <Typography paragraph>
                We believe in keeping our clients fully informed. With our transparent communication, you will receive regular updates and detailed reports about your VoIP services. This transparency helps build trust and ensures that you are always aware of what we are doing to protect your business.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} component={Link} to="/blog">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <img src="/assets/5.jpg" alt="Transparent Communication" style={{ width: '100%', borderRadius: '8px' }} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Process and Accountability
              </Typography>
              <Typography paragraph>
                Our process-oriented approach ensures accountability at every step. From initial setup to ongoing maintenance, every action is meticulously documented. This approach guarantees that our services are reliable and that any issues are resolved promptly.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} component={Link} to="/blog">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <img src="/assets/6.jpg" alt="Process and Accountability" style={{ width: '100%', borderRadius: '8px' }} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Expert Support
              </Typography>
              <Typography paragraph>
                Our team of experts is dedicated to providing top-notch support. We are always available to answer your questions and resolve any issues you may encounter with your VoIP service. Our commitment to expert support ensures that your business operations run smoothly.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} component={Link} to="/blog">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <img src="/assets/7.jpg" alt="Expert Support" style={{ width: '100%', borderRadius: '8px' }} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

       
      </SectionContainer>
    </>
  );
};

export default VoIPServicesCTA;
