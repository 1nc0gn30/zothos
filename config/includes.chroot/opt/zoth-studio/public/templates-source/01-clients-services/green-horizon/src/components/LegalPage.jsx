import Logo from './Logo';

export default function LegalPage({ title, children }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <a href="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif font-medium text-stone-800 mb-8">{title}</h1>
        <div className="prose prose-stone max-w-none">{children}</div>
      </main>

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
        <p>© {new Date().getFullYear()} Nature Harmony Landscaping. Owned by Ian Davis.</p>
        <p className="mt-2">
          <a href="/" className="hover:text-teal-700 transition-colors">Home</a>
          {' • '}
          <a href="/privacy-policy/" className="hover:text-teal-700 transition-colors">Privacy Policy</a>
          {' • '}
          <a href="/terms-of-service/" className="hover:text-teal-700 transition-colors">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
