import React, { useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Modal, Paper } from '@mui/material';
import emailjs from 'emailjs-com';

const WelcomePopup = ({ onClose }) => {
  const form = useRef();
  const [submitted, setSubmitted] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID_2,
      form.current,
      import.meta.env.VITE_EMAILJS_USER_ID
    )

      .then((result) => {
        console.log('Email sent successfully:', result.text);
        setSubmitted(true);

        setTimeout(() => {
          onClose();
          localStorage.setItem('popupShown', 'true');
        }, 200000);
      })
      .catch((error) => {
        console.error('Failed to send email:', error.text);
        alert('Failed to send message, please try again later.');
      });
  };

  const handleDownload = () => {
    // Download the PDF file from the public folder
    const pdfPath = '/network-security-tips.PDF';
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'network-security-tips.PDF';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="welcome-popup"
      aria-describedby="free-ebook-offer"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '90%',
          maxWidth: '500px',
          p: 4,
          borderRadius: 2,
          position: 'relative',
          outline: 'none',
          backgroundColor: '#000', // Black background
          color: '#FFD700', // Yellow text
          textAlign: 'center',
        }}
      >
        {/* Close Button */}
        <Box
          sx={{
            position: 'absolute',
            right: 16,
            top: 8,
            cursor: 'pointer',
            fontSize: '24px',
            color: '#FFD700',
          }}
          onClick={onClose}
        >
          &times;
        </Box>

        <Typography variant="h3" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Welcome to All PC Repair!
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Get our <b>FREE eBook on Network Security Tips</b>.
          Fill in your details below to receive your copy today!
        </Typography>

        {!submitted ? (
          <form ref={form} onSubmit={sendEmail}>
            {/* Name */}
            <TextField
              fullWidth
              name="user_name"
              label="Your Name"
              variant="outlined"
              required
              sx={{ mb: 2, backgroundColor: '#fff', borderRadius: 1 }}
            />

            {/* Company (Optional) */}
            <TextField
              fullWidth
              name="user_company"
              label="Company Name (Optional)"
              variant="outlined"
              sx={{ mb: 2, backgroundColor: '#fff', borderRadius: 1 }}
            />

            {/* Phone Number */}
            <TextField
              fullWidth
              name="user_phone"
              label="Phone Number"
              variant="outlined"
              required
              sx={{ mb: 2, backgroundColor: '#fff', borderRadius: 1 }}
            />

            {/* Email */}
            <TextField
              fullWidth
              name="user_email"
              label="Your Email"
              variant="outlined"
              required
              type="email"
              sx={{ mb: 3, backgroundColor: '#fff', borderRadius: 1 }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#FFC107' },
              }}
            >
              Get My Free eBook
            </Button>

            {/* Not Interested Button */}
            <Button
              onClick={onClose}
              fullWidth
              size="large"
              sx={{
                mt: 2,
                color: '#FFD700',
                border: '1px solid #FFD700',
                '&:hover': { backgroundColor: '#222' },
              }}
            >
              Not Interested
            </Button>
          </form>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" sx={{ color: '#FFD700' }}>
              Thank you!
            </Typography>
            <Typography>
              Your eBook is on its way to your inbox.
            </Typography>

            {/* Download PDF Button */}
            <Button
              onClick={handleDownload}
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#FFC107' },
              }}
            >
              Download eBook Now
            </Button>
          </Box>
        )}

        {/* Privacy Note */}
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: '#FFD700' }}>
          We respect your privacy and will never share your information.
        </Typography>
      </Paper>
    </Modal>
  );
};

export default WelcomePopup;
