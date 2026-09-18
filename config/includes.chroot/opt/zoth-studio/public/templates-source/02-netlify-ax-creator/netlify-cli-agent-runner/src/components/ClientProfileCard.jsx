import EditRoundedIcon from '@mui/icons-material/EditRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'

function ClientProfileCard({ profile, onUpdate }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(profile)

  const toneChip = useMemo(() => {
    const toneMap = {
      professional: 'success',
      friendly: 'primary',
      bold: 'warning',
    }
    return toneMap[profile.tone] || 'default'
  }, [profile.tone])

  const handleOpen = () => {
    setDraft(profile)
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onUpdate(draft)
    setOpen(false)
  }

  return (
    <>
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Business identity
              </Typography>
              <Typography variant="h6" fontWeight={800}>
                {profile.businessName}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={profile.industry} size="small" color="success" variant="outlined" sx={{ borderRadius: 2 }} />
                <Chip label={profile.goal} size="small" variant="outlined" />
                <Chip label={`Tone: ${profile.tone}`} size="small" color={toneChip} variant="outlined" />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Guidance: {profile.guidance}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <PublicRoundedIcon color="success" fontSize="small" />
                <Typography variant="caption" color="text.secondary">
                  Preferences steer every guided flow.
                </Typography>
              </Stack>
            </Stack>
            <Button variant="outlined" startIcon={<EditRoundedIcon />} onClick={handleOpen}>
              Edit profile
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={open} onClose={handleClose} PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 } }}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <EditRoundedIcon color="success" />
            <Typography variant="h6" fontWeight={800}>
              Update profile
            </Typography>
          </Stack>

          <TextField
            label="Business name"
            value={draft.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Industry</InputLabel>
            <Select value={draft.industry} label="Industry" onChange={(e) => handleChange('industry', e.target.value)}>
              {['Restaurant / Café', 'Auto shop / Trades', 'Small retail', 'Local service business', 'Creator / Portfolio', 'Agency'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Website goal</InputLabel>
            <Select value={draft.goal} label="Website goal" onChange={(e) => handleChange('goal', e.target.value)}>
              {['Leads', 'Reservations', 'Ecommerce', 'Showcase'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Preferred tone</InputLabel>
            <Select value={draft.tone} label="Preferred tone" onChange={(e) => handleChange('tone', e.target.value)}>
              {['professional', 'friendly', 'bold'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Guidance for agents"
            value={draft.guidance}
            onChange={(e) => handleChange('guidance', e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2" color="text.secondary">
              Contact and notifications
            </Typography>
            <TextField
              label="Email"
              value={draft.contact.email}
              onChange={(e) => handleChange('contact', { ...draft.contact, email: e.target.value })}
              InputProps={{ startAdornment: <EmailRoundedIcon color="success" sx={{ mr: 1 }} /> }}
            />
            <TextField
              label="Phone"
              value={draft.contact.phone}
              onChange={(e) => handleChange('contact', { ...draft.contact, phone: e.target.value })}
              InputProps={{ startAdornment: <PhoneIphoneRoundedIcon color="success" sx={{ mr: 1 }} /> }}
            />
            <FormControlLabel
              control={
                <Switch
                  color="success"
                  checked={draft.contact.notifications}
                  onChange={(e) => handleChange('contact', { ...draft.contact, notifications: e.target.checked })}
                />
              }
              label="Notify me when actions start or finish"
            />
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="success" fullWidth onClick={handleSave}>
              Save changes
            </Button>
            <Button variant="text" color="inherit" fullWidth onClick={handleClose}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  )
}

export default ClientProfileCard
