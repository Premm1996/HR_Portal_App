  'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Download,
  Upload,
  Eye,
  Trash2,
  Search,
  Filter,
  Plus,
} from 'lucide-react';

interface Document {
  id: number;
  name: string;
  employeeName?: string;
  uploadDate: string;
  type: string;
  url: string;
}

export default function AdminDocuments() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    if (!token || isAdmin !== 'true') {
      router.push('/signin');
      return;
    }
    fetchDocuments();
  }, [router]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/documents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      } else {
        console.error('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchDocuments();
      } else {
        alert('Failed to delete document');
      }
    } catch (error) {
      alert('Error deleting document');
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'png':
        return '🖼️';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl font-bold">Document Management</h1>
        <button
          onClick={() => router.push('/admin/documents/upload')}
          className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents or employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-800 text-white border border-slate-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="all">All Types</option>
          <option value="resume">Resume</option>
          <option value="contract">Contract</option>
          <option value="certificate">Certificate</option>
          <option value="id">ID Document</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-400">
              No documents found.
            </div>
          )}
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{getFileIcon(doc.type)}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{doc.name}</h3>
                  <p className="text-slate-400 text-sm">{doc.employeeName || 'General'}</p>
                  <p className="text-slate-500 text-xs">{doc.uploadDate}</p>
                  <p className="text-slate-500 text-xs capitalize">{doc.type}</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => window.open(doc.url, '_blank')}
                  className="flex-1 flex items-center justify-center space-x-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => window.open(doc.url, '_blank')}
                  className="flex-1 flex items-center justify-center space-x-1 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 bg-red-700 hover:bg-red-600 text-white rounded"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
