import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import ClientLayout from './ClientLayout'
import TemplateGallery from './TemplateGallery'

function ClientTemplateLibrary({ templates, onBack }) {
  return (
    <ClientLayout title="Project templates" subtitle="Curated starters the agent can tailor to your brand in minutes.">
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Button startIcon={<ArrowBackRoundedIcon />} onClick={onBack} variant="text" sx={{ borderRadius: 2 }}>
            Back to portal
          </Button>
          <Stack direction="row" spacing={1}>
            <Chip label="Agent-tuned" color="success" variant="outlined" />
            <Chip label="Instant setup" variant="outlined" />
          </Stack>
        </Stack>

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(49,196,141,0.16), rgba(49,196,141,0.05))',
          }}
        >
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <GridViewRoundedIcon color="success" />
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Start from a safe template
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pick a starter, let the agent apply voice and approvals, and launch a preview without surprises.
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip label="Voice-aware" size="small" variant="outlined" color="success" />
                <Chip label="Rollback ready" size="small" variant="outlined" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <AutoAwesomeRoundedIcon color="success" />
                <Stack spacing={0.25}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Let the agent polish
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Templates include tone prompts, accessibility defaults, and guardrails baked in.
                  </Typography>
                </Stack>
              </Stack>
              <Button
                variant="contained"
                color="success"
                startIcon={<LaunchRoundedIcon />}
                sx={{ borderRadius: 2 }}
                onClick={onBack}
              >
                Capture preferences
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <GridViewRoundedIcon color="success" />
                  <Typography variant="subtitle1" fontWeight={800}>
                    Client-ready options
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label="Accessibility-first" size="small" color="success" variant="outlined" />
                  <Chip label="Reservations CTA" size="small" variant="outlined" />
                  <Chip label="No live deploys" size="small" />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Toggle these options and the agent will wire them into your selected starter before creating a preview.
                </Typography>
              </Stack>
              <Button variant="contained" color="success" startIcon={<AutoAwesomeRoundedIcon />} sx={{ borderRadius: 2 }}>
                Ask the template bot
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Box>
          <TemplateGallery templates={templates} />
        </Box>
      </Stack>
    </ClientLayout>
  )
}

export default ClientTemplateLibrary
