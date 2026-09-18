import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Playground from '../pages/Playground';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import Pricing from '../pages/Pricing';
import Waitlist from '../pages/Waitlist';
import ProtectedRoute from '../components/ProtectedRoute';
import Nodes from '../pages/Nodes';
import Osint from '../pages/osint/Osint';
import Profile from '../pages/Profile';
import TermsOfService from '../pages/TermsOfService';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import HexStrikePage from '../pages/osint/tools/hexstrike/HexStrikePage';
import Reports from '../pages/reports/Reports';
import Swarm from '../pages/swarm/Swarm';
import NeuralLab from '../pages/neural/NeuralLab';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/waitlist" element={<Waitlist />} />
      <Route path="/swarm" element={<Swarm />} />
      <Route path="/neural" element={<NeuralLab />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route
        path="/playground"
        element={
          <ProtectedRoute>
            <Playground />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nodes"
        element={
          <ProtectedRoute>
            <Nodes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/osint"
        element={
          <ProtectedRoute>
            <Osint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hexstrike"
        element={
          <ProtectedRoute>
            <HexStrikePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
