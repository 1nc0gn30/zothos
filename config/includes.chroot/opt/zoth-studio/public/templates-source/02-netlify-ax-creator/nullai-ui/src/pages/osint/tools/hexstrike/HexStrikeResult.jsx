import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Snackbar,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { useAuth } from '../../../../app/AuthProvider'
import { supabase } from '../../../../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function HexStrikeResult({ result, error, loading }) {
  const { user, tier } = useAuth()
  const navigate = useNavigate()

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [reports, setReports] = useState([])
  const [loadingReports, setLoadingReports] = useState(false)

  const MAX_REPORTS = tier === 'free' ? 10 : tier === 'standard' ? 100 : null
  const isQueued = result?.queued === true

  const stdout = result?.stdout || ''
  const stderr = result?.stderr || ''
  const output = stderr?.trim()?.length ? stderr + '\n' + stdout : stdout

  async function fetchReports() {
    if (!user) return
    setLoadingReports(true)
    const { data } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setReports(data ?? [])
    setLoadingReports(false)
  }

  useEffect(() => {
    fetchReports()
  }, [user])

  async function handleSave() {
    if (!user) {
      setSaveError('You must be logged in to save reports.')
      return
    }

    if (MAX_REPORTS && reports.length >= MAX_REPORTS) {
      setSaveError(`You have reached the maximum of ${MAX_REPORTS} reports for your tier.`)
      return
    }

    setSaving(true)
    setSaveError(null)

    const { error } = await supabase.from('reports').insert([
      {
        user_id: user.id,
        report_name: `Scan: ${result.tool} · ${new Date().toLocaleString()}`,
        tool_name: result.tool,
        report_content: output,
      },
    ])

    setSaving(false)

    if (error) setSaveError(error.message)
    else {
      setSaveSuccess(true)
      fetchReports()
    }
  }

  return (
    <Box sx={{ mt: 3 }}>

      {loading && <CircularProgress size={22} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && result && (
        <Paper
          variant="outlined"
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: '#0d1117',
            color: '#c9d1d9',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Tool: {result.tool} · Preset: {result.preset}
          </Typography>

          {isQueued ? (
            <>
              <Typography sx={{ mt: 2, color: '#7ee787' }}>
                {result.message}
              </Typography>
              <Typography sx={{ mt: 1, opacity: 0.7 }}>
                Job ID: {result.job_id}
              </Typography>
              <Button sx={{ mt: 2 }} onClick={() => navigate('/reports')}>
                View Reports
              </Button>
            </>
          ) : (
            <>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Runtime: {result.execution_time}s · {result.success ? 'SUCCESS' : 'FAILED'}
              </Typography>
              <Box sx={{ mt: 2 }}>{output || 'No output returned'}</Box>

              <Button
                sx={{ mt: 2 }}
                variant="contained"
                onClick={handleSave}
                disabled={saving}
              >
                Save Report
              </Button>
            </>
          )}
        </Paper>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Your Reports</Typography>
        {loadingReports ? <CircularProgress size={20} /> : (
          <List dense>
            {reports.map(r => (
              <ListItemButton key={r.id} onClick={() => navigate('/reports')}>
                <ListItemText
                  primary={r.report_name}
                  secondary={`${r.tool_name} · ${new Date(r.created_at).toLocaleString()}`}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>

      {saveError && <Alert severity="error">{saveError}</Alert>}
      <Snackbar open={saveSuccess} autoHideDuration={3000} onClose={() => setSaveSuccess(false)} message="Report saved" />

    </Box>
  )
}
