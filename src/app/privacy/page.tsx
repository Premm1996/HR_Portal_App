'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="w-full bg-gray-950/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            Privacy Policy
          </h1>
          
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                At HireConnect, we collect information to provide better services to our users. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal identification information (Name, email address, phone number)</li>
                <li>Professional information (Resume, work experience, education)</li>
                <li>Usage data and analytics</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p>
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Match candidates with suitable job opportunities</li>
                <li>Facilitate the recruitment process</li>
                <li>Improve our platform and services</li>
                <li>Communicate important updates and notifications</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information. 
                All data is encrypted in transit and at rest, and access is restricted to authorized personnel only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Sharing</h2>
              <p>
                We do not sell your personal information. We only share data with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Verified employers for job matching purposes</li>
                <li>Trusted service providers who assist in our operations</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Access your personal information</li>
                <li>Request corrections to your data</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at: 
                <a href="mailto:privacy@hireconnect.com" className="text-blue-400 hover:text-blue-300 ml-1">
                  privacy@hireconnect.com
                </a>
              </p>
            </section>

            <div className="pt-8 mt-8 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                Last updated: January 2025
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
