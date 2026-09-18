import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Alert,
  Collapse,
  Paper,
  IconButton,
  TextField,
  Chip,
  Stack,
  Button,
  InputAdornment,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useAuth } from '../../app/AuthProvider'
import { supabase } from '../../services/supabase'
import { ExpandLess, ExpandMore, Add } from '@mui/icons-material'

export default function Reports() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')

  // Temp state for editing
  const [editingTitle, setEditingTitle] = useState({})
  const [newTagInput, setNewTagInput] = useState({})

  // Fetch reports
  const fetchReports = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setReports(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchReports()
  }, [user])

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id)

  const filteredReports = reports.filter((r) => {
    const q = search.toLowerCase()
    const inTitle = r.title?.toLowerCase().includes(q)
    const inTags = r.tags?.some((t) => t.toLowerCase().includes(q))
    return inTitle || inTags || r.report_name.toLowerCase().includes(q)
  })

  /** =====================
   * Update title
   ====================== */
  const saveTitle = async (report) => {
    if (!user) return
    const newTitle = editingTitle[report.id]?.trim().slice(0, 20) || null
    const { error } = await supabase
      .from('reports')
      .update({ title: newTitle })
      .eq('id', report.id)
      .eq('user_id', user.id)

    if (error) alert(error.message)
    else fetchReports()
  }

  /** =====================
   * Add tag
   ====================== */
  const addTag = async (report) => {
    if (!user) return
    const tag = newTagInput[report.id]?.trim()
    if (!tag) return
    const newTags = Array.from(new Set([...(report.tags || []), tag])) // avoid duplicates
    const { error } = await supabase
      .from('reports')
      .update({ tags: newTags })
      .eq('id', report.id)
      .eq('user_id', user.id)

    if (error) alert(error.message)
    else {
      fetchReports()
      setNewTagInput((prev) => ({ ...prev, [report.id]: '' }))
    }
  }

  /** =====================
   * Remove tag
   ====================== */
  const removeTag = async (report, tagToRemove) => {
    if (!user) return
    const newTags = (report.tags || []).filter((t) => t !== tagToRemove)
    const { error } = await supabase
      .from('reports')
      .update({ tags: newTags })
      .eq('id', report.id)
      .eq('user_id', user.id)

    if (error) alert(error.message)
    else fetchReports()
  }

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Your Reports
      </Typography>

      {/* Search */}
      <TextField
        label="Search by title, tags, or report name"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && filteredReports.length === 0 && (
        <Typography color="text.secondary">No reports found.</Typography>
      )}

      {!loading && !error && filteredReports.length > 0 && (
        <List>
          {filteredReports.map((r) => {
            const isExpanded = expandedId === r.id
            return (
              <Box key={r.id} sx={{ mb: 2, borderRadius: 2 }}>
                {/* Report header */}
                <ListItemButton
                  onClick={() => toggleExpand(r.id)}
                  sx={{
                    bgcolor: '#111318',
                    '&:hover': { bgcolor: '#1c1f26' },
                    borderRadius: 2,
                  }}
                >
                  <ListItemText
                    primary={
                      <TextField
                        value={editingTitle[r.id] ?? r.title ?? r.report_name}
                        onChange={(e) =>
                          setEditingTitle((prev) => ({
                            ...prev,
                            [r.id]: e.target.value.slice(0, 20),
                          }))
                        }
                        onBlur={() => saveTitle(r)}
                        variant="standard"
                        inputProps={{ style: { color: '#c9d1d9', fontWeight: 500 } }}
                        fullWidth
                      />
                    }
                    secondary={
                      <>
                        Tool: {r.tool_name} ·{' '}
                        {new Date(r.created_at).toLocaleString()}
                        {r.tags && r.tags.length > 0 && (
                          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                            {r.tags.map((t, idx) => (
                              <Chip
                                key={idx}
                                size="small"
                                label={t}
                                onDelete={() => removeTag(r, t)}
                                sx={{ fontSize: 11 }}
                              />
                            ))}
                          </Stack>
                        )}
                      </>
                    }
                  />
                  <IconButton edge="end">
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </ListItemButton>

                {/* Collapse */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Paper
                    variant="outlined"
                    sx={{
                      m: 1,
                      p: 2,
                      backgroundColor: '#0d1117',
                      color: '#c9d1d9',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      overflowX: 'auto',
                    }}
                  >
                    {r.report_content || 'No content'}

                    {/* Add new tag */}
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        placeholder="Add tag"
                        size="small"
                        variant="outlined"
                        value={newTagInput[r.id] ?? ''}
                        onChange={(e) =>
                          setNewTagInput((prev) => ({
                            ...prev,
                            [r.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addTag(r)
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => addTag(r)} size="small">
                                <Add fontSize="small" sx={{ color: '#c9d1d9' }} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Paper>
                </Collapse>
              </Box>
            )
          })}
        </List>
      )}
    </Box>
  )
}
