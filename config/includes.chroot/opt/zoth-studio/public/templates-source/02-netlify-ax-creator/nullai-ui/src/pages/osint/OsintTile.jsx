import { Paper, Typography, Box, Chip, Stack } from '@mui/material'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { alpha, useTheme } from '@mui/material/styles'
import RadarIcon from '@mui/icons-material/Radar'
import SecurityIcon from '@mui/icons-material/Security'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import LayersIcon from '@mui/icons-material/Layers'

const MotionPaper = motion(Paper)

// Decorative Corner Component
const CornerBracket = ({ position }) => {
  const styles = {
    position: 'absolute',
    width: 8,
    height: 8,
    border: `2px solid ${alpha('#22d3ee', 0.4)}`,
    ...position,
  }
  if (position.top) styles.borderBottom = 'none'
  if (position.bottom) styles.borderTop = 'none'
  if (position.left) styles.borderRight = 'none'
  if (position.right) styles.borderLeft = 'none'
  
  return <Box sx={styles} />
}

export default function OsintTile({ tool, onSelect }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  // Subtle 3D tilt effect
  const rotateX = useTransform(my, [0, 300], [5, -5])
  const rotateY = useTransform(mx, [0, 400], [-5, 5])

  const glowX = useTransform(mx, v => `${v}px`)
  const glowY = useTransform(my, v => `${v}px`)

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }

  return (
    <Box sx={{ perspective: 1000, height: '100%' }}>
      <MotionPaper
        onClick={() => onSelect(tool.id)}
        onMouseMove={handleMove}
        onMouseLeave={() => { mx.set(200); my.set(150) }}
        style={{ rotateX, rotateY }}
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        sx={{
          position: 'relative',
          height: '100%',
          cursor: 'pointer',
          borderRadius: '20px',
          overflow: 'hidden',
          p: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',

          // Advanced Background
          background: isDark
            ? `linear-gradient(165deg, ${alpha('#0f172a', 0.9)} 0%, ${alpha('#020617', 0.95)} 100%)`
            : '#ffffff',
          
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1)}`,
          
          '&:hover': {
            borderColor: alpha(theme.palette.primary.main, 0.5),
            boxShadow: isDark
              ? `0 25px 50px -12px ${alpha('#000', 0.8)}, 0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`
              : `0 20px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
      >
        {/* SCANLINE OVERLAY */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, ${alpha(theme.palette.primary.main, 0.05)} 50%), linear-gradient(90deg, rgba(255, 0, 0, 0), ${alpha(theme.palette.primary.main, 0.02)}, rgba(0, 0, 255, 0))`,
            backgroundSize: '100% 4px, 150px 100%',
            pointerEvents: 'none',
          }}
        />

        {/* MOUSE GLOW */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle 250px at ${glowX} ${glowY}, ${alpha(theme.palette.primary.main, 0.15)}, transparent 80%)`,
            pointerEvents: 'none',
          }}
        />

        {/* HUD DECORATIONS */}
        <CornerBracket position={{ top: 12, left: 12 }} />
        <CornerBracket position={{ top: 12, right: 12 }} />
        <CornerBracket position={{ bottom: 12, left: 12 }} />
        <CornerBracket position={{ bottom: 12, right: 12 }} />

        {/* HEADER SECTION */}
        <Stack direction="row" spacing={2} alignItems="flex-start" mb={3} sx={{ zIndex: 1 }}>
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: '16px',
              display: 'grid',
              placeItems: 'center',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              boxShadow: `inset 0 0 15px ${alpha(theme.palette.primary.main, 0.2)}`,
              color: theme.palette.primary.main,
            }}
          >
            <RadarIcon sx={{ fontSize: 28 }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{ 
                fontFamily: 'monospace', 
                color: theme.palette.primary.main, 
                fontWeight: 'bold', 
                letterSpacing: 2,
                opacity: 0.7 
              }}
            >
              MODULE_0{tool.id || '1'}
            </Typography>
            <Typography
              fontWeight={900}
              sx={{
                letterSpacing: '-0.02em',
                fontSize: '1.25rem',
                lineHeight: 1.2,
                color: isDark ? '#fff' : '#1e293b'
              }}
            >
              {tool.label}
            </Typography>
          </Box>
        </Stack>

        {/* DESCRIPTION */}
        <Typography
          sx={{
            lineHeight: 1.6,
            color: isDark ? alpha('#fff', 0.7) : alpha('#000', 0.7),
            mb: 'auto',
            fontSize: '0.925rem',
            zIndex: 1,
          }}
        >
          {tool.description}
        </Typography>

        {/* FOOTER STATS */}
        <Box sx={{ mt: 4, pt: 2, borderTop: `1px dashed ${alpha(theme.palette.divider, 0.5)}`, zIndex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1}>
              {[
                { icon: <SecurityIcon fontSize="inherit" />, label: 'SECURE' },
                { icon: <FlashOnIcon fontSize="inherit" />, label: 'LATENCY_LOW' }
              ].map((tag, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1,
                    py: 0.2,
                    borderRadius: '4px',
                    bgcolor: alpha(theme.palette.text.primary, 0.05),
                    color: alpha(theme.palette.text.primary, 0.6),
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                  }}
                >
                  {tag.icon} {tag.label}
                </Box>
              ))}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
               <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, opacity: 0.4, mb: -0.5 }}>STATUS</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: theme.palette.success.main }}>ONLINE</Typography>
               </Box>
               <motion.div
                animate={{ 
                  boxShadow: [
                    `0 0 0px ${theme.palette.success.main}`,
                    `0 0 12px ${theme.palette.success.main}`,
                    `0 0 0px ${theme.palette.success.main}`
                  ] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 6,
                  height: 24,
                  borderRadius: 2,
                  background: theme.palette.success.main,
                }}
              />
            </Stack>
          </Stack>
        </Box>
      </MotionPaper>
    </Box>
  )
}