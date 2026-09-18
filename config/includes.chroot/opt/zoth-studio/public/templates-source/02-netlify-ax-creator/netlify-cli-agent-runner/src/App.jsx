import { CssBaseline, ThemeProvider } from '@mui/material'
import AppShell from './app/AppShell'
import { PortalProvider } from './app/PortalContext'
import theme from './app/theme'
import PortalSelector from './components/PortalSelector'
import { usePortal } from './app/PortalContext'
import './App.css'

function AppContent() {
  const { portalMode } = usePortal()

  if (!portalMode) {
    return <PortalSelector />
  }

  return <AppShell />
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PortalProvider>
        <AppContent />
      </PortalProvider>
    </ThemeProvider>
  )
}

export default App
