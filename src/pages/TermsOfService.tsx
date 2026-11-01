import { useEffect, useState } from 'react';

export default function TermsOfService() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('vp_terms_accepted');
    if (stored === 'true') {
      setAccepted(true);
    }
  }, []);

  return (
    <section className="terms-section">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 dark:text-white">
          Terms of Service
        </h1>

        <div className="prose max-w-none text-gray-600 dark:text-gray-300">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Acceptance of Terms
          </h2>
          <p>
            These Terms of Service ("Terms") govern your use of the Veltrion website
            (the "Service"). By accessing or using the Service, you agree to be bound
            by these Terms. If you disagree with any part of the Terms, you may not
            access the Service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Use of Our Service
          </h2>
          <p>
            The Service is intended for informational purposes only. You agree not to:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Use the Service for any unlawful purpose;</li>
            <li>Violate any applicable local, national, or international laws;</li>
            <li>Attempt to gain unauthorized access to any portion of the Service;</li>
            <li>Interfere with any person's use of the Service;</li>
            <li>Transmit any viruses, malware, or other destructive code.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Intellectual Property
          </h2>
          <p>
            All content included on this website, such as text, graphics, logos,
            images, and software, is the property of Veltrion or its content
            suppliers and is protected by applicable intellectual property laws.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, Veltrion shall not be
            liable for any indirect, incidental, special, consequential, or punitive
            damages, including without limitation loss of profits, data, or other
            intangible losses, resulting from your access to or use of the Service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Modifications
          </h2>
          <p>
            Veltrion reserves the right to modify these Terms at any time. We will
            post any Term modifications on this page. Your continued use of the
            Service after any such changes constitutes your acceptance of the new
            Terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at
            hello@veltrion.com.
          </p>
        </div>
      </div>
    </section>
  );
}