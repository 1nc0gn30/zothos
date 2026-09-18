import './App.css';
import { useMediaQuery, useTheme } from '@mui/material';
import DesktopAppBar from './components/desktop/DesktopAppBar';
import MobileAppBar from './components/mobile/MobileAppBar';
import MobileCTABar from './components/mobile/MobileCTABar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import LocationsPage from './pages/LocationsPage';
import FAQPage from './pages/FAQPage';
import ScrollToTop from './ScrollToTop';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xl')); // Small tablets and below

  return (
    <div className="App">
      <Router >
        <ScrollToTop />
      {isMobile ? (
        <>
          <MobileAppBar />
          <MobileCTABar />
         
        </>
      ) : (
        <DesktopAppBar />
      
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/faq" element={<FAQPage />} />
      <Route path="/locations" element={<LocationsPage />} />
      </Routes>
      <Footer />
      </ Router>
    </div>
  );
}

export default App;
