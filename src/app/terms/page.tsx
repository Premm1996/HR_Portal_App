'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function TermsPage() {
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
            Terms of Service
          </h1>
          
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using HireConnect, you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Service Description</h2>
              <p>
                HireConnect provides an AI-powered talent acquisition platform that connects job seekers with employers. 
                Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Candidate profile creation and management</li>
                <li>Job matching and recommendations</li>
                <li>Interview scheduling and coordination</li>
                <li>Onboarding process management</li>
                <li>Analytics and reporting tools</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
              <p>As a user, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Not engage in fraudulent or malicious activities</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Account Registration</h2>
              <p>
                To access certain features, you must create an account. You must be at least 18 years old 
                and provide accurate, complete registration information. We reserve the right to suspend or 
                terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
              <p>
                All content, features, and functionality on HireConnect are owned by Truerize and are protected 
                by international copyright, trademark, and other intellectual property laws. You may not reproduce, 
                distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
              <p>
                HireConnect is provided "as is" without warranties of any kind. We are not liable for any indirect, 
                incidental, special, or consequential damages arising from the use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Service Modifications</h2>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of our services at any time. 
                We will provide reasonable notice for significant changes that affect user accounts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice, for conduct that 
                violates these Terms of Service or is otherwise harmful to other users or our business interests.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Governing Law</h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction 
                where Truerize operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at: 
                <a href="mailto:legal@hireconnect.com" className="text-blue-400 hover:text-blue-300 ml-1">
                  legal@hireconnect.com
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
