import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from './components/Loading'; 
import Home from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';

const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const Blog = lazy(() => import('./pages/Blog'));
const ITServices = lazy(() => import('./services/ITServices'));
const DetailedServices = lazy(() => import('./services/DetailedServices'));
const CloudServices = lazy(() => import('./services/CloudServices'));
const CyberSecurityServices = lazy(() => import('./services/CyberSecurityServices'));
const TechnologyProcurement = lazy(() => import('./services/TechnologyProcurement'));
const VoIPServices = lazy(() => import('./services/VoIPServices'));
const WebHosting = lazy(() => import('./services/WebHosting'));
const NetworkSetupServices = lazy(() => import('./services/NetworkSetupServices'));
const ComputerRepairServices = lazy(() => import('./services/ComputerRepairServices'));
const ManagedITServices = lazy(() => import('./services/ManagedITServices'));
const CyberSecurityRiskAssessment = lazy(() => import('./services/cybersecurity-services/CyberSecurityRiskAssesment'));
const VirtualCISO = lazy(() => import('./services/cybersecurity-services/VirtualCISCO'));
const CybersecurityManagement = lazy(() => import('./services/cybersecurity-services/CybersecurityManagement'));
const VoIPServicesCTA = lazy(() => import('./services/voip-services/VoIPServicesCTA'));
const TechnologyProcurementManagement = lazy(() => import('./services/technology-procurement-management/TechnologyProcurementManagement'));
const DataCenterServices = lazy(() => import('./services/datacenter-services/DataCenterServices'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

const AppRoutes = ({ blogs }) => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/what-we-do" element={<Services />} />
        <Route path="/who-we-are" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<BlogPage blogs={blogs} />} />
        <Route path="/blog/:pageId" element={<Blog blogs={blogs} />} />
        <Route path="/services/it-services" element={<ITServices />} />
        <Route path="/services/it-services/learn-more" element={<DetailedServices />} />
        <Route path="/services/cloud-services" element={<CloudServices />} />
        <Route path="/services/cybersecurity-services" element={<CyberSecurityServices />} />
        <Route path="/services/technology-procurement-services" element={<TechnologyProcurement />} />
        <Route path="/services/voip-services" element={<VoIPServices />} />
        <Route path="/services/web-hosting-services" element={<WebHosting />} />
        <Route path="/services/network-setup-services" element={<NetworkSetupServices />} />
        { /*
        <Route path="/services/computer-repair-services" element={<ComputerRepairServices />} /> */ }
        <Route path="/services/managed-it-services" element={<ManagedITServices />} />
        <Route path="/services/cybersecurity-services/risk-assessment" element={<CyberSecurityRiskAssessment />} />
        <Route path="/services/cybersecurity-services/virtual-ciso" element={<VirtualCISO />} />
        <Route path="/services/cybersecurity-services/cybersecurity-management" element={<CybersecurityManagement />} />
        <Route path="/services/voip-services/voip" element={<VoIPServicesCTA />} />
        <Route path="/services/technology-procurement-services/technology-procurement-services" element={<TechnologyProcurementManagement />} />
        <Route path="/services/datacenter-services/datacenter-services-management" element={<DataCenterServices />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
