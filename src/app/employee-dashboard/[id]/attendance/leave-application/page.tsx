'use client';

import React from 'react';
import LeaveRequestForm from '../components/LeaveRequestForm';

export default function LeaveApplicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Leave Application
          </h1>
          <p className="text-gray-600 text-lg">Submit your leave request with ease</p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:shadow-2xl transition-shadow duration-300">
          <LeaveRequestForm />
        </div>
      </div>
    </div>
  );
}
