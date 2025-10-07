'use client';
import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Eye, Loader } from 'lucide-react';

interface Document {
  id: number;
  document_type: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
}

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  employeeId
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchDocuments();
    }
  }, [isOpen, employeeId]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/employees/${employeeId}/documents`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      } else {
        console.error('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    setDownloading(doc.id);
    try {
      const response = await fetch(`/uploads/${doc.file_name}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = doc.file_name;
        window.document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        window.document.body.removeChild(a);
      } else {
        console.error('Failed to download document');
        alert('Failed to download document. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error downloading document. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const handleView = (doc: Document) => {
    // Open document in new tab
    window.open(`/uploads/${doc.file_name}`, '_blank');
  };

  const getDocumentIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      default:
        return '📄';
    }
  };

  const formatDocumentType = (type: string) => {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E2A44] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">My Documents</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
              <span className="ml-3 text-slate-300">Loading documents...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">No Documents Found</h3>
              <p className="text-slate-400">You haven't uploaded any documents yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getDocumentIcon(doc.file_name)}</div>
                      <div>
                        <h4 className="text-white font-medium">
                          {formatDocumentType(doc.document_type)}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {formatDate(doc.uploaded_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(doc)}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-600 text-slate-300 rounded-lg hover:bg-slate-500 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      disabled={downloading === doc.id}
                      className="flex items-center gap-2 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading === doc.id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {downloading === doc.id ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
