import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import ClientLayout from './ClientLayout'
import ClientProfileCard from './ClientProfileCard'

function ClientProfilePage({ profile, onUpdate, onBack }) {
  return (
    <ClientLayout title="Client profile" subtitle="Edit tone, approvals, and notifications that guide every agent action.">
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Button startIcon={<ArrowBackRoundedIcon />} onClick={onBack} variant="text" sx={{ borderRadius: 2 }}>
            Back to portal
          </Button>
          <Stack direction="row" spacing={1}>
            <Chip label="Live" color="success" variant="outlined" />
            <Chip label="Brand guardrails" variant="outlined" />
          </Stack>
        </Stack>

        <Card elevation={0} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, rgba(25,118,210,0.12), rgba(25,118,210,0.04))' }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <TuneRoundedIcon color="primary" />
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Keep projects on-brand
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Preferences from this profile flow into templates, previews, and approvals automatically.
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip label="Tone" size="small" variant="outlined" color="primary" />
                <Chip label="Alerts" size="small" variant="outlined" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" fontWeight={800}>
                  Signal back to the agent
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update voice, brand guardrails, and notification channels before you approve changes.
                </Typography>
              </Stack>
              <Chip icon={<CheckCircleRoundedIcon color="success" />} label="Auto-applied" variant="outlined" />
            </Stack>
          </CardContent>
        </Card>

        <ClientProfileCard profile={profile} onUpdate={onUpdate} />
      </Stack>
    </ClientLayout>
  )
}

export default ClientProfilePage
