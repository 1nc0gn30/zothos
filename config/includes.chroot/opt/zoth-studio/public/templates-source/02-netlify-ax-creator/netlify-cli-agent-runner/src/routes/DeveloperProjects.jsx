import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import DeveloperLayout from '../components/DeveloperLayout'
import { developerProjects } from '../data/mockDeveloperData'

function DeveloperProjects() {
  return (
    <DeveloperLayout subtitle="Full visibility across every guarded project.">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          Projects
        </Typography>
        <Grid container spacing={2} columns={{ xs: 1, md: 12 }}>
          {developerProjects.map((project) => (
            <Grid key={project.name} size={{ xs: 12, md: 4 }}>
              <Card elevation={0}>
                <CardContent>
                  <Stack spacing={1}>
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
      </Box>
    </DeveloperLayout>
  )
}

export default DeveloperProjects
