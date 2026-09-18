import { createTheme } from '@mui/material'
import { createContext } from 'react'

export const ColorModeContext = createContext({
  mode: 'dark',
  toggleColorMode: () => {},
})

export const createAppTheme = (mode = 'dark') =>
  createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'dark' ? '#05070d' : '#f7f9fc',
        paper: mode === 'dark' ? '#0b1220' : '#ffffff',
      },
      primary: {
        main: '#1fb6ff',
        light: '#67e8f9',
      },
      secondary: {
        main: '#7dd3fc',
      },
      text: {
        primary: mode === 'dark' ? '#e5e7eb' : '#0b1220',
        secondary: mode === 'dark' ? '#94a3b8' : '#4b5563',
      },
      divider:
        mode === 'dark'
          ? 'rgba(148,163,184,0.14)'
          : 'rgba(15,23,42,0.08)',
    },

    /* ===========================
       TYPOGRAPHY SYSTEM
    =========================== */
    typography: {
      // Default UI font (clean, readable)
      fontFamily: [
        'Inter',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'sans-serif',
      ].join(','),

      // Big brand / hero text
      h1: {
        fontFamily: 'Space Grotesk, Sora, Inter, sans-serif' ,
        fontWeight: 800,
        letterSpacing: '-0.05em',

      },
      h2: {
        fontFamily: 'Space Grotesk, Sora, Inter, sans-serif',
        fontWeight: 750,
        letterSpacing: '-0.045em',
      },
      h3: {
        fontFamily: 'Space Grotesk, Sora, Inter, sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.035em',
      },
      h4: {
        fontFamily: 'Sora, Space Grotesk, Inter, sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h5: {
        fontFamily: 'Sora, Inter, sans-serif',
        fontWeight: 650,
      },
      h6: {
        fontFamily: 'Sora, Inter, sans-serif',
        fontWeight: 600,
      },

      // Body copy
      body1: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.95rem',
        lineHeight: 1.7,
      },
      body2: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.85rem',
        lineHeight: 1.6,
      },

      // Buttons / labels
      button: {
        fontFamily: 'Sora, Inter, sans-serif',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'none',
      },

      // Small UI text
      caption: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.72rem',
        letterSpacing: '0.02em',
      },

      // Code / terminal / hashes
      overline: {
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: '0.7rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      },
    },

    shape: {
      borderRadius: 16,
    },

    /* ===========================
       COMPONENT OVERRIDES
    =========================== */
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            letterSpacing: '0.04em',
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            border:
              mode === 'dark'
                ? '1px solid rgba(148,163,184,0.12)'
                : '1px solid rgba(15,23,42,0.08)',
            backgroundImage: 'none',
          },
        },
      },

      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor:
              mode === 'dark' ? '#05070d' : '#f5f7fb',
            backgroundImage:
              mode === 'dark'
                ? `
                  radial-gradient(circle at 20% 15%, rgba(79,139,255,0.12), transparent 32%),
                  radial-gradient(circle at 80% 10%, rgba(156,107,255,0.1), transparent 30%),
                  linear-gradient(180deg, #05070d 0%, #070a12 65%)
                `
                : `
                  radial-gradient(circle at 24% 12%, rgba(79,139,255,0.16), transparent 34%),
                  radial-gradient(circle at 82% 8%, rgba(156,107,255,0.12), transparent 32%),
                  linear-gradient(180deg, #f6f7fb 0%, #eef2fb 70%)
                `,
            color:
              mode === 'dark' ? '#e5e7eb' : '#0b1220',
            transition:
              'background-color 300ms ease, color 300ms ease',
            fontFamily: 'Inter, system-ui, sans-serif',
          },

          code: {
            fontFamily:
              'JetBrains Mono, ui-monospace, monospace',
            fontSize: '0.85em',
          },

          pre: {
            fontFamily:
              'JetBrains Mono, ui-monospace, monospace',
          },
        },
      },
    },
  })
