import { Box, Card, CardContent, Chip, Stack, Switch, Typography } from '@mui/material'
import DeveloperLayout from '../components/DeveloperLayout'
import { guardrails } from '../data/mockDeveloperData'

function DeveloperGuardrails() {
  return (
    <DeveloperLayout subtitle="Guardrail controls stay close to developer hands.">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          Guardrails
        </Typography>
        <Card elevation={0}>
          <CardContent>
            <Stack spacing={1.5}>
              {guardrails.map((rule) => (
                <Stack key={rule.id} direction="row" alignItems="center" spacing={2}>
                  <Switch checked={rule.active} readOnly />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {rule.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rule.detail}
                    </Typography>
                  </Box>
                  <Chip label={rule.active ? 'Active' : 'Paused'} size="small" variant="outlined" />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </DeveloperLayout>
  )
}

export default DeveloperGuardrails
