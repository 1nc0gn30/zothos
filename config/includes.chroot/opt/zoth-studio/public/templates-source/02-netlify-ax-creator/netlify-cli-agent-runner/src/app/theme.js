import { alpha, createTheme } from '@mui/material/styles'

const accent = '#00e6a0'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: accent,
      contrastText: '#0a0f14',
    },
    secondary: {
      main: '#7dd3fc',
    },
    background: {
      default: '#0b1219',
      paper: '#111a24',
    },
    divider: alpha('#ffffff', 0.08),
  },
  typography: {
    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: alpha('#ffffff', 0.08),
          borderWidth: 1,
          borderStyle: 'solid',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export default theme
