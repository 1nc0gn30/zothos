import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'

function ClientLayout({ title = 'Client Portal', subtitle, children }) {
  return (
    <Stack spacing={2.5}>
      <Card
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(49, 196, 141, 0.12), rgba(49, 196, 141, 0.03))',
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Stack spacing={0.75} flex={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label="Client" color="success" size="small" sx={{ borderRadius: 2, fontWeight: 700 }} />
                <Typography variant="overline" color="text.secondary">
                  Guided workspace
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
              <AutoAwesomeRoundedIcon color="success" />
              <Typography variant="body2" color="text.secondary">
                Calm, agent-guarded workspace.
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box>{children}</Box>
    </Stack>
  )
}

export default ClientLayout
