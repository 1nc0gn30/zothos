// Home.jsx
import { useTheme, useMediaQuery } from '@mui/material'
import HomeDesktop from './desktop/HomeDesktop'
import HomeMobile from './mobile/HomeMobile'

export default function Home() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  return isDesktop ? <HomeDesktop /> : <HomeMobile />
}
