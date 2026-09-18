import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'

const GHOST = '/DarkMode-NullAI-Icon.png'
const ZOTH = 'https://zoth.nealfrazier.tech/'

export default function Studio() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box component="main" id="main-content" sx={{ bgcolor: 'background.default', minHeight: '100svh' }}>
      <Box
        component="section"
        sx={{
          minHeight: '100svh',
          pt: { xs: 14, md: 18 },
          pb: 10,
          px: { xs: 3, md: 8, lg: 12 },
          position: 'relative',
          overflow: 'hidden',
          background: isDark
            ? `radial-gradient(ellipse 60% 70% at 80% 20%, ${alpha('#7c3aed', 0.24)}, transparent 55%), #05070d`
            : `radial-gradient(ellipse 60% 70% at 80% 20%, ${alpha('#00d5ff', 0.14)}, transparent 55%), #f6f8fc`,
        }}
      >
        <Box
          component="img"
          src={GHOST}
          alt="Ghost Byte, the NullAI mark"
          sx={{
            position: 'absolute',
            right: { xs: '-18%', md: '2%' },
            top: { xs: 72, md: 80 },
            width: { xs: 220, md: 420 },
            opacity: { xs: 0.28, md: 1 },
            pointerEvents: 'none',
            filter: isDark ? 'drop-shadow(0 0 40px rgba(0,213,255,0.3))' : 'none',
          }}
        />

        <Container maxWidth="md" disableGutters sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
            <Box component="img" src={GHOST} alt="Ghost Byte, the NullAI mark" sx={{ width: 22, height: 22 }} />
            <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', letterSpacing: '0.24em', fontSize: 12 }}>
              NULLAI / PRODUCT
            </Typography>
          </Stack>
          <Typography component="h1" sx={{ fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95, fontSize: { xs: '2.6rem', md: '4.4rem' }, textTransform: 'uppercase', mb: 2 }}>
            Zoth Studio
          </Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 520, fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.55, mb: 4 }}>
            The local-first agent deck NullAI built. Chat, pets, vault, GitHub and Drive — on your machine. Ghost Byte stays here.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button href={ZOTH} variant="contained" sx={{ py: 1.5, px: 3, borderRadius: 0, fontWeight: 800, bgcolor: 'primary.main', color: '#041016' }}>
              Open the hub
            </Button>
            <Button component={RouterLink} to="/tools" variant="outlined" sx={{ py: 1.5, px: 3, borderRadius: 0, fontWeight: 800, borderColor: 'text.primary', color: 'text.primary' }}>
              Operator tools
            </Button>
          </Stack>
        </Container>
      </Box>

      <Box component="section" sx={{ px: { xs: 3, md: 8, lg: 12 }, py: { xs: 8, md: 12 }, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container maxWidth="lg" disableGutters>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
            <Box component="img" src={GHOST} alt="Ghost Byte, the NullAI mark" sx={{ width: 22, height: 22 }} />
            <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', letterSpacing: '0.22em', fontSize: 12 }}>
              SURFACES
            </Typography>
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 5, maxWidth: 640 }}>
            Same three doors. Ghost Byte stays the mark.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 2, md: 3 },
            }}
          >
            {[
              ['01', 'Deck', 'Loopback :8484. Pets, connectors, Generate only when you ask for a site.', ZOTH + 'studio/'],
              ['02', 'Vault', 'Encrypted keys on this machine. Optional Rust daemon. No cloud KMS.', ZOTH + 'vault/'],
              ['03', 'Pets', 'Public hangar. Engage stays on the private deck.', ZOTH + 'pets/'],
              ['04', 'Ghost Byte', 'The NullAI mark. Not replaced. Zoth wears its own seal.', '/'],
            ].map(([n, title, copy, href]) => (
              <Box
                key={title}
                component={href === '/' ? RouterLink : 'a'}
                to={href === '/' ? '/' : undefined}
                href={href === '/' ? undefined : href}
                sx={{
                  display: 'block',
                  p: { xs: 2.5, md: 3 },
                  textDecoration: 'none',
                  color: 'inherit',
                  border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                  background: isDark ? alpha('#7c3aed', 0.05) : alpha('#00d5ff', 0.05),
                  '&:hover': {
                    borderColor: 'primary.main',
                    background: isDark ? alpha('#7c3aed', 0.1) : alpha('#00d5ff', 0.1),
                  },
                }}
              >
                <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', fontSize: 11, letterSpacing: '0.16em', mb: 1 }}>
                  {n}
                </Typography>
                <Typography sx={{ fontWeight: 800, mb: 1 }}>{title}</Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{copy}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
