import { Container, Typography, Divider, Alert } from '@mui/material'
import { useState } from 'react'
import HexStrikeForm from './HexStrikeForm'
import HexStrikeResult from './HexStrikeResult'
import { runHexStrike } from '../../../../services/api'
import { useAuth } from '../../../../app/AuthProvider'

export default function HexStrikePage() {
  const { accessToken, tier } = useAuth()

  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const hexstrikeAllowed = ['standard', 'pro', 'operator'].includes(tier)

  async function handleRun(payload) {
    setLoading(true)
    setError(null)

    try {
      const res = await runHexStrike(payload, accessToken)
      setResult(res)
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        'HexStrike execution failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, pb: 8 }}>
      <Typography variant="h4" gutterBottom>
        HexStrike
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Controlled execution of security tools based on your tier.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {!hexstrikeAllowed && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          HexStrike is available on the <strong>Standard</strong> tier and above.
        </Alert>
      )}

      <HexStrikeForm
        disabled={!hexstrikeAllowed}
        loading={loading}
        onRun={handleRun}
      />

      <HexStrikeResult
        loading={loading}
        error={error}
        result={result}
      />
    </Container>
  )
}