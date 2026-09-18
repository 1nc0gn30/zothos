// src/osint/tools/EmailLookup.jsx
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Chip,
  Paper,
  Divider,
  LinearProgress,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { api } from '../../../services/api'
import LockIcon from '@mui/icons-material/Lock'

export default function EmailLookup() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!email.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const data = await api.post('/osint/email', { email })
      setResult({ __error: false, ...data })
    } catch (err) {
      setResult(
        err?.data
          ? { __error: true, ...err.data }
          : { __error: true, detail: 'Lookup failed.' }
      )
    } finally {
      setLoading(false)
    }
  }

  const isError = result?.__error === true
  const errorMessage = result?.detail || null

  const isTierLimit =
    typeof errorMessage === 'string' &&
    errorMessage.toLowerCase().includes('osint')

  return (
    <Box>
      {/* ===== HEADER ===== */}
      <Stack spacing={1.5} mb={4}>
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg,#22d3ee,#818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Email Intelligence
        </Typography>

        <Typography color="text.secondary" maxWidth={720}>
          Passive OSINT analysis of email infrastructure, service attribution,
          and public avatar exposure. No SMTP interaction. No contact.
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label="Passive" size="small" />
          <Chip label="Attribution-Safe" size="small" />
          <Chip label="Infrastructure Signals" size="small" />
        </Stack>
      </Stack>

      {/* ===== INPUT ===== */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          backdropFilter: 'blur(18px)',
          background: isDark
            ? 'rgba(15,23,42,0.75)'
            : theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          boxShadow: isDark
            ? '0 30px 90px rgba(0,0,0,.75)'
            : '0 20px 60px rgba(0,0,0,.15)',
        }}
      >
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Target Email Address"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={run}
            disabled={loading}
            sx={{ fontWeight: 900, alignSelf: 'flex-start' }}
          >
            {loading ? 'Collecting signals…' : 'Run Lookup'}
          </Button>

          {loading && (
            <LinearProgress sx={{ height: 6, borderRadius: 999 }} />
          )}
        </Stack>
      </Paper>

      {/* ===== RESULTS ===== */}
      {result && (
        <Box mt={5}>
          {/* ---- TIER LIMIT ---- */}
          {isTierLimit ? (
            <Paper
              sx={{
                p: 3.5,
                borderRadius: 3,
                background: alpha(theme.palette.warning.main, 0.12),
                border: `1px solid ${theme.palette.warning.main}`,
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LockIcon color="warning" />
                  <Typography fontWeight={900}>
                    OSINT Limit Reached
                  </Typography>
                </Stack>

                <Typography color="text.secondary">
                  {errorMessage}
                </Typography>

                <Divider />

                <Typography
                  variant="caption"
                  sx={{ opacity: 0.7, letterSpacing: '.14em' }}
                >
                  RAW BACKEND RESPONSE
                </Typography>

                <pre
                  style={{
                    margin: 0,
                    padding: 12,
                    borderRadius: 8,
                    background: 'rgba(0,0,0,.4)',
                    fontSize: 12,
                    overflowX: 'auto',
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </pre>

                <Button
                  variant="contained"
                  color="warning"
                  href="/pricing"
                  sx={{ alignSelf: 'flex-start', fontWeight: 900 }}
                >
                  Upgrade Access
                </Button>
              </Stack>
            </Paper>
          ) : isError ? (
            /* ---- GENERIC ERROR ---- */
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.error.main}`,
                background: alpha(theme.palette.error.main, 0.08),
              }}
            >
              <Stack spacing={2}>
                <Typography color="error" fontWeight={800}>
                  {errorMessage}
                </Typography>

                <Divider />

                <pre
                  style={{
                    margin: 0,
                    padding: 12,
                    borderRadius: 8,
                    background: 'rgba(0,0,0,.35)',
                    fontSize: 12,
                    overflowX: 'auto',
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Stack>
            </Paper>
          ) : (
            /* ---- SUCCESS ---- */
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: isDark
                  ? 'rgba(2,6,23,0.92)'
                  : theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={`Email: ${result.email}`} />
                  <Chip label={`Domain: ${result.domain}`} />
                  <Chip label={`${result.runtime_seconds}s`} size="small" />
                </Stack>

                <Divider />

                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Mail Infrastructure
                  </Typography>

                  <Typography variant="body2">
                    • MX records:{' '}
                    {result.mx_records.length
                      ? result.mx_records.join(', ')
                      : 'none detected'}
                  </Typography>

                  <Typography variant="body2">
                    • Gravatar:{' '}
                    {result.gravatar ? 'public avatar detected' : 'none'}
                  </Typography>
                </Stack>

                {result.gravatar_url && (
                  <>
                    <Divider />
                    <Typography variant="body2" color="text.secondary">
                      Public Resource
                    </Typography>
                    <Typography variant="body2">
                      <a
                        href={result.gravatar_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {result.gravatar_url}
                      </a>
                    </Typography>
                  </>
                )}

                <Divider />

                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Provider Signals
                  </Typography>

                  {Object.entries(result.common_providers).map(
                    ([provider, match]) => (
                      <Typography key={provider} variant="body2">
                        • {provider}: {match ? 'match' : 'no'}
                      </Typography>
                    )
                  )}
                </Stack>
              </Stack>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  )
}