// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './ScrollToTop';
import './App.css';
import AppRoutes from './AppRoutes';
import CtaComponent from './components/CtaComponent';
import FloatingButton from './components/FloatingButton';

const App = () => {
  return (
    
      <Router>
        <ScrollToTop />
        <Navbar />
        <div className="App">
          
          <AppRoutes />
          <CtaComponent />
          
</div>
<Footer />
          <FloatingButton />

       
      </Router>
  );
};

export default App;
