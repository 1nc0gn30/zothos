/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import LawnMowing from './pages/LawnMowing';
import Landscaping from './pages/Landscaping';
import TreeCare from './pages/TreeCare';
import ServiceAreas from './pages/ServiceAreas';
import Gallery from './pages/Gallery';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/lawn-mowing" element={<LawnMowing />} />
          <Route path="services/landscaping" element={<Landscaping />} />
          <Route path="services/tree-care" element={<TreeCare />} />
          <Route path="service-areas" element={<ServiceAreas />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}
