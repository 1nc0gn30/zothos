import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import ClientLayout from '../components/ClientLayout'
import ActionCard from '../components/cards/ActionCard'
import { clientActions } from '../data/mockClientData'

function ClientActions() {
  return (
    <ClientLayout subtitle="Guided actions stay human-friendly and reversible.">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          Guided actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Safe presets curated by developers. No CLI exposed.
        </Typography>
        <Grid container spacing={2} columns={{ xs: 1, sm: 12 }}>
          {clientActions.map((action) => (
            <Grid key={action.id} size={{ xs: 12, sm: 4 }}>
              <ActionCard action={action} onSelect={() => {}} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ClientLayout>
  )
}

export default ClientActions
