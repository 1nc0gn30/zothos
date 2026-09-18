import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  GlobalStyles,
  Grid
} from '@mui/material'; // Using Grid2 to resolve v2 migration errors
import { alpha, useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import RadarIcon from '@mui/icons-material/Radar';
import ShieldIcon from '@mui/icons-material/Shield';
import { useAuth } from '../app/AuthProvider';
import { toast } from 'sonner';

// --- COMMAND HUD STYLES & ANIMATIONS ---
const CommandHUDStyles = () => (
  <GlobalStyles styles={{
    '@keyframes grid-flow': { '0%': { backgroundPosition: '0 0' }, '100%': { backgroundPosition: '40px 40px' } },
    '@keyframes scanner-line': { '0%': { top: '0%' }, '100%': { top: '100%' } },
    '@keyframes status-blink': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
    '@keyframes spin-slow': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
    '@keyframes pulse-glow': { '0%, 100%': { opacity: 0.2 }, '50%': { opacity: 0.6 } },
    '@keyframes float-soft': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(10px)' } }
  }} />
);

const SectionHeader = ({ title, subtitle, color }) => {
  const theme = useTheme();
  // Fix: Ensure alpha receives a raw color value, not a shorthand string
  const activeColor = color || theme.palette.primary.main;
  const resolvedColor = activeColor === 'text.primary' ? theme.palette.text.primary : activeColor;

  return (
    <Box sx={{ mb: 4, position: 'relative' }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography sx={{ 
          fontFamily: 'monospace', fontSize: '0.85rem', 
          color: resolvedColor, 
          letterSpacing: 4, fontWeight: 900, textTransform: 'uppercase',
          textShadow: `0 0 10px ${alpha(resolvedColor, 0.5)}`
        }}>
          {`[ ${title} ]`}
        </Typography>
        <Box sx={{ flexGrow: 1, height: '1px', bgcolor: alpha(resolvedColor, 0.2) }} />
      </Stack>
      {subtitle && (
        <Typography variant="caption" sx={{ opacity: 0.4, ml: 2, fontFamily: 'monospace', textTransform: 'uppercase' }}>
          {`>> ${subtitle}`}
        </Typography>
      )}
    </Box>
  );
};

export default function Profile() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { profile, updateProfile } = useAuth();

  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [signature, setSignature] = useState('');
  const [bio, setBio] = useState('');
  const [motto, setMotto] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setEmail(profile.email ?? '');
    setAvatarUrl(profile.avatar_url ?? '');
    setSignature(profile.operator_signature ?? '');
    setBio(profile.bio ?? '');
    setMotto(profile.motto ?? '');
    setSkills(profile.skills ?? []);
  }, [profile]);

  const addSkill = () => {
    if (!skillInput.trim() || skills.includes(skillInput.trim())) return;
    setSkills([...skills, skillInput.trim()]);
    setSkillInput('');
  };

  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

  const saveProfile = async () => {
    setLoading(true);
    updateProfile({
      ...profile,
      email,
      avatar_url: avatarUrl,
      operator_signature: signature,
      bio,
      motto,
      skills,
    });
    toast.success('LOCAL_PROFILE_SYNCHRONIZED');
    setLoading(false);
  };

  if (!profile) return null;

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      bgcolor: isDark ? alpha('#000', 0.6) : alpha('#fff', 0.8),
      borderRadius: '0px',
      fontFamily: 'monospace',
      '& fieldset': { 
        borderColor: alpha(theme.palette.primary.main, 0.2), 
        borderLeft: `4px solid ${theme.palette.primary.main}` 
      },
      '&:hover fieldset': { borderColor: theme.palette.primary.main },
      '&.Mui-focused fieldset': { 
        boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}` 
      },
    },
    '& .MuiInputLabel-root': { fontFamily: 'monospace', fontSize: '0.75rem' }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', bgcolor: 'background.default',
      position: 'relative', overflow: 'hidden',
      pt: { xs: 20, md: 15 }, pb: {xs: 20, md: 10},
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(500px 280px at 12% 10%, var(--glow-cyan), transparent 70%), radial-gradient(420px 220px at 90% 80%, var(--glow-lime), transparent 70%)',
        pointerEvents: 'none'
      }
    }} className="hud-grid">
      <CommandHUDStyles />
      <Container maxWidth="xl">
        <Box sx={{ mb: 5 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box component="img" src="/DarkMode-NullAI-Icon.png" alt="Ghost Byte, the NullAI mark" sx={{ width: 46, height: 46, animation: 'float-soft 8s ease-in-out infinite' }} />
            <Box>
              <Typography variant="h3" sx={{ fontFamily: 'monospace', fontWeight: 1000, letterSpacing: -1 }}>
                OPERATOR_PROFILE
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6, letterSpacing: 3 }}>
                GHOST BYTE · CREATOR OF ZOTH
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Grid container spacing={3}>
          
          {/* COLUMN 1: BIOMETRIC HUD */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <Stack spacing={3}>
              <Paper sx={{ p: 4, borderRadius: 0, position: 'relative', borderColor: alpha(theme.palette.primary.main, 0.4) }} className="hud-panel">
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', bgcolor: 'primary.main', animation: 'scanner-line 4s ease-in-out infinite', zIndex: 2, opacity: 0.3 }} />
                
                <Stack alignItems="center" spacing={4}>
                  <Box sx={{ position: 'relative', p: 1, border: `1px solid ${theme.palette.primary.main}` }}>
                    <Avatar src={avatarUrl} sx={{ width: 180, height: 180, borderRadius: 0, filter: isDark ? 'grayscale(0.5) contrast(1.2)' : 'none' }}>
                      {email?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', bgcolor: 'primary.main', px: 2 }}>
                      <Typography variant="caption" sx={{ color: '#000', fontWeight: 900 }}>SCAN_COMPLETE</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: '100%', textAlign: 'left' }}>
                    <Typography sx={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'primary.main', mb: 1 }}>// OPERATOR_SIG</Typography>
                    <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 900, textTransform: 'uppercase' }}>
                      {profile.operator_signature || 'UNIDENTIFIED'}
                    </Typography>
                  </Box>

                  <Box sx={{ width: '100%', p: 2, bgcolor: alpha('#fff', 0.03), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontFamily: 'monospace', fontSize: '0.6rem', opacity: 0.5 }}>NEURAL_LINK_STABILITY</Typography>
                      <Box sx={{ height: 4, bgcolor: alpha('#fff', 0.1) }}>
                        <Box sx={{ height: '100%', width: '88%', bgcolor: 'primary.main', boxShadow: `0 0 10px ${theme.palette.primary.main}` }} />
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 0 }} className="hud-panel-soft">
                <Stack spacing={2}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>QUICK_STATS</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6 }}>CLEARANCE</Typography>
                      <Typography sx={{ fontFamily: 'monospace', fontWeight: 900 }}>A-3</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6 }}>UPTIME</Typography>
                      <Typography sx={{ fontFamily: 'monospace', fontWeight: 900 }}>99.4%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6 }}>SESSIONS</Typography>
                      <Typography sx={{ fontFamily: 'monospace', fontWeight: 900 }}>16</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6 }}>RISK</Typography>
                      <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'success.main' }}>LOW</Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 0 }} className="hud-panel-muted">
                <Stack spacing={2}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', animation: 'status-blink 2s infinite' }}>● LIVE_TELEMETRY_FEED</Typography>
                  <Divider sx={{ opacity: 0.1 }} />
                  {[ 'GATEWAY: ACTIVE', 'PORT_8080: LISTENING', 'ENCRYPTION: AES-256', 'UPLINK: STABLE' ].map(text => (
                    <Typography key={text} variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.5 }}>{`> ${text}`}</Typography>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* COLUMN 2: CENTRAL COMMAND PANEL */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 0, position: 'relative' }} className="hud-panel">
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: `4px solid ${theme.palette.primary.main}`, borderLeft: `4px solid ${theme.palette.primary.main}` }} />
              <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: `4px solid ${theme.palette.primary.main}`, borderRight: `4px solid ${theme.palette.primary.main}` }} />

              <Stack spacing={5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 1000, letterSpacing: -2 }}>
                    OPERATOR_<span style={{ color: theme.palette.primary.main }}>DOSSIER</span>
                  </Typography>
                  <RadarIcon sx={{ color: 'primary.main', animation: 'spin-slow 10s linear infinite', opacity: 0.5 }} />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, borderRadius: 0 }} className="hud-panel-soft">
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6 }}>SYNC_STATE</Typography>
                      <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary.main' }}>ALIGNED</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, borderRadius: 0 }} className="hud-panel-soft">
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6 }}>KEYPAIR</Typography>
                      <Typography sx={{ fontFamily: 'monospace', fontWeight: 900 }}>ROTATED</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, borderRadius: 0 }} className="hud-panel-soft">
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6 }}>TRACE_ID</Typography>
                      <Typography sx={{ fontFamily: 'monospace', fontWeight: 900 }}>NX-9E2</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box>
                  <SectionHeader title="Cognitive Archive" subtitle="creed and background" />
                  <Stack spacing={3}>
                    <TextField label="OPERATOR_MOTTO" value={motto} onChange={(e) => setMotto(e.target.value)} fullWidth sx={inputStyles} />
                    <TextField label="HISTORICAL_LOG" value={bio} multiline rows={6} onChange={(e) => setBio(e.target.value)} fullWidth sx={inputStyles} />
                  </Stack>
                </Box>

                <Box>
                  <SectionHeader title="System Identity" subtitle="network identifiers" />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="PUBLIC_SIG" value={signature} onChange={(e) => setSignature(e.target.value)} fullWidth sx={inputStyles} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="ASSET_URL" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} fullWidth sx={inputStyles} />
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* COLUMN 3: REGISTRY & SECURITY */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <Stack spacing={3}>
              <Paper sx={{ p: 4, borderRadius: 0 }} className="hud-panel-soft">
                {/* Fixed text.primary error here */}
                <SectionHeader title="Skill Registry" color="text.primary" />
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField 
                      placeholder="NEW_SKILL..." 
                      value={skillInput} 
                      onChange={(e) => setSkillInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                      size="small" fullWidth sx={inputStyles} 
                    />
                    <Button onClick={addSkill} sx={{ minWidth: 0, p: 1, bgcolor: 'primary.main', color: '#000', borderRadius: 0, '&:hover': { bgcolor: 'primary.light' } }}>+</Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skills.map((s) => (
                      <Chip key={s} label={s} onDelete={() => removeSkill(s)} 
                        sx={{ borderRadius: 0, fontFamily: 'monospace', fontWeight: 900, border: '1px solid', borderColor: 'divider' }} 
                      />
                    ))}
                  </Box>
                </Stack>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 0 }} className="hud-panel-soft">
                <SectionHeader title="Access Matrix" subtitle="roles + privileges" color="text.primary" />
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {['DEPLOY', 'AUDIT', 'OPS_READ', 'SANDBOX'].map((item) => (
                      <Chip key={item} label={item} sx={{ borderRadius: 0, fontFamily: 'monospace', fontWeight: 900 }} />
                    ))}
                  </Stack>
                  <Box sx={{ p: 2, border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`, position: 'relative' }}>
                    <Box sx={{ position: 'absolute', right: 6, top: 6, width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main', boxShadow: `0 0 12px ${theme.palette.success.main}`, animation: 'pulse-glow 2s infinite' }} />
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6 }}>
                      ACTIVE_SESSION
                    </Typography>
                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 900 }}>
                      CORE_EDGE_RELAY
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper sx={{ p: 4, borderRadius: 0, bgcolor: 'primary.main', color: '#000' }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <ShieldIcon />
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 900 }}>SYSCFG</Typography>
                </Stack>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, display: 'block', mb: 4 }}>
                  Synchronizing operational data with core AI architecture. Ensure all parameters are verified.
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveProfile}
                  disabled={loading}
                  sx={{ 
                    borderRadius: 0, bgcolor: '#000', color: 'primary.main', py: 2, fontWeight: 900,
                    '&:hover': { bgcolor: '#111', color: '#fff' }
                  }}
                >
                  SYNC_CORE
                </Button>
              </Paper>

              <Box sx={{ p: 2, border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`, textAlign: 'center' }}>
                 <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.5 }}>
                   NODE_STAMP: {new Date(profile.created_at).toLocaleTimeString()}
                 </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
