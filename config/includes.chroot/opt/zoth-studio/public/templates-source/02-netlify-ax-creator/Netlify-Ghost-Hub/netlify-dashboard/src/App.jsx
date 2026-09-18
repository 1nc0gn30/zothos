import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Avatar,
  IconButton,
  MenuItem,
  TextField,
  Fade
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SiteCard from './components/SiteCard';
import ToolsPage from './components/ToolsPage';
import SiteWorkspace from './components/SiteWorkspace';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState('sites');
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [sitesWindowStart, setSitesWindowStart] = useState(0);
  const [error, setError] = useState('');
  const [ghostHintOpen, setGhostHintOpen] = useState(false);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(false);

  const loadSites = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/api/sites`);
      setSites(res.data || []);
    } catch (e) {
      setError('Failed to load Netlify sites. Make sure backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    const onMove = (event) => {
      setPointerPos({
        x: event.clientX,
        y: event.clientY
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const selectedSite = useMemo(() => {
    return sites.find((site) => site.id === selectedSiteId) || null;
  }, [sites, selectedSiteId]);

  const summary = useMemo(() => {
    const total = sites.length;
    const linked = sites.filter((site) => Boolean(site.repo)).length;
    const cloned = sites.filter((site) => site.is_cloned).length;
    return { total, linked, cloned };
  }, [sites]);

  const openWorkspace = (siteId) => {
    setSelectedSiteId(siteId);
    setPage('workspace');
  };

  const cardsPerScreen = 1;
  const maxWindowStart = Math.max(0, sites.length - cardsPerScreen);
  const visibleSites = sites.slice(sitesWindowStart, sitesWindowStart + cardsPerScreen);

  useEffect(() => {
    setSitesWindowStart((prev) => Math.min(prev, maxWindowStart));
  }, [maxWindowStart]);

  useEffect(() => {
    if (!autoRotate || page !== 'sites' || sites.length <= 1) return;
    const timer = window.setInterval(() => {
      setSitesWindowStart((prev) => (prev >= maxWindowStart ? 0 : prev + 1));
    }, 5500);
    return () => window.clearInterval(timer);
  }, [autoRotate, maxWindowStart, page, sites.length]);

  const selectSiteInView = (siteId) => {
    const siteIndex = sites.findIndex((site) => site.id === siteId);
    if (siteIndex < 0) return;
    setSitesWindowStart(Math.min(siteIndex, maxWindowStart));
  };

  return (
    <Box
      sx={{
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        '@keyframes ghostDrift': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
          '100%': { transform: 'translateY(0px)' }
        },
        '@keyframes ghostGlitch': {
          '0%, 92%, 100%': { transform: 'translate3d(0,0,0)', filter: 'hue-rotate(0deg) saturate(1)' },
          '93%': { transform: 'translate3d(-3px, 1px, 0)', filter: 'hue-rotate(14deg) saturate(1.4)' },
          '94%': { transform: 'translate3d(3px, -2px, 0)', filter: 'hue-rotate(-12deg) saturate(1.35)' },
          '95%': { transform: 'translate3d(-2px, 1px, 0)', filter: 'hue-rotate(8deg) saturate(1.2)' }
        },
        '@keyframes ghostTilt': {
          '0%': { transform: 'perspective(600px) rotateY(0deg) rotateX(0deg)' },
          '50%': { transform: 'perspective(600px) rotateY(8deg) rotateX(-4deg)' },
          '100%': { transform: 'perspective(600px) rotateY(0deg) rotateX(0deg)' }
        }
      }}
    >
      <Box
        component="img"
        src="/ghostbyte.png"
        alt=""
        sx={{
          position: 'fixed',
          right: { xs: '-160px', md: '-45px' },
          bottom: { xs: '-120px', md: '-80px' },
          width: { xs: '320px', md: '420px' },
          opacity: 0.18,
          filter: 'drop-shadow(0 0 38px rgba(107, 248, 255, 0.35))',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'ghostGlitch 8.5s steps(1, end) infinite'
        }}
      />
      <Box
        component="img"
        src="/ghostbyte.png"
        alt=""
        sx={{
          position: 'fixed',
          right: { xs: '14%', md: '22%' },
          top: { xs: '8%', md: '16%' },
          width: { xs: 64, md: 88 },
          opacity: 0.08,
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'ghostDrift 9s ease-in-out infinite, ghostTilt 11s ease-in-out infinite',
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 0 14px rgba(112, 228, 255, 0.24))'
        }}
      />
      <Box
        component="img"
        src="/ghostbyte.png"
        alt=""
        sx={{
          position: 'fixed',
          left: { xs: '8%', md: '18%' },
          bottom: { xs: '18%', md: '22%' },
          width: { xs: 58, md: 78 },
          opacity: 0.07,
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'ghostDrift 11s ease-in-out infinite reverse, ghostGlitch 12s steps(1, end) infinite'
        }}
      />
      <Box
        component="img"
        src="/ghostbyte.png"
        alt=""
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: { xs: 86, md: 102 },
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 0,
          transform: `translate(${pointerPos.x * 0.035 + 10}px, ${pointerPos.y * 0.035 + 16}px)`,
          transition: 'transform 260ms ease-out',
          filter: 'drop-shadow(0 0 10px rgba(99, 240, 255, 0.3))'
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(5, 9, 20, 0.25), rgba(5, 9, 20, 0.82) 60%, rgba(5, 9, 20, 0.98))',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <AppBar position="static" color="inherit" elevation={0} sx={{ zIndex: 2 }}>
        <Toolbar>
          <Stack direction="row" spacing={1.25} sx={{ flexGrow: 1, alignItems: 'center' }}>
            <Avatar
              src="/ghostbyte.png"
              alt="Ghost Byte"
              sx={{
                width: 34,
                height: 34,
                border: '1px solid rgba(111, 247, 255, 0.7)',
                boxShadow: '0 0 20px rgba(111, 247, 255, 0.3)',
                animation: 'ghostGlitch 10s steps(1, end) infinite'
              }}
            />
            <Typography variant="h6">Netlify Ghost Hub</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant={page === 'sites' ? 'contained' : 'outlined'} onClick={() => setPage('sites')}>
              Sites
            </Button>
            <Button variant={page === 'tools' ? 'contained' : 'outlined'} onClick={() => setPage('tools')}>
              Tools
            </Button>
            <Button variant="outlined" onClick={loadSites}>
              Refresh
            </Button>
          </Stack>
        </Toolbar>
        {loading && <LinearProgress />}
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          py: 2,
          position: 'relative',
          zIndex: 1,
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {page === 'sites' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minHeight: 0 }}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                flex: '0 0 auto',
                maxHeight: { xs: '26vh', md: '24vh' }
              }}
            >
              <Box
                component="img"
                src="/ghostbyte.png"
                alt=""
                sx={{
                  position: 'absolute',
                  right: { xs: -40, md: 16 },
                  top: { xs: -15, md: -32 },
                  width: { xs: 150, md: 210 },
                  opacity: 0.24,
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 0 18px rgba(117, 240, 255, 0.32))',
                  animation: 'ghostTilt 12s ease-in-out infinite'
                }}
              />
              <CardContent sx={{ overflowY: 'auto' }}>
                <Typography variant="h6">Overview</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Fixed-screen view. Switch sites using arrows or the dropdown.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                  <Chip label={`Total Sites: ${summary.total}`} />
                  <Chip label={`GitHub Linked: ${summary.linked}`} />
                  <Chip label={`Cloned Locally: ${summary.cloned}`} />
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1.5}
                  sx={{ alignItems: { xs: 'stretch', md: 'center' }, mb: 2 }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Sites Window
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => setSitesWindowStart((prev) => Math.max(0, prev - 1))}
                      disabled={sitesWindowStart === 0}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {sites.length ? `${sitesWindowStart + 1}-${Math.min(sitesWindowStart + cardsPerScreen, sites.length)} of ${sites.length}` : '0 sites'}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setSitesWindowStart((prev) => Math.min(maxWindowStart, prev + 1))}
                      disabled={sitesWindowStart >= maxWindowStart}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setAutoRotate((prev) => !prev)}
                      disabled={sites.length <= 1}
                      color={autoRotate ? 'primary' : 'default'}
                      title={autoRotate ? 'Pause auto-rotate' : 'Start auto-rotate'}
                    >
                      {autoRotate ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                    </IconButton>
                  </Stack>
                  <TextField
                    select
                    size="small"
                    label="Jump to site"
                    value={visibleSites[0]?.id || ''}
                    onChange={(event) => selectSiteInView(event.target.value)}
                    sx={{ minWidth: { xs: '100%', md: 280 }, ml: { md: 'auto' } }}
                  >
                    {sites.map((site) => (
                      <MenuItem key={site.id} value={site.id}>
                        {site.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <Box sx={{ mb: 1.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={sites.length ? ((sitesWindowStart + 1) / sites.length) * 100 : 0}
                    sx={{
                      height: 6,
                      borderRadius: 999,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 999,
                        background: 'linear-gradient(90deg, #49d0ff, #83ffe2)'
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {autoRotate ? 'Auto-rotate is on' : 'Auto-rotate is off'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    minHeight: 0,
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: { xs: 0, md: 2 }
                  }}
                >
                  {visibleSites.map((site) => (
                    <Box
                      key={site.id}
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex'
                      }}
                    >
                      <SiteCard site={site} onRefresh={loadSites} onOpenWorkspace={openWorkspace} />
                    </Box>
                  ))}
                  {!visibleSites.length && (
                    <Typography variant="body2" color="text.secondary">
                      No sites available.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {page === 'tools' && (
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ToolsPage apiBase={API_BASE} onRepoCreated={loadSites} />
          </Box>
        )}

        {page === 'workspace' && selectedSite && (
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <SiteWorkspace
              site={selectedSite}
              apiBase={API_BASE}
              onBack={() => setPage('sites')}
              onRefresh={loadSites}
            />
          </Box>
        )}
      </Container>
      <Box sx={{ position: 'fixed', left: 14, bottom: 14, zIndex: 2 }}>
        <Button
          size="small"
          onClick={() => setGhostHintOpen((prev) => !prev)}
          sx={{
            minWidth: 0,
            width: 44,
            height: 44,
            borderRadius: '999px',
            p: 0,
            border: '1px solid rgba(111, 247, 255, 0.42)',
            background: 'rgba(3, 10, 22, 0.65)',
            backdropFilter: 'blur(6px)',
            '&:hover': { background: 'rgba(7, 24, 48, 0.86)' },
            animation: 'ghostDrift 5.8s ease-in-out infinite'
          }}
        >
          <Box
            component="img"
            src="/ghostbyte.png"
            alt="Ghost buddy"
            sx={{ width: 28, opacity: 0.86, filter: 'drop-shadow(0 0 6px rgba(108, 241, 255, 0.38))' }}
          />
        </Button>
        <Fade in={ghostHintOpen}>
          <Card
            sx={{
              position: 'absolute',
              left: 52,
              bottom: 0,
              p: 1,
              minWidth: 220,
              border: '1px solid rgba(111, 247, 255, 0.35)'
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Ghost Buddy tip: open a site page to launch Codex and preview that repo’s media assets.
            </Typography>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
}
