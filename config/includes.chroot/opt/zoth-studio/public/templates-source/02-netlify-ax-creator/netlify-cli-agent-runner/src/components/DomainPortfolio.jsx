import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import WifiRoundedIcon from '@mui/icons-material/WifiRounded'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import ClientLayout from './ClientLayout'

function DomainPortfolio({ websites = [], suggestions = [], onBack }) {
  const signals = [
    {
      title: 'DNS protection',
      value: 'Locked',
      icon: <ShieldRoundedIcon color="success" fontSize="small" />,
      hint: 'Agent blocks risky DNS edits during campaigns.',
    },
    {
      title: 'Certificates',
      value: 'Healthy',
      icon: <VerifiedRoundedIcon color="primary" fontSize="small" />,
      hint: 'Auto-renew enabled for every connected domain.',
    },
    {
      title: 'Edge routing',
      value: 'Guarded',
      icon: <WifiRoundedIcon color="secondary" fontSize="small" />,
      hint: 'Experiments and previews stay isolated from prod.',
    },
  ]

  return (
    <ClientLayout title="Domain portfolio" subtitle="Every domain in one calm, guarded view.">
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Button startIcon={<ArrowBackRoundedIcon />} onClick={onBack} variant="text" sx={{ borderRadius: 2 }}>
              Back to portal
            </Button>
            <Chip label="DNS guarded" color="success" variant="outlined" />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip label="Auto-renew on" size="small" variant="outlined" />
            <Chip label="SSL healthy" size="small" color="primary" variant="outlined" />
          </Stack>
        </Stack>

          <Card elevation={0} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, rgba(49,196,141,0.14), rgba(49,196,141,0.04))' }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <LockRoundedIcon color="success" />
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Safe connections
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Agent keeps DNS, SSL, and routing policies safe across environments.
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Health
                </Typography>
                <Box sx={{ minWidth: 160 }}>
                  <LinearProgress variant="determinate" value={94} color="success" sx={{ height: 8, borderRadius: 99 }} />
                </Box>
                <Typography variant="body2" fontWeight={700}>
                  94%
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(33,150,243,0.08), rgba(5,10,18,0.02))',
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                <ShoppingCartRoundedIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Buy a brand-fit domain
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    The agent checks availability, sets DNS safely, and keeps SSL healthy automatically.
                  </Typography>
                </Box>
              </Stack>
              <Button variant="contained" color="primary" startIcon={<ShoppingCartRoundedIcon />} sx={{ borderRadius: 2 }}>
                Checkout selected
              </Button>
            </Stack>

            <Grid container spacing={1.5} columns={{ xs: 1, sm: 12 }}>
              {suggestions.map((option) => (
                <Grid key={option.domain} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                          {option.domain.slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={800}>
                            {option.domain}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.match}
                          </Typography>
                        </Box>
                        <Chip label={option.status} size="small" color={option.status === 'Available' ? 'success' : 'default'} variant="outlined" />
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                        <Chip label={option.price} size="small" variant="outlined" />
                        <Button size="small" variant="contained" color="success" disabled={option.status !== 'Available'}>
                          Hold & buy
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>

        <Grid container spacing={1.5} columns={{ xs: 1, md: 12 }}>
          {websites.map((site) => (
            <Grid key={site.domain} size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%', position: 'relative', overflow: 'hidden' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.dark', color: 'common.white', fontWeight: 800 }}>
                      {site.domain.slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {site.domain}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {site.environment} · {site.name}
                      </Typography>
                    </Box>
                    <Chip label={site.status} size="small" color="success" variant="outlined" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {site.guardrails}
                  </Typography>
                  <Divider />
                  <Stack direction="row" spacing={1}>
                    <Chip icon={<PublicRoundedIcon />} label="Open" size="small" variant="outlined" />
                    <Chip icon={<LinkRoundedIcon />} label="Copy DNS" size="small" variant="outlined" />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Last updated
                    </Typography>
                    <Typography variant="caption" fontWeight={700}>
                      {site.lastUpdated}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
              Signals
            </Typography>
            <Grid container spacing={1.5} columns={{ xs: 1, sm: 12 }}>
              {signals.map((signal) => (
                <Grid key={signal.title} size={{ xs: 12, sm: 4 }}>
                  <Stack
                    spacing={0.75}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      p: 1.5,
                      background: 'linear-gradient(135deg, rgba(5,10,18,0.02), rgba(49,196,141,0.04))',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {signal.icon}
                      <Typography variant="subtitle2" fontWeight={800}>
                        {signal.title}
                      </Typography>
                      <Chip label={signal.value} size="small" color="success" variant="outlined" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {signal.hint}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </ClientLayout>
  )
}

export default DomainPortfolio
