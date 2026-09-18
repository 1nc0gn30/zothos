import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import LockClockRoundedIcon from '@mui/icons-material/LockClockRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import { Box, Card, CardContent, Chip, Stack, Switch, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import DeveloperLayout from '../components/DeveloperLayout'
import { developerProjects, guardrails, requestQueue } from '../data/mockDeveloperData'

function DeveloperDashboard() {
  return (
    <DeveloperLayout subtitle="Everything technical stays close: guardrails, queues, and presets.">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Grid container spacing={2} columns={{ xs: 1, md: 12 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={0}>
              <CardContent>
                <Stack spacing={1}>
                  <VerifiedUserRoundedIcon color="primary" />
                  <Typography variant="h6" fontWeight={800}>
                    Guardrails on
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Human approvals enforced for production touches.
                  </Typography>
                  <Switch defaultChecked />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={0}>
              <CardContent>
                <Stack spacing={1}>
                  <LockClockRoundedIcon color="primary" />
                  <Typography variant="h6" fontWeight={800}>
                    Deploy lock
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fridays 4-9p (live event mode)
                  </Typography>
                  <Chip label="Active" color="primary" variant="outlined" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={0}>
              <CardContent>
                <Stack spacing={1}>
                  <FactCheckRoundedIcon color="primary" />
                  <Typography variant="h6" fontWeight={800}>
                    Queue
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {requestQueue.length} client requests awaiting a call.
                  </Typography>
                  <Chip label="Review now" color="secondary" variant="outlined" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card elevation={0}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Client request queue
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Route approvals, time-box production, and publish presets confidently.
                </Typography>
              </Box>
              <Chip label="Governed" color="primary" variant="outlined" />
            </Stack>
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {requestQueue.map((request) => (
                <Stack key={request.id} direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {request.client}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {request.request}
                    </Typography>
                  </Box>
                  <Chip label={`Risk ${request.risk}`} size="small" variant="outlined" />
                  <Chip label={request.eta} size="small" color="primary" />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0}>
          <CardContent>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              Guardrails
            </Typography>
            <Stack spacing={1.2}>
              {guardrails.map((item) => (
                <Stack key={item.id} direction="row" alignItems="center" spacing={2}>
                  <Switch checked={item.active} readOnly />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.detail}
                    </Typography>
                  </Box>
                  <Chip label={item.active ? 'Active' : 'Paused'} size="small" variant="outlined" />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0}>
          <CardContent>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              Projects overview
            </Typography>
            <Grid container spacing={2} columns={{ xs: 1, md: 12 }}>
              {developerProjects.map((project) => (
                <Grid key={project.name} size={{ xs: 12, md: 4 }}>
                  <Card elevation={0}>
                    <CardContent>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {project.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {project.approval}
                        </Typography>
                        <Chip label={project.access} size="small" variant="outlined" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </DeveloperLayout>
  )
}

export default DeveloperDashboard
