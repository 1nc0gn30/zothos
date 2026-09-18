import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { playClickSound } from '../utils/audioSFX';

const shortcuts = [
  { key: 'M', action: 'Toggle Sound Effects (SFX)' },
  { key: 'T', action: 'Toggle Dark / Light Visual Theme' },
  { key: 'S', action: 'Jump to Main Content Skip Link' },
  { key: '?', action: 'Open Keyboard Shortcuts & ARIA Accessibility Guide' },
  { key: 'Esc', action: 'Close Modal Windows & Dialogs' },
];

const KeyboardShortcutsModal = ({ open, onClose }) => {
  const handleClose = () => {
    playClickSound();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="keyboard-dialog-title"
      aria-describedby="keyboard-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'rgba(18, 18, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          color: '#fff',
          maxWidth: '480px',
          width: '90vw',
        },
      }}
    >
      <DialogTitle id="keyboard-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <KeyboardIcon sx={{ color: '#D4AF37' }} />
        <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: '#D4AF37' }}>
          Keyboard Hotkeys & Accessibility
        </Typography>
      </DialogTitle>

      <DialogContent id="keyboard-dialog-description">
        <Typography variant="body2" color="grey.300" sx={{ mb: 2 }}>
          Navigate Deseo Media Company using keyboard shortcuts designed for WCAG 2.1 AA screen-reader accessibility.
        </Typography>

        <Grid container spacing={1.5}>
          {shortcuts.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.25,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="body2" sx={{ color: '#eee', fontWeight: 500 }}>
                  {item.action}
                </Typography>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    backgroundColor: '#D4AF37',
                    color: '#111',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                  }}
                >
                  {item.key}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: '#D4AF37',
            color: '#111',
            fontWeight: 700,
            '&:hover, &:focus-visible': {
              backgroundColor: '#fff',
              color: '#000',
              outline: '2px solid #D4AF37',
            },
          }}
        >
          Got It
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;
