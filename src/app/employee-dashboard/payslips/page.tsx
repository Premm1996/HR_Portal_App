'use client';

import React from 'react';
import DashboardLayout from '@/app/employee-dashboard/components/DashboardLayout';
import { DollarSign, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PayslipsPage() {
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
            <DollarSign className="w-8 h-8 mr-3 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-800">Payslips</h1>
          </div>
          <p className="text-gray-600 mb-8">
            View and download your payslips. This feature is under development.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200"
            >
              <FileText className="w-6 h-6 mb-3 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Payslips</h3>
              <p className="text-gray-600">Access your latest payslip documents.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200"
            >
              <Download className="w-6 h-6 mb-3 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Download History</h3>
              <p className="text-gray-600">Download previous payslips for your records.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
