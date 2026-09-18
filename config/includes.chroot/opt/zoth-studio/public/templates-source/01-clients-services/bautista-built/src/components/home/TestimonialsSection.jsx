import React from 'react';
import { Container, Box, Typography, Grid, Card, Divider, Rating } from '@mui/material';
import { motion } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';

const testimonials = [
  {
    name: "Michael Johnson",
    company: "Coastal Brews Taproom",
    text: "The custom beer tap handles Bautista Built created exceeded our expectations.",
    rating: 5
  },
  {
    name: "Sarah Williams",
    company: "Oceanview Restaurant",
    text: "Working with Bautista Built was seamless. Our new signage has become a local landmark.",
    rating: 5
  },
  {
    name: "Robert Chen",
    company: "Modern Homes Developer",
    text: "The custom railings and architectural elements they fabricated added tremendous value.",
    rating: 4.5
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } }
};

const TestimonialsSection = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#121212' }}>
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <Typography
            variant="overline"
            sx={{
              color: '#757575',
              fontWeight: 600,
              letterSpacing: 2,
              display: 'block',
              textAlign: 'center',
              mb: 1
            }}
          >
            CLIENT TESTIMONIALS
          </Typography>
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 8,
              color: 'white',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                backgroundColor: '#757575'
              }
            }}
          >
            What Our Clients Say
          </Typography>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item key={index} xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      p: 4,
                      backgroundColor: '#1e1e1e',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: 60,
                        color: 'rgba(255,255,255,0.5)',
                        height: 40,
                        lineHeight: 1,
                        mb: 2,
                        opacity: 0.5
                      }}
                    >
                      "
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3, flexGrow: 1, fontStyle: 'italic', color: 'white' }}>
                      {testimonial.text}
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: '#424242' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating
                        value={testimonial.rating}
                        precision={0.5}
                        readOnly
                        emptyIcon={<StarIcon style={{ opacity: 0.55, color: 'rgba(255,255,255,0.5)' }} fontSize="inherit" />}
                        sx={{ color: 'white', mb: 1 }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      {testimonial.company}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
