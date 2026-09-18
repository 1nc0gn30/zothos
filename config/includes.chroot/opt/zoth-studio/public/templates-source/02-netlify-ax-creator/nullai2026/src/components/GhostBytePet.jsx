import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tooltip, IconButton, Chip } from '@mui/material';
import { keyframes } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const floatAnim = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulseGlow = keyframes`
  0% { filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.4)); }
  50% { filter: drop-shadow(0 0 18px rgba(0, 240, 255, 0.8)); }
  100% { filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.4)); }
`;

const GHOSTBYTE_QUOTES = [
  "Ghost Byte here. NullAI built Zoth Studio.",
  "Deck stays local. Keys stay on the machine.",
  "Open /studio if you want the product, not the pitch.",
  "Operator tools are still on this domain. I kept the face.",
  "Zoth is the studio. I am the house mark.",
];

export default function GhostBytePet() {
  const [minimized, setMinimized] = useState(false);
  const [bubbleText, setBubbleText] = useState(GHOSTBYTE_QUOTES[0]);
  const [mood, setMood] = useState('HAPPY'); // HAPPY | SCANNING | MESH_LOCKED

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbleText(GHOSTBYTE_QUOTES[Math.floor(Math.random() * GHOSTBYTE_QUOTES.length)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (minimized) {
    return (
      <Tooltip title="GhostByte AI Companion (Click to summon)" placement="left">
        <IconButton
          onClick={() => setMinimized(false)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            bgcolor: 'rgba(0, 240, 255, 0.15)',
            border: '1px solid #00f0ff',
            color: '#00f0ff',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)',
            '&:hover': { bgcolor: 'rgba(0, 240, 255, 0.3)' }
          }}
        >
          <Box component="img" src="/DarkMode-NullAI-Icon.png" alt="Ghost Byte, the NullAI mark" sx={{ width: 22, height: 22 }} />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      {/* Speech Bubble */}
      <Paper
        sx={{
          pointerEvents: 'auto',
          p: 1.5,
          mb: 1.5,
          maxWidth: 240,
          bgcolor: 'rgba(10, 10, 18, 0.92)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #00f0ff',
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.25)',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            right: 28,
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #00f0ff',
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Chip
            size="small"
            icon={<RadioButtonCheckedIcon style={{ color: '#00f0ff', fontSize: 12 }} />}
            label={`GHOSTBYTE // ${mood}`}
            sx={{
              height: 20,
              fontSize: '0.65rem',
              bgcolor: 'rgba(0, 240, 255, 0.12)',
              color: '#00f0ff',
              fontFamily: 'monospace',
              border: '1px solid rgba(0, 240, 255, 0.3)'
            }}
          />
          <IconButton size="small" onClick={() => setMinimized(true)} sx={{ color: 'text.secondary', p: 0.2 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.primary', fontFamily: 'monospace', lineHeight: 1.4, display: 'block' }}>
          {bubbleText}
        </Typography>
      </Paper>

      {/* GhostByte Mascot Icon */}
      <Box
        onClick={() => {
          setMood('SCANNING');
          setBubbleText("Scanning local sector & pinging peer nodes... 📡");
          setTimeout(() => setMood('HAPPY'), 2000);
        }}
        sx={{
          pointerEvents: 'auto',
          cursor: 'pointer',
          animation: `${floatAnim} 3s infinite ease-in-out, ${pulseGlow} 2s infinite ease-in-out`,
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.1)' }
        }}
      >
        <img
          src="/DarkMode-NullAI-Icon.png"
          alt="Ghost Byte, the NullAI mark"
          style={{ width: 64, height: 64, objectFit: 'contain' }}
        />
      </Box>
    </Box>
  );
}
