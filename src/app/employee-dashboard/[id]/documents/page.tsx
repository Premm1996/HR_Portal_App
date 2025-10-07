'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/app/employee-dashboard/components/DashboardLayout';
import { FileText, Upload, Folder, Download, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function DocumentsPage({ params }: { params: { id: string } }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees/profile/documents');
      setDocuments(res.data.documents || []);
    } catch (err) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('offerLetter', selectedFile);

      const res = await api.post('/employees/profile/documents/offer-letter', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 200) {
        fetchDocuments();
        setSelectedFile(null);
      } else {
        setError('Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

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
            <FileText className="w-8 h-8 mr-3 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {loading ? (
            <p>Loading documents...</p>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Uploaded Documents</h2>
                {documents.length === 0 ? (
                  <p className="text-gray-600">No documents uploaded yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {documents.map((doc: any) => (
                      <li key={doc.id} className="flex items-center justify-between border p-3 rounded-md">
                        <div className="flex items-center gap-3">
                          <Folder className="w-6 h-6 text-blue-600" />
                          <span>{doc.file_name}</span>
                        </div>
                        <a
                          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${doc.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-indigo-600 hover:underline"
                          download
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Upload Offer Letter</h2>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="mb-3"
                />
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Uploading...' : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-1" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
