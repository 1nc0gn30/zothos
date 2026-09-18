import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

const plans = [
  {
    name: 'Free',
    price: '$0',
    desc:
      'Entry-tier access with constrained throughput, starter OSINT tools, and shared house models.',
    features: [
      'House AI models',
      'Starter OSINT tooling',
      'Strict fair-use limits',
    ],
    url: '/login',
    available: true,
  },
  {
    name: 'Standard',
    price: '$29 / mo',
    desc:
      'Shared VPS pool with increased limits and full access to core AI and OSINT tooling.',
    features: [
      'LocalAI model access',
      'Full OSINT toolkit',
      'Shared compute resources',
    ],
    url: import.meta.env.VITE_STRIPE_STANDARD,
    available: true,
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$59 / mo',
    desc:
      'Priority queue access with higher throughput and expanded tooling for advanced workflows.',
    features: [
      'Priority compute scheduling',
      'Advanced OSINT suite',
      'Higher throughput limits',
    ],
    available: false,
  },
  {
    name: 'Operator',
    price: '$129 / mo',
    desc:
      'Security-focused tier built for OSINT, research, and cyber operations with reserved resources.',
    features: [
      'Security-grade OSINT tools',
      'Reserved compute capacity',
      'Operational workflows',
    ],
    available: false,
  },
  {
    name: 'Dedicated',
    price: '$249 / mo',
    desc:
      'Single-tenant VPS with isolated resources, maximum throughput, and priority human support.',
    features: [
      'Dedicated 32GB / 8 CPU instance',
      'Isolated single-tenant environment',
      'Priority support channel',
    ],
    available: false,
  },
]

export default function Pricing() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Container maxWidth="md" sx={{ mt: 14, pb: 10 }}>
      {/* HEADER */}
      <Stack spacing={2.5} textAlign="center" sx={{ mb: 9 }}>
        <Typography
          variant="h3"
          fontWeight={900}
          sx={{
            background: isDark
              ? `linear-gradient(135deg,
                  ${theme.palette.primary.light},
                  ${alpha(theme.palette.primary.main, 0.9)}
                )`
              : `linear-gradient(135deg,
                  ${theme.palette.primary.main},
                  #6366f1
                )`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.04em',
          }}
        >
          Choose Your Access Level
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ maxWidth: 520, mx: 'auto' }}
        >
          Compute-backed AI access. No fake limits. No censorship theater.
        </Typography>
      </Stack>

      {/* PLANS */}
      <Stack spacing={4} alignItems="center">
        {plans.map((plan) => {
          const disabled = !plan.available

          return (
            <Box
              key={plan.name}
              sx={{
                width: '100%',
                maxWidth: 560,
                p: 4,
                borderRadius: 3,
                position: 'relative',
                background: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.75 : 0.95
                ),
                backdropFilter: 'blur(18px)',
                border: `1px solid ${
                  plan.highlight
                    ? alpha(theme.palette.primary.main, 0.55)
                    : alpha(theme.palette.divider, 0.9)
                }`,
                boxShadow: plan.highlight
                  ? `
                    0 0 0 1px ${alpha(theme.palette.primary.main, 0.35)},
                    0 30px 90px ${alpha(theme.palette.primary.main, 0.18)}
                  `
                  : '0 30px 80px rgba(0,0,0,0.45)',
                opacity: disabled ? 0.6 : 1,
                transition: 'transform 200ms ease, box-shadow 200ms ease',
                '&:hover': !disabled && {
                  transform: 'translateY(-2px)',
                  boxShadow: plan.highlight
                    ? `
                      0 0 0 1px ${alpha(
                        theme.palette.primary.main,
                        0.45
                      )},
                      0 40px 120px ${alpha(
                        theme.palette.primary.main,
                        0.25
                      )}
                    `
                    : '0 40px 100px rgba(0,0,0,0.55)',
                },
              }}
            >
              {/* BADGES */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography variant="h5" fontWeight={800}>
                  {plan.name}
                </Typography>

                {plan.highlight && (
                  <Chip
                    label="Most Popular"
                    size="small"
                    sx={{
                      background: alpha(
                        theme.palette.primary.main,
                        0.18
                      ),
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                    }}
                  />
                )}

                {!plan.available && (
                  <Chip
                    label="Coming Soon"
                    size="small"
                    sx={{
                      background: alpha('#f97316', 0.18),
                      color: '#f97316',
                      fontWeight: 700,
                    }}
                  />
                )}
              </Stack>

              {/* PRICE */}
              <Typography sx={{ fontSize: 22, fontWeight: 800, mt: 1 }}>
                {plan.price}
              </Typography>

              {/* DESCRIPTION */}
              <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                {plan.desc}
              </Typography>

              {/* FEATURES */}
              <Stack spacing={0.75} sx={{ mt: 3 }}>
                {plan.features.map((f) => (
                  <Typography
                    key={f}
                    variant="body2"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    • {f}
                  </Typography>
                ))}
              </Stack>

              {/* CTA */}
              <Button
                variant={plan.highlight ? 'contained' : 'outlined'}
                disabled={!plan.available}
                href={plan.available ? plan.url : undefined}
                sx={{
                  mt: 4,
                  width: { xs: '100%', sm: 'auto' },
                  px: 4,
                  py: 1.25,
                  fontWeight: 800,
                  ...(disabled && {
                    borderColor: alpha(theme.palette.divider, 0.4),
                    color: alpha(theme.palette.text.primary, 0.5),
                  }),
                }}
              >
                {plan.available ? 'Get Access' : 'Coming Soon'}
              </Button>
            </Box>
          )
        })}
      </Stack>
    </Container>
  )
}
