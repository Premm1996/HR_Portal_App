'use client';

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEmployeeProfile, useAttendanceSummary, usePayrollHistory, useUpcomingBirthdays, updateEmployeeProfile } from "@/lib/api";
import authService from "@/lib/auth";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Target,
  Award,
  BookOpen,
  Bell,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Building,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Eye,
  Star,
  Zap,
  Activity,
  MessageSquare,
  Gift,
  AlertTriangle,
  Edit,
  Save,
  X,
  Upload,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';

export default function HomePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<any>(null);

  useEffect(() => {
    setEmployeeId(params.id);
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    const modeParam = searchParams?.get('mode');
    setMode(modeParam === 'edit' && adminStatus ? 'edit' : 'view');
  }, [params.id, searchParams]);

  const { data: employee, isLoading: empLoading, error: empError } = useEmployeeProfile(employeeId);
  const { data: attendance, isLoading: attLoading, error: attError } = useAttendanceSummary(employeeId);
  const { data: payroll, isLoading: payLoading, error: payError } = usePayrollHistory();
  const { data: birthdays, isLoading: birthdaysLoading, error: birthdaysError } = useUpcomingBirthdays();

  // Helper functions
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on leave': return 'bg-yellow-100 text-yellow-800';
      case 'notice period': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Initialize editedEmployee when employee data loads
  useEffect(() => {
    if (employee && !editedEmployee) {
      setEditedEmployee({ ...employee });
    }
  }, [employee, editedEmployee]);

  // Save handler
  const handleSave = async () => {
    if (!editedEmployee || !employeeId) return;

    try {
      await updateEmployeeProfile(employeeId, editedEmployee);
      toast.success("Profile updated successfully!");
      setMode('view');
      // Optionally refresh the employee data
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Update error:", error);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    setEditedEmployee(employee ? { ...employee } : null);
    setMode('view');
  };

  // Fallback data constants - memoized to prevent unnecessary re-renders
  const assignedTrainings = useMemo(() => [
    { title: "Advanced React Patterns", deadline: "Jan 30, 2025", progress: 40 },
    { title: "Leadership Skills Workshop", deadline: "Feb 15, 2025", progress: 0 },
    { title: "Cloud Architecture Fundamentals", deadline: "Mar 10, 2025", progress: 20 }
  ], []);

  const skillsToImprove = useMemo(() => [
    { skill: "System Design", priority: "High" },
    { skill: "DevOps Practices", priority: "Medium" },
    { skill: "Data Structures", priority: "Low" }
  ], []);

  const announcements = useMemo(() => [
    {
      title: "Holiday Calendar 2025",
      message: "New holiday calendar has been published. Check the updated list of public holidays.",
      date: "Dec 20, 2024",
      type: "holiday"
    },
    {
      title: "New Policy Updates",
      message: "Updated remote work and flexible hours policy is now available.",
      date: "Dec 18, 2024",
      type: "policy"
    },
    {
      title: "Q4 Town Hall Meeting",
      message: "Join us for the quarterly town hall on January 15th, 2025.",
      date: "Dec 15, 2024",
      type: "meeting"
    }
  ], []);

  const loading = empLoading || attLoading || payLoading;
  const error = empError || attError || payError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Override DashboardLayout dark theme */}
      <style jsx global>{`
        body { background-color: #f9fafb !important; }
        .min-h-screen { background-color: #f9fafb !important; }
      `}</style>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section – Employee Welcome */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 shadow-2xl -mt-4 border border-slate-200" style={{ padding: '1rem 2rem' }}>
          <div className="absolute inset-0 bg-white/40"></div>
          <div className="relative p-0">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-slate-200 flex items-center justify-center shadow-2xl relative overflow-hidden">
                  {employee?.photo ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${employee.photo}`}
                      alt={employee?.fullName || 'Employee profile'}
                      width={80}
                      height={80}
                      className="w-full h-full rounded-full object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 80px"
                    />
                  ) : (
                    <User className="w-10 h-10 text-slate-600" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <Star className="w-2 h-2 text-white fill-current" />
                </div>
              </div>

      {/* Employee Info */}
      <div className="flex-1 text-slate-900">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                    {getGreeting()}, {employee?.fullName ? employee.fullName.split(' ')[0] : 'User'}! 👋
                  </h1>
                  <div className="animate-bounce">
                    <Zap className="w-6 h-6 text-yellow-300" />
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-3 max-w-2xl leading-snug">
                  Welcome to your personalized dashboard. Here's your professional overview and key metrics for today.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-slate-200">
                    <Label className="text-[0.55rem] font-medium text-slate-600 uppercase tracking-wide">Employee ID</Label>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{employee?.employeeId || employee?.id}</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-slate-200">
                    <Label className="text-[0.55rem] font-medium text-slate-600 uppercase tracking-wide">Job Title</Label>
                    {mode === 'edit' && isAdmin ? (
                      <Input
                        value={editedEmployee?.position || ''}
                        onChange={(e) => setEditedEmployee(prev => ({ ...prev, position: e.target.value }))}
                        className="text-xs font-bold text-slate-900 mt-0.5 h-6"
                      />
                    ) : (
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{employee?.position || 'Not specified'}</p>
                    )}
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-slate-200">
                    <Label className="text-[0.55rem] font-medium text-slate-600 uppercase tracking-wide">Department</Label>
                    {mode === 'edit' && isAdmin ? (
                      <Input
                        value={editedEmployee?.department || ''}
                        onChange={(e) => setEditedEmployee(prev => ({ ...prev, department: e.target.value }))}
                        className="text-xs font-bold text-slate-900 mt-0.5 h-6"
                      />
                    ) : (
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{employee?.department || 'Not specified'}</p>
                    )}
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-slate-200">
                    <Label className="text-[0.55rem] font-medium text-slate-600 uppercase tracking-wide">Manager</Label>
                    {mode === 'edit' && isAdmin ? (
                      <Input
                        value={editedEmployee?.managerName || ''}
                        onChange={(e) => setEditedEmployee(prev => ({ ...prev, managerName: e.target.value }))}
                        className="text-xs font-bold text-slate-900 mt-0.5 h-6"
                      />
                    ) : (
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{employee?.managerName || 'Not assigned'}</p>
                    )}
                  </div>
                </div>

                {/* Additional editable fields in edit mode */}
                {mode === 'edit' && isAdmin && (
                  <div className="space-y-6 mb-6">
                    {/* Basic Information */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">First Name</Label>
                          <Input
                            value={editedEmployee?.firstName || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, firstName: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Last Name</Label>
                          <Input
                            value={editedEmployee?.lastName || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, lastName: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Email</Label>
                          <Input
                            value={editedEmployee?.email || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, email: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Phone</Label>
                          <Input
                            value={editedEmployee?.phone || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, phone: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Employment Details */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Employment Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Employee ID</Label>
                          <Input
                            value={editedEmployee?.employeeId || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, employeeId: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Job Title</Label>
                          <Input
                            value={editedEmployee?.position || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, position: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Department</Label>
                          <Input
                            value={editedEmployee?.department || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, department: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Manager</Label>
                          <Input
                            value={editedEmployee?.managerName || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, managerName: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status & Location */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Status & Location</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Status</Label>
                          <Select
                            value={editedEmployee?.status || 'active'}
                            onValueChange={(value) => setEditedEmployee(prev => ({ ...prev, status: value }))}
                          >
                            <SelectTrigger className="text-sm font-bold text-slate-900 mt-1 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="on leave">On Leave</SelectItem>
                              <SelectItem value="notice period">Notice Period</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Location</Label>
                          <Input
                            value={editedEmployee?.location || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, location: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                            placeholder="e.g. Remote, Office, Hybrid"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Joining Date</Label>
                          <Input
                            type="date"
                            value={editedEmployee?.joiningDate ? new Date(editedEmployee.joiningDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, joiningDate: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Work Location</Label>
                          <Input
                            value={editedEmployee?.workLocation || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, workLocation: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                            placeholder="e.g. Mumbai, Delhi, Remote"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Personal Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Date of Birth</Label>
                          <Input
                            type="date"
                            value={editedEmployee?.dob ? new Date(editedEmployee.dob).toISOString().split('T')[0] : ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, dob: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Gender</Label>
                          <Select
                            value={editedEmployee?.gender || ''}
                            onValueChange={(value) => setEditedEmployee(prev => ({ ...prev, gender: value }))}
                          >
                            <SelectTrigger className="text-sm font-bold text-slate-900 mt-1 h-8">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Blood Group</Label>
                          <Select
                            value={editedEmployee?.bloodGroup || ''}
                            onValueChange={(value) => setEditedEmployee(prev => ({ ...prev, bloodGroup: value }))}
                          >
                            <SelectTrigger className="text-sm font-bold text-slate-900 mt-1 h-8">
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Personal Email</Label>
                          <Input
                            type="email"
                            value={editedEmployee?.personalEmail || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, personalEmail: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Current Address</Label>
                          <Textarea
                            value={editedEmployee?.currentAddress || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, currentAddress: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-20 resize-none"
                            placeholder="Enter current address"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Permanent Address</Label>
                          <Textarea
                            value={editedEmployee?.permanentAddress || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, permanentAddress: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-20 resize-none"
                            placeholder="Enter permanent address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Banking Information */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Banking Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Bank Name</Label>
                          <Input
                            value={editedEmployee?.bankName || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, bankName: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Account Holder Name</Label>
                          <Input
                            value={editedEmployee?.accountHolderName || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, accountHolderName: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Account Number</Label>
                          <Input
                            value={editedEmployee?.accountNumber || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, accountNumber: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">IFSC Code</Label>
                          <Input
                            value={editedEmployee?.ifscCode || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, ifscCode: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Branch Location</Label>
                          <Input
                            value={editedEmployee?.branchLocation || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, branchLocation: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Career Links */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Career Links</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">LinkedIn Profile</Label>
                          <Input
                            type="url"
                            value={editedEmployee?.linkedInProfile || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, linkedInProfile: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Portfolio/GitHub</Label>
                          <Input
                            type="url"
                            value={editedEmployee?.portfolioGitHub || ''}
                            onChange={(e) => setEditedEmployee(prev => ({ ...prev, portfolioGitHub: e.target.value }))}
                            className="text-sm font-bold text-slate-900 mt-1 h-8"
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Mode Actions */}
                {mode === 'edit' && isAdmin && (
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={handleSave}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-slate-100 text-slate-800 border-slate-200 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                    <Activity className="w-3 h-3 mr-1" />
                    {employee?.status || 'Active'}
                  </Badge>
                  <div className="flex items-center text-slate-700 bg-white/60 px-2 py-1 rounded-lg backdrop-blur-sm text-xs border border-slate-200">
                    <MapPin className="w-3 h-3 mr-1" />
                    {employee?.location || 'Remote'}</div>
                  <div className="flex items-center text-slate-700 bg-white/60 px-2 py-1 rounded-lg backdrop-blur-sm text-xs border border-slate-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {employee?.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'Not specified'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Attendance Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-100 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Attendance</h3>
                    <p className="text-sm text-gray-600">Today's Status</p>
                    <p className="text-sm text-gray-600">Today's Status</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/employee-dashboard/attendance')}
                  className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View More
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700">Today</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Present
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700">Monthly Attendance</span>
                  <span className="text-lg font-bold text-teal-600">95%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700">Working Hours</span>
                  <span className="text-lg font-bold text-teal-600">8h 30m</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Payroll</h3>
                    <p className="text-sm text-gray-600">Latest Payment</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/employee-dashboard/payslips')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View More
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700">Last Credited</span>
                  <span className="text-sm font-semibold text-gray-900">Dec 25, 2024</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700">Amount</span>
                  <span className="text-xl font-bold text-blue-600">₹75,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Paid
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Balance Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Leave Balance</h3>
                    <p className="text-sm text-gray-600">Current Year</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/employee-dashboard/attendance/leave-application')}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Apply
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700">Annual Leave</span>
                  <span className="text-lg font-bold text-purple-600">18 / 24</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700">Sick Leave</span>
                  <span className="text-lg font-bold text-purple-600">5 / 12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium text-gray-700">Casual Leave</span>
                  <span className="text-lg font-bold text-purple-600">8 / 12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance & Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100 rounded-full -mr-12 -mt-12 opacity-20"></div>
            <CardHeader className="pb-4 relative">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                Current OKRs & Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 relative">
              {(employee?.goals || [
                { title: "Complete React Certification", progress: 75, deadline: "Jan 2025" },
                { title: "Lead Team Project", progress: 60, deadline: "Feb 2025" },
                { title: "Improve Code Quality Metrics", progress: 85, deadline: "Mar 2025" }
              ]).slice(0, 3).map((goal: any, idx: number) => (
                <div key={idx} className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-900">{goal.title}</span>
                    <span className="text-sm font-bold text-teal-600">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-3 mb-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Deadline: {goal.deadline}</span>
                    <Badge className={`text-xs px-2 py-1 ${
                      goal.progress >= 80 ? 'bg-emerald-100 text-emerald-800' :
                      goal.progress >= 60 ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {goal.progress >= 80 ? 'On Track' : goal.progress >= 60 ? 'Good Progress' : 'Needs Attention'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -mr-12 -mt-12 opacity-20"></div>
            <CardHeader className="pb-4 relative">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                Latest Performance Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-5">
                <div className="p-5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900">Q4 2024 Review</span>
                      <Badge className="bg-emerald-100 text-emerald-800 text-xs ml-2">Excellent</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {employee?.feedback || "Outstanding performance in the recent project delivery. Demonstrated excellent leadership skills and technical expertise. Keep up the great work!"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Manager: {employee?.managerName || 'John Smith'}</span>
                    <span>Dec 15, 2024</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    Achievements & Recognitions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(employee?.achievements || ["Employee of the Month", "Project Excellence Award", "Innovation Champion"]).map((achievement: string, idx: number) => (
                      <Badge key={idx} className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 flex items-center gap-1 px-3 py-1">
                        <Award className="w-3 h-3" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects & Work Allocation */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16 opacity-20"></div>
          <CardHeader className="pb-4 relative">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              Current Projects & Work Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(employee?.currentProjects || [
                {
                  name: "E-commerce Platform Redesign",
                  role: "Frontend Lead",
                  status: "In Progress",
                  progress: 65,
                  tools: ["React", "TypeScript", "Figma"],
                  links: [
                    { type: "jira", url: "#", label: "Jira Board" },
                    { type: "github", url: "#", label: "Repository" },
                    { type: "figma", url: "#", label: "Design System" }
                  ]
                },
                {
                  name: "Mobile App Development",
                  role: "Technical Consultant",
                  status: "Planning",
                  progress: 25,
                  tools: ["React Native", "Node.js"],
                  links: [
                    { type: "jira", url: "#", label: "Backlog" },
                    { type: "confluence", url: "#", label: "Documentation" }
                  ]
                }
              ]).map((project: any, idx: number) => (
                <div key={idx} className="p-5 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 text-lg">{project.name}</h4>
                    <Badge className={`px-3 py-1 text-xs font-medium ${
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {project.status}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Role:</span>
                      <span className="text-sm font-semibold text-purple-600">{project.role}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Progress:</span>
                        <span className="text-sm font-bold text-purple-600">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-3" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-purple-200 rounded"></div>
                        Tools & Technologies:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {project.tools.map((tool: string, toolIdx: number) => (
                          <Badge key={toolIdx} className="bg-purple-100 text-purple-800 border-purple-200 text-xs px-2 py-1">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                        <ExternalLink className="w-4 h-4 text-purple-600" />
                        Quick Links:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {project.links.map((link: any, linkIdx: number) => (
                          <Button key={linkIdx} variant="outline" size="sm" className="text-xs h-8 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {link.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning & Development */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-full -mr-12 -mt-12 opacity-20"></div>
            <CardHeader className="pb-4 relative">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                Learning & Development
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 relative">
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-200 rounded flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-green-700" />
                  </div>
                  Assigned Trainings
                </h4>
                <div className="space-y-4">
                  {assignedTrainings.map((training, idx) => (
                    <div key={idx} className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{training.title}</p>
                          <p className="text-xs text-gray-500">Deadline: {training.deadline}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-green-600">{training.progress}%</span>
                        </div>
                      </div>
                      <Progress value={training.progress} className="h-3" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full -mr-12 -mt-12 opacity-20"></div>
            <CardHeader className="pb-4 relative">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                Certifications & Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 relative">
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Completed Certifications
                </h4>
                <div className="space-y-3">
                  {(employee?.certifications || [
                    "AWS Certified Developer",
                    "React Professional Certification",
                    "Scrum Master Certification"
                  ]).map((cert: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-200 rounded flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-orange-700" />
                  </div>
                  Skills to Improve
                </h4>
                <div className="space-y-3">
                  {skillsToImprove.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50">
                      <span className="text-sm font-medium text-gray-800">{skill.skill}</span>
                      <Badge className={`px-3 py-1 text-xs font-medium ${
                        skill.priority === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
                        skill.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      }`}>
                        {skill.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements & Notifications */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Bell className="w-5 h-5 text-orange-600" />
              Announcements & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* HR Announcements */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">HR Announcements</h4>
                <div className="space-y-3">
                  {announcements.map((announcement, idx) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          announcement.type === 'holiday' ? 'bg-green-100' :
                          announcement.type === 'policy' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          {announcement.type === 'holiday' ? <Gift className="w-4 h-4 text-green-600" /> :
                           announcement.type === 'policy' ? <Award className="w-4 h-4 text-blue-600" /> :
                           <Users className="w-4 h-4 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{announcement.title}</h5>
                          <p className="text-xs text-gray-600 mt-1">{announcement.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Birthdays & Alerts */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Celebrations & Alerts</h4>
                <div className="space-y-3">
                  {birthdaysLoading ? (
                    <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Gift className="w-6 h-6 text-pink-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Loading birthdays...</p>
                        </div>
                      </div>
                    </div>
                  ) : birthdays && birthdays.length > 0 ? (
                    birthdays.slice(0, 2).map((birthday: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Gift className="w-6 h-6 text-pink-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{birthday.name}'s Birthday {birthday.daysUntil === 0 ? 'Today' : `in ${birthday.daysUntil} days`}! 🎉</p>
                            <p className="text-xs text-gray-600">Don't forget to wish {birthday.daysUntil === 0 ? 'them' : 'them'}!</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Gift className="w-6 h-6 text-pink-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">No upcoming birthdays</p>
                          <p className="text-xs text-gray-600">Check back later for celebrations!</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Work Anniversary</p>
                        <p className="text-xs text-gray-600">Mike completed 3 years with us!</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pending Actions</p>
                        <p className="text-xs text-gray-600">2 leave requests awaiting approval</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
