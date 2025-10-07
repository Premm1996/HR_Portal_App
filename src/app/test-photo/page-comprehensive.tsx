'use client';

import React, { useState } from 'react';
import { getBestPhotoUrl } from '@/lib/photoUtils';

export default function PhotoTestPage() {
  const [photoPath, setPhotoPath] = useState('/uploads/profile-photos/test.jpg');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testPhoto = async () => {
    setLoading(true);
    setError('');
    setPhotoUrl('');

    try {
      console.log('🧪 Testing photo path:', photoPath);
      const url = await getBestPhotoUrl(photoPath, 'test-employee-id', 'Test Employee');
      console.log('📸 Final URL:', url);
      setPhotoUrl(url || '');

      if (!url) {
        setError('No URL returned from getBestPhotoUrl');
      }
    } catch (err) {
      console.error('❌ Error testing photo:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully');
  };

  const handleImageError = () => {
    console.error('❌ Image failed to load');
    setError('Image failed to load in browser');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Photo Loading Test Page</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Photo Path:
            </label>
            <input
              type="text"
              value={photoPath}
              onChange={(e) => setPhotoPath(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter photo path (e.g., /uploads/profile-photos/photo.jpg)"
            />
          </div>

          <button
            onClick={testPhoto}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Photo'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        {photoUrl && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Generated URL:</p>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                {photoUrl}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <img
                    src={photoUrl}
                    alt="Test"
                    className="max-w-full max-h-64 rounded-lg shadow-md"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}</p>
            <p><strong>Current Path:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Common Photo Paths to Test:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <button
                onClick={() => setPhotoPath('/uploads/profile-photos/photo.jpg')}
                className="text-left p-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
              >
                /uploads/profile-photos/photo.jpg
              </button>
              <button
                onClick={() => setPhotoPath('/uploads/photos/photo.jpg')}
                className="text-left p-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
              >
                /uploads/photos/photo.jpg
              </button>
              <button
                onClick={() => setPhotoPath('/public/uploads/photo.jpg')}
                className="text-left p-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
              >
                /public/uploads/photo.jpg
              </button>
              <button
                onClick={() => setPhotoPath('http://localhost:5000/uploads/photo.jpg')}
                className="text-left p-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
              >
                http://localhost:5000/uploads/photo.jpg
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
