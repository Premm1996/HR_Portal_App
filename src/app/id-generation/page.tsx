'use client';
import React from 'react';

export default function IdGenerationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-cyan-900 px-4">
      <div className="bg-white/95 rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Virtual ID Card</h2>
        <div className="mb-6 text-blue-800">
          Your ID card has been generated. Download your virtual ID below.
        </div>
        <a
          href="/path-to-id-card.pdf"
          className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-lg font-bold text-lg shadow hover:from-cyan-700 hover:to-blue-800 transition-all"
          download
        >
          Download ID Card
        </a>
        <div className="mt-8 text-gray-600">Welcome to the company!</div>
      </div>
    </div>
  );
}
