import { useEffect, useState } from 'react';

export default function PrivacyPolicy() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    // Check if already accepted via localStorage
    const stored = localStorage.getItem('vp_privacy_accepted');
    if (stored === 'true') {
      setAccepted(true);
    }
  }, []);

  return (
    <section className="privacy-section">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 dark:text-white">
          Privacy Policy
        </h1>

        <div className="prose max-w-none text-gray-600 dark:text-gray-300">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Introduction
          </h2>
          <p>
            This privacy policy explains how Veltrion collects, uses, discloses, and
            safeguards your information when you visit our website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>
              <strong>Personal information:</strong> Name, email address, and phone
              number when you contact us via the contact form.
            </li>
            <li>
              <strong>Usage data:</strong> Information about how you interact with our
              website, including pages visited, time spent, and referral sources.
            </li>
            <li>
              <strong>Cookies:</strong> Small data files placed on your device. See our
              Cookie Policy below.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            How We Use Your Information
          </h2>
          <p>
            We use the information we collect to: operate and maintain our website;
            improve, personalize, and expand our services; communicate with you;
            send updates and marketing communications (if you have consented); and
            detect, prevent, and address security issues.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Information Sharing
          </h2>
          <p>
            We do not sell your personal information to third parties. We may share
            information with service providers who help us operate our website, with
            legal authorities if required by law, and with your consent when you
            contact us.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Data Security
          </h2>
          <p>
            We implement appropriate data security measures and restrict access to
            personal information to authorized personnel. However, no method of
            transmission over the internet or electronic storage is 100% secure.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Your Rights
          </h2>
          <p>
            You have the right to access, correct, delete, or restrict the processing
            of your personal data. You may also withdraw consent at any time.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Changes to This Policy
          </h2>
          <p>
            We may update our privacy policy from time to time. We will notify you of
            any changes by posting the new privacy policy on this page.
          </p>
        </div>
      </div>
    </section>
  );
}