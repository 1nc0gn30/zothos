import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Chip,
  Divider,
  useTheme
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../../services/supabase'
import { useAuth } from '../../../app/AuthProvider'

function parseHolehe(text = '') {
  const used = []
  const unused = []
  const rate = []

  for (const line of text.split('\n')) {
    const m = line.match(/^\[(.?)\]\s+(.+)/)
    if (!m) continue
    const type = m[1]
    const site = m[2]
    if (type === '+') used.push(site)
    else if (type === '-') unused.push(site)
    else if (type === 'x') rate.push(site)
  }

  return { used, unused, rate }
}

export default function HoleheLookup() {
  const { user, tier } = useAuth()
  const theme = useTheme()

  const [email, setEmail] = useState('')
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [report, setReport] = useState(null)

  const isAllowed = tier !== 'free'
  const parsed = useMemo(() => parseHolehe(report?.report_content), [report])

  async function run() {
    setError(null)
    setReport(null)
    setLoading(true)

    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    if (!token) {
      setError('Not authenticated')
      setLoading(false)
      return
    }

    const res = await fetch('/api/holehe/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    })

    const body = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(body.detail || 'Failed to start Holehe')
      return
    }

    setJob(body)
  }

  async function pollReport() {
    if (!user) return

    const { data } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .eq('tool_name', 'holehe')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) setReport(data)
  }

  useEffect(() => {
    if (!job) return
    const i = setInterval(pollReport, 2500)
    return () => clearInterval(i)
  }, [job])

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Holehe · Email OSINT</Typography>

      {!isAllowed && (
        <Alert severity="warning">
          Holehe requires Standard tier or higher.
        </Alert>
      )}

      <TextField
        label="Target Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="target@example.com"
        fullWidth
      />

      <Button
        variant="contained"
        disabled={!email || !isAllowed || loading}
        onClick={run}
      >
        {loading ? 'Scanning…' : 'Run Holehe'}
      </Button>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress size={22} />
              <Typography variant="body2">
                Enumerating email across 120+ services…
              </Typography>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <Alert severity="error">{error}</Alert>}

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Paper
            sx={{
              p: 3,
              background:
                theme.palette.mode === 'dark'
                  ? '#0d1117'
                  : theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="caption">
                Holehe Report · {new Date(report.created_at).toLocaleString()}
              </Typography>

              <Divider />

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={`Used: ${parsed.used.length}`} color="success" />
                <Chip label={`Not used: ${parsed.unused.length}`} />
                <Chip label={`Rate-limited: ${parsed.rate.length}`} color="warning" />
              </Stack>

              <Divider />

              <Typography variant="subtitle2">Accounts found</Typography>
              <Box sx={{ maxHeight: 220, overflowY: 'auto' }}>
                {parsed.used.map(site => (
                  <Chip key={site} label={site} color="success" sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>

              <Divider />

              <Typography variant="subtitle2">Raw OSINT Output</Typography>
              <Paper
                sx={{
                  p: 2,
                  background: theme.palette.mode === 'dark' ? '#010409' : '#f5f5f5',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  maxHeight: 300,
                  overflowY: 'auto',
                }}
              >
                {report.report_content}
              </Paper>
            </Stack>
          </Paper>
        </motion.div>
      )}
    </Stack>
  )
}
