import React, { Suspense, lazy } from 'react';
import {  Route, Routes } from 'react-router-dom';
import LoadingPage from './components/LoadingPage';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ClassesPage = lazy(() => import('./pages/ClassesPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const MembershipPage = lazy(() => import('./pages/MembershipPage'));
const MediaPage = lazy(() => import('./pages/MediaPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));

const AppRoutes = () => {
    return (
      <Suspense fallback={<LoadingPage />}>
        
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/FAQ" element={<FAQPage />} />
      </Routes>
    </Suspense>
    )
  };

export default AppRoutes