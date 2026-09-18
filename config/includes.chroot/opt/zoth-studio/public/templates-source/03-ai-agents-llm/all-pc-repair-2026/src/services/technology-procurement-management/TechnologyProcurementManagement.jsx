import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Paper, Button, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import { Build, AttachMoney, VerifiedUser} from '@mui/icons-material';
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

const TechnologyProcurementManagement = () => {
  return (
    <>
    <Helmet>
  <title>Technology Procurement and Management | All PC Repair</title>
  <meta name="description" content="Streamline your technology procurement and management processes with All PC Repair. Our services ensure your business runs smoothly and efficiently with expertise, cost savings, reliability, and customer satisfaction." />
  <meta name="keywords" content="Technology procurement, technology management, cost savings, reliable IT services, customer satisfaction, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/technology-procurement-services/technology-procurement-services" />
  <meta property="og:title" content="Technology Procurement and Management | All PC Repair" />
  <meta property="og:description" content="Streamline your technology procurement and management processes with All PC Repair. Our services ensure your business runs smoothly and efficiently with expertise, cost savings, reliability, and customer satisfaction." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/technology-procurement-services/technology-procurement-services" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/3.png" />
</Helmet>
      <Box sx={{ background: 'url(/bg.png) no-repeat center center', backgroundSize: 'cover', color: 'white', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography  sx={{ 
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              lineHeight: 1.2,
              wordBreak: 'break-word'
            }} variant="h2" component="h1" gutterBottom>
            Why Choose Our Technology Procurement and Management Services?
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Our services are designed to streamline your technology procurement and management processes, ensuring your business runs smoothly and efficiently.
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
                    <Build fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                    Expertise
                  </Typography>
                  <Typography variant="body1" component="p" sx={{ mt: 1 }}>
                    Our team of experienced professionals understands the complexities of technology procurement and management, ensuring you receive the best solutions.
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ mt: 1 }}>
                    Example: We help you select the right hardware and software that align with your business goals, avoiding costly mistakes.
                  </Typography>
                </FeaturePaper>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <FeaturePaper elevation={3}>
                  <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
                    <AttachMoney fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                    Cost Savings
                  </Typography>
                  <Typography variant="body1" component="p" sx={{ mt: 1 }}>
                    We help you save money by optimizing your technology spend and negotiating the best prices with vendors.
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ mt: 1 }}>
                    Example: Through our vendor relationships, we secure discounts and favorable terms that you might not achieve on your own.
                  </Typography>
                </FeaturePaper>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <FeaturePaper elevation={3}>
                  <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
                    <VerifiedUser fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                    Reliability
                  </Typography>
                  <Typography variant="body1" component="p" sx={{ mt: 1 }}>
                    Our reliable services ensure your technology infrastructure is always up and running, minimizing downtime and disruptions.
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ mt: 1 }}>
                    Example: We offer proactive monitoring and maintenance to prevent issues before they impact your operations.
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
                Expertise
              </Typography>
              <Typography paragraph>
                Our team of experienced professionals understands the complexities of technology procurement and management, ensuring you receive the best solutions. From selecting the right hardware to managing software licenses, we handle it all.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} component={Link} to="/blog">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <img src="/assets/11.jpg" alt="Expertise" style={{ width: '100%', borderRadius: '8px' }} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Cost Savings
              </Typography>
              <Typography paragraph>
                We help you save money by optimizing your technology spend and negotiating the best prices with vendors. Our goal is to provide cost-effective solutions that enhance your business operations without breaking the bank.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} component={Link} to="/blog">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <img src="/assets/8.jpg" alt="Cost Savings" style={{ width: '100%', borderRadius: '8px' }} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Reliability
              </Typography>
              <Typography paragraph>
                Our reliable services ensure your technology infrastructure is always up and running, minimizing downtime and disruptions. We provide proactive support and maintenance to keep your systems in top shape.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} component={Link} to="/blog">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <img src="/assets/9.jpg" alt="Reliability" style={{ width: '100%', borderRadius: '8px' }} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Customer Satisfaction
              </Typography>
              <Typography paragraph>
                We prioritize customer satisfaction, ensuring you receive the best service and support tailored to your needs. Our team is dedicated to providing prompt, professional, and personalized support.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} component={Link} to="/blog">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <img src="/assets/10.jpg" alt="Customer Satisfaction" style={{ width: '100%', borderRadius: '8px' }} />
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

export default TechnologyProcurementManagement;
