import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'

const MotionBox = motion.create(Box)
const GHOST = '/DarkMode-NullAI-Icon.png'
const ZOTH = 'https://zoth.nealfrazier.tech/'

export default function HomeMobile() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box component="main" id="main-content" sx={{ bgcolor: 'background.default' }}>
      <Box
        component="section"
        sx={{
          minHeight: '100svh',
          pt: 12,
          pb: 8,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          overflow: 'hidden',
          background: isDark
            ? `radial-gradient(circle at 50% 18%, ${alpha('#7c3aed', 0.28)}, transparent 50%), #05070d`
            : `radial-gradient(circle at 50% 18%, ${alpha('#00d5ff', 0.16)}, transparent 50%), #f6f8fc`,
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          sx={{ position: 'absolute', top: 72, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}
        >
          <Box
            component="img"
            src={GHOST}
            alt="Ghost Byte, the NullAI mark"
            sx={{
              width: 'min(72vw, 280px)',
              filter: isDark ? 'drop-shadow(0 0 28px rgba(0,213,255,0.4))' : 'none',
            }}
          />
        </MotionBox>

        <Stack spacing={2} sx={{ position: 'relative', zIndex: 1, pt: 28 }}>
          <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', letterSpacing: '0.24em', fontSize: 11 }}>
            NULLAI
          </Typography>
          <Typography component="h1" sx={{ fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95, fontSize: '2.6rem', textTransform: 'uppercase' }}>
            Creator of
            <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
              Zoth Studio
            </Box>
          </Typography>
          <Typography sx={{ color: 'text.secondary', lineHeight: 1.55 }}>
            Ghost Byte’s house. Local-first agent deck. Keys stay on your machine.
          </Typography>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Button href={ZOTH} variant="contained" fullWidth sx={{ py: 1.6, borderRadius: 0, fontWeight: 800, bgcolor: 'primary.main', color: '#041016' }}>
              Open Zoth
            </Button>
            <Button component={RouterLink} to="/studio" variant="outlined" fullWidth sx={{ py: 1.6, borderRadius: 0, fontWeight: 800, borderColor: 'text.primary', color: 'text.primary' }}>
              How we built it
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box id="studio" component="section" sx={{ px: 3, py: 8 }}>
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.5 }}>
          <Box component="img" src={GHOST} alt="Ghost Byte, the NullAI mark" sx={{ width: 22, height: 22 }} />
          <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', letterSpacing: '0.2em', fontSize: 11 }}>
            THE PRODUCT
          </Typography>
        </Stack>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 4 }}>
          Zoth is the studio. NullAI is who made it.
        </Typography>
        <Stack spacing={1.5}>
          {[
            ['01', 'Local deck', 'Chat, pets, GitHub and Drive on loopback. Tokens never leave the PC.'],
            ['02', 'Public hub', 'Landing and hangar under this brand. Hostinger is the planned host.'],
            ['03', 'Ghost Byte', 'This ghost stays the NullAI logo. Zoth has its own seal.'],
          ].map(([n, title, copy]) => (
            <Box
              key={title}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                background: isDark ? alpha('#7c3aed', 0.05) : alpha('#00d5ff', 0.05),
              }}
            >
              <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', fontSize: 10, letterSpacing: '0.16em' }}>
                {n}
              </Typography>
              <Typography sx={{ fontWeight: 800, mt: 0.6 }}>{title}</Typography>
              <Typography sx={{ color: 'text.secondary', mt: 0.6 }}>{copy}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box
        component="section"
        sx={{
          px: 3,
          py: 8,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: isDark ? '#020408' : '#eef2f7',
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.5 }}>
          <Box component="img" src={GHOST} alt="Ghost Byte, the NullAI mark" sx={{ width: 22, height: 22 }} />
          <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', letterSpacing: '0.2em', fontSize: 11 }}>
            STILL HERE
          </Typography>
        </Stack>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5 }}>
          Operator tools stay on NullAI.
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.55 }}>
          Feed, nodes, and the repo index sit beside Zoth. Ghost Byte stays the mark.
        </Typography>
        <Button component={RouterLink} to="/tools" variant="contained" fullWidth sx={{ py: 1.6, borderRadius: 0, fontWeight: 800, bgcolor: 'text.primary', color: 'background.paper' }}>
          Open tools
        </Button>
      </Box>
    </Box>
  )
}
