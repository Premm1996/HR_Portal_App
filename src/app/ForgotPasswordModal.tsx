'use client';

import React, { useState } from 'react';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to handle password reset
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Reset Password</h2>
        
        {submitted ? (
          <div className="text-center py-6">
            <p className="text-cyan-400 mb-4">Check your email for reset instructions</p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-500 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-slate-300 mb-4">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
            />
            
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Send Reset Instructions
            </button>
          </form>
        )}
      </div>
    </div>
  );
}