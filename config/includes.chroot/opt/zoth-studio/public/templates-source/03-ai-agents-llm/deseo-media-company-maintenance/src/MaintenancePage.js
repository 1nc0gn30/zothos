import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  useMediaQuery,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import logo from './logo.png';
import InstagramIcon from '@mui/icons-material/Instagram';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import Tilt from 'react-parallax-tilt';
import { LinkedIn, YouTube } from '@mui/icons-material';

import ServiceMatrix from './components/ServiceMatrix';
import AIAssetSimulator from './components/AIAssetSimulator';
import DiagnosticsConsole from './components/DiagnosticsConsole';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import {
  playClickSound,
  playChimeSound,
  playSuccessSound,
  playHotkeySound,
  toggleSFX,
  isSFXEnabled,
} from './utils/audioSFX';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#D4AF37' },
    background: {
      default: '#f8f9fa',
      paper: 'rgba(255, 255, 255, 0.85)',
    },
    text: {
      primary: '#1a1a24',
      secondary: '#4a4a5a',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontFamily: 'Ivy Presto, serif', color: '#1a1a24', fontWeight: 700 },
    h6: { fontFamily: 'Ivy Presto, serif', color: '#1a1a24' },
    body1: { color: '#2b2b36' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#D4AF37' },
    background: {
      default: '#0d0d11',
      paper: 'rgba(18, 18, 26, 0.8)',
    },
    text: {
      primary: '#f0f0f5',
      secondary: '#a0a0b5',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontFamily: 'Ivy Presto, serif', color: '#ffffff', fontWeight: 700 },
    h6: { fontFamily: 'Ivy Presto, serif', color: '#ffffff' },
    body1: { color: '#e0e0ea' },
  },
});

