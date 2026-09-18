// HomeDesktop.jsx
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  Paper,
  Grid,
  useTheme,
} from '@mui/material'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../app/AuthProvider'

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)

export default function HomeDesktop() {
  const { isAuthenticated, tier } = useAuth()
  const theme = useTheme()

  return (
    <Box component="main">
      <Box
        sx={(theme) => ({
          pt: 22,
          pb: 18,
          position: 'relative',
          overflow: 'hidden',
          background:
            theme.palette.mode === 'dark'
              ? `
                radial-gradient(circle at 15% -20%, rgba(34,211,238,0.35), transparent 45%),
                radial-gradient(circle at 85% 120%, rgba(99,102,241,0.25), transparent 55%),
                linear-gradient(180deg, #05070d 0%, #070a12 100%)
              `
              : `
                radial-gradient(circle at 15% -20%, rgba(25,118,210,0.25), transparent 45%),
                radial-gradient(circle at 85% 120%, rgba(99,102,241,0.18), transparent 55%),
                linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)
              `,
        })}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={8} alignItems="center">
            {/* LEFT */}
            <Grid xs={12} md={7}>
              <Stack spacing={4}>
                <Chip
                  label={
                    isAuthenticated
                      ? `SIGNED IN · ${tier.toUpperCase()}`
                      : 'LIMITED ACCESS'
                  }
                  variant="outlined"
                  sx={{
                    width: 'fit-content',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                  }}
                />

                <Typography
                  variant="h1"
                  fontWeight={900}
                  sx={{
                    letterSpacing: '-0.06em',
                    lineHeight: 1.05,
                    background:
                    theme.palette.mode === 'dark' ?
                      'linear-gradient(90deg,#e5f9ff 0%,#22d3ee 40%,#818cf8 100%)' : 'linear-gradient(90deg,#818cf8 0%,#22d3ee 40%,#818cf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  NullAI
                  <br />
                  Local-first AI
                  <br />
                  & operator tooling
                </Typography>

                <Typography variant="h6" color="text.secondary" maxWidth={620}>
                  Private inference, cyber-grade utilities, and developer workflows —
                  all executed on your VPS. No cloud exposure. No telemetry.
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button
                    component={RouterLink}
                    to={isAuthenticated ? '/playground' : '/login'}
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4.5,
                      py: 1.4,
                      borderRadius: 999,
                      fontWeight: 800,
                      boxShadow: '0 20px 60px rgba(34,211,238,0.45)',
                    }}
                  >
                    {isAuthenticated ? 'Open playground' : 'Sign up / Log in'}
                  </Button>

                  <Button
                    component={RouterLink}
                    to="/pricing"
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4.5,
                      py: 1.4,
                      borderRadius: 999,
                      fontWeight: 700,
                    }}
                  >
                    View pricing
                  </Button>
                </Stack>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ letterSpacing: '0.18em' }}
                >
                  NO CLOUD · NO TRACKING · BUILT FOR OPERATORS
                </Typography>
              </Stack>
            </Grid>

            {/* RIGHT INFO CARD */}
            <Grid xs={12} md={5}>
              <MotionPaper
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                sx={(theme) => ({
                  p: 4,
                  borderRadius: 4,
                  backdropFilter: 'blur(24px)',
                  background:
                    theme.palette.mode === 'dark'
                      ? 'rgba(15,23,42,0.65)'
                      : 'rgba(255,255,255,0.85)',
                  border: `1px solid ${theme.palette.divider}`,
                })}
              >
                <Stack spacing={2.5}>
                  <Typography variant="overline" color="text.secondary">
                    PLATFORM CAPABILITIES
                  </Typography>
                  <Typography fontWeight={800}>Uncensored local LLMs</Typography>
                  <Typography color="text.secondary">
                    LocalAI models on the same VPS. Zero third-party inference.
                  </Typography>
                  <Divider />
                  <Typography fontWeight={800}>OSINT + security tooling</Typography>
                  <Typography color="text.secondary">
                    Recon, scanning, enrichment, pivots, analyst workflows.
                  </Typography>
                </Stack>
              </MotionPaper>
            </Grid>
          </Grid>
        </Container>

        {/* IPHONE MOCKUP */}
        <MotionBox
          initial={{ opacity: 0, y: 140, rotate: -6 }}
          whileInView={{ opacity: 1, y: 0, rotate: -2 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          sx={{
            position: 'absolute',
            bottom: -140,
            right: 120,
            display: { xs: 'none', md: 'block' },
            zIndex: 3,
          }}
        >
          <MotionBox
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 300,
              }}
            >
              {/* SCREEN */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: '6% 6%',
                  borderRadius: 24,
                  overflow: 'hidden',
                  background: '#000',
                }}
              >
                <iframe
                  src="/playground"
                  title="NullAI mobile"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </Box>

              {/* FRAME */}
              <Box
                component="img"
                src="/nullai-mockup.png"
                alt="iPhone mockup"
                sx={{
                  width: '100%',
                  display: 'block',
                  filter:
                    'drop-shadow(0 40px 120px rgba(0,0,0,0.65))',
                }}
              />
            </Box>
          </MotionBox>
        </MotionBox>
      </Box>
    </Box>
  )
}
