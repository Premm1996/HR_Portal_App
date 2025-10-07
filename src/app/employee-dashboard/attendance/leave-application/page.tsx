'use client';

import React from 'react';
import DashboardLayout from '@/app/employee-dashboard/components/DashboardLayout';
import { Calendar, FileText, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaveApplicationPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-purple-100 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50"
        >
          <div className="flex items-center mb-6">
            <Calendar className="w-8 h-8 mr-3 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Leave Application</h1>
          </div>
          <p className="text-gray-600 mb-8">
            Submit your leave requests here. This feature is under development.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200"
            >
              <FileText className="w-6 h-6 mb-3 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">New Leave Request</h3>
              <p className="text-gray-600">Apply for annual leave, sick leave, or other types.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200"
            >
              <Clock className="w-6 h-6 mb-3 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Leave History</h3>
              <p className="text-gray-600">View your past leave requests and status.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
