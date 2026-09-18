import { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './hooks/ScrollToTop';
import AppRoutes from './AppRoutes';
import WelcomePopup from './components/WelcomePopup';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import data from './data/data.json';
import CTASection from './components/CTASections';
import WelcomeCTASection from './components/WelcomeCTASection';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700',
    },
    secondary: {
      main: '#00D2FF',
    },
    background: {
      default: '#0A0A10',
      paper: '#121218',
    },
  },
  typography: {
    h1: {
      fontFamily: 'Namotura, sans-serif',
    },
    h2: {
      fontFamily: 'Namotura, sans-serif',
    },
    h3: {
      fontFamily: 'Namotura, sans-serif',
    },
    fontFamily: 'Space-Grotesk, Poppins, sans-serif',
  },
});

function GlobalKeyboardHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + E: Jump to AI Estimator
      if (e.altKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        const estimatorEl = document.getElementById('estimator');
        if (estimatorEl) {
          estimatorEl.scrollIntoView({ behavior: 'smooth' });
          estimatorEl.focus();
        } else {
          navigate('/what-we-do');
        }
      }
      // Alt + H: Navigate Home
      if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        navigate('/');
      }
      // Alt + C: Contact
      if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        navigate('/contact');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return null;
}

function AppContent() {
  const [blogs, setBlogs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const sortedBlogs = data.sort((a, b) => b.id - a.id);
    setBlogs(sortedBlogs);
    
    // Check if popup has been shown before
    const hasPopupShown = localStorage.getItem('popupShown');
    
    // Show popup if it hasn't been shown before
    if (!hasPopupShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem('popupShown', 'true');
  };

  return (
    <>
      <GlobalKeyboardHandler />
      <main id="main-content" tabIndex="-1" role="main" style={{ minHeight: '80vh', outline: 'none' }}>
        <AppRoutes blogs={blogs} />
      </main>
      {location.pathname !== '/contact' && <CTASection />}
      {showPopup && <WelcomePopup onClose={handleClosePopup} />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        {/* AX Skip Navigation Link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ScrollToTop />
        <Navbar />
        <AppContent />
        <WelcomeCTASection />
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;