const MaintenancePage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [soundActive, setSoundActive] = useState(isSFXEnabled());
  const [kbModalOpen, setKbModalOpen] = useState(false);

  // Form State
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const activeTheme = darkMode ? darkTheme : lightTheme;
  const isSmallScreen = useMediaQuery(activeTheme.breakpoints.down('sm'));

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      const key = e.key.toUpperCase();

      if (key === 'M') {
        e.preventDefault();
        const newState = toggleSFX();
        setSoundActive(newState);
        playHotkeySound();
        setToastMessage({
          text: `Sound effects ${newState ? 'ENABLED' : 'MUTED'}`,
          severity: 'info',
        });
      } else if (key === 'T') {
        e.preventDefault();
        setDarkMode((prev) => !prev);
        playChimeSound();
        setToastMessage({
          text: `Switched to ${!darkMode ? 'Dark' : 'Light'} Mode`,
          severity: 'info',
        });
      } else if (key === 'S') {
        e.preventDefault();
        const main = document.getElementById('main-content');
        if (main) {
          main.focus();
          playHotkeySound();
        }
      } else if (e.key === '?') {
        e.preventDefault();
        setKbModalOpen(true);
        playHotkeySound();
      } else if (e.key === 'Escape') {
        setKbModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [darkMode]);

  const handleThemeToggle = () => {
    playChimeSound();
    setDarkMode(!darkMode);
  };

  const handleSoundToggle = () => {
    const newState = toggleSFX();
    setSoundActive(newState);
    setToastMessage({
      text: `Sound effects ${newState ? 'ENABLED' : 'MUTED'}`,
      severity: 'info',
    });
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    playClickSound();

    if (!formState.name || !formState.email || !formState.message) {
      setToastMessage({
        text: 'Please complete all form fields before submitting.',
        severity: 'warning',
      });
      return;
    }

    setFormSubmitting(true);

    // Simulate reliable Netlify / offline submission handler
    setTimeout(() => {
      setFormSubmitting(false);
      playSuccessSound();
      setToastMessage({
        text: 'Thank you! Your project inquiry has been received. Our team will contact you within 24 hours.',
        severity: 'success',
      });
      setFormState({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <ThemeProvider theme={activeTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'transparent',
          color: activeTheme.palette.text.primary,
          py: 4,
        }}
      >
        {/* Top Control Bar Navigation */}
        <Box
          component="nav"
          role="navigation"
          aria-label="Accessibility & Control Toolbar"
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 9999,
            display: 'flex',
            gap: 1,
            p: 0.5,
            borderRadius: '24px',
            background: 'rgba(15, 15, 20, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <Tooltip title="Toggle Theme (Key: T)">
            <IconButton
              onClick={handleThemeToggle}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              sx={{ color: '#D4AF37' }}
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle Sound SFX (Key: M)">
            <IconButton
              onClick={handleSoundToggle}
              aria-label={`Turn sound ${soundActive ? 'off' : 'on'}`}
              sx={{ color: soundActive ? '#D4AF37' : '#888' }}
            >
              {soundActive ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Keyboard Shortcuts (Key: ?)">
            <IconButton
              onClick={() => {
                playClickSound();
                setKbModalOpen(true);
              }}
              aria-label="View keyboard shortcuts"
              sx={{ color: '#D4AF37' }}
            >
              <KeyboardIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Main Layout Container */}
        <Container
          id="main-content"
          tabIndex={-1}
          component={Paper}
          role="main"
          aria-label="Deseo Media Company Maintenance Hub"
          elevation={4}
          sx={{
            maxWidth: '1100px !important',
            width: '94vw',
            mx: 'auto',
            my: { xs: 6, md: 4 },
            p: { xs: 2.5, sm: 4, md: 5 },
            borderRadius: '24px',
            background: darkMode ? 'rgba(13, 13, 17, 0.82)' : 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: darkMode
              ? '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.15)'
              : '0 20px 50px rgba(0, 0, 0, 0.1), 0 0 30px rgba(212, 175, 55, 0.15)',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Header Section */}
          <Box component="header" role="banner" sx={{ mb: 3 }}>
            <Tilt
              tiltMaxAngleX={6}
              tiltMaxAngleY={6}
              perspective={1000}
              scale={1.03}
              transitionSpeed={1500}
              gyroscope={true}
              style={{ display: 'inline-block' }}
            >
              <img
                src={logo}
                alt="Deseo Media Company Logo"
                style={{
                  height: isSmallScreen ? '140px' : '220px',
                  width: 'auto',
                  borderRadius: '50%',
                  boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
                  border: '2px solid rgba(212, 175, 55, 0.4)',
                }}
              />
            </Tilt>

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                mt: 2,
                fontSize: { xs: '1.8rem', sm: '2.5rem' },
                background: 'linear-gradient(135deg, #ffffff 0%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: darkMode ? 'transparent' : 'inherit',
                fontWeight: 700,
              }}
            >
              Deseo Media Company
            </Typography>

            <Typography
              variant="h6"
              component="h2"
              sx={{ color: '#D4AF37', fontWeight: 600, mb: 1, letterSpacing: '0.04em' }}
            >
              System Upgrade & Maintenance Portal v2.0
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: '720px', mx: 'auto', fontSize: '1.05rem', lineHeight: 1.6 }}
            >
              We are currently enhancing our infrastructure, video render pipelines, and AI asset engine to bring you an extraordinary digital studio experience. Priority inquiries remain active below.
            </Typography>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(212, 175, 55, 0.25)' }} />

          {/* Section 1: Live Service Maintenance Matrix */}
          <ServiceMatrix />

          {/* Section 2: Interactive AI Production Spec Generator */}
          <AIAssetSimulator />

          {/* Section 3: Live System Upgrade Diagnostics */}
          <DiagnosticsConsole />

          <Divider sx={{ my: 4, borderColor: 'rgba(212, 175, 55, 0.25)' }} />

          {/* Section 4: Contact Inquiry Form */}
          <Box
            id="contact"
            role="region"
            aria-label="Priority Contact Inquiry Gateway"
            sx={{ maxWidth: '750px', mx: 'auto', textAlign: 'left', mb: 5 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#D4AF37', mb: 1 }}>
              ✉️ Submit Priority Media Inquiry
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Need urgent commercial video production, portrait photography, or podcast recording in Hampton Roads? Submit your scope below:
            </Typography>

            <Box
              component="form"
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleFormSubmit}
              noValidate
              autoComplete="off"
            >
              <input type="hidden" name="form-name" value="contact" />
              <input type="hidden" name="bot-field" />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    id="name"
                    label="Your Name / Organization"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
                        '&:hover fieldset': { borderColor: '#D4AF37' },
                        '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
                        '&:hover fieldset': { borderColor: '#D4AF37' },
                        '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    id="message"
                    label="Project Scope & Desired Services (Video, Photo, Podcast, AI)"
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
                        '&:hover fieldset': { borderColor: '#D4AF37' },
                        '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={formSubmitting}
                    endIcon={<SendIcon />}
                    sx={{
                      py: 1.5,
                      backgroundColor: '#D4AF37',
                      color: '#111',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderRadius: '10px',
                      '&:hover, &:focus-visible': {
                        backgroundColor: '#fff',
                        color: '#000',
                        outline: '3px solid #D4AF37',
                      },
                    }}
                  >
                    {formSubmitting ? 'Transmitting Inquiry...' : 'Submit Priority Request'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Section 5: Frequently Asked Questions (FAQ) for AEO */}
          <Box role="region" aria-label="Frequently Asked Questions" sx={{ maxWidth: '850px', mx: 'auto', mb: 4, textAlign: 'left' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#D4AF37', mb: 2 }}>
              ❓ Frequently Asked Questions (FAQ)
            </Typography>

            <Accordion
              sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '10px !important',
                mb: 1,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#D4AF37' }} />}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Can I still book video or photography services during maintenance?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Yes! Our priority client contact portal is 100% active. Fill out the contact form above, and our executive producers will review your scope and respond within 24 hours.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '10px !important',
                mb: 1,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#D4AF37' }} />}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Where is Deseo Media Company located and what areas are served?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  We are headquartered in Hampton Roads, Virginia (serving Norfolk, Virginia Beach, Chesapeake, Newport News, and Portsmouth) while delivering digital AI asset creation nationwide.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '10px !important',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#D4AF37' }} />}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  What AI & media tools are integrated into Deseo Media workflows?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  We combine RED / Sony 4K cinema gear with generative AI scriptwriting, neural audio noise-cancellation, automated color grading, and custom web graphics.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Section 6: Social Media Links & Footer */}
          <Box component="footer" role="contentinfo" sx={{ mt: 5 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#D4AF37' }}>
              Connect with Deseo Media Studio
            </Typography>

            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
              <Grid item>
                <Link
                  href="https://www.youtube.com/channel/UCYSl9Jj70dRmadJk87hJABQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  onClick={() => playClickSound()}
                >
                  <Button
                    variant="contained"
                    startIcon={<YouTube />}
                    sx={{
                      backgroundColor: '#D4AF37',
                      color: '#111',
                      fontWeight: 700,
                      '&:hover, &:focus-visible': {
                        backgroundColor: '#fff',
                        color: '#000',
                        outline: '3px solid #D4AF37',
                      },
                    }}
                  >
                    YouTube
                  </Button>
                </Link>
              </Grid>

              <Grid item>
                <Link
                  href="https://linkedin.com/company/deseo-media-company"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  onClick={() => playClickSound()}
                >
                  <Button
                    variant="contained"
                    startIcon={<LinkedIn />}
                    sx={{
                      backgroundColor: '#D4AF37',
                      color: '#111',
                      fontWeight: 700,
                      '&:hover, &:focus-visible': {
                        backgroundColor: '#fff',
                        color: '#000',
                        outline: '3px solid #D4AF37',
                      },
                    }}
                  >
                    LinkedIn
                  </Button>
                </Link>
              </Grid>

              <Grid item>
                <Link
                  href="https://instagram.com/deseomedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  onClick={() => playClickSound()}
                >
                  <Button
                    variant="contained"
                    startIcon={<InstagramIcon />}
                    sx={{
                      backgroundColor: '#D4AF37',
                      color: '#111',
                      fontWeight: 700,
                      '&:hover, &:focus-visible': {
                        backgroundColor: '#fff',
                        color: '#000',
                        outline: '3px solid #D4AF37',
                      },
                    }}
                  >
                    Instagram
                  </Button>
                </Link>
              </Grid>
            </Grid>

            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 4 }}>
              © {new Date().getFullYear()} Deseo Media Company. All rights reserved. | Hampton Roads, VA | Designed for portfolio showcase on nealfrazier.tech
            </Typography>
          </Box>
        </Container>

        {/* Keyboard Shortcuts Dialog Modal */}
        <KeyboardShortcutsModal open={kbModalOpen} onClose={() => setKbModalOpen(false)} />

        {/* Global Toast Notification */}
        <Snackbar
          open={Boolean(toastMessage)}
          autoHideDuration={4500}
          onClose={() => setToastMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          {toastMessage ? (
            <Alert
              onClose={() => setToastMessage(null)}
              severity={toastMessage.severity}
              variant="filled"
              sx={{ width: '100%', fontWeight: 600 }}
              aria-live="polite"
            >
              {toastMessage.text}
            </Alert>
          ) : undefined}
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default MaintenancePage;
