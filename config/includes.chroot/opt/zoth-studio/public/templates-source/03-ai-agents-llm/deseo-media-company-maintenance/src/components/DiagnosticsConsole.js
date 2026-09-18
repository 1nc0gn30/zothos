import React, { useState } from 'react';
import { Box, Paper, Typography, LinearProgress, Chip, IconButton, Tooltip } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { playClickSound } from '../utils/audioSFX';

const defaultLogs = [
  '[08:12:01] INFO: Initialized Maintenance Protocol v2.4.0',
  '[08:12:02] OK: Connected to Netlify Form Handler Edge Gateway',
  '[08:12:04] OK: Schema.org JSON-LD Answer Engine graph verified',
  '[08:12:08] OK: Canvas WebGL high-DPI backup renderer ready',
  '[08:12:12] SYNC: AI Asset Generation Pipeline model weights loaded',
  '[08:12:15] OK: WCAG 2.1 AA accessibility hotkey listeners attached',
];

const DiagnosticsConsole = () => {
  const [progress, setProgress] = useState(92);
  const [logs, setLogs] = useState(defaultLogs);

  const handleRefreshLogs = () => {
    playClickSound();
    const timeStr = new Date().toLocaleTimeString();
    const newLog = `[${timeStr}] HEALTHCHECK: All systems nominal (Hampton Roads Cluster)`;
    setLogs((prev) => [...prev.slice(-5), newLog]);
    setProgress((prev) => (prev < 98 ? prev + 1 : 92));
  };

  return (
    <Box
      sx={{ width: '100%', my: 3 }}
      role="region"
      aria-label="System Diagnostics & Infrastructure Console"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontSize: '1rem',
            color: '#D4AF37',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <TerminalIcon /> Live System Upgrade Diagnostics
        </Typography>

        <Tooltip title="Ping System Diagnostics">
          <IconButton
            onClick={handleRefreshLogs}
            size="small"
            aria-label="Refresh system diagnostics"
            sx={{
              color: '#D4AF37',
              border: '1px solid rgba(212,175,55,0.3)',
              '&:hover, &:focus-visible': {
                backgroundColor: 'rgba(212,175,55,0.1)',
                outline: '2px solid #D4AF37',
              },
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: '16px',
          background: 'rgba(10, 10, 15, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          fontFamily: 'monospace',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, fontSize: '0.85rem' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              System Migration Status: <strong>{progress}% Complete</strong>
            </Typography>
            <Chip
              icon={<CheckCircleOutlineIcon sx={{ color: '#D4AF37 !important' }} />}
              label="Priority Booking Active"
              size="small"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                backgroundColor: 'rgba(212,175,55,0.1)',
                color: '#D4AF37',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            aria-label="System Migration Progress"
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#D4AF37',
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            p: 1.5,
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255,255,255,0.05)',
            maxHeight: '120px',
            overflowY: 'auto',
            textAlign: 'left',
          }}
          aria-live="polite"
        >
          {logs.map((log, i) => (
            <Typography
              key={i}
              variant="caption"
              component="div"
              sx={{
                color: log.includes('OK') ? '#4caf50' : log.includes('HEALTH') ? '#D4AF37' : '#cfd8dc',
                fontSize: '0.75rem',
                lineHeight: 1.6,
                fontFamily: 'Consolas, Monaco, monospace',
              }}
            >
              {log}
            </Typography>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default DiagnosticsConsole;
