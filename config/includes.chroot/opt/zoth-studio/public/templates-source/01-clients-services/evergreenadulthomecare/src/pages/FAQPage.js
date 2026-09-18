// pages/FAQPage.js
import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Card,
  Chip,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SearchIcon from '@mui/icons-material/Search';
import faqData from '../data/faqData.json'; // Import FAQ data
import FancyDivider from '../components/FancyDivider';
import CTASection from '../components/CTASection';
import ContactForm from '../components/ContactForm';
import ParallaxImageSection from '../components/ParallaxImageSection';
import LearnMoreCTA from '../components/LearnMoreCTA';

const FAQPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState(faqData);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = faqData.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
    );

    setFilteredFAQs(filtered);
  };

  return (
    <>
      <Container sx={{ padding: '48px', minHeight: '100vh' }} maxWidth={false}>
        {/* Hero Section */}
        <Paper
          elevation={4}
          sx={{
            padding: '32px',
            marginBottom: '40px',
            backgroundColor: '#e8f5e9',
            borderRadius: '16px',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '16px' }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#388E3C', marginBottom: '24px' }}
          >
            Have questions about our home care services? Find your answers below
            or contact us directly for more information!
          </Typography>
          <Button
            variant="contained"
            href="/contact"
            startIcon={<ContactMailIcon />}
            sx={{
              backgroundColor: '#388E3C',
              '&:hover': { backgroundColor: '#2e7d32' },
              margin: '0 auto',
            }}
          >
            Contact Us
          </Button>
        </Paper>

        {/* Search Bar */}
        <Box sx={{ marginBottom: 5 }}>
          <TextField
            fullWidth
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ marginBottom: '24px' }}
          />
          <Typography variant="body2" sx={{ color: '#4CAF50' }}>
            {filteredFAQs.length} results found
          </Typography>
        </Box>

        {/* FAQ Accordion */}
        <Grid container spacing={3}>
          {filteredFAQs.map((faq, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#f1f8e9',
                }}
              >
                <Accordion
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    sx={{
                      backgroundColor: '#c8e6c9',
                      '&:hover': { backgroundColor: '#a5d6a7' },
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: '#388E3C' }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: '#ffffff' }}>
                    <Typography
                      variant="body2"
                      sx={{ color: '#4CAF50', marginBottom: 2 }}
                    >
                      {faq.answer}
                    </Typography>
                    <Chip label="Home Care" color="primary" sx={{ marginRight: 1 }} />
                    <Chip label="Support" color="secondary" />
                  </AccordionDetails>
                </Accordion>
              </Card>
            </Grid>
          ))}
        </Grid>

        <FancyDivider />

        {/* CTA Section */}
        <Box sx={{ marginBottom: 5, marginTop: 5 }}>
          <LearnMoreCTA />
        </Box>
        <CTASection />
      </Container>

      <ContactForm />
      <ParallaxImageSection />
    </>
  );
};

export default FAQPage;
