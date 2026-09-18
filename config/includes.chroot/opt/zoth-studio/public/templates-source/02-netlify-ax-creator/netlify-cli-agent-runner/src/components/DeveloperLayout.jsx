import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'

function DeveloperLayout({ title = 'Developer Portal', subtitle, children }) {
  return (
    <Stack spacing={2.5}>
      <Card
        elevation={0}
        sx={{
          background: 'linear-gradient(120deg, rgba(103, 58, 183, 0.08), rgba(140, 93, 210, 0.04))',
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Stack spacing={0.75} flex={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label="Developer" color="secondary" size="small" sx={{ borderRadius: 2, fontWeight: 700 }} />
                <Typography variant="overline" color="text.secondary">
                  Governance + control
                </Typography>
              </Stack>
              <Typography variant="h5" fontWeight={800}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <InsightsRoundedIcon color="secondary" />
              <Typography variant="body2" color="text.secondary">
                Switch contexts without losing your queue.
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box>{children}</Box>
    </Stack>
  )
}

export default DeveloperLayout
