import { useState } from 'react'
import { Box, Chip, Snackbar, Stack, Typography } from '@mui/material'
import ActionCard from './cards/ActionCard'
import ActionDrawer from './drawers/ActionDrawer'

function GuidedActions({ actions, onLog }) {
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const [snackbar, setSnackbar] = useState(null)

  const handleSelect = (action) => {
    setSelected(action)
    setOpen(true)
  }

  const handleConfirm = (mode) => {
    setOpen(false)
    setSnackbar(`Running ${selected?.title} as a ${mode === 'dry' ? 'dry run' : 'full run'}`)
    onLog(`${mode === 'dry' ? 'Dry run —' : 'Started —'} ${selected?.title}`)
  }

  const handleRoute = () => {
    setOpen(false)
    setSnackbar('Routed to a human developer for review')
    onLog(`Routed — ${selected?.title}`)
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="Safe" color="success" size="small" variant="outlined" sx={{ borderRadius: 2 }} />
          <Typography variant="h6" fontWeight={800}>
            Guided actions
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          No CLI or branches exposed.
        </Typography>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} flexWrap="wrap">
        {actions.map((action) => (
          <Box key={action.id} sx={{ minWidth: { xs: '100%', md: 260 }, flex: 1 }}>
            <ActionCard action={action} onSelect={handleSelect} />
          </Box>
        ))}
      </Stack>

      <ActionDrawer
        key={`${selected?.id ?? 'none'}-${open ? 'open' : 'closed'}`}
        open={open}
        action={selected}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        onRoute={handleRoute}
      />

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={3000}
        message={snackbar}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}

export default GuidedActions
