import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MaintenancePage from './MaintenancePage';
import Spline from '@splinetool/react-spline';
import LoadingScreen from './LoadingScreen';
import ParticleCanvasBackground from './components/ParticleCanvasBackground';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import earth from './earthdeseo.spline';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [splineFailed, setSplineFailed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Deseo Media Company — Photography, Videography & AI Studio | Hampton Roads, VA</title>
        <meta
          name="description"
          content="Deseo Media Company is currently undergoing system maintenance & v2.0 upgrade. Priority contact portal & live service status active."
        />
        <meta
          name="keywords"
          content="Deseo Media, media production, videography, photography, podcast studio, Hampton Roads, Virginia, Norfolk, Virginia Beach"
        />
        <meta name="author" content="Deseo Media Company" />

        {/* Canonical Link */}
        <link rel="canonical" href="https://deseomediacompany.com/maintenance" />

        {/* OpenGraph Tags */}
        <meta property="og:title" content="Deseo Media Company — Creative Media Studio & AI Platform" />
        <meta
          property="og:description"
          content="Deseo Media Company is undergoing system maintenance. Submit priority project inquiries and view live service statuses."
        />
        <meta property="og:url" content="https://deseomediacompany.com/maintenance" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="%PUBLIC_URL%/logo512.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Deseo Media Company — Maintenance Portal" />
        <meta
          name="twitter:description"
          content="Deseo Media Company system upgrade status & client inquiry portal."
        />
        <meta name="twitter:image" content="%PUBLIC_URL%/logo512.png" />
      </Helmet>

      {/* WCAG 2.1 AA Skip Navigation Link */}
      <a href="#main-content" className="skip-link" id="skip-to-content">
        Skip to Main Content
      </a>

      <Box sx={{ position: 'relative', minHeight: '100vh', background: '#0d0d11' }}>
        {/* High-DPI WebGL Canvas Starfield Fallback */}
        <ParticleCanvasBackground />

        {/* Spline 3D Scene Layer with Defensive Fallback */}
        {!splineFailed && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              opacity: 0.85,
              pointerEvents: 'auto',
            }}
          >
            <Spline
              scene={earth}
              onError={() => setSplineFailed(true)}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        )}

        {isLoading ? (
          <LoadingScreen />
        ) : (
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Router>
              <Routes>
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="*" element={<Navigate to="/maintenance" replace />} />
              </Routes>
            </Router>
          </Box>
        )}
      </Box>
    </>
  );
}

export default App;
