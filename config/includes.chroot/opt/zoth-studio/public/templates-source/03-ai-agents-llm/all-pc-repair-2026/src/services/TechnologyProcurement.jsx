import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import { ShoppingCart, Assessment, Build, VerifiedUser, HeadsetMic, Storage } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeaturedCard';

const SectionContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 2),
}));

const techServices = [
  {
    icon: <ShoppingCart fontSize="large" />,
    title: 'Strategic Procurement',
    description: 'We help you choose the best technology solutions to meet your business objectives, ensuring cost-effectiveness and compatibility. Our strategic approach guarantees that your investments align perfectly with your long-term goals, driving growth and efficiency.',
    route: null,
  },
  {
    icon: <Build fontSize="large" />,
    title: 'Custom Integration',
    description: 'Our experts integrate new technology seamlessly into your existing systems, minimizing disruption and maximizing efficiency. We tailor our integration services to meet your specific requirements, ensuring a smooth and effective transition.',
    route: null,
  },
  {
    icon: <VerifiedUser fontSize="large" />,
    title: 'Vendor Management',
    description: 'We handle all vendor interactions, from negotiations to support, ensuring you get the best value and service. Our comprehensive vendor management ensures consistent quality and reliability from all your technology providers.',
    route: null,
  },
  {
    icon: <Storage fontSize="large" />,
    title: 'Inventory Management',
    description: 'Efficient management of your IT inventory to ensure optimal performance and cost savings. We keep track of all your assets, helping you avoid unnecessary expenditures and maintain a streamlined operation.',
    route: null,
  },
  {
    icon: <Assessment fontSize="large" />,
    title: 'Cost Optimization',
    description: 'Analyze and optimize your technology spend to ensure you are getting the best return on investment. Our cost optimization strategies help you maximize value while minimizing expenses, driving financial efficiency.',
    route: null,
  },
  {
    icon: <HeadsetMic fontSize="large" />,
    title: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to assist with any technology issues or questions. We provide prompt and reliable support to ensure your operations run smoothly and efficiently at all times.',
    route: null,
  }
  
];

const additionalFeatures = [
  {
    title: 'Expertise',
    description: 'Our team of experienced professionals understands the complexities of technology procurement and management, ensuring you receive the best solutions. We leverage our extensive industry knowledge to provide tailored recommendations that meet your specific needs and goals.',
    route: '/services/technology-procurement-services/technology-procurement-services',
  },
  {
    title: 'Cost Savings',
    description: 'At All PC Repair, we help you save money by optimizing your technology spend and negotiating the best prices with vendors. Our strategic approach to procurement ensures you get maximum value from your investments, reducing costs while enhancing efficiency.',
    route: '/services/technology-procurement-services/technology-procurement-services',
  },
  {
    title: 'Reliability',
    description: 'Our reliable services ensure your technology infrastructure is always up and running, minimizing downtime and disruptions. We implement robust and dependable solutions that guarantee continuous operations, supporting your business\'s productivity and growth.',
    route: '/services/technology-procurement-services/technology-procurement-services',
  },
  {
    title: 'Customer Satisfaction',
    description: 'We prioritize customer satisfaction, ensuring you receive the best service and support tailored to your needs. Our dedicated team is committed to delivering exceptional customer experiences, building long-term relationships based on trust and reliability.',
    route: '/services/technology-procurement-services/technology-procurement-services',
  }
  
];

const TechnologyProcurement = () => {
  return (
    <>
    <Helmet>
  <title>Technology Procurement and Management | All PC Repair</title>
  <meta name="description" content="Empower your business with seamless technology procurement and expert management solutions from All PC Repair. Our services include strategic procurement, custom integration, vendor management, inventory management, cost optimization, and 24/7 support." />
  <meta name="keywords" content="Technology procurement, technology management, strategic procurement, custom integration, vendor management, inventory management, cost optimization, IT support, All PC Repair, Virginia Beach" />
  <link rel="canonical" href="https://www.allrepairpcva.com/services/technology-procurement-services" />
  <meta property="og:title" content="Technology Procurement and Management | All PC Repair" />
  <meta property="og:description" content="Empower your business with seamless technology procurement and expert management solutions from All PC Repair. Our services include strategic procurement, custom integration, vendor management, inventory management, cost optimization, and 24/7 support." />
  <meta property="og:url" content="https://www.allrepairpcva.com/services/technology-procurement-services" />
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
            Technology Procurement and Management
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Empowering Your Business with Seamless Technology Procurement and Expert Management Solutions.
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
          Comprehensive Technology Procurement Services
        </Typography>
        <Typography paragraph align="center">
          At All PC Repair, we provide end-to-end technology procurement services designed to streamline your business operations. From selecting the right hardware and software to managing vendor relationships, we ensure that your technology needs are met efficiently and cost-effectively.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {techServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard
                height={300}
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
          Why Choose Our Technology Procurement and Management Services?
        </Typography>
        <Typography paragraph align="center">
          Our services are designed to streamline your technology procurement and management processes, ensuring your business runs smoothly and efficiently. Here’s why you should choose us:
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {additionalFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
                buttonText="Learn more"
                buttonLink={feature.route}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 8 }}>
          Ready to Empower Your Business?
        </Typography>
        <Typography paragraph align="center">
          Don’t let technology procurement and management slow you down. With our expert services, you can focus on what you do best – running your business. Contact us today to learn more about how our Technology Procurement and Management Services can benefit your business.
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

export default TechnologyProcurement;
