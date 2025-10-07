'use client';
import React from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-center text-slate-800">Terms & Conditions</h3>
        <div className="text-slate-700 mb-6 max-h-64 overflow-y-auto pr-2">
          <p className="mb-3"><strong>HireConnect Portal Terms of Service</strong></p>
          
          <p className="mb-2">By using our platform, you agree to the following terms:</p>
          
          <ol className="list-decimal list-inside space-y-2 mb-3">
            <li>You will provide accurate and truthful information during registration and profile creation.</li>
            <li>All uploaded documents must be genuine and not falsified in any way.</li>
            <li>You consent to the processing of your personal data as per our privacy policy.</li>
            <li>You will not use the platform for any fraudulent or malicious activities.</li>
            <li>You understand that providing false information may result in account suspension or termination.</li>
            <li>You agree to comply with all applicable laws and regulations.</li>
            <li>The platform reserves the right to verify any information provided by you.</li>
            <li>You grant permission for background checks as part of the hiring process.</li>
          </ol>
          
          <p className="mb-2"><strong>Data Usage:</strong></p>
          <p className="mb-2">Your information will be used solely for recruitment and hiring purposes. We implement appropriate security measures to protect your data.</p>
          
          <p className="mb-2"><strong>Account Responsibility:</strong></p>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-colors"
            onClick={onAccept}
          >
            I Agree
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-slate-400 text-white font-semibold hover:bg-slate-500 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
