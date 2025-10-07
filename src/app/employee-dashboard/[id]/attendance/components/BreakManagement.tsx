'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [1, 0.8, 1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    repeatType: 'loop' as const
  }
};

const bounceAnimation = {
  y: [0, -5, 0],
  transition: {
    duration: 0.6,
    ease: 'easeOut'
  }
};

export default function BreakManagement() {
  const [breakStartTime, setBreakStartTime] = useState<string | null>(null);
  const [breakDuration, setBreakDuration] = useState(0);
  const [breakReason, setBreakReason] = useState('');
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [error, setError] = useState('');
  const [breakInterval, setBreakInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOnBreak) {
      // Start break timer
      const interval = setInterval(() => {
        if (breakStartTime) {
          const now = new Date().getTime();
          const start = new Date(breakStartTime).getTime();
          setBreakDuration(Math.floor((now - start) / 1000));
        }
      }, 1000);
      setBreakInterval(interval);
      return () => clearInterval(interval);
    } else {
      // Stop timer
      if (breakInterval) {
        clearInterval(breakInterval);
        setBreakInterval(null);
      }
      setBreakDuration(0);
    }
  }, [isOnBreak, breakStartTime]);

  const handleStartBreak = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/attendance/break/start', {
        reason: breakReason
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBreakStartTime(response.data.breakStartTime);
      setIsOnBreak(true);
    } catch (err: any) {
      console.error('Start break error:', err);
      setError(err.response?.data?.message || 'Error starting break');
    }
  };

  const handleEndBreak = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/attendance/break/end', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsOnBreak(false);
      setBreakStartTime(null);
      setBreakReason('');
      // Optionally show break summary
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error ending break');
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {!isOnBreak ? (
        <div className="flex flex-col items-center space-y-4">
          <textarea
            value={breakReason}
            onChange={(e) => setBreakReason(e.target.value)}
            placeholder="Reason for break (optional)"
            className="w-64 p-2 border rounded-md"
            rows={3}
          />
          <motion.button
            onClick={handleStartBreak}
            className="bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
            animate={pulseAnimation}
            whileTap={{ scale: 0.9 }}
          >
            Start Break
          </motion.button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-lg font-semibold text-gray-700">
            On Break - Duration: {formatTime(breakDuration)}
          </div>
          <motion.button
            onClick={handleEndBreak}
            className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
            animate={bounceAnimation}
            whileTap={{ scale: 0.9 }}
          >
            Resume Work
          </motion.button>
        </div>
      )}

      {error && <div className="text-red-600 font-semibold">{error}</div>}
    </div>
  );
}
