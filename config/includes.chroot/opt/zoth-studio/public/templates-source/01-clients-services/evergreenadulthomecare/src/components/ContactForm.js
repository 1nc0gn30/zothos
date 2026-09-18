// ContactForm.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid2';

const ContactForm = () => {
  const [honeypot, setHoneypot] = useState('');
  const [formError, setFormError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (honeypot) {
      setFormError(true);
      console.log('Bot submission detected!');
    } else {
      setFormError(false);
      console.log('Form submitted successfully');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: '900px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
      }}
    >
      {/* Left Section */}
      <Box flex={1}>
        <Typography variant="h5" gutterBottom>
          Reach Out to Us
        </Typography>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Send Us a Message
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Contents are for display.
        </Typography>
      </Box>

      {/* Right Section */}
      <Box flex={2}>
        <Grid container spacing={2}>
          <Grid item="true" size={{xs:12, md: 6}}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              required
              InputProps={{
                sx: {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none', // Remove focus border
                  },
                  border: 'none', // Remove normal border
                  backgroundColor: 'rgba(86, 180, 53, 0.1)',
                  borderRadius: '30px',
                },
              }}
              InputLabelProps={{
                sx: { color: 'gray' }, // Adjust label color if needed
              }}
            />
          </Grid>

          <Grid item="true" size={{xs:12, md: 6}}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              required
              InputProps={{
                sx: {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  border: 'none',
                  backgroundColor: 'rgba(86, 180, 53, 0.1)',
                  borderRadius: '30px',
                },
              }}
              InputLabelProps={{
                sx: { color: 'gray' },
              }}
            />
          </Grid>

          <Grid item="true" size={{xs:12}}>
            <TextField
              fullWidth
              label="Message(s)"
              multiline
              rows={4}
              variant="outlined"
              required
              InputProps={{
                sx: {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  border: 'none',
                  backgroundColor: 'rgba(86, 180, 53, 0.1)',
                  borderRadius: '20px',
                },
              }}
            />
          </Grid>

          <Grid item="true" size={{xs:12}} style={{ display: 'none' }}>
            <TextField
              label="Leave this field empty"
              variant="outlined"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </Grid>

          <Grid item="true" size={{xs:12}} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: '#56B435',
                borderRadius: '30px',
                px: 4,
                '&:hover': { backgroundColor: '#4CA730' },
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>

        {formError && (
          <Typography color="error" mt={2}>
            Bot submission detected! Please try again.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ContactForm;
