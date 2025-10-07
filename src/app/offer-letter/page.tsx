'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface OfferLetter {
  id: string;
  candidateName: string;
  position: string;
  salary: string;
  startDate: string;
  offerLetterUrl: string;
  signedOfferLetterUrl?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'not_uploaded' | 'submitted';
  approvedAt?: string | null;
  remarks?: string | null;
}

export default function OfferLetterPage() {
  const router = useRouter();
  const [offerLetter, setOfferLetter] = useState<OfferLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signedFile, setSignedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchOfferLetter() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/signin');
          return;
        }

        const res = await fetch('/api/offer-letter', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch offer letter');
        }
        const data = await res.json();
        setOfferLetter(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchOfferLetter();
  }, [router]);

  const handleDownload = () => {
    if (offerLetter?.offerLetterUrl) {
      window.open(offerLetter.offerLetterUrl, '_blank');
    }
  };

  const handleUploadSigned = async () => {
    if (!signedFile || !offerLetter) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('signedOfferLetter', signedFile);
    formData.append('offerId', offerLetter.id);

    try {
      const response = await fetch('/api/upload-signed-offer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        // Refresh the offer letter data to show updated status
        const res = await fetch('/api/offer-letter', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOfferLetter(data);
        }
        setSignedFile(null);
        setError('');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAccept = async () => {
    if (!offerLetter) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    try {
      const response = await fetch('/api/accept-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ offerId: offerLetter.id }),
      });

      if (response.ok) {
        const result = await response.json();
        setOfferLetter({ ...offerLetter, status: 'accepted' });

        // Redirect to ID card generation page after successful acceptance
        router.push('/generate-id-card');
      } else {
        throw new Error('Acceptance failed');
      }
    } catch (err) {
      setError('Acceptance failed. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-white">Loading offer letter...</div>;
  }

  if (error && !offerLetter) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  if (!offerLetter) {
    return <div className="text-center mt-20 text-white">No offer letter available.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-900 to-blue-900 px-4 py-8">
      <motion.div
        className="bg-white/95 rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">TrueRize IQ Strategic Solutions Pvt Ltd</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Company Header */}
        <div className="mb-8 text-center">
          <div className="mb-4">
            <img
              src="/logo.jpg"
              alt="TrueRize IQ Logo"
              className="h-16 mx-auto object-contain"
            />
          </div>
          <h2 className="text-4xl font-bold text-blue-900 mb-2">Offer Letter Management</h2>
          <p className="text-lg text-blue-700">Professional Employment Solutions</p>
          <div className="mt-4 border-t-2 border-blue-200 pt-4">
            <h3 className="text-2xl font-semibold text-blue-900">Employment Offer Letter</h3>
            <p className="text-blue-600">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Offer Letter Details */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold mb-6 text-blue-900">Offer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-blue-900">Employee Name:</p>
            <p className="text-lg font-medium">{offerLetter.candidateName}</p>
          </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-blue-900">Position:</p>
              <p className="text-lg font-medium">{offerLetter.position || 'Not specified'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-blue-900">Joining Date:</p>
              <p className="text-lg font-medium">{offerLetter.startDate}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-blue-900">Salary:</p>
              <p className="text-lg text-gray-500 italic select-none">Confidential</p>
            </div>
          </div>
        </div>

        {/* Professional Terms */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Terms and Conditions</h3>
          <div className="space-y-3 text-gray-700">
            <p>• This offer is contingent upon successful completion of background verification and reference checks.</p>
            <p>• Employment is at-will and may be terminated by either party with appropriate notice.</p>
            <p>• All company policies and procedures must be adhered to during employment.</p>
            <p>• This offer letter supersedes any previous agreements or understandings.</p>
            <p>• Please sign and return this offer letter within 7 days to secure your position.</p>
          </div>
        </div>

        {/* Status Information */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-blue-900">Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              offerLetter.status === 'accepted' ? 'bg-green-100 text-green-800' :
              offerLetter.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
              offerLetter.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              offerLetter.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {offerLetter.status.toUpperCase()}
            </span>
          </div>

          {offerLetter.remarks && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">Remarks:</p>
              <p className="text-gray-600">{offerLetter.remarks}</p>
            </div>
          )}

          {offerLetter.approvedAt && (
            <div className="text-sm text-gray-600">
              <p>Last updated: {new Date(offerLetter.approvedAt).toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-6">
          {/* Download Offer Letter */}
          <div className="text-center">
            <button
              onClick={handleDownload}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-lg font-bold text-lg shadow-lg hover:from-cyan-700 hover:to-blue-800 transition-all"
            >
              📄 Download Offer Letter
            </button>
          </div>

          {/* Upload/Reupload Signed Offer Letter */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">
              {offerLetter.signedOfferLetterUrl ? 'Reupload Signed Offer Letter' : 'Upload Signed Offer Letter'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-blue-800 font-medium">
                  Select Signed Offer Letter (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSignedFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleUploadSigned}
                disabled={!signedFile || uploading}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-lg hover:from-green-700 hover:to-cyan-700 transition-all disabled:opacity-50 font-medium"
              >
                {uploading ? '📤 Uploading...' : '📤 Submit Signed Offer Letter'}
              </button>
            </div>

            {offerLetter.signedOfferLetterUrl && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
                <p className="text-sm">✅ Signed offer letter has been uploaded. You can reupload if needed.</p>
              </div>
            )}
          </div>

          {/* Accept Offer */}
          {offerLetter.status !== 'accepted' && (
            <div className="border-t pt-6 text-center">
              <button
                onClick={handleAccept}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                ✅ Accept Offer
              </button>
            </div>
          )}

          {/* Status Messages */}
          {offerLetter.status === 'accepted' && (
            <div className="border-t pt-6">
              <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center">
                <p className="font-bold text-lg">🎉 Offer Accepted!</p>
                <p>Your signed offer letter has been received and processed.</p>
              </div>
            </div>
          )}

          {(offerLetter.status === 'rejected' || offerLetter.status === 'not_uploaded') && (
            <div className="border-t pt-6">
              <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                <p className="font-bold">⚠️ Action Required</p>
                <p>Please upload your signed offer letter or contact HR for further assistance.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
