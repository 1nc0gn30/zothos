import React from 'react';
import { 
  Container, Typography, Grid, Card, CardMedia, CardContent, Accordion, AccordionSummary, AccordionDetails, Button, Divider, Box 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import BuildIcon from '@mui/icons-material/Build';
import HandymanIcon from '@mui/icons-material/Handyman';

const servicesData = [
  {
    title: 'Custom Metal Fabrication',
    description: 'Precision-engineered metal solutions tailored to your specifications.',
    detailedDescription: "We specialize in **custom metal fabrication**, offering CNC cutting, welding, and finishing for architectural, industrial, and artistic projects. Using high-grade materials, we ensure durability and style in every project.",
    image: 'https://plus.unsplash.com/premium_photo-1663127162791-ef922fd1ab89?q=80&w=2133&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    icon: <BuildIcon sx={{ fontSize: 40, color: '#bbb', backgroundColor: "rgba(0, 0, 0, 0.4)", borderRadius: 5 }} />,
    caseStudyLink: "#",
  },
  {
    title: 'Custom Signs & Installations',
    description: 'Eye-catching signage designed to make a lasting impression.',
    detailedDescription: "We create **impactful, durable signage** for businesses, events, and urban spaces. From LED-lit signage to handcrafted metal lettering, our installations combine style with function.",
    image: 'https://media.istockphoto.com/id/499208871/photo/hotel-sign.webp?s=2048x2048&w=is&k=20&c=6GGbwPavfYxvt0WhmVKKYSf4QXnQeqIPTc3m75Ud2Mc=',
    icon: <DesignServicesIcon sx={{ fontSize: 40, color: '#bbb', backgroundColor: "rgb(71, 68, 68)", borderRadius: 5 }} />,
    caseStudyLink: "#",
  },
  {
    title: 'Bespoke Metal Work',
    description: 'Handcrafted metalwork that brings creativity and craftsmanship together.',
    detailedDescription: "Our **bespoke metalwork** includes handcrafted sculptures, railings, and functional metal art. Each piece is uniquely designed and built to enhance your space.",
    image: 'https://plus.unsplash.com/premium_photo-1725826740450-e59a003a0b11?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    icon: <HandymanIcon sx={{ fontSize: 40, color: '#bbb', backgroundColor: "rgba(0, 0, 0, 0.4)", borderRadius: 5 }} />,
    caseStudyLink: "#",
  },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] } }
};

const Services = () => {
  return (
    <Box sx={{ py: 10, bgcolor: '#121212', color: 'white' }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInVariants}>
          <Typography variant="overline" align="center" sx={{ display: 'block', textAlign: 'center', letterSpacing: 2, color: '#888', mb: 1 }}>
            WHAT WE DO
          </Typography>
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 6 }}>
            Our Specialized Services
          </Typography>
        </motion.div>

        {/* Services Grid */}
        <Grid container spacing={6}>
          {servicesData.map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Tilt glareEnable={true} glareMaxOpacity={0.25} scale={0.82}>
                  <Card sx={{
                    bgcolor: '#1A1A1A', 
                    color: 'white', 
                    borderRadius: 2, 
                    overflow: 'hidden', 
                    boxShadow: '0 10px 30px rgba(255,255,255,0.1)',
                    '&:hover': { boxShadow: '0 15px 40px rgba(255,255,255,0.2)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 4, pb: 4, backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
                      {service.icon}
                    </Box>
                    <CardMedia component="img" height="220" image={service.image} alt={service.title} sx={{ filter: 'brightness(0.8)' }} />
                    <CardContent sx={{ textAlign: 'center', px: 3, pb: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                        {service.description}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        sx={{ color: 'white', borderColor: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'white' } }}
                        href={service.caseStudyLink}
                      >
                        View Case Study
                      </Button>
                    </CardContent>
                  </Card>
                </Tilt>
              </motion.div>
              
              {/* Expandable Details */}
              <Accordion sx={{ mt: 2, bgcolor: '#1A1A1A', color: 'white', boxShadow: 'none' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography>More Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {service.detailedDescription}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>

        {/* Section Divider */}
        <Divider sx={{ my: 8, bgcolor: '#333' }} />

        {/* FAQ Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
            Frequently Asked Questions
          </Typography>
          <Accordion sx={{ bgcolor: '#1A1A1A', color: 'white', boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography>What types of metals do you work with?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                We specialize in working with **steel, aluminum, brass, and stainless steel**. We ensure high-quality finishes and durability.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ bgcolor: '#1A1A1A', color: 'white', boxShadow: 'none', mt: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography>Do you offer custom design services?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Yes! Our team of **designers and engineers** can help you bring your vision to life with 3D modeling and digital previews before fabrication.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </Box>
  );
};

export default Services;
