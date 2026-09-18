import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Chip,
  Button,
  useTheme,
  alpha,
  Stack,
  Divider,
} from '@mui/material'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import CodeIcon from '@mui/icons-material/Code'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CloseIcon from '@mui/icons-material/Close'

import { Link as RouterLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../app/AuthProvider'
import { ColorModeContext } from '../../theme/theme'

const MotionBox = motion(Box)
const MotionAppBar = motion(AppBar)

export default function NavbarMobile() {
  const theme = useTheme()
  const location = useLocation()
  const { toggleColorMode, mode } = useContext(ColorModeContext)
  const { tier } = useAuth()

  const [sheetOpen, setSheetOpen] = useState(false)
  const lastY = useRef(0)
  const [hidden, setHidden] = useState(false)
  const [locked, setLocked] = useState(false)

  const logoSrc = '/DarkMode-NullAI-Icon.png'

  useEffect(() => {
    if (locked) return
    const onScroll = () => {
      const y = window.scrollY
      if (y < 60) setHidden(false)
      else if (y > lastY.current + 8) setHidden(true)
      else if (y < lastY.current - 8) setHidden(false)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [locked])

  const nav = [
    { to: '/', label: 'Home', icon: <RocketLaunchIcon sx={{ fontSize: 20 }} /> },
    { to: '/studio', label: 'Zoth', icon: <RocketLaunchIcon sx={{ fontSize: 20 }} /> },
    { to: '/tools', label: 'Tools', icon: <CodeIcon sx={{ fontSize: 20 }} /> },
  ]

  return (
    <>
      {/* HUD TAB HANDLE */}
      <MotionBox
        onClick={() => {
          setHidden((h) => !h)
          setLocked((l) => !l)
        }}
        animate={{
          top: hidden ? 0 : 70,
          rotate: hidden ? 0 : 180,
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          margin: '0 auto',
          zIndex: theme.zIndex.appBar + 2,
          width: 50,
          height: 20,
          borderRadius: '0 0 10px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(20px)',
          background: alpha(theme.palette.primary.main, 0.2),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          borderTop: 'none',
        }}
      >
        <KeyboardArrowUpIcon sx={{ fontSize: 16, color: 'primary.main' }} />
      </MotionBox>

      {/* TOP BAR */}
      <MotionAppBar
        position="fixed"
        elevation={0}
        animate={{ y: hidden ? -96 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        sx={{
          backdropFilter: 'blur(28px)',
          background: theme.palette.mode === 'dark' 
            ? alpha('#05070d', 0.8) 
            : alpha('#ffffff', 0.95),
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}>
            <Box component="img" src={logoSrc} alt="Ghost Byte, the NullAI mark" sx={{ height: 32, filter: theme.palette.mode === 'dark' ? 'drop-shadow(0 0 8px cyan)' : 'none' }} />
            <Box>
              <Typography fontWeight={950} sx={{ fontFamily: 'monospace', letterSpacing: -0.5, color: 'text.primary', lineHeight: 1 }}>
                NULL<span style={{ color: theme.palette.primary.main }}>AI</span>
              </Typography>
              <Typography sx={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.12em', color: 'text.secondary', textTransform: 'uppercase' }}>
                creator of Zoth
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={() => setSheetOpen(true)} sx={{ color: 'primary.main' }}>
            <Box sx={{ width: 20, height: 2, background: 'currentColor', boxShadow: '0 6px, 0 -6px' }} />
          </IconButton>
        </Toolbar>
      </MotionAppBar>

      {/* FULLSCREEN HUD SHEET */}
      <AnimatePresence>
        {sheetOpen && (
          <MotionBox
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'circOut' }}
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: theme.zIndex.modal,
              background: theme.palette.mode === 'dark'
                ? `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.1)}, transparent), #05070d`
                : '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              p: 3,
              pb: 15, // High padding value to clear the FooterBar
              overflowY: 'auto'
            }}
          >
            {/* SHEET SCANLINES */}
            <Box sx={{ 
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
              backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, ${theme.palette.success.main} 50%)`,
              backgroundSize: '100% 4px', zIndex: 0,
            }} />

            {/* HEADER */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
              <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary.main', letterSpacing: 2 }}>
                // NODE_MENU
              </Typography>
              <IconButton onClick={() => setSheetOpen(false)} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Divider sx={{ my: 3, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

            {/* NAV LIST */}
            <Stack spacing={1} sx={{ position: 'relative', zIndex: 1 }}>
              {nav.map((n) => {
                const active = location.pathname === n.to
                return (
                  <Button
                    key={n.to}
                    component={RouterLink}
                    to={n.to}
                    startIcon={n.icon}
                    onClick={() => setSheetOpen(false)}
                    sx={{
                      justifyContent: 'flex-start',
                      fontSize: '1.2rem',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      py: 2,
                      px: 2,
                      borderRadius: 1,
                      color: active ? 'primary.main' : alpha(theme.palette.text.primary, 0.6),
                      bgcolor: active ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                      border: active ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : '1px solid transparent',
                    }}
                  >
                    {n.label}
                  </Button>
                )
              })}
            </Stack>

            <Box flex={1} />

            {/* FOOTER CONTROLS */}
            <Stack spacing={2} sx={{ pb: 2, position: 'relative', zIndex: 1 }}>
              <Button
                variant="outlined"
                startIcon={mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                onClick={toggleColorMode}
                fullWidth
                sx={{ fontFamily: 'monospace', fontWeight: 900, py: 1.5 }}
              >
                SWAP_INTERFACE
              </Button>

              <Chip
                label={`OP_LEVEL: ${tier.toUpperCase()}`}
                variant="outlined"
                sx={{ 
                  fontFamily: 'monospace', fontWeight: 900, borderRadius: 1, 
                  color: 'primary.main', borderColor: alpha(theme.palette.primary.main, 0.3) 
                }}
              />

            </Stack>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  )
}
