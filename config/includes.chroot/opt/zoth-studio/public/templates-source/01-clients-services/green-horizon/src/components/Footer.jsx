export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & About */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 relative flex items-center justify-center bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
              <img src="/logo.svg" alt="NH logo" className="w-full h-full" />
            </div>
            <span className="text-xl font-serif font-medium">Nature Harmony Landscaping</span>
          </div>
          <p className="text-sm text-stone-300">
            Owned by Ian Davis. Serving Hampton Roads with honest landscaping services built on care, creativity, and craftsmanship.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Services</h4>
          <ul className="text-sm text-stone-300 space-y-2">
            <li>• Lawn Care & Maintenance</li>
            <li>• Custom Hardscaping</li>
            <li>• Tree & Yard Cleanup</li>
            <li>• Landscape Design</li>
            <li>• Seasonal Refresh</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact</h4>
          <ul className="text-sm text-stone-300 space-y-2">
            <li>Hampton Roads, VA</li>
            <li><a href="tel:+17576670064" className="hover:text-[#bfa06f] transition-colors">(757) 667-0064</a></li>
            <li><a href="mailto:nhlandscapingva@gmail.com" className="hover:text-[#bfa06f] transition-colors">nhlandscapingva@gmail.com</a></li>
            <li>Mon–Sat: 7AM–7PM</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-stone-700 pt-6 text-center text-stone-400 text-sm">
        <p>© {new Date().getFullYear()} Nature Harmony Landscaping. All rights reserved.</p>
        <p className="mt-1">Owned & operated by Ian Davis.</p>
        <p className="mt-2">
          <a href="/privacy-policy/" className="hover:text-[#bfa06f] transition-colors">Privacy Policy</a>
          {' • '}
          <a href="/terms-of-service/" className="hover:text-[#bfa06f] transition-colors">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}
