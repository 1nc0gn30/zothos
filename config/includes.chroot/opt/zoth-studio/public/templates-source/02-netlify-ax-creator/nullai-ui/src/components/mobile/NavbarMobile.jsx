import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Chip,
  Button,
  useTheme,
} from '@mui/material'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import ShieldIcon from '@mui/icons-material/Security'
import HubIcon from '@mui/icons-material/Hub'
import CodeIcon from '@mui/icons-material/Code'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CloseIcon from '@mui/icons-material/Close'

import { Link as RouterLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../app/AuthProvider'
import { ColorModeContext } from '../../theme/theme'
import { Person } from '@mui/icons-material'
import MemoryIcon from '@mui/icons-material/Memory'

const MotionBox = motion(Box)
const MotionAppBar = motion(AppBar)

export default function NavbarMobile() {
  const theme = useTheme()
  const { toggleColorMode, mode } = useContext(ColorModeContext)
  const { isAuthenticated, tier, signOut } = useAuth()

  const [sheetOpen, setSheetOpen] = useState(false)

  /* ============================
     SCROLL + MANUAL VISIBILITY
  ============================ */
  const lastY = useRef(0)
  const [hidden, setHidden] = useState(false)
  const [locked, setLocked] = useState(false)

  const logoSrc =
  theme.palette.mode === 'dark'
    ? '/NullAI-Logo-NoBG.png'
    : '/NullAI-Logo-LightMode.png' // light-mode-safe version

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
    { to: '/playground', label: 'Playground', icon: <RocketLaunchIcon /> },
    { to: '/neural', label: 'Neural Lab', icon: <MemoryIcon /> },
    { to: '/swarm', label: 'Swarm', icon: <HubIcon /> },
    { to: '/osint', label: 'Cyber Tools', icon: <ShieldIcon /> },
    { to: '/nodes', label: 'Nodes', icon: <HubIcon /> },
    { to: '/docs', label: 'Docs', icon: <CodeIcon /> },
    { to: '/profile', label: 'Profile', icon: <Person /> },
  ]

  return (
    <>
      {/* TAB HANDLE (ALWAYS VISIBLE) */}
      <MotionBox
        onClick={() => {
          setHidden((h) => !h)
          setLocked((l) => !l)
        }}
        animate={{
          top: hidden ? 6 : 70,
          rotate: hidden ? 0 : 180,
        }}
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          margin: '0 auto',

          zIndex: theme.zIndex.appBar + 2,
          width: 46,
          height: 24,
          borderRadius: '0 0 14px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(14px)',
          background:
            theme.palette.mode === 'dark'
              ? 'rgba(34,211,238,0.22)'
              : 'rgba(0,0,0,0.12)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 26px rgba(0,0,0,0.6)'
              : '0 8px 22px rgba(0,0,0,0.18)',
        }}
      >
        <KeyboardArrowUpIcon fontSize="small" />
      </MotionBox>

      {/* TOP BAR */}
      <MotionAppBar
        position="fixed"
        elevation={0}
        animate={{ y: hidden ? -96 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        sx={{
          backdropFilter: 'blur(22px)',
          background:
            theme.palette.mode === 'dark'
              ? 'transparent'
              : 'rgba(255,255,255,0.95)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* LOGO */}
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Box
              component="img"
              src={logoSrc}
              sx={{
                height: 34,
                filter:
                  theme.palette.mode === 'dark'
                    ? 'drop-shadow(0 0 14px rgba(34,211,238,0.6))'
                    : 'none',
              }}
            />
            <Typography fontWeight={900}>
              NullAI
            </Typography>
          </Box>

          {/* MENU OPEN */}
          <IconButton onClick={() => setSheetOpen(true)}>
            <Box
              sx={{
                width: 22,
                height: 2,
                background: 'currentColor',
                boxShadow: '0 6px, 0 -6px',
              }}
            />
          </IconButton>
        </Toolbar>
      </MotionAppBar>

      {/* FULLSCREEN SHEET */}
      <AnimatePresence>
        {sheetOpen && (
          <MotionBox
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: theme.zIndex.modal,
              background:
                theme.palette.mode === 'dark'
                  ? 'radial-gradient(circle at top, rgba(34,211,238,0.18), transparent 40%), #06080e'
                  : '#fff',
              display: 'flex',
              flexDirection: 'column',
              px: 3,
              pt: 2,
            }}
          >
            {/* HEADER */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography fontFamily="ui-monospace" fontWeight={900}>
                NullAI
              </Typography>
              <IconButton onClick={() => setSheetOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* NAV */}
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {nav.map((n) => (
                <Button
                  key={n.to}
                  component={RouterLink}
                  to={n.to}
                  startIcon={n.icon}
                  onClick={() => setSheetOpen(false)}
                  sx={{ justifyContent: 'flex-start', fontSize: '1.1rem', fontWeight: 700, color: theme.palette.mode === 'dark' ? 'white' : 'black'}}
                >
                  {n.label}
                </Button>
              ))}
            </Box>

            <Box flex={1} />

            {/* FOOTER */}
            <Box sx={{ pb: 3 }}>
              <Button
                startIcon={mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                onClick={toggleColorMode}
                fullWidth
              >
                Toggle theme
              </Button>

              {isAuthenticated && (
                <Chip
                  label={`${tier.toUpperCase()} TIER`}
                  color={tier === 'free' ? 'default' : 'primary'}
                  sx={{ mt: 2 }}
                />
              )}

              {isAuthenticated ? (
                <Button
                  color="error"
                  onClick={() => {
                    signOut()
                    setSheetOpen(false)
                  }}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Sign out
                </Button>
              ) : (
                <Button component={RouterLink} to="/login" fullWidth sx={{ mt: 2 }}>
                  Sign in
                </Button>
              )}
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  )
}
