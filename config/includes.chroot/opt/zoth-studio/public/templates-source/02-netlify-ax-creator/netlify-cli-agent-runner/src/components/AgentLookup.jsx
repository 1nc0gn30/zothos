import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Drawer,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

function AgentLookup({ agents }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [requested, setRequested] = useState(null)

  const filtered = useMemo(
    () =>
      agents.filter(
        (agent) =>
          agent.name.toLowerCase().includes(query.toLowerCase()) ||
          agent.specialty.toLowerCase().includes(query.toLowerCase()) ||
          agent.focus.some((item) => item.toLowerCase().includes(query.toLowerCase()))
      ),
    [agents, query]
  )

  const handleSelect = (agent) => {
    setSelected(agent)
    setRequested(null)
    setOpen(true)
  }

  const handleRequest = (route) => {
    setRequested(route)
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PersonSearchRoundedIcon color="success" />
          <Typography variant="h6" fontWeight={800}>
            Developer / Agent lookup
          </Typography>
        </Stack>
        <Chip label="No tickets required" size="small" variant="outlined" color="success" sx={{ borderRadius: 2 }} />
      </Stack>

      <TextField
        placeholder="Search AI or human help by specialty"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton size="small" disabled>
                <BoltRoundedIcon color="success" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} flexWrap="wrap">
        {filtered.map((agent) => (
          <Card key={agent.name} variant="outlined" sx={{ minWidth: { xs: '100%', md: 260 }, flex: 1, borderRadius: 2 }}>
            <CardActionArea onClick={() => handleSelect(agent)} sx={{ p: 2, height: '100%' }}>
              <Stack spacing={1} alignItems="flex-start">
                <Chip label={agent.type} color={agent.type === 'AI Agent' ? 'success' : 'default'} size="small" variant="outlined" />
                <Typography variant="subtitle1" fontWeight={800}>
                  {agent.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {agent.specialty}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={`Turnaround: ${agent.turnaround}`} size="small" />
                  <Chip label={agent.availability} size="small" color={agent.availability === 'Instant' ? 'success' : 'default'} variant="outlined" />
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <StarRoundedIcon fontSize="small" color="warning" />
                  <Typography variant="caption">{agent.score} confidence</Typography>
                </Stack>
              </Stack>
            </CardActionArea>
          </Card>
        ))}
      </Stack>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 } }}>
        {selected && (
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PeopleAltRoundedIcon color="success" />
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  {selected.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selected.specialty}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Chip label={selected.type} color={selected.type === 'AI Agent' ? 'success' : 'default'} />
              <Chip label={selected.availability} variant="outlined" />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {selected.bio}
            </Typography>

            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Typical coverage
              </Typography>
              {selected.focus.map((item) => (
                <Stack key={item} direction="row" spacing={1} alignItems="center">
                  <AccessTimeRoundedIcon fontSize="small" color="success" />
                  <Typography variant="body2">{item}</Typography>
                </Stack>
              ))}
            </Stack>

            <Stack direction="column" spacing={1}>
              <Button variant="contained" color="success" onClick={() => handleRequest('ai')}>
                Request AI help
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => handleRequest('human')}>
                Route to this human
              </Button>
              <Button variant="text" color="success" onClick={() => handleRequest('decide')}>
                Ask AI to decide for me
              </Button>
            </Stack>

            {requested && (
              <Card variant="outlined" sx={{ borderRadius: 2, mt: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Request captured
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {requested === 'ai' && 'AI agent is responding in under a minute.'}
                    {requested === 'human' && 'A human developer will confirm ETA shortly.'}
                    {requested === 'decide' && 'We will route to the best option based on urgency.'}
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Button onClick={() => setOpen(false)} sx={{ mt: 'auto' }} color="inherit">
              Close
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  )
}

export default AgentLookup
