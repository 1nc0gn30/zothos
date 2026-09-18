import { Container, Typography, Box, Paper, Button, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import { Cloud, Security, DataUsage, HelpOutline, Support, Gavel } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const FeaturePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease-in-out',
  },
}));

const services = [
  {
    icon: <Cloud fontSize="large" />,
    title: 'Cloud Services',
    description: 'Reliable, scalable, and cost-effective cloud computing services with compliance baked in.',
    details: 'Our cloud services provide businesses with scalable and reliable solutions tailored to meet specific needs. With compliance and security at the forefront, we ensure your data is protected and your operations are streamlined. From cloud migration to management, our team is equipped to handle all aspects, allowing your business to scale effortlessly and securely.',
  },
  {
    icon: <DataUsage fontSize="large" />,
    title: 'Data Back-Up and Disaster Recovery',
    description: 'Protect your business & client data from cyber security threats with advanced cloud backup services and disaster recovery.',
    details: 'All Repair PC offers robust data backup and disaster recovery solutions to safeguard your critical data. Our services include regular backups, secure storage, and quick recovery options to minimize downtime and data loss in the event of a disaster. By leveraging our expertise, your business can maintain continuity and protect valuable information from unexpected events.',
  },
  {
    icon: <HelpOutline fontSize="large" />,
    title: 'Staff Augmentation Services',
    description: 'We provide skilled IT professionals who seamlessly integrate with your team, offering the expertise needed to tackle projects of any size.',
    details: 'Our staff augmentation services connect your business with skilled IT professionals who integrate seamlessly with your existing team. Whether you need temporary support for a specific project or long-term expertise, our specialists are ready to provide the skills and knowledge required to achieve your goals efficiently and effectively.',
  },
  {
    icon: <Support fontSize="large" />,
    title: 'IT Support and Helpdesk Services',
    description: 'Comprehensive IT Support and Helpdesk Services designed to resolve issues quickly and efficiently, keeping your systems running smoothly.',
    details: 'All Repair PC offers comprehensive IT support and helpdesk services to ensure your systems run smoothly. Our support team is available around the clock to resolve any technical issues quickly and efficiently, minimizing downtime and maximizing productivity. With our helpdesk services, you can focus on your core business while we handle your IT needs.',
  },
  {
    icon: <Gavel fontSize="large" />,
    title: 'Managed Compliance',
    description: 'Navigate the complexity of compliance with our Managed Compliance Services. Our expert team ensures your operations meet regulatory standards, reducing risks and safeguarding your business.',
    details: 'Navigating the complexities of regulatory compliance is made simple with our managed compliance services. Our expert team ensures that your operations meet industry standards, reducing risks and safeguarding your business. From initial assessments to ongoing monitoring, we provide the tools and support needed to stay compliant and secure.',
  },
  {
    icon: <Security fontSize="large" />,
    title: 'Managed IT Services',
    description: 'Free up your internal resources to focus on the business by letting us handle day-to-day support services, management, and monitoring of your IT.',
    details: 'Our managed IT services allow your business to focus on core operations while we handle the day-to-day management, support, and monitoring of your IT infrastructure. With proactive maintenance, continuous monitoring, and expert support, we ensure your systems are always running optimally, reducing downtime and enhancing productivity.',
  },
];

const DetailedServices = () => {
  return (
    <>
    <Helmet>
  <title>Detailed IT Services | All PC Repair</title>
  <meta name="description" content="Explore the comprehensive IT services offered by All PC Repair. Learn about our cloud services, data backup & recovery, staff augmentation, IT support, managed compliance, and managed IT services tailored to meet your business needs." />
  <meta name="keywords" content="IT services, cloud services, data backup, disaster recovery, staff augmentation, IT support, helpdesk services, managed compliance, managed IT services, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/it-services/learn-more" />
  <meta property="og:title" content="Detailed IT Services | All PC Repair" />
  <meta property="og:description" content="Explore the comprehensive IT services offered by All PC Repair. Learn about our cloud services, data backup & recovery, staff augmentation, IT support, managed compliance, and managed IT services tailored to meet your business needs." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/it-services/learn-more" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/3.png" />
</Helmet>
      <Box sx={{ background: 'url(/bg.png) no-repeat center center', backgroundSize: 'cover', color: 'white', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Our Detailed IT Services
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Learn more about our comprehensive solutions tailored to your business needs
          </Typography>
        </Container>
      </Box>

      <SectionContainer>
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <FeaturePaper elevation={3}>
              <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
                {service.icon}
              </Avatar>
              <Typography variant="h4" component="h2" gutterBottom>
                {service.title}
              </Typography>
              <Typography variant="h6" component="h3" gutterBottom>
                {service.description}
              </Typography>
              <Typography variant="body1" component="p" sx={{ mt: 1 }}>
                {service.details}
              </Typography>
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
              to={service.route}
              >
                Learn more
              </Button>
            </FeaturePaper>
          </motion.div>
        ))}
      </SectionContainer>
    </>
  );
};

export default DetailedServices;
