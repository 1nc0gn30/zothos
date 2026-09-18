import React from 'react';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-stone-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="group">
          <Logo size="sm" />
        </a>

        {/* Contact & CTA */}
        <div className="hidden sm:flex items-center space-x-4">
          <a
            href="tel:+17576670064"
            className="text-teal-700 hover:text-teal-800 font-medium flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            (757) 667-0064
          </a>
          <a
            href="#contact"
            className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Get Free Quote
          </a>
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden">
          <a
            href="tel:+17576670064"
            className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition-transform transform hover:scale-105"
          >
            Call
          </a>
        </div>
      </div>
    </header>
  );
}
