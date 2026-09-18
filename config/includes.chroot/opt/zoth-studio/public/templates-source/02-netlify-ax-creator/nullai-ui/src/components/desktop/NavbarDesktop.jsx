import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import HubIcon from '@mui/icons-material/Hub'
import GroupsIcon from '@mui/icons-material/Groups'
import ShieldIcon from '@mui/icons-material/Security'
import CodeIcon from '@mui/icons-material/Code'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import { useContext, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../app/AuthProvider'
import { ColorModeContext } from '../../theme/theme'
import { Person } from '@mui/icons-material'
import MemoryIcon from '@mui/icons-material/Memory'

const MotionAppBar = motion(AppBar)
const MotionBox = motion(Box)
const MotionButton = motion(Button)



export default function NavbarDesktop() {
  const theme = useTheme()
  const location = useLocation()
  const { toggleColorMode, mode } = useContext(ColorModeContext)
  const { isAuthenticated, tier, signOut } = useAuth()

  /* ============================
     SCROLL + MANUAL VISIBILITY
  ============================ */
  const lastScrollY = useRef(0)
  const [hidden, setHidden] = useState(false)
  const [lockedOpen, setLockedOpen] = useState(false)

  const logoSrc =
  theme.palette.mode === 'dark'
    ? '/NullAI-Logo-NoBG.png'
    : '/NullAI-Logo-LightMode.png' // light-mode-safe version

  useEffect(() => {
    if (lockedOpen) return

    const onScroll = () => {
      const y = window.scrollY
      if (y < 80) setHidden(false)
      else if (y > lastScrollY.current + 12) setHidden(true)
      else if (y < lastScrollY.current - 12) setHidden(false)
      lastScrollY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lockedOpen])

  const navItems = [
    { label: 'Playground', to: '/playground', icon: <RocketLaunchIcon /> },
    { label: 'Neural Lab', to: '/neural', icon: <MemoryIcon /> },
    { label: 'Swarm', to: '/swarm', icon: <GroupsIcon /> },
    { label: 'Cyber Tools', to: '/osint', icon: <ShieldIcon /> },
    { label: 'Nodes', to: '/nodes', icon: <HubIcon /> },
    { label: 'Docs', to: '/docs', icon: <CodeIcon /> },
    { label: 'Profile', to: '/profile', icon: <Person /> },
  ]

  return (
    <>
      
<MotionBox
  onClick={() => {
    setHidden((h) => !h)
    setLockedOpen((l) => !l)
  }}
  initial={false}
  animate={{
    y: hidden ? 0 : 0,
    rotate: hidden ? 0 : 180,
    opacity: 1,
  }}
  whileHover={{ scale: 1.05 }}
  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
  sx={{
    position: 'fixed',
    top: hidden ? 6 : 88, // 👈 follows navbar edge
    left: 0,
    right: 0,
    margin: '0 auto',

    zIndex: theme.zIndex.appBar + 2,
    width: 44,
    height: 24,
    borderRadius: '0 0 14px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(16px)',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(34,211,238,0.22)'
        : 'rgba(0,0,0,0.1)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 10px 28px rgba(0,0,0,0.65)'
        : '0 10px 22px rgba(0,0,0,0.18)',
  }}
>
  <KeyboardArrowUpIcon fontSize="small" />
</MotionBox>

      

      {/* NAVBAR */}
      <MotionAppBar
        position="fixed"
        elevation={0}
        animate={{
          y: hidden ? -120 : 0,
          opacity: hidden ? 0.96 : 1,
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        sx={{
          backdropFilter: 'blur(28px)',
          background:
            theme.palette.mode === 'dark'
              ? `
                transparent
              `
              : 'rgba(255,255,255,0.95)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 22px 70px rgba(0,0,0,0.6)'
              : '0 18px 50px rgba(0,0,0,0.12)',
        }}
      >
        {/* AMBIENT MOTION LAYER */}
        <MotionBox
          aria-hidden
          animate={{ backgroundPositionX: ['0%', '100%'] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              theme.palette.mode === 'dark'
                ? `
                  repeating-linear-gradient(
                    120deg,
                    rgba(255,255,255,0.035) 0px,
                    rgba(255,255,255,0.035) 1px,
                    transparent 1px,
                    transparent 7px
                  )
                `
                : 'none',
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        />

        <Toolbar
          sx={{
            maxWidth: 1380,
            mx: 'auto',
            width: '100%',
            py: 1.5,
            px: 2,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* LOGO */}
          <MotionBox
            component={RouterLink}
            to="/"
            whileHover={{ scale: 1.045 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              textDecoration: 'none',
            }}
          >
            <MotionBox
              component="img"
              src={logoSrc}
              animate={{
                filter:
                  theme.palette.mode === 'dark'
                    ? [
                        'drop-shadow(0 0 10px rgba(34,211,238,0.35))',
                        'drop-shadow(0 0 16px rgba(34,211,238,0.55))',
                        'drop-shadow(0 0 10px rgba(34,211,238,0.35))',
                      ]
                    : [
                        'drop-shadow(0 0 6px rgba(15,23,42,0.25))',
                        'drop-shadow(0 0 10px rgba(15,23,42,0.35))',
                        'drop-shadow(0 0 6px rgba(15,23,42,0.25))',
                      ],
              }}
              transition={{ duration: 4.5, repeat: Infinity }}
              sx={{
                height: 40,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
            <Typography
              fontWeight={900}
              sx={{
                letterSpacing: '-0.045em',
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #e5f9ff, #fcfcfce8, #e6e6e6ff'
                    : 'none',
                WebkitBackgroundClip:
                  theme.palette.mode === 'dark' ? 'text' : 'unset',
                WebkitTextFillColor:
                  theme.palette.mode === 'dark' ? 'transparent' : 'inherit',
              }}
            >
              NullAI
            </Typography>
          </MotionBox>

          <Box flex={1} />

          {/* NAV LINKS */}
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.to)

              return (
                <MotionButton
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  startIcon={item.icon}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  sx={{
                    px: 2.2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 700,
                    color: active ? 'primary.main' : 'text.primary',
                    background: active
                      ? 'rgba(34,211,238,0.18)'
                      : 'transparent',
                    border: active
                      ? `1px solid ${theme.palette.primary.main}`
                      : '1px solid transparent',
                    position: 'relative',
                  }}
                >
                  {item.label}
                </MotionButton>
              )
            })}
          </Box>

          <Box flex={1} />

          {/* TIER */}
          {isAuthenticated && (
            <Chip
              label={tier.toUpperCase()}
              color={tier === 'free' ? 'default' : 'primary'}
              size="small"
              sx={{
                fontWeight: 800,
                letterSpacing: '0.08em',
                mr: 1.5,
              }}
            />
          )}

          {/* THEME */}
          <IconButton
            onClick={toggleColorMode}
            sx={{
              mr: 0.75,
              background:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.05)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* AUTH */}
          {isAuthenticated ? (
            <Button
              color="error"
              variant="outlined"
              onClick={signOut}
              sx={{ fontWeight: 700 }}
            >
              Sign out
            </Button>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              sx={{ fontWeight: 800 }}
            >
              Sign in
            </Button>
          )}
        </Toolbar>
      </MotionAppBar>
    </>
  )
}
