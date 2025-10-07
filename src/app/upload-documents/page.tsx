'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface DocumentUpload {
  id: string;
  title: string;
  file: File | null;
  uploaded: boolean;
  progress: number;
  accept: string;
}

const requiredDocuments = [
  { id: 'resume', title: 'Resume (PDF)', accept: '.pdf' },
  { id: 'marks10', title: '10th Mark Sheet/Certificate', accept: '.pdf,.jpg,.jpeg,.png' },
  { id: 'marks12', title: '12th Mark Sheet/Certificate', accept: '.pdf,.jpg,.jpeg,.png' },
  { id: 'degree', title: 'Degree Certificate', accept: '.pdf,.jpg,.jpeg,.png' },
  { id: 'aadhaar', title: 'Aadhaar Card', accept: '.pdf,.jpg,.jpeg,.png' },
  { id: 'pan', title: 'PAN Card', accept: '.pdf,.jpg,.jpeg,.png' },
  { id: 'photo', title: 'Passport-size Photograph', accept: '.jpg,.jpeg,.png' },
];

export default function UploadDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentUpload[]>(
    requiredDocuments.map(doc => ({
      ...doc,
      file: null,
      uploaded: false,
      progress: 0,
    }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (id: string, file: File) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id
          ? { ...doc, file, uploaded: false, progress: 0 }
          : doc
      )
    );
  };

  const handleUpload = async (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (!document || !document.file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('document', document.file);
      formData.append('type', id);

      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === id
              ? { ...doc, uploaded: true, progress: 100 }
              : doc
          )
        );
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAll = async () => {
    const allUploaded = documents.every(doc => doc.uploaded);
    if (!allUploaded) {
      setError('Please upload all required documents.');
      return;
    }

    try {
      const response = await fetch('/api/submit-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: documents.map(d => d.id) }),
      });

      if (response.ok) {
        router.push('/offer-letter');
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setError('Submission failed. Please try again.');
    }
  };

  const allUploaded = documents.every(doc => doc.uploaded);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-900 to-blue-900 px-4">
      <motion.div 
        className="bg-white/95 rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Upload Your Documents</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {documents.map((doc) => (
            <div key={doc.id} className="mb-4">
              <label className="block mb-2 text-blue-800 font-semibold text-left">
                {doc.title}
              </label>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept={doc.accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(doc.id, file);
                  }}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleUpload(doc.id)}
                  disabled={!doc.file || doc.uploaded || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {doc.uploaded ? '✓ Uploaded' : 'Upload'}
                </button>
              </div>
              {doc.progress > 0 && doc.progress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${doc.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={handleSubmitAll}
            disabled={!allUploaded || loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-lg hover:from-green-700 hover:to-cyan-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit All Documents'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}