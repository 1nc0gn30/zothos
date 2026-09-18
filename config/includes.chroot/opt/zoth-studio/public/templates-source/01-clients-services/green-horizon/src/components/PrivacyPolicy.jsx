import LegalPage from './LegalPage';

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="mb-4">
        <strong>Effective Date:</strong> June 29, 2026
      </p>

      <p className="mb-4">
        Nature Harmony Landscaping (“we,” “us,” or “our”) respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or submit a contact request.
      </p>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">Information We Collect</h2>
      <p className="mb-4">
        When you fill out our contact form, we collect your name, email address, phone number, and the message you provide. We may also collect basic usage data through standard server logs and analytics tools.
      </p>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>To respond to your estimate requests, questions, or service inquiries.</li>
        <li>To schedule appointments and provide landscaping services.</li>
        <li>To improve our website, services, and customer experience.</li>
        <li>To comply with legal obligations or protect our rights.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">How We Protect Your Information</h2>
      <p className="mb-4">
        We use industry-standard security measures, including secure form handling and spam protection, to keep your information safe. We do not sell or rent your personal information to third parties.
      </p>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">Third-Party Services</h2>
      <p className="mb-4">
        We use Netlify to host our website and process form submissions. Netlify may process your submission data in accordance with its own privacy policy. We may also use Google reCAPTCHA to protect our forms from spam.
      </p>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">Your Choices</h2>
      <p className="mb-4">
        You may contact us at any time to request access to, correction of, or deletion of your personal information by emailing{' '}
        <a href="mailto:nhlandscapingva@gmail.com" className="text-teal-700 hover:underline">nhlandscapingva@gmail.com</a>.
      </p>

      <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-3">Contact Us</h2>
      <p className="mb-4">
        Nature Harmony Landscaping
        <br />
        Hampton Roads, VA
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
