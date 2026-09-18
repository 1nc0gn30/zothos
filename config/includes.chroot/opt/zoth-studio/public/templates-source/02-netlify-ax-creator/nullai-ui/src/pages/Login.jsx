import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Divider,
  Link,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useAuth } from '../app/AuthProvider'

export default function Login() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const { isAuthenticated, hasAccess, isWaitlisted } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  if (isAuthenticated) {
    if (!hasAccess) return <Navigate to="/pricing" replace />
    if (isWaitlisted) return <Navigate to="/waitlist" replace />
    return <Navigate to="/playground" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const action =
      mode === 'login'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/login`,
            },
          })

    const { error } = await action

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({
        type: 'success',
        text:
          mode === 'login'
            ? 'Authenticated. Routing access checks…'
            : 'Verification email sent. Confirm to activate your account.',
      })
    }

    setLoading(false)
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 13, md: 17 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          p: { xs: 3, md: 4.5 },
          borderRadius: 4,
          background: isDark
            ? `
              linear-gradient(
                180deg,
                ${alpha(theme.palette.background.paper, 0.92)},
                ${alpha('#020617', 0.95)}
              )
            `
            : `
              linear-gradient(
                180deg,
                ${alpha('#ffffff', 0.95)},
                ${alpha('#eef3ff', 0.85)}
              )
            `,
          backdropFilter: 'blur(22px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          boxShadow: isDark
            ? '0 40px 120px rgba(0,0,0,0.75)'
            : '0 30px 90px rgba(60,80,160,0.25)',
        }}
      >
        <Stack spacing={3.5}>
          {/* HEADER */}
          <Box textAlign="center">
            <Typography
              variant="h4"
              fontWeight={900}
              letterSpacing=".04em"
            >
              {mode === 'login' ? 'Secure Sign In' : 'Create Account'}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 1, maxWidth: 420, mx: 'auto' }}
            >
              Private access · Capacity-limited · Operator-grade
            </Typography>
          </Box>

          <Divider />

          {/* STATUS */}
          {message && <Alert severity={message.type}>{message.text}</Alert>}

          {/* FORM */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.75}>
              <TextField
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                helperText={
                  mode === 'signup'
                    ? 'Minimum 16 characters · uppercase · lowercase · number · symbol'
                    : null
                }
              />

              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.35,
                  fontWeight: 800,
                  letterSpacing: '.05em',
                  boxShadow: `0 12px 40px ${alpha(
                    theme.palette.primary.main,
                    0.35
                  )}`,
                }}
              >
                {loading
                  ? 'Processing…'
                  : mode === 'login'
                  ? 'Authenticate'
                  : 'Create Account'}
              </Button>
            </Stack>
          </Box>

          {/* SECURITY RECOMMENDATION */}
          <Divider />

          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              background: alpha(theme.palette.background.paper, 0.55),
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={800}
              gutterBottom
            >
              Security recommendation
            </Typography>

            <Typography variant="body2" color="text.secondary">
              This platform enforces long, high-entropy passwords. Use a
              password manager to avoid reuse, leaks, or memorization errors.
            </Typography>

            <Stack spacing={0.5} sx={{ mt: 1 }}>
              <Typography variant="body2">
                •{' '}
                <Link
                  href="https://bitwarden.com"
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                >
                  Bitwarden
                </Link>{' '}
                — open-source, zero-knowledge
              </Typography>

              <Typography variant="body2">
                •{' '}
                <Link
                  href="https://1password.com"
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                >
                  1Password
                </Link>{' '}
                — strong UX, audited model
              </Typography>

              <Typography variant="body2">
                •{' '}
                <Link
                  href="https://www.lastpass.com"
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                >
                  LastPass
                </Link>{' '}
                — widely used (assess risk profile)
              </Typography>
            </Stack>
          </Box>

          {/* FOOTER */}
          <Stack spacing={1.5} textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Access requires available capacity and an active subscription.
            </Typography>

            <Button
              variant="text"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              sx={{ fontWeight: 700 }}
            >
              {mode === 'login'
                ? 'Need access? Create an account'
                : 'Already verified? Sign in'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  )
}
