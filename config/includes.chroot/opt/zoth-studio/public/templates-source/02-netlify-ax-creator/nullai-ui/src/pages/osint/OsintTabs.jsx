import {
  Stack,
  Chip,
  IconButton,
  Box,
  Typography,
  Slider,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion, AnimatePresence } from 'framer-motion';
import { alpha } from '@mui/material/styles';
import { useRef, useState, useEffect } from 'react';

const MotionChip = motion(Chip);
const MotionIconButton = motion(IconButton);
const MotionBox = motion(Box);

export default function OsintTabs({ tools, active, onSelect, onBack }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const scrollRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);

  const onWheel = (e) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft += e.deltaY;
    syncSlider();
  };

  const syncSlider = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollPct(max ? (el.scrollLeft / max) * 100 : 0);
  };

  const onSlider = (_, value) => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollLeft = (value / 100) * max;
    setScrollPct(value);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncSlider);
    return () => el.removeEventListener('scroll', syncSlider);
  }, []);

  return (
    <Stack
      spacing={0}
      sx={{
        position: 'sticky',
        top: { xs: 8, md: 16 }, // Floating effect
        mx: { xs: 1, md: 2 },
        zIndex: 100,
        borderRadius: '24px',
        overflow: 'hidden',
        backdropFilter: 'blur(20px) saturate(180%)',
        background: isDark 
          ? `linear-gradient(135deg, ${alpha('#121212', 0.7)}, ${alpha('#1e1e26', 0.8)})`
          : alpha(theme.palette.background.paper, 0.8),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        boxShadow: isDark
          ? `0 8px 32px 0 ${alpha('#000', 0.8)}, inset 0 0 0 1px ${alpha('#fff', 0.05)}`
          : `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      {/* HEADER SECTION */}
      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={2} 
        sx={{ p: 1.5, pb: 0.5 }}
      >
        <MotionIconButton
          onClick={onBack}
          whileHover={{ scale: 1.1, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
          whileTap={{ scale: 0.9 }}
          sx={{
            color: theme.palette.primary.main,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            borderRadius: '14px',
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </MotionIconButton>

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography 
            variant="overline" 
            sx={{ 
              display: 'block', 
              lineHeight: 1, 
              color: theme.palette.primary.main, 
              fontWeight: 800,
              letterSpacing: 2,
              fontSize: '0.65rem'
            }}
          >
            OSINT ENGINE / COMMAND_CENTRAL
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ opacity: 0.5, fontSize: '0.6rem', fontFamily: 'monospace' }}
          >
            STATUS: {active ? `TARGETING_${active.toUpperCase()}` : 'AWAITING_SELECTION'}
          </Typography>
        </Box>
      </Stack>

      {/* TAB STRIP */}
      <Box
        ref={scrollRef}
        onWheel={onWheel}
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          px: 2,
          py: 2,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
        }}
      >
        {tools.map((t) => {
          const isActive = active === t.id;
          return (
            <Box key={t.id} sx={{ position: 'relative' }}>
              <MotionChip
                onClick={() => onSelect(t.id)}
                label={t.label}
                whileHover={{ y: -2 }}
                sx={{
                  height: 38,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  borderRadius: '10px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive 
                    ? alpha(theme.palette.primary.main, 0.15)
                    : 'transparent',
                  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                  border: `1px solid ${isActive ? alpha(theme.palette.primary.main, 0.5) : alpha(theme.palette.divider, 0.1)}`,
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.1),
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  }
                }}
              />
              {isActive && (
                <MotionBox
                  layoutId="activeGlow"
                  sx={{
                    position: 'absolute',
                    bottom: -6,
                    left: '20%',
                    right: '20%',
                    height: '2px',
                    background: theme.palette.primary.main,
                    boxShadow: `0 0 10px ${theme.palette.primary.main}`,
                    borderRadius: '2px',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* MINIMALIST SCRUBBER */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Slider
          value={scrollPct}
          onChange={onSlider}
          sx={{
            height: 2,
            p: 0,
            color: theme.palette.primary.main,
            '& .MuiSlider-rail': { opacity: 0.1, bgcolor: theme.palette.text.primary },
            '& .MuiSlider-thumb': {
              width: 0,
              height: 0,
              '&:hover, &.Mui-focusVisible': { boxShadow: 'none' },
            },
            '& .MuiSlider-track': {
              border: 'none',
              boxShadow: `0 0 10px ${theme.palette.primary.main}`,
            },
          }}
        />
      </Box>
    </Stack>
  );
}