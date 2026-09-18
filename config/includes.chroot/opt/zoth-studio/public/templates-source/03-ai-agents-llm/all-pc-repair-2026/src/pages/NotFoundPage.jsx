import { Box, Button, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
    <Helmet>
        <title>404 | Page Not Found</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
    <Container
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: 4,
      }}
    >
      <Box
        component="img"
        src="/assets/1.png" // Replace with your logo path
        alt="All PC Repair Logo"
        sx={{ width: 120, height: 'auto' }}
      />

      <Typography variant="h3" fontWeight="bold">
        404: Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Oops! The page you’re looking for doesn’t exist.
        <br />
        Please return to the homepage.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Return Home
      </Button>
    </Container>
    </>
  );
}
