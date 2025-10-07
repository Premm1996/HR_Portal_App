'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Candidate {
  id: number;
  fullName: string;
  email: string;
  onboarding_status: string;
  offerLetterUploaded: boolean;
  idCardGenerated: boolean;
  documents: Array<{
    id: number;
    document_type: string;
    file_name: string;
    status: string;
    approved_at: string | null;
    remarks: string | null;
  }>;
}

export default function AdminOfferLettersPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/admin-login';
        return;
      }

      const res = await fetch('/api/admin/candidates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch candidates');
      }

      const data = await res.json();
      setCandidates(data.candidates);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (candidateId: number, status: 'APPROVED' | 'REJECTED') => {
    if (!remarks.trim() && status === 'REJECTED') {
      alert('Please provide remarks for rejection');
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/candidates/${candidateId}/offer/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          remarks: remarks.trim()
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const result = await res.json();
      alert(result.message);

      // Refresh candidates list
      await fetchCandidates();
      setSelectedCandidate(null);
      setRemarks('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'NOT_UPLOADED': { color: 'bg-gray-100 text-gray-800', label: 'Not Uploaded' },
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      'SUBMITTED': { color: 'bg-blue-100 text-blue-800', label: 'Submitted' },
      'APPROVED': { color: 'bg-green-100 text-green-800', label: 'Approved' },
      'REJECTED': { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['NOT_UPLOADED'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getSignedOfferStatus = (documents: any[]) => {
    const signedOffer = documents.find(doc => doc.document_type === 'signed_offer_letter');
    return signedOffer ? signedOffer.status : 'NOT_UPLOADED';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold">Error: {error}</div>
          <button
            onClick={fetchCandidates}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Offer Letter Management</h1>
          <p className="mt-2 text-gray-600">Review and approve/reject signed offer letters</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {candidates.map((candidate) => {
              const signedOfferStatus = getSignedOfferStatus(candidate.documents);
              const signedOfferDoc = candidate.documents.find(doc => doc.document_type === 'signed_offer_letter');

              return (
                <li key={candidate.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{candidate.fullName}</h3>
                          <p className="text-sm text-gray-500">{candidate.email}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                              Status: {getStatusBadge(signedOfferStatus)}
                            </span>
                            {signedOfferDoc?.approved_at && (
                              <span className="text-sm text-gray-500">
                                Approved: {new Date(signedOfferDoc.approved_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {signedOfferDoc?.remarks && (
                            <p className="mt-1 text-sm text-gray-600">
                              Remarks: {signedOfferDoc.remarks}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
{signedOfferDoc && (
  <button
    onClick={() => window.open(`http://localhost:5000${signedOfferDoc.file_name}`, '_blank')}
    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
  >
    View Signed Offer
  </button>
)}

                      {signedOfferStatus === 'SUBMITTED' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedCandidate(candidate)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            Review
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Review Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Review Offer Letter - {selectedCandidate.fullName}
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks (required for rejection)
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter remarks..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedCandidate.id, 'REJECTED')}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedCandidate.id, 'APPROVED')}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
