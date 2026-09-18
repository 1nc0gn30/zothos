import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Grid, Alert, Snackbar, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message cannot be empty';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setLoading(false);
      setAlertOpen(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <Box sx={{ py: 10, bgcolor: '#121212', color: 'white' }}>
      <Container maxWidth="md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Typography variant="overline" align="center" sx={{ display: 'block', color: '#888', letterSpacing: 2, mb: 1 }}>
            GET IN TOUCH
          </Typography>
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8 }}>
            Have questions or need a quote? Fill out the form below and we'll get back to you within 24 hours.
          </Typography>
        </motion.div>

        {/* Contact Form */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 6, px: 3, py: 5, bgcolor: '#1A1A1A', borderRadius: 2, boxShadow: '0 10px 30px rgba(255,255,255,0.1)' }}>
            <Grid container spacing={3}>
              {/* Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': { bgcolor: '#222', color: 'white', borderRadius: 1 },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#777' }
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': { bgcolor: '#222', color: 'white', borderRadius: 1 },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#777' }
                  }}
                />
              </Grid>

              {/* Subject */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  error={!!errors.subject}
                  helperText={errors.subject}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': { bgcolor: '#222', color: 'white', borderRadius: 1 },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#777' }
                  }}
                />
              </Grid>

              {/* Message */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  helperText={errors.message}
                  required
                  multiline
                  rows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': { bgcolor: '#222', color: 'white', borderRadius: 1 },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#777' }
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{
                      py: 1.5, px: 5, fontSize: '1.1rem', fontWeight: 600,
                      bgcolor: '#4A90E2',
                      '&:hover': { bgcolor: '#3B7CD1', transform: 'translateY(-3px)', boxShadow: '0 6px 15px rgba(74, 144, 226, 0.3)' },
                      transition: 'all 0.3s ease'
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Send Message"}
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* Snackbar for Success Message */}
        <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
          <Alert onClose={() => setAlertOpen(false)} severity="success" sx={{ bgcolor: '#4caf50', color: 'white' }}>
            Message sent successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Contact;
