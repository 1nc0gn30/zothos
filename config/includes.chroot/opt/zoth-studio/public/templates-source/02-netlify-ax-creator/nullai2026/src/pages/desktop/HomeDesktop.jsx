import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'

const MotionBox = motion.create(Box)
const GHOST = '/DarkMode-NullAI-Icon.png'
const ZOTH = 'https://zoth.nealfrazier.tech/'

export default function HomeDesktop() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { scrollY } = useScroll()
  const ghostY = useTransform(scrollY, [0, 600], [0, 80])
  const ghostScale = useTransform(scrollY, [0, 600], [1, 1.06])

  return (
    <Box component="main" id="main-content" sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        component="section"
        aria-label="Hero"
        sx={{
          position: 'relative',
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
          background: isDark
            ? `radial-gradient(ellipse 70% 80% at 72% 40%, ${alpha('#7c3aed', 0.22)}, transparent 55%), #05070d`
            : `radial-gradient(ellipse 70% 80% at 72% 40%, ${alpha('#00d5ff', 0.12)}, transparent 55%), #f6f8fc`,
        }}
      >
        <MotionBox
          style={{ y: ghostY, scale: ghostScale }}
          sx={{
            position: 'absolute',
            right: { md: '-4%', lg: '2%' },
            top: { md: '8%', lg: '4%' },
            width: { md: '52vw', lg: '46vw' },
            maxWidth: 720,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <Box
            component="img"
            src={GHOST}
            alt="Ghost Byte, the NullAI mark"
            sx={{
              width: '100%',
              height: 'auto',
              filter: isDark
                ? 'drop-shadow(0 0 48px rgba(0,213,255,0.35))'
                : 'drop-shadow(0 24px 40px rgba(15,23,42,0.18))',
            }}
          />
        </MotionBox>

        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 2, px: { md: 8, lg: 12 }, pb: 10, pt: 18 }}>
          <Stack spacing={3} sx={{ maxWidth: 560 }}>
            <Typography
              component="p"
              sx={{
                m: 0,
                fontFamily: 'monospace',
                letterSpacing: '0.28em',
                fontSize: 12,
                fontWeight: 700,
                color: 'primary.main',
                textTransform: 'uppercase',
              }}
            >
              NullAI
            </Typography>
            <Typography
              component="h1"
              sx={{
                m: 0,
                fontWeight: 900,
                letterSpacing: '-0.045em',
                lineHeight: 0.92,
                fontSize: { md: '4.4rem', lg: '5.4rem' },
                textTransform: 'uppercase',
              }}
            >
              Creator of
              <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                Zoth Studio
              </Box>
            </Typography>
            <Typography sx={{ maxWidth: 440, color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.55 }}>
              Ghost Byte’s house. We build the local-first agent deck — pets, vault, connectors — and ship it from this domain.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
              <Button
                href={ZOTH}
                variant="contained"
                size="large"
                sx={{
                  px: 3.5,
                  py: 1.4,
                  borderRadius: 0,
                  fontWeight: 800,
                  bgcolor: 'primary.main',
                  color: '#041016',
                  '&:hover': { bgcolor: '#67e8f9' },
                }}
              >
                Open Zoth
              </Button>
              <Button
                component={RouterLink}
                to="/studio"
                variant="outlined"
                size="large"
                sx={{ px: 3.5, py: 1.4, borderRadius: 0, fontWeight: 800, borderColor: 'text.primary', color: 'text.primary' }}
              >
                How we built it
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box id="studio" component="section" sx={{ py: { md: 12, lg: 16 }, px: { md: 8, lg: 12 } }}>
        <Container maxWidth="lg" disableGutters>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
            <Box component="img" src={GHOST} alt="Ghost Byte, the NullAI mark" sx={{ width: 22, height: 22 }} />
            <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', letterSpacing: '0.22em', fontSize: 12 }}>
              THE PRODUCT
            </Typography>
          </Stack>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.03em', maxWidth: 720, mb: 6 }}>
            Zoth is the studio. NullAI is who made it.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: { md: 6, lg: 10 },
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              pt: 5,
            }}
          >
            {[
              ['01', 'Local deck', 'Chat, pets, GitHub and Drive tools on 127.0.0.1:8484. Keys stay on the machine.'],
              ['02', 'Public hub', 'Landing, hangar, and vault UI. Lives on this brand; Hostinger is the planned host.'],
              ['03', 'Ghost Byte', 'The NullAI mark. Not replaced. Zoth wears its own seal; we remain the ghost.'],
            ].map(([n, title, copy]) => (
              <Box
                key={title}
                sx={{
                  p: 2.5,
                  border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                  background: isDark ? alpha('#7c3aed', 0.04) : alpha('#00d5ff', 0.04),
                  transition: 'border-color 0.25s ease, transform 0.2s ease',
                  '&:hover': {
                    borderColor: isDark ? alpha('#22d3ee', 0.45) : alpha('#7c3aed', 0.4),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', fontSize: 11, letterSpacing: '0.16em', mb: 1 }}>
                  {n}
                </Typography>
                <Typography sx={{ fontWeight: 800, mb: 1.2 }}>{title}</Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{copy}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{
          py: 12,
          px: { md: 8, lg: 12 },
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          bgcolor: isDark ? '#020408' : '#eef2f7',
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Stack direction={{ md: 'row' }} spacing={6} alignItems="flex-end" justifyContent="space-between">
            <Box sx={{ maxWidth: 520 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Box component="img" src={GHOST} alt="Ghost Byte, the NullAI mark" sx={{ width: 28, height: 28 }} />
                <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', letterSpacing: '0.22em', fontSize: 12 }}>
                  STILL HERE
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
                Operator tools stay on NullAI.
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                The feed, nodes, and repo index remain. They sit beside Zoth — they are not the headline anymore.
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to="/tools"
              variant="contained"
              sx={{ borderRadius: 0, px: 4, py: 1.6, fontWeight: 800, bgcolor: 'text.primary', color: 'background.paper' }}
            >
              Open tools
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
