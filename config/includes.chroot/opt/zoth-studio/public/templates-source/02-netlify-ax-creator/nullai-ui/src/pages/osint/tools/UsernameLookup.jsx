// src/osint/tools/UsernameLookup.jsx
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
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useState, useMemo } from 'react'
import { api } from '../../../services/api'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LockIcon from '@mui/icons-material/Lock'

export default function UsernameLookup() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [username, setUsername] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const run = async () => {
    if (!username.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const r = await api.post('/osint/username', { username })
      setResult({ __error: false, ...r })
    } catch (err) {
      const data = err?.data
      setResult(
        data
          ? { __error: true, ...data }
          : { __error: true, detail: 'Lookup failed.' }
      )
    } finally {
      setLoading(false)
    }
  }

  const isError = result?.__error === true
  const errorMessage = result?.detail || result?.error || null

  const isTierLimit =
    typeof errorMessage === 'string' &&
    errorMessage.toLowerCase().includes('osint')

  const exposureScore = useMemo(() => {
    if (!result?.platforms) return 0
    const total = Object.keys(result.platforms).length
    const hits = Object.values(result.platforms).filter(p => p.exists).length
    return Math.round((hits / total) * 100)
  }, [result])

  const saveResult = () => {
    const saved = JSON.parse(localStorage.getItem('osint_username') || '[]')
    saved.unshift({ ts: Date.now(), result })
    localStorage.setItem('osint_username', JSON.stringify(saved.slice(0, 25)))
  }

  return (
    <Box>
      {/* ===== HEADER ===== */}
      <Stack spacing={1.5} mb={5}>
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
          Username Intelligence
        </Typography>

        <Typography color="text.secondary" maxWidth={760}>
          Passive OSINT correlation across public platforms. No authentication.
          No contact. No footprint.
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label="Passive" size="small" />
          <Chip label="Attribution-Safe" size="small" />
          <Chip label="Correlation Engine" size="small" />
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
            ? '0 40px 120px rgba(0,0,0,.8)'
            : '0 24px 70px rgba(0,0,0,.15)',
        }}
      >
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Target Username"
            placeholder="alias / handle / gamer tag"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={run}
            disabled={loading}
            sx={{ fontWeight: 900, alignSelf: 'flex-start' }}
          >
            {loading ? 'Analyzing…' : 'Run Lookup'}
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
                  RAW RESPONSE
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

                <Typography
                  variant="caption"
                  sx={{ opacity: 0.6, letterSpacing: '.14em' }}
                >
                  RAW RESPONSE
                </Typography>

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
                  <Chip label={`Username: ${result.username}`} />
                  <Chip label={`Exposure: ${exposureScore}%`} color="primary" />
                  <Chip label={`${result.runtime_seconds}s`} size="small" />
                </Stack>

                <Divider />

                <Stack spacing={1.5}>
                  {Object.entries(result.platforms).map(
                    ([platform, data]) => (
                      <Stack
                        key={platform}
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ sm: 'center' }}
                        spacing={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: alpha(
                            theme.palette.background.paper,
                            0.55
                          ),
                          border: `1px solid ${alpha(
                            theme.palette.divider,
                            0.4
                          )}`,
                        }}
                      >
                        <Typography fontWeight={800}>
                          {platform}
                        </Typography>

                        <Stack direction="row" spacing={1}>
                          {data.exists ? (
                            <>
                              <Chip
                                label="FOUND"
                                color="success"
                                component="a"
                                href={data.url}
                                target="_blank"
                                clickable
                              />
                              <Tooltip title="Preview">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setPreviewUrl(data.url)
                                  }
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <Chip label="NOT FOUND" />
                          )}
                        </Stack>
                      </Stack>
                    )
                  )}
                </Stack>

                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={saveResult}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Save Result
                </Button>
              </Stack>
            </Paper>
          )}
        </Box>
      )}

      {/* ===== PREVIEW ===== */}
      <Dialog
        open={Boolean(previewUrl)}
        onClose={() => setPreviewUrl(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {previewUrl && (
            <iframe
              src={previewUrl}
              title="Profile Preview"
              style={{
                width: '100%',
                height: '80vh',
                border: 'none',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
