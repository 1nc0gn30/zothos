import React from 'react';
import { 
  Typography, Grid, Card, CardContent, Container, Box, Button, 
  CardMedia, Stack, 
} from '@mui/material';
import { FitnessCenter, Restaurant, Security, HealthAndSafety, Elderly, LocalHospital } from '@mui/icons-material';
import ServicesPageHero from '../components/ServicesPageHero';
import ContactForm from '../components/ContactForm';
import ParallaxImageSection from '../components/ParallaxImageSection';
import LearnMoreCTA from '../components/LearnMoreCTA';
import FancyDivider from '../components/FancyDivider';

const services = [
  {
    title: 'Recreational Programs',
    description: 'Engaging activities tailored to keep minds and bodies active, improving both mental and physical well-being.',
    image: 'https://media.istockphoto.com/id/1445018103/photo/senior-man-using-dumbbells-with-physiotherapist.jpg?s=612x612&w=0&k=20&c=j4m22uCSmNQYQfEGIOlgbBck-4ja-qvzNAll247Wsdg=',
    useCase: 'Staying physically and mentally active has been shown to improve quality of life and delay cognitive decline.',
    icon: <FitnessCenter fontSize="large" />,
  },
  {
    title: 'Meals and Snacks',
    description: 'Nutritious meals provided daily, ensuring well-balanced diets designed for senior health needs.',
    image: 'https://media.istockphoto.com/id/1444971627/photo/male-care-worker-serving-dinner-to-a-senior-man-at-his-home.jpg?s=612x612&w=0&k=20&c=w3tRyQ0h8BBTBWSUuBlMJtU4JJAD6cDy-FW7sRBkD_c=',
    useCase: 'Proper nutrition supports immune function, maintains energy, and reduces the risk of chronic diseases.',
    icon: <Restaurant fontSize="large" />,
  },
  {
    title: 'Safety and Security',
    description: '24/7 support to ensure a safe and secure environment, providing peace of mind for residents and families.',
    image: 'https://media.istockphoto.com/id/1918836947/photo/coffee-reading-book-or-senior-man-with-nurse-on-sofa-for-nursing-home-retirement-or-house.jpg?s=612x612&w=0&k=20&c=U8AXY71EUNTgf9ihweW4EfTDtKBeym-ZUAzpncj_EOc=',
    useCase: 'A secure environment minimizes risks, promoting both safety and independence for residents.',
    icon: <Security fontSize="large" />,
  },
  {
    title: 'Health Monitoring',
    description: 'Regular health check-ups and personalized care plans to keep residents in the best health.',
    image: 'https://media.istockphoto.com/id/1388819968/photo/senior-man-putting-medications-in-a-pill-organizer-close-up.jpg?s=612x612&w=0&k=20&c=JgJR5n1UV5Uoycm2iMFAM8CaXaVoKuIFl9ImxaBwJ4Q=',
    useCase: 'Proactive health monitoring helps in early detection of potential health issues.',
    icon: <HealthAndSafety fontSize="large" />,
  },
  {
    title: 'Personalized Assistance',
    description: 'Tailored personal assistance with daily activities to maintain independence.',
    image: 'https://media.istockphoto.com/id/1351063564/photo/senior-woman-talking-to-nurse-in-retirement-home.jpg?s=612x612&w=0&k=20&c=Z2QZ6TIEKGPbdSefL317dZeYuDglo9qQzVFI6ZRO9u0=',
    useCase: 'Helping residents with daily tasks promotes dignity and independence.',
    icon: <Elderly fontSize="large" />,
  },
  {
    title: 'Medical Support',
    description: 'On-site medical staff to address urgent needs and coordinate with doctors.',
    image: 'https://media.istockphoto.com/id/1219706864/photo/calling-the-patient.jpg?s=612x612&w=0&k=20&c=FPH5bRJo3s8g1Fa06mEu3MVqn29FNkYc0iw93awcj6E=',
    useCase: 'Immediate access to medical care ensures prompt treatment.',
    icon: <LocalHospital fontSize="large" />,
  },
];

const testimonials = [
  {
    quote: "The care my mom received was exceptional. She's happier and healthier than ever!",
    author: "John D.",
  },
  {
    quote: "The meals are amazing, and the activities keep my dad active every day!",
    author: "Susan K.",
  },
  {
    quote: "Knowing my grandmother is safe 24/7 gives our family great peace of mind.",
    author: "Karen M.",
  },
  {
    quote: "The personalized care has made a huge difference in my uncle's life.",
    author: "Mike R.",
  },
  {
    quote: "Health monitoring caught an issue early, and the staff responded quickly.",
    author: "Sarah L.",
  },
];

const ServicesPage = () => (
  <>{/* Hero Section */}
    <ServicesPageHero />
  <Container sx={{ padding: '32px' }}>
    

    {/* Introduction with CTA */}
    <Box sx={{ textAlign: 'center', margin: '32px 0' }}>
      <Typography variant="h4" gutterBottom>
        Dedicated to Providing Exceptional Care
      </Typography>
      <Typography variant="body1" paragraph>
        Our goal is to enhance the quality of life for every resident through comprehensive, personalized services. 
        We offer a variety of programs designed to meet the unique needs of each individual.
      </Typography>
      <Button variant="contained" sx={{ backgroundColor: '#56B435' }} href="/contact">
        Contact Us to Learn More
      </Button>
    </Box>

    {/* Services Section */}
    <Grid container spacing={4}>
      {services.map((service, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="140"
              image={service.image}
              alt={service.title}
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box display="flex" alignItems="center" gap={2}>
                {service.icon}
                <Typography variant="h6" sx={{ color: '#0A4704' }} gutterBottom>
                  {service.title}
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                {service.description}
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', marginTop: '8px' }}>
                {service.useCase}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Testimonial Section */}
    <Box sx={{ marginTop: '48px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        What Our Families Say
      </Typography>
      <Stack spacing={2} sx={{ marginTop: '16px' }}>
        {testimonials.map((testimonial, index) => (
          <Box key={index} sx={{ border: '1px solid #56B435', padding: '16px', borderRadius: '8px' }}>
            <Typography variant="body1" paragraph>
              "{testimonial.quote}"
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#0A4704' }}>
              - {testimonial.author}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  </Container>
  <FancyDivider />
  <LearnMoreCTA />
  <ContactForm />
  <ParallaxImageSection />
  </>
);

export default ServicesPage;
