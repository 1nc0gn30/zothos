import {
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
  alpha,
  Stack,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { OSINT_TOOLS } from '../osint/osintConfig'
import OsintTile from '../osint/OsintTile'
import OsintTabs from '../osint/OsintTabs'
import RadarIcon from '@mui/icons-material/Radar'
import SensorsIcon from '@mui/icons-material/Sensors'

export default function Osint() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [activeTool, setActiveTool] = useState(() => {
    try {
      return localStorage.getItem('nullai.osint.activeTool')
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (activeTool) {
      localStorage.setItem('nullai.osint.activeTool', activeTool)
    } else {
      localStorage.removeItem('nullai.osint.activeTool')
    }
  }, [activeTool])

  // Sync visibility
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible') {
        const saved = localStorage.getItem('nullai.osint.activeTool')
        if (saved) setActiveTool(saved)
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [])

  const ToolComponent = OSINT_TOOLS.find(t => t.id === activeTool)?.component

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100dvh',
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 14 },
        overflow: 'hidden',
        bgcolor: isDark ? '#020408' : '#f8fafc',
      }}
    >
      {/* 1. TACTICAL BACKGROUND OVERLAY */}
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: isDark ? 0.4 : 0.1,
          background: `
            radial-gradient(circle at 2px 2px, ${alpha(theme.palette.primary.main, 0.15)} 1px, transparent 0)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* 2. SCANLINE ANIMATION */}
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02))',
          backgroundSize: '100% 3px, 3px 100%',
          opacity: isDark ? 0.3 : 0.05,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        {!activeTool ? (
          <Box>
            {/* Header with tactical readouts */}
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <RadarIcon color="primary" sx={{ fontSize: 18, animation: 'pulse 2s infinite' }} />
                  <Typography variant="overline" sx={{ letterSpacing: 4, fontWeight: 900, opacity: 0.6 }}>
                    ENCRYPTED NODE // HEXSTRIKE
                  </Typography>
                </Stack>
                
                <Typography
                  variant="h2"
                  fontWeight={900}
                  sx={{
                    letterSpacing: '-0.05em',
                    textTransform: 'uppercase',
                    background: 'linear-gradient(135deg, #fff 0%, #64748b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: isDark ? 'transparent' : 'inherit',
                  }}
                >
                  OSINT <Box component="span" sx={{ color: theme.palette.primary.main }}>Toolkit</Box>
                </Typography>
                
                <Typography color="text.secondary" sx={{ maxWidth: 600, mt: 1, fontWeight: 500 }}>
                  Active reconnaissance & intelligence gathering interface. 
                  Digital signatures minimized. <Box component="span" sx={{ color: 'success.main', fontFamily: 'monospace' }}>[NO_TELEMETRY_DETECTED]</Box>
                </Typography>
              </Box>

              {/* Tactical Status Readout */}
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right', fontFamily: 'monospace', opacity: 0.4 }}>
                <Typography variant="caption" display="block">LAT: 38.8977° N | LON: 77.0365° W</Typography>
                <Typography variant="caption" display="block">SIGNAL: 99.8% | ISO-LEVEL: IV</Typography>
              </Box>
            </Stack>

            {/* Grid with improved spacing */}
            <Grid container spacing={2}>
              {OSINT_TOOLS.map(tool => (
                <Grid item key={tool.id} xs={12} sm={6} md={4} lg={3}>
                  <OsintTile tool={tool} onSelect={setActiveTool} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <>
            {/* Active tool chrome */}
            <OsintTabs
              tools={OSINT_TOOLS}
              active={activeTool}
              onSelect={setActiveTool}
              onBack={() => setActiveTool(null)}
            />

            {/* Tool workspace with "Cyber" frame */}
            <Box
              mt={{ xs: 3, md: 4 }}
              sx={{
                position: 'relative',
                animation: 'toolIn .6s cubic-bezier(.16,1,.3,1)',
                '@keyframes toolIn': {
                  from: { opacity: 0, transform: 'translateY(10px)' },
                  to: { opacity: 1, transform: 'none' },
                },
              }}
            >
              {/* Corner Accents */}
              <Box sx={{ position: 'absolute', top: -1, left: -1, width: 20, height: 20, borderTop: `2px solid ${theme.palette.primary.main}`, borderLeft: `2px solid ${theme.palette.primary.main}`, zIndex: 1 }} />
              <Box sx={{ position: 'absolute', bottom: -1, right: -1, width: 20, height: 20, borderBottom: `2px solid ${theme.palette.primary.main}`, borderRight: `2px solid ${theme.palette.primary.main}`, zIndex: 1 }} />

              <Box
                sx={{
                  p: { xs: 2, md: 4 },
                  borderRadius: 1,
                  background: isDark
                    ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`
                    : '#fff',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                }}
              >
                {/* Header within workspace */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`, pb: 2 }}>
                  <SensorsIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                      {OSINT_TOOLS.find(t => t.id === activeTool)?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.5 }}>
                      MODULE_ID: {activeTool?.toUpperCase()} // STATUS: OPERATIONAL
                    </Typography>
                  </Box>
                </Stack>

                <ToolComponent />
              </Box>
            </Box>
          </>
        )}
      </Container>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Box>
  )
}