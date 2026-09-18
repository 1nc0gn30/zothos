import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DryCleaningRoundedIcon from '@mui/icons-material/DryCleaningRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import { useState } from 'react'
import { Box, Button, Chip, Divider, Drawer, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

function ActionDrawer({ open, action, onClose, onConfirm, onRoute }) {
  const [mode, setMode] = useState('dry')

  if (!action) return null

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ShieldRoundedIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {action.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agents mediate every step. No raw CLI, ever.
            </Typography>
          </Box>
        </Stack>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            What will change
          </Typography>
          <Stack spacing={1} mt={1}>
            {action.impact.map((item) => (
              <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                <CheckCircleRoundedIcon fontSize="small" color="primary" />
                <Typography variant="body2">{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            What stays untouched
          </Typography>
          <Stack spacing={1} mt={1}>
            {action.wontChange.map((item) => (
              <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                <DryCleaningRoundedIcon fontSize="small" color="secondary" />
                <Typography variant="body2">{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Divider />

        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Safety plan
          </Typography>
          <Chip label={action.safety} variant="outlined" color="primary" sx={{ borderRadius: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Rollback: {action.rollback}
          </Typography>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Choose how to proceed
          </Typography>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={mode}
            color="primary"
            onChange={(_, value) => value && setMode(value)}
          >
            <ToggleButton value="dry" sx={{ borderRadius: 2 }}>
              Dry run
            </ToggleButton>
            <ToggleButton value="real" sx={{ borderRadius: 2 }}>
              Real run
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="primary" fullWidth onClick={() => onConfirm(mode)}>
            Confirm
          </Button>
          <Button variant="outlined" color="inherit" fullWidth onClick={onRoute}>
            Route to human
          </Button>
        </Stack>

        <Button color="inherit" onClick={onClose} sx={{ mt: 'auto' }}>
          Close
        </Button>
      </Box>
    </Drawer>
  )
}

export default ActionDrawer
