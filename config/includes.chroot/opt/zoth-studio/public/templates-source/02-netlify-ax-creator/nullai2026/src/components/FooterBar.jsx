import { useEffect, useMemo, useState, useRef } from 'react';
import { Box, Paper, Stack, Typography, IconButton, Fade, Tooltip, Divider } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PolicyIcon from '@mui/icons-material/Policy';
import GavelIcon from '@mui/icons-material/Gavel';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HomeIcon from '@mui/icons-material/Home';
import ScienceIcon from '@mui/icons-material/Science';

/* ===========================
   MAGNETIC ACTION ICON
=========================== */
function ActionIcon({ active = false, onClick, children, label, mouseX }) {
  const theme = useTheme();
  const ref = useRef(null);

  // Magnetic distance calculation
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [50, 70, 50]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Tooltip title={label} arrow placement="top">
      <motion.div
        ref={ref}
        style={{ width }}
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        className="dock-item"
      >
        <Box
          sx={{
            aspectRatio: '1/1',
            borderRadius: '16px',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.3s ease',
            background: active 
              ? alpha(theme.palette.primary.main, 0.15) 
              : alpha(theme.palette.background.paper, 0.2),
            border: `1px solid ${active ? theme.palette.primary.main : alpha(theme.palette.divider, 0.2)}`,
            backdropFilter: 'blur(8px)',
            color: active ? theme.palette.primary.main : alpha('#fff', 0.6),
            '&:hover': {
              color: '#fff',
              borderColor: alpha(theme.palette.primary.main, 0.8),
              background: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          {children}
          
          {/* Active Laser Dot */}
          {active && (
            <motion.div 
              layoutId="laser"
              style={{
                position: 'absolute',
                bottom: -8,
                width: 12,
                height: 2,
                background: theme.palette.primary.main,
                boxShadow: `0 0 10px ${theme.palette.primary.main}`,
                borderRadius: 2
              }}
            />
          )}
        </Box>
      </motion.div>
    </Tooltip>
  );
}
/* ===========================
   ENHANCED INFO POPOVER
=========================== */
function InfoPopover({ onClose }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      style={{
        position: 'fixed',
        bottom: 100, // Positions it above the dock
        left: '50%',
        translateX: '-50%',
        zIndex: 1600,
      }}
    >
      <Paper
        sx={{
          p: 3,
          minWidth: 320,
          borderRadius: '20px',
          background: isLight
            ? `linear-gradient(135deg, ${alpha('#ffffff', 0.96)}, ${alpha('#f1f5f9', 0.98)})`
            : `linear-gradient(135deg, ${alpha('#1e293b', 0.95)}, ${alpha('#0f172a', 0.98)})`,
          color: isLight ? '#000' : '#fff',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          boxShadow: isLight
            ? `0 20px 40px rgba(15,23,42,0.2), inset 0 0 20px ${alpha(theme.palette.primary.main, 0.06)}`
            : `0 30px 60px rgba(0,0,0,0.8), inset 0 0 20px ${alpha(theme.palette.primary.main, 0.1)}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Grid */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: `radial-gradient(${theme.palette.primary.main} 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            pointerEvents: 'none',
          }}
        />

        <Stack spacing={2.5}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 1, lineHeight: 1 }}>
                NULL<span style={{ color: theme.palette.primary.main }}>AI</span>
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: isLight ? 0.7 : 0.5, color: isLight ? '#000' : 'inherit' }}>
                v4.0.2-STABLE
              </Typography>
            </Box>
            <IconButton size="small" onClick={onClose} sx={{ color: 'primary.main' }}>
              <VisibilityOffIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Divider sx={{ borderColor: isLight ? alpha('#000', 0.12) : alpha('#fff', 0.1) }} />

          {/* Terminal Data Cells */}
          <Stack spacing={1.5}>
            <Box>
              <Typography sx={{ fontSize: '0.6rem', color: 'primary.main', fontWeight: 900, mb: 0.5 }}>
                LOCAL_CHRONO
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: isLight ? alpha('#000', 0.06) : alpha('#000', 0.3), p: 1, borderRadius: 1, color: isLight ? '#000' : 'inherit' }}>
                {time.toLocaleTimeString()} <span style={{ opacity: 0.4 }}>[{time.toLocaleDateString()}]</span>
              </Typography>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Box component="img" src="/DarkMode-NullAI-Icon.png" alt="Ghost Byte, the NullAI mark" sx={{ width: 16, height: 16 }} />
                <Typography sx={{ fontSize: '0.6rem', color: 'primary.main', fontWeight: 900 }}>
                  SYSTEM_MANIFEST
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ display: 'block', opacity: isLight ? 0.85 : 0.7, lineHeight: 1.5, color: isLight ? '#000' : 'inherit' }}>
                NullAI — creator of Zoth Studio.<br />
                Ghost Byte remains the mark.<br />
                Deck: <span style={{ color: theme.palette.success.main }}>LOCAL-FIRST</span>
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ borderColor: isLight ? alpha('#000', 0.12) : alpha('#fff', 0.1) }} />

          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              opacity: isLight ? 0.55 : 0.3,
              color: isLight ? '#000' : 'inherit',
              fontFamily: 'monospace',
              fontSize: '0.65rem'
            }}
          >
            © 2026 NULLAI_OPERATIONS // UNCLASSIFIED
          </Typography>
        </Stack>
      </Paper>
    </motion.div>
  );
}
/* ===========================
   ENHANCED FOOTER BAR
=========================== */
export default function FooterBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const mouseX = useMotionValue(Infinity);

  const [hidden, setHidden] = useState(false);
  const [panel, setPanel] = useState(null);
  const path = location.pathname;

  return (
    <>
      <AnimatePresence>
        {panel === 'info' && <InfoPopover onClose={() => setPanel(null)} />}
      </AnimatePresence>

      <Fade in={!hidden}>
        <Box
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          sx={{
            position: 'fixed',
            bottom: 20, // Floating off the edge
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1400,
            p: 0.8,
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            background: `linear-gradient(180deg, ${alpha('#1e293b', 0.8)} 0%, ${alpha('#0f172a', 0.95)} 100%)`,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: `1px solid ${alpha('#fff', 0.08)}`,
            boxShadow: `
              0 20px 50px rgba(0,0,0,0.5),
              inset 0 1px 1px ${alpha('#fff', 0.1)}
            `,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ px: 1 }}>
            
            {/* NAVIGATION GROUP */}
            <ActionIcon active={path === '/'} onClick={() => navigate('/')} label="Home" mouseX={mouseX}>
              <HomeIcon />
            </ActionIcon>

            <ActionIcon active={path.startsWith('/tools')} onClick={() => navigate('/tools')} label="Tools" mouseX={mouseX}>
              <ScienceIcon />
            </ActionIcon>

            {/* SEGMENT DIVIDER */}
            <Box sx={{ width: '1px', height: '30px', bgcolor: alpha('#fff', 0.1), mx: 1, alignSelf: 'center' }} />

            {/* UTILITY GROUP */}
            <ActionIcon active={panel === 'info'} onClick={() => setPanel(p => p === 'info' ? null : 'info')} label="About" mouseX={mouseX}>
              <InfoOutlinedIcon />
            </ActionIcon>

            <ActionIcon active={path.startsWith('/nodes')} onClick={() => navigate('/nodes')} label="Nodes" mouseX={mouseX}>
              <PolicyIcon />
            </ActionIcon>

            <ActionIcon onClick={() => setHidden(true)} label="Ghost Mode" mouseX={mouseX}>
              <VisibilityOffIcon />
            </ActionIcon>
          </Stack>

          {/* DYNAMIC METADATA RIBBON */}
          <Box
            sx={{
              position: 'absolute',
              top: -28,
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                color: theme.palette.primary.main,
                textTransform: 'uppercase',
                letterSpacing: 2,
                opacity: 0.6,
                background: alpha('#000', 0.4),
                px: 1.5,
                py: 0.2,
                borderRadius: '4px',
                backdropFilter: 'blur(4px)',
              }}
            >
              System.Status: <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}>Nominal</motion.span> // Node_04
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* RESTORE BUTTON */}
      <AnimatePresence>
        {hidden && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1500 }}>
            <IconButton
              onClick={() => setHidden(false)}
              sx={{
                background: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.primary.main}`,
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
