import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import TerminalPage from './pages/TerminalPage';

function App() {
  return (
    <>
      <Toaster theme="dark" position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<TerminalPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;