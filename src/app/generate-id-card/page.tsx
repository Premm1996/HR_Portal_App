'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface IDCard {
  id: string;
  candidateName: string;
  candidateId: string;
  position: string;
  startDate: string;
  photoUrl: string;
  qrCodeUrl: string;
}

export default function GenerateIDCardPage() {
  const router = useRouter();
  const [idCard, setIdCard] = useState<IDCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    async function fetchIDCard() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/signin');
          return;
        }

        const res = await fetch('/api/generate-id-card', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Failed to generate ID card');
        }
        const data = await res.json();

        // Handle auto logout if specified by backend
        if (data.autoLogout) {
          // Clear authentication data immediately
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('onboardingStatus');
          localStorage.removeItem('onboardingStep');
          localStorage.removeItem('candidateId');
          localStorage.removeItem('hasProfile');

          // Show success modal
          setShowSuccessModal(true);
          return;
        }

        setIdCard(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchIDCard();
  }, [router]);

  const handleDownload = () => {
    if (idCard) {
      // Create download link
      const link = document.createElement('a');
      link.href = `/api/download-id-card/${idCard.id}`;
      link.download = `id-card-${idCard.candidateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloaded(true);

      // Clear authentication data and logout immediately
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('onboardingStatus');
      localStorage.removeItem('onboardingStep');
      localStorage.removeItem('candidateId');
      localStorage.removeItem('hasProfile');

      // Redirect to signin page immediately
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    }
  };

  const handleOkay = () => {
    router.push('/signin');
  };

  if (loading) {
    return <div className="text-center mt-20 text-white">Generating ID card...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  if (!idCard) {
    return <div className="text-center mt-20 text-white">No ID card available.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Virtual ID Card</h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-2xl">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">HireConnect</h2>
                <p className="text-sm">Virtual ID Card</p>
              </div>
              
              <div className="flex justify-center mb-4">
                {idCard.photoUrl ? (
                  <img
                    src={idCard.photoUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-2xl">👤</span>
                  </div>
                )}
              </div>
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">{idCard.candidateName}</h3>
                <p className="text-sm">ID: {idCard.candidateId}</p>
                <p className="text-sm">Position: {idCard.position}</p>
                <p className="text-sm">Start Date: {idCard.startDate}</p>
              </div>
              
              {idCard.qrCodeUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={idCard.qrCodeUrl}
                    alt="QR Code"
                    className="w-20 h-20"
                  />
                </div>
              )}
              
              <div className="text-center">
                <p className="text-xs">This ID is valid for employment verification</p>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-8 text-center">
            <button
              onClick={handleDownload}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-lg hover:from-green-700 hover:to-cyan-700 transition-all"
            >
              Download ID Card
            </button>
            
            {downloaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-green-400"
              >
                ✓ ID Card Downloaded! You will be signed out in 5 seconds...
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
            <p className="text-gray-700 mb-6">
              ID card generated successfully! You can collect it from HR it will be provided within 7 working days. You have been logged out for security reasons.
            </p>
            <button
              onClick={handleOkay}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Okay
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
