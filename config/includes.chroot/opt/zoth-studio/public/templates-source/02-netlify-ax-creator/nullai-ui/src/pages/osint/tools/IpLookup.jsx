// src/osint/tools/IpLookup.jsx
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

export default function IpLookup() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [ip, setIp] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!ip.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const data = await api.post('/osint/ip', { ip })
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

  const isError = result?.__error
  const errorMessage = result?.detail
  const isTierLimit =
    typeof errorMessage === 'string' &&
    errorMessage.toLowerCase().includes('osint')

  return (
    <Box>
      <Typography variant="h4" fontWeight={900} mb={3}>
        IP Intelligence
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack spacing={2}>
          <TextField
            label="Target IP"
            value={ip}
            onChange={e => setIp(e.target.value)}
            placeholder="8.8.8.8"
            fullWidth
          />
          <Button variant="contained" onClick={run} disabled={loading}>
            {loading ? 'Querying…' : 'Run Lookup'}
          </Button>
          {loading && <LinearProgress />}
        </Stack>
      </Paper>

      {result && (
        <Paper sx={{ p: 3 }}>
          {isTierLimit ? (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <LockIcon color="warning" />
                <Typography fontWeight={900}>OSINT Limit Reached</Typography>
              </Stack>
              <Typography>{errorMessage}</Typography>
              <Divider sx={{ my: 2 }} />
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </>
          ) : isError ? (
            <>
              <Typography color="error">{errorMessage}</Typography>
              <Divider sx={{ my: 2 }} />
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </>
          ) : (
            <>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={result.country} />
                <Chip label={result.org || 'Unknown Org'} />
                {result.rdns && <Chip label={`rDNS: ${result.rdns}`} />}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </>
          )}
        </Paper>
      )}
    </Box>
  )
}