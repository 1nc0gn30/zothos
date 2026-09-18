import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MovieIcon from '@mui/icons-material/Movie';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import HeadphoneIcon from '@mui/icons-material/Headphones';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import { playClickSound, playSuccessSound } from '../utils/audioSFX';

const presetTemplates = [
  {
    category: 'Commercial Video',
    icon: <MovieIcon sx={{ mr: 1, color: '#D4AF37' }} />,
    prompt: '4K Commercial Brand Story with Cinematic Lighting & AI Color Grading Pass',
    format: 'ProRes 422 HQ / 60 FPS',
    resolution: '3840 x 2160 (4K UHD)',
    audioSpecs: '24-bit 48kHz Stereo Master',
  },
  {
    category: 'Studio Photography',
    icon: <PhotoCameraIcon sx={{ mr: 1, color: '#D4AF37' }} />,
    prompt: 'High-Fashion Portrait Series with Retouching & HDR Color Calibration',
    format: 'RAW + 16-bit TIFF',
    resolution: '8640 x 5760 (45 MP RAW)',
    audioSpecs: 'N/A',
  },
  {
    category: 'Podcast Production',
    icon: <HeadphoneIcon sx={{ mr: 1, color: '#D4AF37' }} />,
    prompt: 'Multi-host Talk Show Studio Recording with Noise Cancellation & Intro SFX',
    format: 'WAV 24-bit / MP3 320kbps',
    resolution: 'N/A',
    audioSpecs: 'Broadcast Loudness (-14 LUFS)',
  },
  {
    category: 'Brand AI Asset Suite',
    icon: <DesignServicesIcon sx={{ mr: 1, color: '#D4AF37' }} />,
    prompt: 'Vector Logo Motion Graphics & Generative Social Media Promo Kit',
    format: 'SVG / MP4 / WebM',
    resolution: '1080 x 1920 (9:16 Vertical)',
    audioSpecs: 'Custom Synthesized Audio Jingle',
  },
];

const AIAssetSimulator = () => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customPrompt, setCustomPrompt] = useState(presetTemplates[0].prompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSpec, setGeneratedSpec] = useState(null);

  const handleSelectPreset = (idx) => {
    playClickSound();
    setSelectedPreset(idx);
    setCustomPrompt(presetTemplates[idx].prompt);
    setGeneratedSpec(null);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    playClickSound();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      playSuccessSound();
      const current = presetTemplates[selectedPreset];
      setGeneratedSpec({
        id: `DESEO-AI-${Math.floor(100000 + Math.random() * 900000)}`,
        category: current.category,
        prompt: customPrompt || current.prompt,
        format: current.format,
        resolution: current.resolution,
        audioSpecs: current.audioSpecs,
        timestamp: new Date().toLocaleTimeString(),
        estimatedDelivery: '24-48 Hours Post-Maintenance',
        renderScore: '99.4% Optimization Index',
      });
    }, 1200);
  };

  return (
    <Box
      sx={{ width: '100%', my: 3 }}
      role="region"
      aria-label="AI Asset & Production Simulator Playground"
    >
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
        🎨 Interactive Media Production & AI Spec Generator
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
          Select a project category below or enter your vision to preview technical production specifications and AI workflow pipeline metrics.
        </Typography>

        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {presetTemplates.map((preset, idx) => (
            <Grid item xs={6} sm={3} key={idx}>
              <Button
                fullWidth
                variant={selectedPreset === idx ? 'contained' : 'outlined'}
                onClick={() => handleSelectPreset(idx)}
                sx={{
                  py: 1,
                  px: 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  backgroundColor: selectedPreset === idx ? '#D4AF37' : 'transparent',
                  color: selectedPreset === idx ? '#111' : '#D4AF37',
                  borderColor: '#D4AF37',
                  '&:hover': {
                    backgroundColor: selectedPreset === idx ? '#b89528' : 'rgba(212, 175, 55, 0.1)',
                    borderColor: '#D4AF37',
                  },
                }}
              >
                {preset.category}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Box component="form" onSubmit={handleGenerate} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="Media Concept & Technical Directives"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                variant="outlined"
                size="small"
                inputProps={{
                  'aria-label': 'Media Concept & Technical Directives',
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
                    '&:hover fieldset': { borderColor: '#D4AF37' },
                    '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isGenerating}
                startIcon={
                  isGenerating ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />
                }
                sx={{
                  height: '100%',
                  minHeight: '40px',
                  backgroundColor: '#D4AF37',
                  color: '#111',
                  fontWeight: 700,
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: '#000',
                  },
                }}
              >
                {isGenerating ? 'Synthesizing...' : 'Generate Spec Sheet'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {generatedSpec && (
          <Box
            sx={{ mt: 3, pt: 2, borderTop: '1px dashed rgba(212, 175, 55, 0.3)' }}
            aria-live="polite"
          >
            <Alert
              severity="success"
              icon={<AutoAwesomeIcon sx={{ color: '#D4AF37' }} />}
              sx={{
                background: 'rgba(212, 175, 55, 0.08)',
                color: 'text.primary',
                border: '1px solid #D4AF37',
                borderRadius: '12px',
                textAlign: 'left',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#D4AF37' }}>
                ✅ AI Production Specification Generated [{generatedSpec.id}]
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1, fontSize: '0.825rem' }}>
                <Grid item xs={12} sm={6}>
                  <strong>Category:</strong> {generatedSpec.category}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <strong>Output Format:</strong> {generatedSpec.format}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <strong>Master Resolution:</strong> {generatedSpec.resolution}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <strong>Audio Master Specs:</strong> {generatedSpec.audioSpecs}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <strong>Pipeline Index:</strong> {generatedSpec.renderScore}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <strong>Target Turnaround:</strong> {generatedSpec.estimatedDelivery}
                </Grid>
              </Grid>
            </Alert>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AIAssetSimulator;
