import React from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';

const ContactForm = () => {
  return (
    <Container sx={{ py: 8 }}>
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Contact Us
        </Typography>
        <Box component="form">
          <TextField fullWidth label="First Name" variant="outlined" margin="normal" />
          <TextField fullWidth label="Last Name" variant="outlined" margin="normal" />
          <TextField fullWidth label="Company / Organization" variant="outlined" margin="normal" />
          <TextField fullWidth label="Email" variant="outlined" margin="normal" />
          <TextField fullWidth label="Phone" variant="outlined" margin="normal" />
          <TextField fullWidth label="Message" variant="outlined" multiline rows={4} margin="normal" />
          <Button variant="contained" color="primary" type="submit">Send</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactForm;
