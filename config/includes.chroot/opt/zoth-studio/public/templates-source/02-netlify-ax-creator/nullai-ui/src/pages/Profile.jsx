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
  Grid,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SaveIcon from '@mui/icons-material/Save';
import { supabase } from '../services/supabase'
import { useAuth } from '../app/AuthProvider'

// Shared sub-component for section headers
const SectionHeader = ({ title, subtitle }) => (
  <Box sx={{ mb: 2 }}>
    <Typography sx={{ 
      fontFamily: 'monospace', 
      fontSize: '0.7rem', 
      color: 'primary.main', 
      letterSpacing: 3, 
      fontWeight: 900 
    }}>
      {`// ${title.toUpperCase()}`}
    </Typography>
    {subtitle && (
      <Typography variant="caption" sx={{ opacity: 0.5 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default function Profile() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { user, profile, refreshProfile } = useAuth()

  // ... state logic remains the same ...
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [signature, setSignature] = useState('')
  const [bio, setBio] = useState('')
  const [motto, setMotto] = useState('')
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (!profile) return
    setEmail(profile.email ?? '')
    setAvatarUrl(profile.avatar_url ?? '')
    setSignature(profile.operator_signature ?? '')
    setBio(profile.bio ?? '')
    setMotto(profile.motto ?? '')
    setSkills(profile.skills ?? [])
  }, [profile])

  const addSkill = () => {
    if (!skillInput.trim() || skills.includes(skillInput.trim())) return
    setSkills([...skills, skillInput.trim()])
    setSkillInput('')
  }

  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s))

  const saveProfile = async () => {
    if (!user) return
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.from('profiles').update({
      email, avatar_url: avatarUrl, operator_signature: signature, bio, motto, skills,
    }).eq('id', user.id)
    if (error) setMessage({ type: 'error', text: error.message })
    else {
      setMessage({ type: 'success', text: 'Personnel file updated.' })
      refreshProfile?.()
    }
    setLoading(false)
  }

  if (!profile) return null

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      bgcolor: alpha(theme.palette.background.paper, 0.4),
      fontFamily: 'monospace',
      '& fieldset': { borderColor: alpha(theme.palette.divider, 0.1) },
      '&:hover fieldset': { borderColor: alpha(theme.palette.primary.main, 0.3) },
    },
    '& .MuiInputLabel-root': { fontFamily: 'monospace', fontSize: '0.8rem' }
  }

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 16 }, pb: 12 }}>
      <Grid container spacing={4}>
        
        {/* LEFT COLUMN: IDENTITY CARD */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${alpha('#1e293b', 0.9)}, ${alpha('#020617', 1)})`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              boxShadow: `0 0 40px ${alpha('#000', 0.5)}`,
            }}
          >
            {/* Dossier ID Badge */}
            <Box sx={{ position: 'absolute', top: 20, right: -30, transform: 'rotate(45deg)', bgcolor: 'primary.main', px: 6, py: 0.5 }}>
              <Typography variant="caption" fontWeight={900} color="black">OPERATOR</Typography>
            </Box>

            <Stack spacing={3} alignItems="center">
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={avatarUrl}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '20%',
                    border: `2px solid ${theme.palette.primary.main}`,
                    boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  }}
                >
                  {email?.[0]?.toUpperCase()}
                </Avatar>
                <FingerprintIcon sx={{ position: 'absolute', bottom: -10, right: -10, color: 'primary.main', bgcolor: 'background.paper', borderRadius: '50%', p: 0.5, border: '1px solid cyan' }} />
              </Box>

              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="h6" fontWeight={900}>{profile.operator_signature || 'Unknown Op'}</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.5 }}>
                  UUID: {user.id.slice(0, 13)}...
                </Typography>
              </Box>

              <Divider sx={{ width: '100%', borderColor: alpha('#fff', 0.1) }} />

              <Stack spacing={2} sx={{ width: '100%' }}>
                <SectionHeader title="System Status" />
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <Chip label={profile.tier} size="small" color="primary" sx={{ borderRadius: 1, fontWeight: 900 }} />
                  <Chip label={profile.access_enabled ? 'Verified' : 'Locked'} variant="outlined" size="small" color={profile.access_enabled ? 'success' : 'error'} />
                </Stack>
                
                <Box sx={{ p: 2, bgcolor: alpha('#000', 0.3), borderRadius: 2, border: `1px solid ${alpha('#fff', 0.05)}` }}>
                   <Typography variant="caption" sx={{ display: 'block', mb: 0.5, opacity: 0.4 }}>HASH_STRING</Typography>
                   <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', color: 'primary.light' }}>
                     {profile.operator_hash || 'SHA256_PENDING'}
                   </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: CORE DATA */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: '24px',
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack spacing={4}>
              <Box>
                <Typography variant="h4" fontWeight={900}>Personnel File</Typography>
                <Typography variant="body2" color="text.secondary">Modify operational parameters and identity metadata.</Typography>
              </Box>

              {message && <Alert severity={message.type} sx={{ borderRadius: 2 }}>{message.text}</Alert>}

              {/* SECTION: BIO */}
              <Box>
                <SectionHeader title="Operational Background" subtitle="Bio and mission creed" />
                <Stack spacing={2.5}>
                  <TextField label="Motto" value={motto} onChange={(e) => setMotto(e.target.value)} fullWidth sx={inputStyles} />
                  <TextField label="Detailed Bio" value={bio} multiline rows={4} onChange={(e) => setBio(e.target.value)} fullWidth sx={inputStyles} />
                </Stack>
              </Box>

              {/* SECTION: SKILLS */}
              <Box>
                <SectionHeader title="Technical Proficiencies" subtitle="Active skillset registry" />
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField 
                    label="Initialize Skill" 
                    value={skillInput} 
                    onChange={(e) => setSkillInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    fullWidth 
                    sx={inputStyles} 
                  />
                  <Button variant="contained" onClick={addSkill} sx={{ borderRadius: 2, px: 4 }}>Add</Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {skills.map((s) => (
                    <Chip key={s} label={s} onDelete={() => removeSkill(s)} 
                      sx={{ 
                        borderRadius: 1, 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        fontWeight: 700,
                        fontFamily: 'monospace'
                      }} 
                    />
                  ))}
                </Stack>
              </Box>

              {/* SECTION: CONFIG */}
              <Box>
                <SectionHeader title="Interface Configuration" />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Public Signature" value={signature} onChange={(e) => setSignature(e.target.value)} fullWidth sx={inputStyles} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Identity URL" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} fullWidth sx={inputStyles} />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.4 }}>
                  LAST_UPDATED: {new Date(profile.created_at).toLocaleDateString()}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={saveProfile}
                  disabled={loading}
                  sx={{ 
                    borderRadius: '12px', 
                    px: 6,
                    boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                  }}
                >
                  Synchronize Dossier
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}