// App.jsx
import React from 'react';
import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustBadges from './components/TrustBadges';
import Services from './components/Services';
import Showcase from './components/Showcase';
import Testimonials from './components/Testimonials';
import Urgency from './components/Urgency';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingButton from './components/FloatingButton';

import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import SuccessPage from './components/SuccessPage';

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <TrustBadges />
      <Services />
      <Showcase />
      <Testimonials />
      <Urgency />
      <Contact />
      <Footer />
      <FloatingButton />
    </>
  );
}

function getPage() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/privacy-policy') return <PrivacyPolicy />;
  if (path === '/terms-of-service') return <TermsOfService />;
  if (path === '/success') return <SuccessPage />;
  return <HomePage />;
}

export default function App() {
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/privacy-policy/') {
      document.title = 'Privacy Policy | Nature Harmony Landscaping';
    } else if (path === '/terms-of-service/') {
      document.title = 'Terms of Service | Nature Harmony Landscaping';
    } else if (path === '/success/') {
      document.title = 'Thank You | Nature Harmony Landscaping';
    }
  }, []);

  return getPage();
}
