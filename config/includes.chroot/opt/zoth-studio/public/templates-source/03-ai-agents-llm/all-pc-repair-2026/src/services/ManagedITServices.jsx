import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Paper, Button, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import { Build, Support, Gavel, Computer } from '@mui/icons-material';
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

const services = [
  {
    icon: <Build fontSize="large" />,
    title: 'Staff Augmentation Services',
    description: 'We provide skilled IT professionals who seamlessly integrate with your team, offering the expertise needed to tackle projects of any size.',
    details: 'Our staff augmentation services help you scale your IT capabilities quickly and efficiently. Whether you need additional support for a short-term project or long-term engagement, our skilled professionals are ready to join your team and hit the ground running. With their expertise, you can ensure your projects are completed on time and within budget.',
    example: 'For example, if your business is undertaking a major software development project, our staff augmentation services can provide the additional manpower needed to meet tight deadlines and deliver a high-quality product.',
  },
  {
    icon: <Support fontSize="large" />,
    title: 'IT Support and Helpdesk Services',
    description: 'Comprehensive IT Support and Helpdesk Services designed to resolve issues quickly and efficiently, keeping your systems running smoothly.',
    details: 'Our IT support and helpdesk services provide your business with round-the-clock assistance for any technical issues that may arise. From troubleshooting hardware and software problems to providing guidance on IT best practices, our support team ensures your systems are always up and running smoothly.',
    example: 'Imagine your business experiencing a critical system outage. With our IT support services, you have access to immediate assistance to resolve the issue quickly, minimizing downtime and keeping your business operations running smoothly.',
  },
  {
    icon: <Gavel fontSize="large" />,
    title: 'Managed Compliance',
    description: 'Navigate the complexity of compliance with our Managed Compliance Services. Our expert team ensures your operations meet regulatory standards, reducing risks and safeguarding your business.',
    details: 'Our managed compliance services help your business stay compliant with industry regulations such as PCI DSS, HIPAA, and GDPR. We conduct thorough assessments of your IT infrastructure, identify any compliance gaps, and implement the necessary measures to ensure your operations meet the required standards.',
    example: 'For example, if your business handles sensitive customer data, our managed compliance services ensure that your data handling practices comply with regulations, reducing the risk of data breaches and associated penalties.',
  },
  {
    icon: <Computer fontSize="large" />,
    title: 'Managed IT Services',
    description: 'Free up your internal resources to focus on the business by letting us handle day-to-day support services, management, and monitoring of your IT.',
    details: 'Our managed IT services provide comprehensive support for your entire IT infrastructure. From network management and server maintenance to software updates and cybersecurity, we handle all aspects of your IT operations, allowing you to focus on your core business activities.',
    example: 'For instance, our managed IT services can include proactive monitoring of your network to identify and resolve potential issues before they impact your business, ensuring uninterrupted productivity and reducing the risk of costly downtime.',
  },
];

const ManagedITServices = () => {
  return (
    <>
    <Helmet>
  <title>Managed IT Services | All PC Repair</title>
  <meta name="description" content="Explore the comprehensive managed IT services offered by All PC Repair. Our services include staff augmentation, IT support, managed compliance, and full IT management to enhance your business operations and ensure compliance with industry standards." />
  <meta name="keywords" content="Managed IT services, staff augmentation, IT support, managed compliance, IT management, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/managed-it-services" />
  <meta property="og:title" content="Managed IT Services | All PC Repair" />
  <meta property="og:description" content="Explore the comprehensive managed IT services offered by All PC Repair. Our services include staff augmentation, IT support, managed compliance, and full IT management to enhance your business operations and ensure compliance with industry standards." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/managed-it-services" />
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
            Comprehensive Managed IT Services
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Empowering Your Business with Seamless IT Solutions
          </Typography>
          <Link to="/contact">
          <Button variant="contained" color="secondary"  sx={{ mt: 2 }}>
            Schedule a Free Consultation
          </Button>
          </Link>
        </Container>
      </Box>

      <SectionContainer>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Our Managed IT Services
        </Typography>
        <Typography paragraph align="center">
          At All PC Repair, we offer a range of managed IT services designed to support your business operations, enhance efficiency, and ensure compliance with industry standards.
        </Typography>

        {services.map((service, index) => (
          <Box sx={{ mt: 8 }} key={index}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <FeaturePaper elevation={3}>
                    <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
                      {service.icon}
                    </Avatar>
                    <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mt: 1 }}>
                      {service.description}
                    </Typography>
                  </FeaturePaper>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" component="h4" gutterBottom>
                  {service.title}
                </Typography>
                <Typography paragraph>
                  {service.details}
                </Typography>
                <Typography paragraph>
                  <strong>Example:</strong> {service.example}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          Why Choose Our Managed IT Services?
        </Typography>
        <Typography paragraph align="center">
          Our managed IT services provide your business with the necessary tools and support to thrive in today's competitive market. From skilled IT professionals to comprehensive support and compliance services, we have you covered.
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

export default ManagedITServices;
