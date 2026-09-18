import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import HubIcon from '@mui/icons-material/Hub'
import GroupsIcon from '@mui/icons-material/Groups'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import HandshakeIcon from '@mui/icons-material/Handshake'
import AgentTelemetryWidget from '../../components/swarm_widgets/AgentTelemetryWidget'
import SwarmStatusMonitor from '../../components/swarm_widgets/SwarmStatusMonitor'
import ExecutionLogs from '../../components/swarm_widgets/ExecutionLogs'
import {
  loadSwarmState,
  saveSwarmState,
  matchAgentsToRequest,
  createHelpRequest,
} from '../../lib/swarmProtocol'

export default function Swarm() {
  const theme = useTheme()
  const [state, setState] = useState(() => loadSwarmState())
  const [summary, setSummary] = useState('')
  const [caps, setCaps] = useState('security, owasp')
  const [selectedProject, setSelectedProject] = useState(state.projects[0]?.id)

  const openRequests = state.help_board.filter((r) => r.status === 'open')

  const matches = useMemo(() => {
    if (!openRequests[0]) return []
    return matchAgentsToRequest(state.agents, openRequests[0])
  }, [state.agents, openRequests])

  const persist = (next) => {
    setState(next)
    saveSwarmState(next)
  }

  const postHelpRequest = () => {
    if (!summary.trim()) return
    const envelope = createHelpRequest({
      from_agent: 'local-user',
      project_id: selectedProject,
      target_project_id:
        selectedProject === 'proj-nullai-core' ? 'proj-zoth-bridge' : 'proj-nullai-core',
      capabilities_needed: caps
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      summary: summary.trim(),
    })
    const req = {
      id: envelope.id,
      project_id: envelope.project_id,
      target_project_id: envelope.target_project_id,
      summary: envelope.body.summary,
      capabilities_needed: envelope.body.capabilities_needed,
      from_agent: envelope.from_agent,
      status: 'open',
      created_at: Date.now(),
      envelope,
    }
    const next = {
      ...state,
      help_board: [req, ...state.help_board],
      activity: [
        { id: crypto.randomUUID(), ts: Date.now(), text: `Help request posted: ${req.summary}` },
        ...state.activity,
      ],
    }
    persist(next)
    setSummary('')
  }

  const acceptBestMatch = (requestId) => {
    const req = state.help_board.find((r) => r.id === requestId)
    if (!req) return
    const best = matchAgentsToRequest(state.agents, req)[0]
    if (!best) return
    const next = {
      ...state,
      help_board: state.help_board.map((r) =>
        r.id === requestId
          ? { ...r, status: 'matched', matched_agent: best.agent.id }
          : r
      ),
      activity: [
        {
          id: crypto.randomUUID(),
          ts: Date.now(),
          text: `${best.agent.display_name} offered help on: ${req.summary}`,
        },
        ...state.activity,
      ],
    }
    persist(next)
  }

  const cardSx = {
    p: 2.5,
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
    background:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.9)
        : theme.palette.background.paper,
  }

  return (
    <Box sx={{ py: { xs: 10, md: 12 }, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Chip
            icon={<HubIcon />}
            label="NullAI Swarm · collaborative agent mesh"
            color="primary"
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            Work together. Let agents help each other.
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
            Swarm is NullAI&apos;s decentralized collaboration layer: multi-human projects where
            your agents can advertise skills and assist other projects — without dumping secrets.
            This page runs a local mesh demo; Supabase schema is ready in{' '}
            <code>supabase/swarm_schema.sql</code>.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            mb: 3,
          }}
        >
          <Paper sx={cardSx}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <GroupsIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Swarm projects
              </Typography>
            </Stack>
            <Stack spacing={1.5}>
              {state.projects.map((p) => (
                <Paper
                  key={p.id}
                  variant="outlined"
                  onClick={() => setSelectedProject(p.id)}
                  sx={{
                    p: 1.75,
                    cursor: 'pointer',
                    borderColor:
                      selectedProject === p.id
                        ? theme.palette.primary.main
                        : alpha(theme.palette.divider, 0.8),
                    bgcolor:
                      selectedProject === p.id
                        ? alpha(theme.palette.primary.main, 0.08)
                        : 'transparent',
                  }}
                >
                  <Typography fontWeight={700}>{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.description}
                  </Typography>
                  <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
                    {(p.tags || []).map((t) => (
                      <Chip key={t} size="small" label={t} />
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>

          <Paper sx={cardSx}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <SmartToyIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Online agents
              </Typography>
            </Stack>
            <Stack spacing={1.25}>
              {state.agents.map((a) => (
                <Box
                  key={a.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1,
                    p: 1.25,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                  }}
                >
                  <Box>
                    <Typography fontWeight={700}>{a.display_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(a.capabilities || []).join(' · ')}
                    </Typography>
                  </Box>
                  <Chip size="small" color="success" label={a.status} />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>

        <Paper sx={{ ...cardSx, mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <HandshakeIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Post a cross-project help request
            </Typography>
          </Stack>
          <Stack spacing={1.5}>
            <TextField
              label="What do you need help with?"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Capabilities needed (comma-separated)"
              value={caps}
              onChange={(e) => setCaps(e.target.value)}
              fullWidth
              helperText="Example: security, react, seo, osint"
            />
            <Button variant="contained" onClick={postHelpRequest} sx={{ alignSelf: 'flex-start' }}>
              Broadcast help request
            </Button>
          </Stack>
        </Paper>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              mb: 3,
            }}
          >
            <SwarmStatusMonitor nodes={state.agents} projects={state.projects} />
            <AgentTelemetryWidget agent={state.agents[0]} />
          </Box>
          <Box sx={{ mb: 3 }}>
            <ExecutionLogs logs={state.activity} />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            }}
          >
          <Paper sx={cardSx}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
              Help board
            </Typography>
            <Stack spacing={1.5}>
              {state.help_board.map((r) => (
                <Box
                  key={r.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" gap={1} alignItems="center">
                    <Typography fontWeight={700}>{r.summary}</Typography>
                    <Chip size="small" label={r.status} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    needs: {(r.capabilities_needed || []).join(', ')}
                    {r.matched_agent ? ` · matched ${r.matched_agent}` : ''}
                  </Typography>
                  {r.status === 'open' && (
                    <Button size="small" sx={{ mt: 1 }} onClick={() => acceptBestMatch(r.id)}>
                      Match best agent
                    </Button>
                  )}
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper sx={cardSx}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
              Suggested matches (demo)
            </Typography>
            {matches.length === 0 ? (
              <Typography color="text.secondary" variant="body2">
                Post a request or open board item to see agent matches.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {matches.map((m) => (
                  <Box key={m.agent.id} sx={{ p: 1.25, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                    <Typography fontWeight={700}>{m.agent.display_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      score {m.score} · hits: {m.hits.join(', ')}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Activity
            </Typography>
            <Stack spacing={0.75}>
              {state.activity.slice(0, 8).map((a) => (
                <Typography key={a.id} variant="caption" color="text.secondary">
                  {new Date(a.ts).toLocaleString()} — {a.text}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Protocol helpers: <code>src/lib/swarmProtocol.js</code> · Vision:{' '}
          <code>COLLAB_DAPP.md</code> · Next: apply Supabase schema and replace local mock.
        </Typography>
      </Container>
    </Box>
  )
}
