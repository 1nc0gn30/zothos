import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import Diversity2RoundedIcon from '@mui/icons-material/Diversity2Rounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import AgentLookup from './AgentLookup'
import ClientLayout from './ClientLayout'

function DeveloperLookupPage({ agents = [], onBack }) {
  return (
    <ClientLayout
      title="Find a developer or AI partner"
      subtitle="Route requests to a trusted human dev or the AI agent with one tap."
    >
      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Button startIcon={<ArrowBackRoundedIcon />} onClick={onBack} variant="text" sx={{ borderRadius: 2 }}>
              Back to portal
            </Button>
            <Chip label="Fast routing" color="success" variant="outlined" />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label="AI + human" size="small" color="success" variant="outlined" sx={{ borderRadius: 2 }} />
            <Chip label="No tickets" size="small" variant="outlined" />
          </Stack>
        </Stack>

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(49,196,141,0.16), rgba(49,196,141,0.04))',
          }}
        >
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Stack direction="row" spacing={1.25} alignItems="center" flex={1}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, rgba(49,196,141,0.7), rgba(5,10,18,0.9))',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'common.white',
                  }}
                >
                  <SmartToyRoundedIcon fontSize="small" />
                </Box>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Concierge routing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Search specialties, preview confidence, and decide if AI or human is best.
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip icon={<Diversity2RoundedIcon />} label="Trusted humans" variant="outlined" />
                <Chip icon={<AutoAwesomeRoundedIcon />} label="AI in seconds" color="success" variant="outlined" />
                <Chip icon={<ScheduleRoundedIcon />} label="Instant ETA" variant="outlined" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <AgentLookup agents={agents} />
      </Stack>
    </ClientLayout>
  )
}

export default DeveloperLookupPage
