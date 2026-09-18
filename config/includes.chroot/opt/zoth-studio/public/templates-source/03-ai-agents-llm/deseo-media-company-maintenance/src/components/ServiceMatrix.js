import React from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SecurityIcon from '@mui/icons-material/Security';
import { playClickSound } from '../utils/audioSFX';

const services = [
  {
    name: 'Photography Engine & Studio',
    icon: <CameraAltIcon sx={{ color: '#D4AF37' }} />,
    status: 'Operational',
    statusColor: 'success',
    latency: '14ms',
    uptime: '99.9%',
    desc: 'RAW Studio capture, color grading & asset delivery.',
  },
  {
    name: 'Video Production Pipeline',
    icon: <VideocamIcon sx={{ color: '#D4AF37' }} />,
    status: 'Rendering v2.0',
    statusColor: 'warning',
    latency: '42ms',
    uptime: '98.5%',
    desc: '4K/8K Cinema rendering & multi-cam editing node.',
  },
  {
    name: 'Podcast Engineering Suite',
    icon: <MicIcon sx={{ color: '#D4AF37' }} />,
    status: 'Operational',
    statusColor: 'success',
    latency: '18ms',
    uptime: '99.9%',
    desc: 'Multi-channel audio mastering & broadcast sync.',
  },
  {
    name: 'Generative AI Asset Engine',
    icon: <AutoAwesomeIcon sx={{ color: '#D4AF37' }} />,
    status: 'Model Sync',
    statusColor: 'info',
    latency: '65ms',
    uptime: '99.2%',
    desc: 'LLM Scripting, automated captions & image synthesis.',
  },
  {
    name: 'Client Priority Contact Gateway',
    icon: <SecurityIcon sx={{ color: '#D4AF37' }} />,
    status: 'Active 24/7',
    statusColor: 'success',
    latency: '8ms',
    uptime: '100%',
    desc: 'Secure message routing to executive producers.',
  },
];

const ServiceMatrix = () => {
  return (
    <Box sx={{ width: '100%', my: 3 }} role="region" aria-label="System Service Matrix">
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontSize: '1rem',
          color: '#D4AF37',
          textAlign: 'left',
          mb: 2,
        }}
      >
        ⚡ Live Service Maintenance & Operational Matrix
      </Typography>

      <Grid container spacing={2}>
        {services.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper
              elevation={0}
              onClick={() => playClickSound()}
              tabIndex={0}
              role="article"
              aria-label={`${item.name} status: ${item.status}`}
              sx={{
                p: 2,
                height: '100%',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover, &:focus-visible': {
                  borderColor: '#D4AF37',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.2)',
                  outline: '2px solid #D4AF37',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.icon}
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {item.name}
                  </Typography>
                </Box>
                <Chip
                  label={item.status}
                  color={item.statusColor}
                  size="small"
                  sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 1.5, textAlign: 'left' }}>
                {item.desc}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'text.secondary' }}>
                <span>Latency: <strong>{item.latency}</strong></span>
                <span>Uptime: <strong>{item.uptime}</strong></span>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServiceMatrix;
