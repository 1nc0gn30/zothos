import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded'
import { Avatar, Box, Button, Card, CardActionArea, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import ClientLayout from './ClientLayout'

function ClientWebsites({ websites = [], onBack }) {
  const buildOptions = [
    {
      id: 'repo',
      title: 'Link a repo',
      description: 'Connect Git and let guardrails watch deploys.',
      icon: <LinkRoundedIcon color="success" />,
      pill: 'Recommended',
    },
    {
      id: 'upload',
      title: 'Drop a folder to deploy',
      description: 'Ship a quick folder deploy with rollbacks on.',
      icon: <CloudUploadRoundedIcon color="primary" />,
      pill: 'No Git required',
    },
    {
      id: 'agent',
      title: 'Let an agent dev build it',
      description: 'Describe the goal, review a safe preview, and ship.',
      icon: <SmartToyRoundedIcon color="success" />,
      pill: 'Fastest',
    },
    {
      id: 'human',
      title: 'Bring in a human developer',
      description: 'Hand off to a trusted dev with approvals baked in.',
      icon: <GroupsRoundedIcon color="secondary" />,
      pill: 'Hands-off',
    },
    {
      id: 'template',
      title: 'Find a template',
      description: 'Pick a starter and let the agent tune tone and setup.',
      icon: <ViewQuiltRoundedIcon color="info" />,
      pill: 'Fast start',
    },
  ]

  return (
    <ClientLayout title="Websites" subtitle="Open live sites, previews, and create guarded deploys.">
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button startIcon={<ArrowBackRoundedIcon />} onClick={onBack} variant="text" sx={{ borderRadius: 2 }}>
              Back to portal
            </Button>
            <Chip label="Live + preview" color="success" variant="outlined" />
          </Stack>
          <Button variant="contained" startIcon={<AddRoundedIcon />} sx={{ borderRadius: 2 }} href="#create-website">
            Create website
          </Button>
        </Stack>

        <Card elevation={0} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, rgba(49,196,141,0.14), rgba(49,196,141,0.03))' }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <PublicRoundedIcon color="success" />
                <Stack spacing={0.25}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Calm website control
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Agents keep deploys safe, previews ready, and DNS locked to avoid surprises.
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip label="Guarded" color="success" variant="outlined" />
                <Chip label="Rollback ready" variant="outlined" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2} columns={{ xs: 1, md: 12 }}>
          {websites.map((site) => (
            <Grid key={site.domain} size={{ xs: 12, md: 4 }}>
              <Card elevation={0} variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Stack spacing={1.25} sx={{ height: '100%' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark', fontWeight: 800 }}>
                        {site.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={800}>
                          {site.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {site.domain}
                        </Typography>
                      </Box>
                      <LaunchRoundedIcon color="action" />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Chip label={site.environment} size="small" variant="outlined" />
                      <Chip label={site.status} size="small" color="success" variant="outlined" />
                      <Chip label={`Updated ${site.lastUpdated}`} size="small" variant="outlined" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {site.guardrails}
                    </Typography>
                    <Divider />
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" color="success" startIcon={<PublicRoundedIcon />} sx={{ borderRadius: 2 }}>
                        Open site
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<LaunchRoundedIcon />} sx={{ borderRadius: 2 }}>
                        Preview
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card id="create-website" elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5}>
                <Stack spacing={0.5}>
                  <Typography variant="h6" fontWeight={900}>
                    Create a new website
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose the path that matches how you want to launch. Every option keeps approvals and rollbacks in place.
                  </Typography>
                </Stack>
                <Chip label="Agent-assisted" color="success" variant="outlined" />
              </Stack>

              <Grid container spacing={1.5} columns={{ xs: 1, md: 12 }}>
                {buildOptions.map((option) => (
                  <Grid key={option.id} size={{ xs: 12, md: 4 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2.5, height: '100%' }}>
                      <CardActionArea sx={{ height: '100%' }}>
                        <CardContent>
                          <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar sx={{ bgcolor: 'background.default', border: 1, borderColor: 'divider', width: 40, height: 40 }}>
                                {option.icon}
                              </Avatar>
                              <Chip label={option.pill} size="small" variant="outlined" />
                            </Stack>
                            <Typography variant="subtitle1" fontWeight={800}>
                              {option.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </ClientLayout>
  )
}

export default ClientWebsites
