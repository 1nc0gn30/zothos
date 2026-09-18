import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'

import DeveloperDashboard from './pages/Developer/DeveloperDashboard';
import ClientDashboard from './pages/Client/ClientDashboard';
import Home from './pages/Home';
import ClientWebsites from './pages/Client/ClientWebsites';
import ClientActiveWebsites from './pages/Client/ClientActiveWebsites';
import ClientDomains from './pages/Client/ClientDomains';
import ClientMedia from './pages/Client/ClientMedia';
import ClientTools from './pages/Client/ClientTools';
import ClientDevelopers from './pages/Client/ClientDevelopers';
import ClientSettings from './pages/Client/ClientSettings';
import ClientNewWebsite from './pages/Client/ClientNewWebsite';
import RequireRole from './components/auth/RequireRole';

function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/ClientDashboard"
          element={
            <RequireRole role="client">
              <ClientDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/ClientWebsites"
          element={
            <RequireRole role="client">
              <ClientWebsites />
            </RequireRole>
          }
        />
        <Route
          path="/ClientNewWebsite"
          element={
            <RequireRole role="client">
              <ClientNewWebsite />
            </RequireRole>
          }
        />
        <Route
          path="/ClientActiveWebsites"
          element={
            <RequireRole role="client">
              <ClientActiveWebsites />
            </RequireRole>
          }
        />
        <Route
          path="/ClientDomains"
          element={
            <RequireRole role="client">
              <ClientDomains />
            </RequireRole>
          }
        />
        <Route
          path="/ClientMedia"
          element={
            <RequireRole role="client">
              <ClientMedia />
            </RequireRole>
          }
        />
        <Route
          path="/ClientTools"
          element={
            <RequireRole role="client">
              <ClientTools />
            </RequireRole>
          }
        />
        <Route
          path="/ClientDevelopers"
          element={
            <RequireRole role="client">
              <ClientDevelopers />
            </RequireRole>
          }
        />
        <Route
          path="/ClientSettings"
          element={
            <RequireRole role="client">
              <ClientSettings />
            </RequireRole>
          }
        />

        <Route
          path="/DeveloperDashboard"
          element={
            <RequireRole role="developer">
              <DeveloperDashboard />
            </RequireRole>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
