// HomeMobile.jsx
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
  Paper,
  useTheme,
} from '@mui/material'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../app/AuthProvider'

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)

export default function HomeMobile() {
  const { isAuthenticated, tier } = useAuth()
  const theme = useTheme()

  return (
    <Box component="main">
      {/* HERO */}
      <Box
        sx={(theme) => ({
          pt: 14,
          pb: 10,
          background:
            theme.palette.mode === 'dark'
              ? `
                radial-gradient(circle at top, rgba(34,211,238,0.28), transparent 60%),
                linear-gradient(180deg, #05070d, #070a12)
              `
              : `
                radial-gradient(circle at top, rgba(25,118,210,0.22), transparent 60%),
                linear-gradient(180deg, #f8fafc, #ffffff)
              `,
        })}
      >
        <Container>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Chip
              label={
                isAuthenticated
                  ? `SIGNED IN · ${tier.toUpperCase()}`
                  : 'LIMITED ACCESS'
              }
              variant="outlined"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.12em',
              }}
            />

            <Typography
              variant="h3"
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

            <Typography color="text.secondary" maxWidth={420}>
              Private inference, OSINT, and developer utilities —
              all running on your VPS.
            </Typography>

            <Stack spacing={2} width="100%">
              <Button
                component={RouterLink}
                to={isAuthenticated ? '/playground' : '/login'}
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  py: 1.3,
                  borderRadius: 999,
                  fontWeight: 800,
                  boxShadow: '0 14px 40px rgba(34,211,238,0.45)',
                }}
              >
                {isAuthenticated ? 'Open playground' : 'Sign up / Log in'}
              </Button>

              <Button
                component={RouterLink}
                to="/pricing"
                variant="outlined"
                size="large"
                fullWidth
                sx={{
                  py: 1.3,
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                View pricing
              </Button>
            </Stack>

            {/* FEATURE CARD */}
            <MotionPaper
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              sx={(theme) => ({
                mt: 1,
                p: 3,
                width: '100%',
                maxWidth: 420,
                borderRadius: 3,
                backdropFilter: 'blur(18px)',
                background:
                  theme.palette.mode === 'dark'
                    ? 'rgba(15,23,42,0.75)'
                    : 'rgba(255,255,255,0.9)',
                border: `1px solid ${theme.palette.divider}`,
              })}
            >
              <Stack spacing={1.5}>
                <Typography fontWeight={800}>
                  Uncensored local LLMs
                </Typography>
                <Typography color="text.secondary">
                  Local inference. No cloud leakage.
                </Typography>
                <Typography fontWeight={800}>
                  OSINT + security tools
                </Typography>
                <Typography color="text.secondary">
                  Recon and analysis in one workspace.
                </Typography>
              </Stack>
            </MotionPaper>
          </Stack>
        </Container>
      </Box>

      {/* PHONE SECTION */}
      <Box
        sx={(theme) => ({
          pt: 10,
          pb: 14,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, #070a12, #05070d)'
              : 'linear-gradient(180deg, #ffffff, #f8fafc)',
        })}
      >
        <Container>
          <Stack spacing={4} alignItems="center">
            <Typography
              variant="h5"
              fontWeight={800}
              textAlign="center"
              sx={{
                letterSpacing: '-0.03em',
              }}
            >
              Use NullAI anywhere
            </Typography>

            <Typography
              color="text.secondary"
              textAlign="center"
              maxWidth={420}
            >
              Full access to playground, tools, and workflows on mobile.
            </Typography>

            <MotionBox
              initial={{ opacity: 0, y: 80, rotate: -6 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <MotionBox
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Box sx={{ position: 'relative', width: 240 }}>
                  {/* SCREEN */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: '6% 6%',
                      borderRadius: 22,
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
                        'drop-shadow(0 30px 90px rgba(0,0,0,0.65))',
                    }}
                  />
                </Box>
              </MotionBox>
            </MotionBox>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
