import { useMediaQuery } from '@mui/material'

import Router from './router'
import FooterBar from '../components/FooterBar'

// NEW NAVBARS
import NavbarDesktop from '../components/desktop/NavbarDesktop'
import NavbarMobile from '../components/mobile/NavbarMobile'
import ScrollToTop from '../components/ScrollToTop'
import GhostBytePet from '../components/GhostBytePet'
import { Toaster } from 'sonner'

export default function App() {
  const isDesktop = useMediaQuery('(min-width:900px)')

  return (
    <>
      <ScrollToTop />
      {isDesktop ? <NavbarDesktop /> : <NavbarMobile />}
      <Router />
      <GhostBytePet />
      <FooterBar />
      <Toaster position="bottom-right" theme="dark" />
    </>
  )
}
