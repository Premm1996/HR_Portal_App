'use client';

import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, HelpCircle, Send } from 'lucide-react';

export default function SupportPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('contact');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  const [supportRequests] = useState([
    { id: 1, subject: 'Login Issue', status: 'Resolved', date: '2023-10-01', priority: 'High' },
    { id: 2, subject: 'Document Upload Problem', status: 'In Progress', date: '2023-10-05', priority: 'Medium' },
    { id: 3, subject: 'Payroll Query', status: 'Open', date: '2023-10-08', priority: 'Low' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submitting support request:', { subject, message });
    setMessage('');
    setSubject('');
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Support</h1>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-[#1E2A44] p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'contact' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Contact Info
        </button>
        <button
          onClick={() => setActiveTab('request')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'request' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          New Request
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          My Requests
        </button>
      </div>

      {/* Contact Info Tab */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#1E2A44] rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Phone className="w-8 h-8 text-green-400 mr-3" />
              <h3 className="text-lg font-semibold">Phone Support</h3>
            </div>
            <p className="text-slate-400 mb-2">Call us for immediate assistance</p>
            <p className="text-white font-medium">(123) 456-7890</p>
            <p className="text-sm text-slate-400">Mon-Fri: 9AM-6PM</p>
          </div>

          <div className="bg-[#1E2A44] rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Mail className="w-8 h-8 text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold">Email Support</h3>
            </div>
            <p className="text-slate-400 mb-2">Send us an email for detailed queries</p>
            <p className="text-white font-medium">support@truerize.com</p>
            <p className="text-sm text-slate-400">Response within 24 hours</p>
          </div>

          <div className="bg-[#1E2A44] rounded-xl p-6">
            <div className="flex items-center mb-4">
              <MessageSquare className="w-8 h-8 text-purple-400 mr-3" />
              <h3 className="text-lg font-semibold">Live Chat</h3>
            </div>
            <p className="text-slate-400 mb-2">Chat with our support team</p>
            <p className="text-white font-medium">Available 24/7</p>
            <p className="text-sm text-slate-400">Average response: 5 minutes</p>
          </div>
        </div>
      )}

      {/* New Request Tab */}
      {activeTab === 'request' && (
        <div className="bg-[#1E2A44] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Submit a Support Request</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#15253B] border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of your issue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full bg-[#15253B] border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide detailed information about your issue..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </button>
          </form>
        </div>
      )}

      {/* My Requests Tab */}
      {activeTab === 'history' && (
        <div className="bg-[#1E2A44] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold">My Support Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#15253B]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {supportRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-[#15253B] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">#{request.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{request.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        request.status === 'Resolved' ? 'bg-green-500/20 text-green-400' :
                        request.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        request.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                        request.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{request.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
