'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const glowAnimation = {
  boxShadow: [
    '0 0 5px 2px rgba(0, 255, 0, 0.7)',
    '0 0 15px 5px rgba(0, 255, 0, 1)',
    '0 0 5px 2px rgba(0, 255, 0, 0.7)'
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: 'loop' as const
  }
};

const rippleEffect = {
  scale: [1, 1.1, 1],
  opacity: [1, 0.7, 1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    repeatType: 'loop' as const
  }
};

const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.6 }
};

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

export default function PunchInOut() {
  const [punchInTime, setPunchInTime] = useState<string | null>(null);
  const [punchOutTime, setPunchOutTime] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // Break management state
  const [breakStartTime, setBreakStartTime] = useState<string | null>(null);
  const [breakDuration, setBreakDuration] = useState(0);
  const [breakReason, setBreakReason] = useState('');
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakInterval, setBreakInterval] = useState<NodeJS.Timeout | null>(null);

  // Combined button state
  const [showPunchOutOption, setShowPunchOutOption] = useState(false);

  useEffect(() => {
    if (punchInTime && !punchOutTime) {
      // Start timer
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(punchInTime).getTime();
        setTimer(Math.floor((now - start) / 1000));
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    } else {
      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setTimer(0);
    }
  }, [punchInTime, punchOutTime]);

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

  const handlePunchIn = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/attendance/punch-in', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPunchInTime(response.data.punchInTime);
      setPunchOutTime(null);
      setShowPunchOutOption(false);
    } catch (err: any) {
      console.error('Punch in error:', err);
      setError(err.response?.data?.message || 'Error punching in');
    }
  };

  const handlePunchOut = async () => {
    setError('');
    if (!punchInTime) {
      // Shake punch out button if clicked before punch in
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/attendance/punch-out', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPunchOutTime(response.data.punchOutTime);
      setShowPunchOutOption(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error punching out');
    }
  };

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
      setShowPunchOutOption(false);
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error ending break');
    }
  };

  const handleMainButtonClick = () => {
    if (!punchInTime) {
      // Not punched in - punch in
      handlePunchIn();
    } else if (punchInTime && !punchOutTime && !isOnBreak) {
      // Punched in, not on break - show options
      setShowPunchOutOption(!showPunchOutOption);
    } else if (isOnBreak) {
      // On break - resume work
      handleEndBreak();
    }
  };

  const getMainButtonLabel = () => {
    if (!punchInTime) return 'Punch In';
    if (punchInTime && !punchOutTime && !isOnBreak) return 'Start Break';
    if (isOnBreak) return 'Resume Work';
    return 'Punched Out';
  };

  const getMainButtonColor = () => {
    if (!punchInTime) return 'bg-green-500';
    if (punchInTime && !punchOutTime && !isOnBreak) return 'bg-yellow-500';
    if (isOnBreak) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {/* Main Combined Button */}
      <div className="flex flex-col items-center space-y-4">
        <motion.button
          onClick={handleMainButtonClick}
          className={`${getMainButtonColor()} text-white px-8 py-4 rounded-full font-semibold shadow-lg relative overflow-hidden text-lg`}
          animate={punchInTime && !punchOutTime ? glowAnimation : {}}
          whileTap={{ scale: 0.9 }}
          disabled={!!punchOutTime}
        >
          {getMainButtonLabel()}
          {punchInTime && !punchOutTime && (
            <motion.span
              className="absolute rounded-full bg-white opacity-30"
              style={{ top: 0, left: 0, right: 0, bottom: 0 }}
              animate={rippleEffect}
            />
          )}
        </motion.button>

        {/* Punch Out Option */}
        <AnimatePresence>
          {showPunchOutOption && punchInTime && !punchOutTime && !isOnBreak && (
            <motion.div animate={shake ? shakeAnimation : {}}>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handlePunchOut}
                className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
                whileTap={{ scale: 0.9 }}
              >
                Punch Out
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continuous Timer Display */}
      {punchInTime && !punchOutTime && (
        <motion.div
          className="text-3xl font-mono text-gray-800 font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {formatTime(timer)}
        </motion.div>
      )}

      {/* Break Reason Input */}
      {punchInTime && !punchOutTime && !isOnBreak && !showPunchOutOption && (
        <motion.div
          className="mt-4 p-4 bg-gray-50 rounded-lg w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <textarea
            value={breakReason}
            onChange={(e) => setBreakReason(e.target.value)}
            placeholder="Reason for break (optional)"
            className="w-full p-2 border rounded-md"
            rows={2}
          />
        </motion.div>
      )}

      {/* Break Status */}
      {isOnBreak && (
        <motion.div
          className="mt-4 p-4 bg-orange-50 rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-lg font-semibold text-orange-700 mb-2">
            On Break
          </div>
          <div className="text-xl font-mono text-orange-600">
            {formatTime(breakDuration)}
          </div>
        </motion.div>
      )}

      {/* Punch Out Confirmation */}
      {punchOutTime && (
        <motion.div
          className="mt-4 p-4 bg-green-50 rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-lg font-semibold text-green-700">
            Punched Out Successfully
          </div>
          <div className="text-sm text-green-600 mt-1">
            {new Date(punchOutTime).toLocaleString()}
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="text-red-600 font-semibold text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
