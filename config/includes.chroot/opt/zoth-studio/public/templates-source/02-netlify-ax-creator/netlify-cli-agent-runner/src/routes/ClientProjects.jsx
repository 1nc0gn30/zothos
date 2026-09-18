import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import ClientLayout from '../components/ClientLayout'
import { clientProjects } from '../data/mockClientData'

function ClientProjects() {
  return (
    <ClientLayout subtitle="Projects are wrapped in guardrails and preview-first flows.">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          Client projects
        </Typography>
        <Grid container spacing={2} columns={{ xs: 1, md: 12 }}>
          {clientProjects.map((project) => (
            <Grid key={project.name} size={{ xs: 12, md: 4 }}>
              <Card elevation={0}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight={700}>
                        {project.name}
                      </Typography>
                      <LaunchRoundedIcon color="primary" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {project.guardrails}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={project.status} size="small" variant="outlined" color="primary" />
                      <Chip label={`Last deploy ${project.lastDeployed}`} size="small" variant="outlined" />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ClientLayout>
  )
}

export default ClientProjects
