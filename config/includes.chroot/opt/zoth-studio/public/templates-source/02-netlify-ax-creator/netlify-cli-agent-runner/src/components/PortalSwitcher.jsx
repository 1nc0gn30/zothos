import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, useTheme } from '@mui/material'

function PortalSwitcher({ value, onChange }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, next) => next && onChange(next)}
      color="primary"
      aria-label="Portal switcher"
      sx={{
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 99,
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.14)',
        minHeight: isMobile ? 36 : 44,
        '& .MuiToggleButton-root': {
          border: 'none',
          textTransform: 'none',
          px: isMobile ? 1.5 : 2.5,
          py: isMobile ? 0.75 : 1,
          gap: 0.75,
          borderRadius: 99,
          color: 'common.white',
          minWidth: isMobile ? 0 : 120,
          '&.Mui-selected': {
            backgroundColor: 'rgba(49,196,141,0.2)',
            color: 'common.white',
          },
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.08)',
          },
        },
      }}
    >
      <ToggleButton value="client" aria-label="Client Portal">
        <AutoAwesomeRoundedIcon fontSize="small" color="success" />
        <Typography variant={isMobile ? 'caption' : 'body2'} fontWeight={800} sx={{ display: 'inline-flex' }}>
          {isMobile ? 'Client' : 'Client workspace'}
        </Typography>
      </ToggleButton>
      <ToggleButton value="developer" aria-label="Developer Portal">
        <TuneRoundedIcon fontSize="small" color="secondary" />
        <Typography variant={isMobile ? 'caption' : 'body2'} fontWeight={800} sx={{ display: 'inline-flex' }}>
          {isMobile ? 'Dev' : 'Developer desk'}
        </Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default PortalSwitcher
