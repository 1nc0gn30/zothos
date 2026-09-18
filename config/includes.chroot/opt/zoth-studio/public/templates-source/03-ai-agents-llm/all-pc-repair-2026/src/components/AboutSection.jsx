import React from 'react';
import { Container, Typography, Box, Grid, Paper, Avatar, Button, IconButton, Divider } from '@mui/material';
import { styled } from '@mui/system';
import HeroSection from './HeroSection';
import { Cloud, Security, Build, Group, Business, VerifiedUser, Phone, NetworkCheck, Computer, LinkedIn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';
import AlertNewsBanner from './AlertNewsBanner';
import { Link } from 'react-router-dom';

const AboutContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const FeaturePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease-in-out',
  },
}));

const ProfileContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(4),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

const ScheduleContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  backgroundColor: '#f7f7f7',
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
}));

const AnimatedBox = animated(Box);

const AboutSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const fadeIn = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(50px)',
  });

  return (
    <>
      <HeroSection
        backgroundImage="/bg.png"
        mainText="Discover Our Story and Mission"
        subText="Learn about our journey, values, and the dedicated team behind All PC Repair"
        buttonText="Learn More On Our Blog Page"
        buttonRoute="/blog"
      />
      <AlertNewsBanner />
      <AboutContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Link to="/"><img src="/assets/2.png" alt="All Repair PC Logo" style={{ maxWidth: '400px' }} /></Link>
        </Box>
        <AnimatedBox ref={ref}>
          <Typography marginTop="70px" id="about" variant="h3" component="h2" gutterBottom align="center">
            Who We Are
          </Typography>
          <Typography paragraph align="center">
            At All PC Repair, we understand the diverse needs of small and medium-sized businesses. Our comprehensive and efficient IT solutions are crafted to streamline your operations, significantly boosting productivity.
          </Typography>
          <Typography paragraph align="center">
            Stay at the forefront of your industry with our latest technology offerings. We’re committed to innovation, ensuring your business leverages contemporary solutions to outpace competitors and meet the ever-evolving market demands.
          </Typography>
          <Typography paragraph align="center">
            Our team specializes in delivering customized IT and cybersecurity services across various sectors. Whether you’re in healthcare, finance, or manufacturing, we provide industry-specific solutions that perfectly align with your unique business requirements.
          </Typography>
          <Typography paragraph align="center">
            As a Managed Service Provider (MSP), we offer a complete suite of IT services designed to meet all your business needs. From networking services and VoIP solutions to cloud services and cybersecurity, All PC Repair is your trusted partner in technology.
          </Typography>
        </AnimatedBox>

        <ProfileContainer elevation={3}>
          <Avatar
            src="/assets/portrait.jpg"
            alt="Chris Lex"
            sx={{ width: 120, height: 120 }}
          />
          <IconButton
            href="https://www.linkedin.com/in/chris-lex-7576472a4/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 1 }}
          >
            <LinkedIn sx={{ color: '#0e76a8' }} />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h3" gutterBottom>
              Chris Lex, Owner
            </Typography>
            <Typography paragraph>
              All PC Repair is a family-owned and operated company specializing in residential and small business computer repair and networking solutions. Established in 2009, we proudly offer on-site solutions to any technology problem our customers bring us, big or small. Our technicians have years of experience and are A+, Network+, and MCSE certified. You'll know you're getting prompt, professional, friendly service at competitive rates each and every visit. We guarantee our performance and your satisfaction.
            </Typography>
            <Typography paragraph>
              Under the leadership of Chris Lex, All PC Repair has transitioned from a local computer repair service to a full-fledged Managed Service Provider (MSP), offering comprehensive IT solutions to businesses of all sizes. Chris's vision and dedication have been instrumental in guiding the company through this transformation, ensuring that we continue to meet the evolving needs of our clients.
            </Typography>
          </Box>
        </ProfileContainer>
        <Divider />

        <Box style={fadeIn} ref={ref} sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {[
              { icon: <Cloud />, title: 'Cutting-Edge Technology', description: 'Leveraging contemporary solutions to stay ahead of market demands.' },
              { icon: <Security />, title: 'Industry-Tailored Expertise', description: 'Customized IT and cybersecurity services for various sectors.' },
              { icon: <Build />, title: 'Streamlined Efficiency', description: 'Solutions crafted to streamline operations and boost productivity.' },
              { icon: <Group />, title: 'Dedicated Team', description: 'Our team is committed to providing the best IT solutions.' },
              { icon: <Business />, title: 'Business Growth', description: 'Scalable solutions to grow alongside your business.' },
              { icon: <VerifiedUser />, title: 'Trusted Expertise', description: 'Expertise you can trust to handle your IT needs.' },
              { icon: <Phone />, title: 'VoIP Solutions', description: 'Advanced VoIP services for seamless business communication.' },
              { icon: <NetworkCheck />, title: 'Networking Services', description: 'Professional setup and management of your business network.' },
              { icon: <Computer />, title: 'Computer Repair', description: 'Reliable repair services for residential and small business computers.' },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <FeaturePaper elevation={3}>
                    <Avatar sx={{ bgcolor: '#FFD700', mx: 'auto', mb: 2 }}>
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" component="h3">
                      {feature.title}
                    </Typography>
                    <Typography>
                      {feature.description}
                    </Typography>
                  </FeaturePaper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
              
        <ScheduleContainer>
          
          <Typography variant="h5" component="h2" gutterBottom>
            Schedule a Meeting with Chris Lex
          </Typography>
          <Typography paragraph>
            Want to discuss your IT needs in detail? Schedule a meeting with our founder, Chris Lex, to get personalized insights and solutions tailored to your business.
          </Typography>
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="contained"
                component="a"
                href="https://outlook.office.com/bookwithme/user/989884d224234413b9ad67915a1244c1@allpcrepairva.com/meetingtype/w7vvXiU7M06tqTCDaaAUmQ2?anonymous&ep=mlink"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  backgroundColor: '#FFD700',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#FFC107',
                  },
                }}
              >
                Schedule Now
              </Button>
            </motion.div>
          </Box>
        </ScheduleContainer>
      </AboutContainer>
    </>
  );
};

export default AboutSection;
