'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Activity, User, Calendar, Mail, Phone, Building } from 'lucide-react';
import AuthService from '@/lib/auth';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  onboardingStatus: string;
  onboardingStep: number;
}

interface OnboardingData {
  step: number;
  data: any;
}

interface Document {
  id: number;
  type: string;
  name: string;
  status: string;
  remarks?: string;
  uploadedAt: string;
  approvedAt?: string;
}

interface Activity {
  action: string;
  details: any;
  timestamp: string;
}

interface EmployeeDashboardData {
  employee: Employee;
  onboardingData: OnboardingData[];
  documents: Document[];
  recentActivities: Activity[];
}

export default function EmployeeDashboardView() {
  const params = useParams();
  const router = useRouter();
  const authService = AuthService;
  const [dashboardData, setDashboardData] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for offer letter status update form
  const [offerLetterStatus, setOfferLetterStatus] = useState<string>('');
  const [offerLetterRemarks, setOfferLetterRemarks] = useState<string>('');
  const [updatingOfferStatus, setUpdatingOfferStatus] = useState<boolean>(false);
  const [offerStatusMessage, setOfferStatusMessage] = useState<string | null>(null);
  const [offerStatusError, setOfferStatusError] = useState<string | null>(null);

  if (!params || !params.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Employee ID</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!authService.isAuthenticated() || !authService.getToken()) {
      router.push('/signin');
      return;
    }

    fetchEmployeeDashboard();
  }, [id, authService, router]);

  const fetchEmployeeDashboard = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/employees/${id}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employee dashboard');
      }

      const data = await response.json();
      setDashboardData(data);

      // Initialize offer letter status and remarks from documents if available
      const offerLetterDoc = data.documents.find((doc: Document) => doc.type === 'signed_offer_letter');
      if (offerLetterDoc) {
        setOfferLetterStatus(offerLetterDoc.status);
        setOfferLetterRemarks(offerLetterDoc.remarks || '');
      } else {
        setOfferLetterStatus('');
        setOfferLetterRemarks('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handler for offer letter status update form submit
  const handleOfferLetterStatusUpdate = async () => {
    if (!offerLetterStatus) {
      setOfferStatusError('Please select a status');
      return;
    }
    setOfferStatusError(null);
    setOfferStatusMessage(null);
    setUpdatingOfferStatus(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/employees/${id}/offer/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: offerLetterStatus,
          remarks: offerLetterRemarks,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update offer letter status');
      }

      setOfferStatusMessage('Offer letter status updated successfully');
      // Refresh dashboard data to reflect changes
      fetchEmployeeDashboard();
    } catch (error) {
      setOfferStatusError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setUpdatingOfferStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No Data Found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const { employee, onboardingData, documents, recentActivities } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard View</h1>
          <p className="text-gray-600 mt-2">Viewing dashboard for {employee.name}</p>
        </div>

        {/* Employee Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Employee Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg font-semibold">{employee.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold flex items-center">
                  <Mail className="mr-1 h-4 w-4" />
                  {employee.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Position</p>
                <p className="text-lg font-semibold">{employee.position}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="text-lg font-semibold flex items-center">
                  <Building className="mr-1 h-4 w-4" />
                  {employee.department}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Onboarding Status</p>
              <Badge className={getStatusColor(employee.onboardingStatus)}>
                {employee.onboardingStatus.replace('_', ' ').toUpperCase()}
              </Badge>
              <p className="text-sm font-medium text-gray-500 mt-2">Current Step: {employee.onboardingStep}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Onboarding Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
              <CardDescription>Step-by-step progress through onboarding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingData.map((step, index) => (
                  <div key={step.step} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step.step <= employee.onboardingStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Step {step.step}</p>
                      <p className="text-sm text-gray-600">
                        {Object.keys(step.data).length > 0 ? 'Completed' : 'Not started'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Documents
              </CardTitle>
              <CardDescription>Uploaded documents and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{doc.type.replace('_', ' ')}</p>
                      </div>
                      <Badge className={getDocumentStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No documents uploaded</p>
                )}
              </div>

              {/* Offer Letter Status Update Form */}
              <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-white">
                <h3 className="text-lg font-semibold mb-4">Update Offer Letter Status</h3>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Status</label>
                  <select
                    value={offerLetterStatus}
                    onChange={(e) => setOfferLetterStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select status</option>
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Remarks (optional)</label>
                  <textarea
                    value={offerLetterRemarks}
                    onChange={(e) => setOfferLetterRemarks(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows={4}
                    placeholder="Enter remarks here"
                  />
                </div>
                {offerStatusError && (
                  <p className="text-red-600 mb-2">{offerStatusError}</p>
                )}
                {offerStatusMessage && (
                  <p className="text-green-600 mb-2">{offerStatusMessage}</p>
                )}
                <Button
                  onClick={handleOfferLetterStatusUpdate}
                  disabled={updatingOfferStatus}
                >
                  {updatingOfferStatus ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest actions and updates for this employee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-gray-600">
                        {activity.details && Object.keys(activity.details).length > 0
                          ? Object.entries(activity.details).map(([key, value]) => `${key}: ${value}`).join(', ')
                          : 'No additional details'
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No recent activities</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
