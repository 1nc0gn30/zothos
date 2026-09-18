import { Outlet, Link, useLocation } from 'react-router-dom';
import { Leaf, MapPin, Phone, Menu, X, Facebook, Instagram, Twitter } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Service Areas', path: '/service-areas' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const handleSocialClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-emerald-50 text-emerald-950">
      {/* Coming Soon Toast */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-emerald-900 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold border-2 border-emerald-500"
          >
            Coming Soon! 🚀
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="bg-emerald-900 text-emerald-50 py-2 px-4 text-sm hidden md:flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/contact" className="flex items-center hover:text-emerald-300 transition-colors">
            <Leaf className="w-4 h-4 mr-2" /> Contact Us for a Quote
          </Link>
          <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Serving Hampton Roads, VA</span>
        </div>
        <div className="flex space-x-4">
          <button type="button" onClick={handleSocialClick} className="hover:text-emerald-300 transition-colors"><Facebook className="w-4 h-4" /></button>
          <button type="button" onClick={handleSocialClick} className="hover:text-emerald-300 transition-colors"><Instagram className="w-4 h-4" /></button>
          <button type="button" onClick={handleSocialClick} className="hover:text-emerald-300 transition-colors"><Twitter className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 rounded-b-3xl border-b-4 border-emerald-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-emerald-500 p-2 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-emerald-900">
                Happy<span className="text-emerald-500">Lawns</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-emerald-500 text-white shadow-md transform -translate-y-1'
                      : 'text-emerald-800 hover:bg-emerald-100 hover:text-emerald-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="ml-4 px-6 py-2 bg-yellow-400 text-yellow-900 font-extrabold rounded-full shadow-[0_4px_0_rgb(202,138,4)] hover:shadow-[0_2px_0_rgb(202,138,4)] hover:translate-y-[2px] transition-all"
              >
                Get a Quote
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b-4 border-emerald-500 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-2xl font-bold text-lg ${
                    location.pathname === link.path
                      ? 'bg-emerald-500 text-white'
                      : 'text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={closeMenu}
                className="block text-center mt-4 px-6 py-4 bg-yellow-400 text-yellow-900 font-extrabold rounded-2xl shadow-[0_4px_0_rgb(202,138,4)] active:shadow-[0_0px_0_rgb(202,138,4)] active:translate-y-[4px] transition-all text-lg"
              >
                Get a Free Quote!
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-100 pt-16 pb-8 rounded-t-[3rem] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="bg-emerald-500 p-2 rounded-2xl">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  Happy<span className="text-emerald-400">Lawns</span>
                </span>
              </Link>
              <p className="text-emerald-200 mb-6 font-medium">
                Making Hampton Roads greener, one yard at a time! Friendly, reliable, and professional lawn care services.
              </p>
              <div className="flex space-x-4">
                <button type="button" onClick={handleSocialClick} className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-600 transition-colors"><Facebook className="w-5 h-5" /></button>
                <button type="button" onClick={handleSocialClick} className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-600 transition-colors"><Instagram className="w-5 h-5" /></button>
                <button type="button" onClick={handleSocialClick} className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-600 transition-colors"><Twitter className="w-5 h-5" /></button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="bg-emerald-500 w-2 h-6 rounded-full mr-3"></span>
                Quick Links
              </h3>
              <ul className="space-y-3 font-medium">
                <li><Link to="/about" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">-</span> About Us</Link></li>
                <li><Link to="/services" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">-</span> All Services</Link></li>
                <li><Link to="/gallery" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">-</span> Our Work</Link></li>
                <li><Link to="/testimonials" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">-</span> Reviews</Link></li>
                <li><Link to="/contact" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">-</span> Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="bg-emerald-500 w-2 h-6 rounded-full mr-3"></span>
                Our Services
              </h3>
              <ul className="space-y-3 font-medium">
                <li><Link to="/services/lawn-mowing" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">-</span> Lawn Mowing</Link></li>
                <li><Link to="/services/landscaping" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">-</span> Landscaping</Link></li>
                <li><Link to="/services/tree-care" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">-</span> Tree & Shrub Care</Link></li>
                <li><Link to="/services" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">-</span> Seasonal Cleanup</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="bg-emerald-500 w-2 h-6 rounded-full mr-3"></span>
                Service Areas
              </h3>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-emerald-400" /> Virginia Beach</li>
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-emerald-400" /> Chesapeake</li>
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-emerald-400" /> Norfolk</li>
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-emerald-400" /> Hampton & Newport News</li>
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-emerald-400" /> Suffolk & Portsmouth</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-emerald-800 pt-8 text-center text-emerald-400 text-sm font-medium">
            <p>&copy; {new Date().getFullYear()} HappyLawns Hampton Roads. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
