import AdjustRoundedIcon from '@mui/icons-material/AdjustRounded'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'

function ActivityFeed({ activity }) {
  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TimelineRoundedIcon color="success" />
          <Typography variant="h6" fontWeight={800}>
            Activity & requests
          </Typography>
        </Stack>
        <Chip label="Client view" size="small" variant="outlined" color="success" sx={{ borderRadius: 2 }} />
      </Stack>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            {activity.map((item, index) => (
              <Box key={item.id}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 180 }}>
                    {item.status === 'Completed' ? (
                      <DoneAllRoundedIcon color="success" />
                    ) : (
                      <AdjustRoundedIcon color={item.status === 'Queued' ? 'warning' : 'success'} />
                    )}
                    <Stack spacing={0}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {item.actor}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.timestamp}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={700}>
                      {item.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.detail}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.status}
                    size="small"
                    color={item.status === 'Completed' ? 'success' : item.status === 'Queued' ? 'warning' : 'default'}
                    variant="outlined"
                  />
                </Stack>
                {index !== activity.length - 1 && <Divider sx={{ my: 1.5 }} />}
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ActivityFeed
