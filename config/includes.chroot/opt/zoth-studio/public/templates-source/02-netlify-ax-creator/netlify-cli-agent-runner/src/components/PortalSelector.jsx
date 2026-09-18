import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Box, Card, CardActionArea, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { usePortal } from '../app/PortalContext'

const cards = [
  {
    id: 'client',
    title: 'Client Portal',
    hint: 'Guided actions · Safe by default',
    icon: <AutoAwesomeRoundedIcon sx={{ fontSize: 44 }} color="success" />,
    accent: 'linear-gradient(145deg, rgba(129, 199, 132, 0.15), rgba(255,255,255,0.9))',
  },
  {
    id: 'developer',
    title: 'Developer Portal',
    hint: 'Controls · Guardrails · Approvals',
    icon: <TuneRoundedIcon sx={{ fontSize: 44 }} color="secondary" />,
    accent: 'linear-gradient(145deg, rgba(103, 58, 183, 0.14), rgba(255,255,255,0.9))',
  },
]

function PortalSelector() {
  const { setPortalMode } = usePortal()
  const [hovered, setHovered] = useState(null)

  const handleSelect = (mode) => {
    setPortalMode(mode)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: { xs: 3, md: 6 },
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(129,199,132,0.12), transparent 34%), radial-gradient(circle at 80% 0%, rgba(103,58,183,0.12), transparent 36%)',
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ width: '100%', maxWidth: 960 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
          <SecurityRoundedIcon color="primary" />
          <Typography variant="overline" sx={{ letterSpacing: 2 }}>
            Choose your portal
          </Typography>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }} justifyContent="center">
          {cards.map((card) => {
            const isActive = hovered === card.id
            return (
              <Card
                key={card.id}
                elevation={isActive ? 10 : 0}
                sx={{
                  flex: 1,
                  borderRadius: 4,
                  backgroundImage: card.accent,
                  transition: 'transform 200ms ease, box-shadow 200ms ease',
                  transform: isActive ? 'scale(1.015)' : 'scale(1)',
                }}
              >
                <CardActionArea
                  onMouseEnter={() => setHovered(card.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleSelect(card.id)}
                  sx={{
                    p: { xs: 3, md: 4 },
                    minHeight: 220,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Stack spacing={1.5} alignItems="flex-start">
                    <Stack direction="row" spacing={1} alignItems="center">
                      {card.icon}
                      <Typography variant="h4" fontWeight={800}>
                        {card.title}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle1" color="text.secondary">
                      {card.hint}
                    </Typography>
                  </Stack>
                  <Stack
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      border: 1,
                      borderColor: 'divider',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: isActive ? 4 : 1,
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 200ms ease, box-shadow 200ms ease',
                    }}
                  >
                    <SettingsSuggestRoundedIcon color={card.id === 'developer' ? 'secondary' : 'success'} />
                  </Stack>
                </CardActionArea>
              </Card>
            )
          })}
        </Stack>
      </Stack>
    </Box>
  )
}

export default PortalSelector
