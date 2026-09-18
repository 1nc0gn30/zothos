import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import DeveloperLayout from '../components/DeveloperLayout'
import { requestQueue } from '../data/mockDeveloperData'

function DeveloperQueue() {
  return (
    <DeveloperLayout subtitle="Work the queue without leaving your developer context.">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          Client request queue
        </Typography>
        <Card elevation={0}>
          <CardContent>
            <Stack spacing={1.5}>
              {requestQueue.map((item) => (
                <Stack key={item.id} direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {item.client}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.request}
                    </Typography>
                  </Box>
                  <Chip label={`Risk ${item.risk}`} size="small" variant="outlined" />
                  <Chip label={item.eta} size="small" color="primary" />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </DeveloperLayout>
  )
}

export default DeveloperQueue
