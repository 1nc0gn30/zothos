import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import './styles/FAQPage.css';
import TipsSection from '../components/TipsSection';
import SearchComponent from '../components/SearchComponent';
import contentIndex from './data/contentIndex.json';
import './styles/FAQPage.css'

const FAQPage = () => {
  const faqData = contentIndex.filter(item => item.page === 'FAQ');

  return (
    <Container id="page-top" maxWidth={false} disableGutters className="faq-page-container">
      <Box className="faq-hero-section">
        <Typography variant="h2" className="faq-hero-title">
          Frequently Asked Questions
        </Typography>
      </Box>
      <Container maxWidth={false} className="faq-details-section">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6} className="faq-content">
            <Paper elevation={3} className="faq-content-paper">
              <Box p={3}>
                <Typography variant="h6" mb={2}>Search FAQs</Typography>
                <SearchComponent 
                  data={faqData} 
                  searchFields={['title', 'content']} 
                  placeholder="Search FAQs" 
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center" className="tips-section">
          <Grid item xs={12} md={6}>
            <TipsSection />
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

export default FAQPage;
