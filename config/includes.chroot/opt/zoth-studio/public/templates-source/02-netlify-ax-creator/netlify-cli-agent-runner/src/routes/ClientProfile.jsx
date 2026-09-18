import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import { Box, Card, CardContent, Stack, Switch, Typography } from '@mui/material'
import ClientLayout from '../components/ClientLayout'

function ClientProfile() {
  return (
    <ClientLayout subtitle="Preferences tuned for guided, low-risk collaboration.">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          Client preferences
        </Typography>
        <Card elevation={0}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <VerifiedRoundedIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Aster Studio
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body1" fontWeight={700}>
                    Notify me on dry runs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Agents will DM when simulations complete.
                  </Typography>
                </Box>
                <Switch defaultChecked />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body1" fontWeight={700}>
                    Human review preference
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Route production changes to developers automatically.
                  </Typography>
                </Box>
                <Switch defaultChecked />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </ClientLayout>
  )
}

export default ClientProfile
