import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import LabelRoundedIcon from '@mui/icons-material/LabelRounded'
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ClientLayout from './ClientLayout'

const starterNotes = [
  {
    id: 'seasonal-offer',
    title: 'Seasonal offer brief',
    body: 'Highlight the cinnamon cold brew and weekend brunch specials across hero + SMS prompts.',
    tag: 'Campaign',
    pinned: true,
  },
  {
    id: 'accessibility',
    title: 'Accessibility reminders',
    body: 'Keep headings ordered, alt text friendly, and form labels explicit before launch.',
    tag: 'Guardrails',
    pinned: false,
  },
]

function NotesWorkbench({ onBack }) {
  const [notes, setNotes] = useState(starterNotes)
  const [draft, setDraft] = useState({ title: '', body: '', tag: 'Idea' })

  const sortedNotes = useMemo(() => [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned)), [notes])

  const handleSave = () => {
    if (!draft.title || !draft.body) return
    setNotes((prev) => [
      { ...draft, id: `note-${Date.now()}`, pinned: false },
      ...prev,
    ])
    setDraft({ title: '', body: '', tag: 'Idea' })
  }

  const togglePin = (id) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)))
  }

  return (
    <ClientLayout
      title="Notes & context"
      subtitle="Drop guidance, campaign briefs, and reminders the agents can read before acting."
    >
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Button startIcon={<ArrowBackRoundedIcon />} onClick={onBack} variant="text" sx={{ borderRadius: 2 }}>
              Back to portal
            </Button>
            <Chip label="Synced to agents" color="success" variant="outlined" />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip icon={<AutoAwesomeRoundedIcon />} label="Tone aware" size="small" variant="outlined" />
            <Chip label={`${notes.length} notes`} size="small" variant="outlined" />
          </Stack>
        </Stack>

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(5,10,18,0.08), rgba(49,196,141,0.05))',
          }}
        >
          <CardContent>
            <Grid container spacing={2} columns={{ xs: 1, md: 12 }}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Compose a new note
                  </Typography>
                  <TextField
                    label="Title"
                    value={draft.title}
                    onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                    placeholder="Ex: Pre-launch checklist"
                  />
                  <TextField
                    label="Details for the agent"
                    multiline
                    minRows={4}
                    value={draft.body}
                    onChange={(e) => setDraft((prev) => ({ ...prev, body: e.target.value }))}
                    placeholder="Share context, deadlines, or links you want the AI/human dev to respect."
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LabelRoundedIcon color="action" />
                    <TextField
                      size="small"
                      label="Tag"
                      value={draft.tag}
                      onChange={(e) => setDraft((prev) => ({ ...prev, tag: e.target.value }))}
                    />
                    <Button
                      variant="contained"
                      startIcon={<SaveRoundedIcon />}
                      onClick={handleSave}
                      sx={{ borderRadius: 2 }}
                      disabled={!draft.title || !draft.body}
                    >
                      Save note
                    </Button>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Notes are synced instantly so the AI knows what to avoid and what to prioritize.
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Recent notes
                  </Typography>
                  {sortedNotes.map((note) => (
                    <Card key={note.id} variant="outlined" sx={{ borderRadius: 2.5, background: 'rgba(255,255,255,0.5)' }}>
                      <CardContent>
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'success.light', display: 'grid', placeItems: 'center' }}>
                            <PushPinRoundedIcon color={note.pinned ? 'success' : 'disabled'} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                              <Stack spacing={0.25}>
                                <Typography variant="subtitle1" fontWeight={800}>
                                  {note.title}
                                </Typography>
                                <Chip label={note.tag} size="small" variant="outlined" />
                              </Stack>
                              <IconButton onClick={() => togglePin(note.id)} color={note.pinned ? 'success' : 'default'}>
                                <AddRoundedIcon sx={{ transform: note.pinned ? 'rotate(45deg)' : 'none', transition: 'transform 120ms ease' }} />
                              </IconButton>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {note.body}
                            </Typography>
                          </Box>
                        </Stack>
                        <Divider sx={{ my: 1.25 }} />
                        <Typography variant="caption" color="text.secondary">
                          AI uses pinned notes first when proposing changes.
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </ClientLayout>
  )
}

export default NotesWorkbench
