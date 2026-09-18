// src/osint/tools/HeaderLookup.jsx
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Divider,
  LinearProgress,
} from '@mui/material'
import { useState } from 'react'
import { api } from '../../../services/api'
import LockIcon from '@mui/icons-material/Lock'

export default function HeaderLookup() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!url.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const data = await api.post('/osint/headers', { url })
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
        HTTP Header Recon
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack spacing={2}>
          <TextField
            label="Target URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            fullWidth
          />
          <Button variant="contained" onClick={run} disabled={loading}>
            {loading ? 'Fetching…' : 'Run Lookup'}
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
              <Typography fontWeight={700}>Response Headers</Typography>
              <Divider sx={{ my: 2 }} />
              <pre>{JSON.stringify(result.headers, null, 2)}</pre>
            </>
          )}
        </Paper>
      )}
    </Box>
  )
}