'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            Contact Us
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We're here to help! Reach out to us for any questions, support, or partnership inquiries.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Get in touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email Support</h3>
                    <p className="text-gray-400 text-sm">For general inquiries</p>
                    <a href="mailto:support@hireconnect.com" className="text-blue-400 hover:text-blue-300 text-sm">
                      support@hireconnect.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Phone className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Phone Support</h3>
                    <p className="text-gray-400 text-sm">Mon-Fri, 9AM-6PM EST</p>
                    <a href="tel:+1-800-HIRE-123" className="text-purple-400 hover:text-purple-300 text-sm">
                      +1 (800) HIRE-123
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Office Address</h3>
                    <p className="text-gray-400 text-sm">
                      123 Tech Avenue<br />
                      Suite 456, Innovation District<br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Clock className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Business Hours</h3>
                    <p className="text-gray-400 text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Support Channels */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Other ways to reach us</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-medium">Sales Inquiries</h4>
                  <a href="mailto:sales@hireconnect.com" className="text-blue-400 hover:text-blue-300 text-sm">
                    sales@hireconnect.com
                  </a>
                </div>
                <div>
                  <h4 className="text-white font-medium">Partnership Opportunities</h4>
                  <a href="mailto:partnerships@hireconnect.com" className="text-blue-400 hover:text-blue-300 text-sm">
                    partnerships@hireconnect.com
                  </a>
                </div>
                <div>
                  <h4 className="text-white font-medium">Media & Press</h4>
                  <a href="mailto:press@hireconnect.com" className="text-blue-400 hover:text-blue-300 text-sm">
                    press@hireconnect.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
