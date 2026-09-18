export default function LegalFooter() {
  return (
    <p className="text-center text-stone-500 text-sm mt-6">
      <a href="/privacy-policy/" className="hover:text-teal-700 transition-colors">Privacy Policy</a>
      {' • '}
      <a href="/terms-of-service/" className="hover:text-teal-700 transition-colors">Terms of Service</a>
    </p>
  );
}
