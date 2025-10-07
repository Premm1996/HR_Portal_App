'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface InterviewFailModalProps {
  isOpen: boolean;
  onClose: () => void;
  retryAfter: Date;
}

export default function InterviewFailModal({ isOpen, onClose, retryAfter }: InterviewFailModalProps) {
  if (!isOpen) return null;

  const daysRemaining = Math.ceil((retryAfter.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
      >
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Failed</h2>
        <p className="text-gray-600 mb-4">
          You can try again after {daysRemaining} days.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Retry available on: {retryAfter.toLocaleDateString()}
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
