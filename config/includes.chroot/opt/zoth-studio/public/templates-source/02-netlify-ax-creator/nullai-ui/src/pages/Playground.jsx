import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  Container,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../app/AuthProvider'
import PlaygroundChat from '../components/PlaygroundChat'
import { useNavigate } from 'react-router-dom' // Changed to useNavigate for cleaner handling

import BoltIcon from '@mui/icons-material/Bolt'
import SecurityIcon from '@mui/icons-material/Security'
import TuneIcon from '@mui/icons-material/Tune'
import CloseIcon from '@mui/icons-material/Close'
import TerminalIcon from '@mui/icons-material/Terminal'
import HubIcon from '@mui/icons-material/Hub'
import MemoryIcon from '@mui/icons-material/Memory'

export default function Playground() {
  const { profile } = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()
  const isDark = theme.palette.mode === 'dark'
  const tier = (profile?.tier ?? 'standard').toUpperCase()

  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('nullai.playground.mode')
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (mode) localStorage.setItem('nullai.playground.mode', mode)
    else localStorage.removeItem('nullai.playground.mode')
  }, [mode])

  const menuItems = [
    {
      id: 'chat',
      title: 'Chat Playground',
      desc: 'Neural reasoning, advanced coding & generation',
      icon: <BoltIcon fontSize="large" />,
      color: theme.palette.primary.main,
      action: () => setMode('chat'),
    },
    {
      id: 'neural',
      title: 'Neural Weights & Latency Lab',
      desc: 'Neuron activation canvas, latency benchmarker, temperature/top_p comparator',
      icon: <MemoryIcon fontSize="large" />,
      color: '#00f0ff',
      action: () => navigate('/neural'),
    },
    {
      id: 'osint',
      title: 'OSINT / HexStrike',
      desc: 'Active reconnaissance & digital intel scanning',
      icon: <SecurityIcon fontSize="large" />,
      color: theme.palette.error.main,
      action: () => navigate('/osint'),
    },
  ]

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* GLOBAL BACKGROUND - Stayed the same but ensures zIndex layering */}
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: isDark
            ? `radial-gradient(900px circle at 15% 15%, ${alpha(theme.palette.primary.main, 0.15)}, transparent),
               radial-gradient(800px circle at 85% 85%, ${alpha(theme.palette.secondary.main, 0.1)}, transparent),
               #020409`
            : `radial-gradient(1000px circle at 15% 10%, ${alpha(theme.palette.primary.main, 0.05)}, transparent),
               #f8fafc`,
        }}
      />

      {/* HEADER */}
      <Box sx={{ position: 'relative', zIndex: 10, pt: { xs: 8, md: 10 }, pb: 4 }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <TerminalIcon color="primary" />
              </Box>
              <Box>
                <Typography variant="overline" sx={{ opacity: 0.5, letterSpacing: 4, fontWeight: 800, display: 'block', lineHeight: 1 }}>
                  NULLAI SYSTEM
                </Typography>
                <Typography variant="h4" fontWeight={900} sx={{ textTransform: 'uppercase', letterSpacing: -0.5 }}>
                  Playground
                </Typography>
              </Box>
            </Stack>

            <Chip
              icon={<HubIcon style={{ fontSize: 16 }} />}
              label={`${tier} NODE`}
              sx={{
                fontWeight: 900,
                borderRadius: '8px',
                px: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                fontFamily: 'monospace',
                color: theme.palette.primary.main,
              }}
            />
          </Stack>
        </Container>
      </Box>

      {/* CONTENT */}
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {!mode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <Container maxWidth="md" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                  {menuItems.map((item) => (
                    <Grid item xs={12} md={6} key={item.id}>
                      <Paper
                        onClick={item.action}
                        sx={{
                          p: 5,
                          height: '100%',
                          borderRadius: '24px',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          background: isDark 
                            ? alpha(theme.palette.background.paper, 0.4) 
                            : '#fff',
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${alpha(item.color, 0.2)}`,
                          textDecoration: 'none', // Critical for Link if used
                          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            borderColor: alpha(item.color, 0.6),
                            boxShadow: `0 20px 60px ${alpha(item.color, 0.15)}`,
                            '& .icon-box': {
                              transform: 'scale(1.1) rotate(-5deg)',
                              bgcolor: alpha(item.color, 0.2),
                            }
                          },
                        }}
                      >
                        <Stack spacing={4}>
                          <Box
                            className="icon-box"
                            sx={{
                              width: 70,
                              height: 70,
                              borderRadius: '16px',
                              display: 'grid',
                              placeItems: 'center',
                              bgcolor: alpha(item.color, 0.1),
                              color: item.color,
                              transition: 'all 0.3s ease',
                              border: `1px solid ${alpha(item.color, 0.2)}`,
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Box>
                            <Typography variant="h5" fontWeight={900} gutterBottom>
                              {item.title}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.6, lineHeight: 1.6 }}>
                              {item.desc}
                            </Typography>
                          </Box>
                        </Stack>
                        
                        {/* Decorative background glow for the card */}
                        <Box sx={{
                          position: 'absolute',
                          bottom: -20,
                          right: -20,
                          width: 100,
                          height: 100,
                          background: item.color,
                          filter: 'blur(60px)',
                          opacity: 0.1,
                          pointerEvents: 'none'
                        }} />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </motion.div>
          )}

          {mode === 'chat' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ minHeight: '70vh' }}
            >
              <PlaygroundChat />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* ACTION DOCK */}
      {mode && (
  <Box
    sx={{
      position: 'relative',
      zIndex: 20,
      mt: 6,
      pb: 6,          // 👈 breathing room below
      display: 'flex',
      justifyContent: 'center',
    }}
  >

          <Paper
            elevation={0}
            sx={{
              px: 2,
              py: 1,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backdropFilter: 'blur(30px)',
              background: alpha(isDark ? '#0b1020' : '#fff', 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            }}
          >
            <IconButton 
              onClick={() => setMode(null)} 
              sx={{ color: theme.palette.error.main, '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) } }}
            >
              <CloseIcon />
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, alignSelf: 'center' }} />

            {[BoltIcon, SecurityIcon, TuneIcon, InsightsIcon].map((Icon, i) => (
              <IconButton 
                key={i} 
                sx={{ 
                  color: i === 0 ? 'primary.main' : 'text.secondary',
                  '&:hover': { color: 'primary.main' } 
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Paper>
        </Box>
      )}
    </Box>
  )
}