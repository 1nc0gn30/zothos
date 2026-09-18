import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Stack,
} from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import CodeIcon from '@mui/icons-material/Code'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import { useContext, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../app/AuthProvider'
import { ColorModeContext } from '../../theme/theme'

const MotionAppBar = motion(AppBar)
const MotionBox = motion(Box)
const MotionButton = motion(Button)

export default function NavbarDesktop() {
  const theme = useTheme()
  const location = useLocation()
  const { toggleColorMode, mode } = useContext(ColorModeContext)
  const { tier } = useAuth()

  const lastScrollY = useRef(0)
  const [hidden, setHidden] = useState(false)
  const [lockedOpen, setLockedOpen] = useState(false)

  const logoSrc = '/DarkMode-NullAI-Icon.png'

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
    { to: '/', label: 'Home', icon: <RocketLaunchIcon sx={{ fontSize: 18 }} /> },
    { to: '/studio', label: 'Zoth', icon: <RocketLaunchIcon sx={{ fontSize: 18 }} /> },
    { to: '/tools', label: 'Tools', icon: <CodeIcon sx={{ fontSize: 18 }} /> },
  ]

  return (
    <>
      {/* HUD TOGGLE TAB */}
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
        whileHover={{ scale: 1.1, backgroundColor: alpha(theme.palette.primary.main, 0.4) }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        sx={{
          position: 'fixed',
          top: hidden ? 0 : 88,
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
          background: alpha(theme.palette.primary.main, 0.15),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          borderTop: 'none',
        }}
      >
        <KeyboardArrowUpIcon sx={{ fontSize: 16, color: 'primary.main' }} />
      </MotionBox>

      <MotionAppBar
        position="fixed"
        elevation={0}
        animate={{
          y: hidden ? -120 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        sx={{
          backdropFilter: 'blur(30px)',
          background: theme.palette.mode === 'dark' 
            ? alpha('#05070d', 0.8) 
            : alpha('#ffffff', 0.9),
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          boxShadow: theme.palette.mode === 'dark'
            ? `0 10px 40px ${alpha('#000', 0.5)}`
            : `0 10px 30px ${alpha(theme.palette.primary.main, 0.05)}`,
        }}
      >
        {/* NEW: SCANLINE ANIMATION LAYER */}
        <MotionBox
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, ${alpha(theme.palette.primary.main, 0.05)} 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02))`,
            backgroundSize: '100% 4px, 3px 100%',
            zIndex: 1,
          }}
        />

        <Toolbar sx={{ maxWidth: 1440, mx: 'auto', width: '100%', py: 1, px: 3, position: 'relative', zIndex: 2 }}>
          {/* LOGO AREA */}
          <MotionBox
            component={RouterLink}
            to="/"
            whileHover={{ scale: 1.02 }}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
          >
            <Box sx={{ position: 'relative' }}>
              <MotionBox
                component="img"
                src={logoSrc}
                alt="Ghost Byte, the NullAI mark"
                sx={{ height: 38, position: 'relative', zIndex: 2 }}
                animate={{ filter: theme.palette.mode === 'dark' 
                  ? ['drop-shadow(0 0 5px cyan)', 'drop-shadow(0 0 12px cyan)', 'drop-shadow(0 0 5px cyan)'] 
                  : 'none' 
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={950} sx={{ 
                fontFamily: 'monospace', 
                letterSpacing: -1, 
                color: 'text.primary',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}>
                Null<span style={{ color: theme.palette.primary.main }}>AI</span>
              </Typography>
              <Typography sx={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.14em', color: 'text.secondary', textTransform: 'uppercase' }}>
                creator of Zoth
              </Typography>
            </Box>
          </MotionBox>

          <Box sx={{ flexGrow: 1 }} />

          {/* NAV ITEMS WITH ACTIVE GLOW */}
          <Stack direction="row" spacing={1}>
            {navItems.map((item) => {
              const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
              return (
                <MotionButton
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  startIcon={item.icon}
                  whileHover={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
                  whileTap={{ scale: 0.97 }}
                  sx={{
                    px: 2,
                    py: 0.8,
                    borderRadius: '4px',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    color: active ? 'primary.main' : alpha(theme.palette.text.primary, 0.7),
                    border: active ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
                    boxShadow: active ? `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {item.label}
                  {active && (
                    <MotionBox
                      layoutId="nav-underline"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: '10%',
                        width: '80%',
                        height: '2px',
                        backgroundColor: 'primary.main',
                        boxShadow: `0 0 10px ${theme.palette.primary.main}`,
                      }}
                    />
                  )}
                </MotionButton>
              )
            })}
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {/* RIGHT SIDE UTILITIES */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Chip
              label={tier.toUpperCase()}
              variant="outlined"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 900,
                fontSize: '0.65rem',
                height: 24,
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                '& .MuiChip-label': { px: 1 }
              }}
            />

            <IconButton 
              onClick={toggleColorMode} 
              size="small"
              sx={{ 
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                bgcolor: alpha(theme.palette.background.paper, 0.5) 
              }}
            >
              {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>

          </Stack>
        </Toolbar>
      </MotionAppBar>
    </>
  )
}
