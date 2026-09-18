// src/osint/tools/DomainLookup.jsx
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { api } from '../../../services/api'
import LockIcon from '@mui/icons-material/Lock'

export default function DomainLookup() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [domain, setDomain] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!domain.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const data = await api.post('/osint/domain', { domain })
      setResult({ __error: false, ...data })
    } catch (err) {
      // 🔑 preserve backend JSON when present
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
          Domain Recon
        </Typography>

        <Typography color="text.secondary" maxWidth={720}>
          Perform passive reconnaissance against a target domain. This module
          aggregates DNS intelligence, registration metadata, and infrastructure
          signals without active scanning or payload delivery.
        </Typography>

        <Stack direction="row" spacing={1}>
          <Chip label="Passive OSINT" size="small" />
          <Chip label="No Active Probing" size="small" />
          <Chip label="Operator Safe" size="small" />
        </Stack>
      </Stack>

      {/* ===== INPUT PANEL ===== */}
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
            label="Target Domain"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={run}
            disabled={loading}
            sx={{ alignSelf: 'flex-start', px: 4, fontWeight: 800 }}
          >
            {loading ? 'Collecting intelligence…' : 'Run Lookup'}
          </Button>

          {loading && (
            <LinearProgress sx={{ height: 6, borderRadius: 999 }} />
          )}
        </Stack>
      </Paper>

      {/* ===== RESULTS ===== */}
      {result && (
        <Box mt={4}>
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
            /* ---- SUCCESS (UNCHANGED RAW VIEW) ---- */
            <Paper
              sx={{
                p: 0,
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                background: isDark
                  ? 'rgba(2,6,23,0.9)'
                  : theme.palette.background.paper,
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.6
                  )}`,
                  background: alpha(theme.palette.background.paper, 0.6),
                }}
              >
                <Typography fontWeight={900}>
                  Recon Output
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ letterSpacing: '.18em' }}
                >
                  RAW JSON · UNFILTERED
                </Typography>
              </Box>

              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 3,
                  fontSize: 13,
                  lineHeight: 1.6,
                  overflowX: 'auto',
                  color: isDark ? '#e5e7eb' : '#020617',
                  background:
                    'repeating-linear-gradient(0deg, rgba(255,255,255,.04), rgba(255,255,255,.04) 1px, transparent 1px, transparent 3px)',
                }}
              >
                {JSON.stringify(result, null, 2)}
              </Box>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  )
}