'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, MapPin, Phone, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/60 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-white font-bold text-xl">Support Center</h1>
            <p className="text-slate-400 text-sm">Get help and support</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <img src="/logo.jpg" alt="Truerize Logo" className="h-10 w-auto" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          <div className="text-center mb-8">
            <HelpCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">How can we help you?</h2>
            <p className="text-slate-300">Contact our HR team for any assistance or inquiries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HR Email */}
            <div className="bg-slate-700/50 rounded-xl p-6 text-center">
              <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Email Support</h3>
              <p className="text-slate-300 mb-4">Send us an email for detailed inquiries</p>
              <a
                href="mailto:hr@truerize.com"
                className="inline-block px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                hr@truerize.com
              </a>
            </div>

            {/* Office Address */}
            <div className="bg-slate-700/50 rounded-xl p-6 text-center">
              <MapPin className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Office Address</h3>
              <p className="text-slate-300 mb-4">Visit our office for in-person support</p>
              <div className="text-white">
                <p>Truerize Technologies</p>
                <p>123 Business Park</p>
                <p>Tech City, TC 12345</p>
                <p>India</p>
              </div>
            </div>

            {/* Office Phone */}
            <div className="bg-slate-700/50 rounded-xl p-6 text-center">
              <Phone className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Phone Support</h3>
              <p className="text-slate-300 mb-4">Call us for immediate assistance</p>
              <a
                href="tel:+91-9876543210"
                className="inline-block px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                +91-9876543210
              </a>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-slate-700/30 rounded-xl p-6">
            <h3 className="text-white font-semibold text-xl mb-4">Additional Support Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-cyan-400 font-medium mb-2">Working Hours</h4>
                <p className="text-slate-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-slate-300">Saturday: 9:00 AM - 2:00 PM</p>
                <p className="text-slate-300">Sunday: Closed</p>
              </div>
              <div>
                <h4 className="text-cyan-400 font-medium mb-2">Emergency Contact</h4>
                <p className="text-slate-300">For urgent matters outside working hours:</p>
                <p className="text-white font-medium">+91-9876543211 (Emergency Line)</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8">
            <h3 className="text-white font-semibold text-xl mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-cyan-400 font-medium mb-2">How do I update my profile information?</h4>
                <p className="text-slate-300">Go to your dashboard and click on "Update Profile" in the Quick Actions section.</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-cyan-400 font-medium mb-2">How do I view my documents?</h4>
                <p className="text-slate-300">Click on "View Documents" in your dashboard to access all your uploaded documents.</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-cyan-400 font-medium mb-2">How do I download my ID card?</h4>
                <p className="text-slate-300">In your dashboard, go to the ID Card section and click "Download ID Card".</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-cyan-400 font-medium mb-2">How do I mark my attendance?</h4>
                <p className="text-slate-300">Use the Attendance section in your dashboard to punch in/out and view your attendance records.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
