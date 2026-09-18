import { Container, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ pt: { xs: 12, md: 16 }, pb: 10, textAlign: 'center' }}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4">Route not found</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
          The page you requested does not exist. Return to the landing page to explore Nullai.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/" sx={{ width: { xs: '100%', sm: 'auto' } }}>
          Back to home
        </Button>
      </Stack>
    </Container>
  );
}
