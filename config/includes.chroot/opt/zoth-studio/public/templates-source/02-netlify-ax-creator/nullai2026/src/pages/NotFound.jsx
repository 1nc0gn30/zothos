import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ pt: { xs: 12, md: 16 }, pb: 10, textAlign: 'center' }}>
      <Stack spacing={3} alignItems="center">
        <Box component="img" src="/DarkMode-NullAI-Icon.png" alt="Ghost Byte, the NullAI mark" sx={{ width: 88, height: 88 }} />
        <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', letterSpacing: '0.22em', fontSize: 12 }}>
          CREATOR OF ZOTH
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>Route not found</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
          That route is empty. NullAI is the house behind Zoth Studio — start at home or /studio.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button variant="contained" component={RouterLink} to="/" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Back to home
          </Button>
          <Button variant="outlined" component={RouterLink} to="/studio" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Zoth Studio
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
