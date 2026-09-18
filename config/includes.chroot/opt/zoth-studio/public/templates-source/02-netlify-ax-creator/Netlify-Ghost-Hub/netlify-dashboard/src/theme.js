import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6ff7ff',
      dark: '#45d2df',
      light: '#b7ffff',
    },
    secondary: {
      main: '#8e63ff',
    },
    background: {
      default: '#05070f',
      paper: '#0d1224',
    },
    error: {
      main: '#ff5f8f',
    },
    warning: {
      main: '#ffb74d',
    },
    info: {
      main: '#6ec2ff',
    },
    success: {
      main: '#64f0bf',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d5ddff',
    },
    divider: 'rgba(132, 162, 255, 0.26)',
  },
  typography: {
    fontFamily: '"Space Grotesk", "Sora", "Rajdhani", "Segoe UI", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '0.03em',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at 10% 15%, rgba(111, 247, 255, 0.08), transparent 40%), radial-gradient(circle at 90% 10%, rgba(142, 99, 255, 0.16), transparent 38%), #05070f',
          color: '#ffffff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(8, 11, 26, 0.82)',
          borderBottom: '1px solid rgba(132, 162, 255, 0.28)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage:
            'linear-gradient(165deg, rgba(142, 99, 255, 0.14), rgba(111, 247, 255, 0.04) 30%, rgba(8, 12, 27, 0.88) 100%)',
          border: '1px solid rgba(132, 162, 255, 0.26)',
          boxShadow: '0 16px 30px rgba(0, 0, 0, 0.35)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 16px',
        },
        containedPrimary: {
          color: '#041017',
          boxShadow: '0 0 0 1px rgba(183, 255, 255, 0.2) inset',
          '&:hover': {
            boxShadow: '0 0 18px rgba(111, 247, 255, 0.55)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(132, 162, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: '#6ff7ff',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: '1px solid transparent',
        },
        standardInfo: {
          backgroundColor: 'rgba(110, 194, 255, 0.12)',
          borderColor: '#6ec2ff',
        },
        standardSuccess: {
          backgroundColor: 'rgba(100, 240, 191, 0.1)',
          borderColor: '#64f0bf',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(97, 124, 213, 0.2)',
          border: '1px solid rgba(132, 162, 255, 0.35)',
          color: '#ffffff',
        },
      },
    },
  },
});

export default theme;
