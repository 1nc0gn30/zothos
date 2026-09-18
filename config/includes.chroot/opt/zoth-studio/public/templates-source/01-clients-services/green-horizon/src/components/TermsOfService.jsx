import LegalPage from './LegalPage';

export default function TermsOfService() {
  return (
    <LegalPage title="Terms of Service">
      <p className="mb-4">
        <strong>Effective Date:</strong> June 29, 2026
      </p>

      <p className="mb-4">
        Welcome to the Nature Harmony Landscaping website. These Terms of Service govern your use of our website and the services we provide. By using this site, you agree to these terms.
      </p>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">Services</h2>
      <p className="mb-4">
        Nature Harmony Landscaping provides lawn care, hardscaping, tree services, yard cleanups, and landscape design services in Hampton Roads, Virginia. All estimates are provided free of charge and are subject to final on-site review.
      </p>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">Quotes and Scheduling</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>Online and phone estimates are preliminary and may be adjusted after an on-site evaluation.</li>
        <li>Scheduling is weather-dependent and subject to availability.</li>
        <li>We will communicate any changes to your scheduled service as promptly as possible.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">Payments</h2>
      <p className="mb-4">
        Payment terms will be outlined in your service agreement or invoice. We accept payment methods as agreed upon at the time of service.
      </p>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">Website Content</h2>
      <p className="mb-4">
        All content on this website, including images, text, and logos, is owned by Nature Harmony Landscaping or used with permission. You may not copy, reproduce, or distribute our content without written permission.
      </p>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">Limitation of Liability</h2>
      <p className="mb-4">
        Nature Harmony Landscaping is not liable for indirect, incidental, or consequential damages arising from the use of our website or services. Our total liability is limited to the amount paid for the specific service in question.
      </p>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">Changes to These Terms</h2>
      <p className="mb-4">
        We may update these Terms of Service from time to time. Continued use of the site after changes constitutes acceptance of the updated terms.
      </p>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">Contact Us</h2>
      <p className="mb-4">
        For questions about these terms, please contact us:
        <br />
        Phone:{' '}
        <a href="tel:+17576670064" className="text-teal-700 hover:underline">(757) 667-0064</a>
        <br />
        Email:{' '}
        <a href="mailto:nhlandscapingva@gmail.com" className="text-teal-700 hover:underline">nhlandscapingva@gmail.com</a>
      </p>
    </LegalPage>
  );
}
