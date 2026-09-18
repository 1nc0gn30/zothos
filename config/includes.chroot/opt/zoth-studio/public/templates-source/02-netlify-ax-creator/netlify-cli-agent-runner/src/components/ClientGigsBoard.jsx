import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded'
import WorkHistoryRoundedIcon from '@mui/icons-material/WorkHistoryRounded'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import ClientLayout from './ClientLayout'

function ClientGigsBoard({ listings = [], onBack }) {
  const [gigList, setGigList] = useState(listings)
  const [newGig, setNewGig] = useState({
    title: '',
    budget: '$500+',
    urgency: 'This week',
    summary: '',
    tags: [],
  })

  const suggestedTags = useMemo(
    () => ['Design polish', 'Integrations', 'Preview-only', 'Guardrails on', 'Copywriting', 'QA sweep'],
    []
  )

  const handleSubmit = () => {
    if (!newGig.title || !newGig.summary) return
    setGigList((prev) => [
      {
        ...newGig,
        id: `gig-${Date.now()}`,
        tags: newGig.tags.length ? newGig.tags : ['Preview-only'],
      },
      ...prev,
    ])
    setNewGig({ title: '', budget: '$500+', urgency: 'This week', summary: '', tags: [] })
  }

  const toggleTag = (tag) => {
    setNewGig((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  return (
    <ClientLayout title="Post a project" subtitle="Share Netlify website work and let trusted developers apply.">
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Button startIcon={<ArrowBackRoundedIcon />} onClick={onBack} variant="text" sx={{ borderRadius: 2 }}>
            Back to portal
          </Button>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label="Human + AI network" color="success" variant="outlined" />
            <Chip label="Beta" color="primary" variant="outlined" />
          </Stack>
        </Stack>

        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <GroupsRoundedIcon color="success" />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800}>
                      Describe the work and guardrails
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      We notify developers who follow your industry and respect your preview/approval rules.
                    </Typography>
                  </Box>
                </Stack>
                <Button variant="contained" color="success" startIcon={<AddTaskRoundedIcon />} onClick={handleSubmit} sx={{ borderRadius: 2 }}>
                  Post request
                </Button>
              </Stack>

              <Grid container spacing={1.5} columns={{ xs: 1, md: 12 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Project title"
                    value={newGig.title}
                    onChange={(e) => setNewGig((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Budget"
                    value={newGig.budget}
                    onChange={(e) => setNewGig((prev) => ({ ...prev, budget: e.target.value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Urgency"
                    value={newGig.urgency}
                    onChange={(e) => setNewGig((prev) => ({ ...prev, urgency: e.target.value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="What should they deliver?"
                    value={newGig.summary}
                    onChange={(e) => setNewGig((prev) => ({ ...prev, summary: e.target.value }))}
                  />
                </Grid>
              </Grid>

              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Guardrails & skills to highlight
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                  {suggestedTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => toggleTag(tag)}
                      color={newGig.tags.includes(tag) ? 'success' : 'default'}
                      variant={newGig.tags.includes(tag) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <WorkHistoryRoundedIcon color="success" />
              <Typography variant="subtitle1" fontWeight={800}>
                Open requests
              </Typography>
            </Stack>
            <Grid container spacing={1.5} columns={{ xs: 1, md: 12 }}>
              {gigList.map((gig) => (
                <Grid key={gig.id} size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight={800}>
                          {gig.title}
                        </Typography>
                        <Chip label={gig.urgency} size="small" color="success" variant="outlined" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {gig.summary}
                      </Typography>
                      <Divider />
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip icon={<HowToRegRoundedIcon />} label="Applicants open" size="small" variant="outlined" />
                        <Chip label={gig.budget} size="small" />
                        {gig.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>
                      <Button size="small" variant="contained" color="success" sx={{ alignSelf: 'flex-start', borderRadius: 2 }}>
                        Notify developers
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </ClientLayout>
  )
}

export default ClientGigsBoard
