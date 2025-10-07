'use client';

import React, { useState, useEffect } from 'react';
import authService from '../../lib/auth';

interface PhotoDebugInfo {
  employeeId: string;
  employeeData: any;
  photoPath: string;
  constructedUrl: string;
  backendUrl: string;
  imageLoadStatus: 'loading' | 'success' | 'error';
  errorMessage: string;
  imageMetadata: any;
}

export default function FixedPhotoTestPage() {
  const [debugInfo, setDebugInfo] = useState<PhotoDebugInfo>({
    employeeId: '',
    employeeData: null,
    photoPath: '',
    constructedUrl: '',
    backendUrl: '',
    imageLoadStatus: 'loading',
    errorMessage: '',
    imageMetadata: null
  });

  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<string[]>([]);

  // Helper function to construct full photo URL with comprehensive debugging
  const getPhotoUrl = (photoPath: string) => {
    if (!photoPath) return '';

    if (photoPath.startsWith('http')) return photoPath;

    // Get backend URL from multiple sources
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ||
                      (typeof window !== 'undefined' ? localStorage.getItem('backendUrl') : null) ||
                      'http://localhost:5000';

    const fullUrl = `${backendUrl}${photoPath}`;
    return fullUrl;
  };

  // Test image loading with comprehensive error handling
  const testImageLoading = async (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          success: true,
          width: img.naturalWidth,
          height: img.naturalHeight,
          src: url
        });
      };

      img.onerror = (error) => {
        reject({
          success: false,
          error: error,
          src: url
        });
      };

      img.src = url;
    });
  };

  // Comprehensive employee data fetch
  const fetchEmployeeData = async () => {
    try {
      const employeeId = authService.getCurrentEmployeeId();
      if (!employeeId) {
        throw new Error('No employee ID found');
      }

      console.log('🔍 Fixed Test: Fetching employee data for ID:', employeeId);

      const response = await fetch(`/api/employees/${employeeId}/profile`);
      console.log('📡 Fixed Test: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch employee data: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Fixed Test: Employee data received:', data);

      const photoPath = data.photo || '';
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const constructedUrl = getPhotoUrl(photoPath);

      setDebugInfo({
        employeeId,
        employeeData: data,
        photoPath,
        constructedUrl,
        backendUrl,
        imageLoadStatus: 'loading',
        errorMessage: '',
        imageMetadata: null
      });

      // Test the constructed URL
      if (constructedUrl) {
        try {
          const result = await testImageLoading(constructedUrl);
          setDebugInfo(prev => ({
            ...prev,
            imageLoadStatus: 'success',
            imageMetadata: result
          }));
          setTestResults(prev => [...prev, `✅ Image loaded successfully: ${constructedUrl}`]);
        } catch (error: any) {
          setDebugInfo(prev => ({
            ...prev,
            imageLoadStatus: 'error',
            errorMessage: error.message || 'Unknown error'
          }));
          setTestResults(prev => [...prev, `❌ Image failed to load: ${constructedUrl} - ${error.message || 'Unknown error'}`]);
        }
      } else {
        setDebugInfo(prev => ({
          ...prev,
          imageLoadStatus: 'error',
          errorMessage: 'No photo URL constructed'
        }));
        setTestResults(prev => [...prev, '❌ No photo URL constructed - no photo path available']);
      }

    } catch (error: any) {
      console.error('❌ Fixed Test: Error fetching employee data:', error);
      setDebugInfo(prev => ({
        ...prev,
        imageLoadStatus: 'error',
        errorMessage: error.message || 'Unknown error'
      }));
      setTestResults(prev => [...prev, `❌ Error fetching employee data: ${error.message || 'Unknown error'}`]);
    } finally {
      setLoading(false);
    }
  };

  // Test different URL variations
  const testUrlVariations = async () => {
    const variations = [
      debugInfo.constructedUrl,
      debugInfo.constructedUrl?.replace('http://localhost:5000', 'http://127.0.0.1:5000'),
      debugInfo.constructedUrl?.replace('http://localhost:5000', 'https://localhost:5000'),
      debugInfo.photoPath?.startsWith('/') ? `http://localhost:3000${debugInfo.photoPath}` : null,
    ].filter((url): url is string => Boolean(url));

    setTestResults(prev => [...prev, '🔄 Testing URL variations...']);

    for (const url of variations) {
      try {
        const result = await testImageLoading(url);
        setTestResults(prev => [...prev, `✅ Variation worked: ${url}`]);
      } catch (error: any) {
        setTestResults(prev => [...prev, `❌ Variation failed: ${url} - ${error.message || 'Unknown error'}`]);
      }
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Fixed Photo Test Page</h1>
        <div>Loading employee data and testing photo...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔍 Fixed Photo Debugging Tool</h1>

      {/* Debug Information */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>📊 Debug Information</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Employee ID:</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{debugInfo.employeeId || 'Not found'}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Employee Name:</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{debugInfo.employeeData?.fullName || 'Not available'}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Photo Path from DB:</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontFamily: 'monospace' }}>{debugInfo.photoPath || 'No photo path'}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Backend URL:</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontFamily: 'monospace' }}>{debugInfo.backendUrl}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Constructed Photo URL:</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontFamily: 'monospace', wordBreak: 'break-all' }}>{debugInfo.constructedUrl || 'No URL constructed'}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Image Load Status:</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                <span style={{
                  color: debugInfo.imageLoadStatus === 'success' ? 'green' :
                         debugInfo.imageLoadStatus === 'error' ? 'red' : 'orange',
                  fontWeight: 'bold'
                }}>
                  {debugInfo.imageLoadStatus === 'success' ? '✅ SUCCESS' :
                   debugInfo.imageLoadStatus === 'error' ? '❌ ERROR' : '⏳ LOADING'}
                </span>
              </td>
            </tr>
            {debugInfo.errorMessage && (
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Error Message:</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', color: 'red' }}>{debugInfo.errorMessage}</td>
              </tr>
            )}
            {debugInfo.imageMetadata && (
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Image Metadata:</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {debugInfo.imageMetadata.width} x {debugInfo.imageMetadata.height} pixels
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Photo Display Test */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h2>🖼️ Photo Display Test</h2>
        {debugInfo.constructedUrl ? (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <img
                src={debugInfo.constructedUrl}
                alt="Profile Test"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  border: '2px solid #ccc',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  console.error('❌ Image failed to load in display test');
                  setTestResults(prev => [...prev, '❌ Display test failed - image not loading in browser']);
                }}
                onLoad={(e) => {
                  console.log('✅ Image loaded successfully in display test');
                  setTestResults(prev => [...prev, '✅ Display test passed - image visible in browser']);
                }}
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={testUrlVariations}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Test URL Variations
              </button>
            </div>
          </div>
        ) : (
          <p style={{ color: 'red' }}>❌ No photo URL available to test</p>
        )}
      </div>

      {/* Test Results */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
        <h2>📋 Test Results</h2>
        {testResults.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {testResults.map((result, index) => (
              <li key={index} style={{
                padding: '8px',
                marginBottom: '4px',
                backgroundColor: 'white',
                borderRadius: '4px',
                borderLeft: '4px solid',
                borderLeftColor: result.startsWith('✅') ? 'green' : result.startsWith('❌') ? 'red' : 'orange'
              }}>
                {result}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tests run yet</p>
        )}
      </div>

      {/* Recommendations */}
      <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h2>💡 Recommendations</h2>
        <ul>
          <li>Check if the backend server is running on the correct port</li>
          <li>Verify the photo file exists on the backend server</li>
          <li>Check if the photo path in the database is correct</li>
          <li>Ensure NEXT_PUBLIC_BACKEND_URL environment variable is set correctly</li>
          <li>Check browser network tab for failed requests</li>
          <li>Verify CORS settings on the backend server</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
        <h2>🔧 Actions</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={fetchEmployeeData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Data
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Reload Page
          </button>
          <button
            onClick={() => console.log('Debug info:', debugInfo)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📊 Log Debug Info
          </button>
        </div>
      </div>
    </div>
  );
}
