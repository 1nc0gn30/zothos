import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { Box, Card, CardActionArea, Chip, Stack, Typography } from '@mui/material'

function ActionCard({ action, onSelect }) {
  return (
    <Card elevation={0} sx={{ height: '100%' }}>
      <CardActionArea onClick={() => onSelect(action)} sx={{ height: '100%', p: 2 }}>
        <Stack spacing={1.5} alignItems="flex-start">
          <Chip size="small" label="Guided" color="primary" sx={{ fontWeight: 700 }} />
          <Typography variant="h6" fontWeight={700}>
            {action.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {action.summary}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 700 }}>
            <PlayArrowRoundedIcon fontSize="small" />
            <Typography variant="body2">Run action</Typography>
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  )
}

export default ActionCard
