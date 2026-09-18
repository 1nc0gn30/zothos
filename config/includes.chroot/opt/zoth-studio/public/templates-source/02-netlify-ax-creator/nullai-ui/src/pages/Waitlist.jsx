import { Container, Typography } from '@mui/material'

export default function Waitlist() {
  return (
    <Container maxWidth="sm" sx={{ mt: 12, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        You’re on the waitlist
      </Typography>

      <Typography color="text.secondary">
        All shared compute slots are currently full.
        <br />
        You’ll be notified when capacity opens.
      </Typography>
    </Container>
  )
}
