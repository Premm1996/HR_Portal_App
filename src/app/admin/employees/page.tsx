'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  position?: string;
  role: string;
  status: string;
  onboarding_step: number;
  createdAt: string;
  department?: string;
  offerLetterUploaded?: boolean;
  idCardGenerated?: boolean;
  photo?: string | null;
  approved: boolean;
}



export default function AdminEmployees() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');


  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    if (!token || isAdmin !== 'true') {
      router.push('/signin');
      return;
    }
    fetchEmployees();
  }, [router]);

  useEffect(() => {
    let filtered = employees;
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((emp) => emp.status === statusFilter);
    }
    setFilteredEmployees(filtered);
  }, [employees, searchTerm, statusFilter]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees);
      } else {
        console.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchEmployees();
      } else {
        alert('Failed to delete employee');
      }
    } catch (error) {
      alert('Error deleting employee');
    }
  };

  const handleResetProgress = async (id: number, employeeName: string) => {
    if (!confirm(`Are you sure you want to reset progress for ${employeeName}? This will delete all their documents and reset their onboarding status.`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/employees/${id}/reset-progress`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert('Employee progress reset successfully');
        fetchEmployees();
      } else {
        alert('Failed to reset employee progress');
      }
    } catch (error) {
      alert('Error resetting employee progress');
    }
  };

  const handleApprove = async (id: number, employeeName: string) => {
    if (!confirm(`Are you sure you want to approve ${employeeName}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/employees/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert('Employee approved successfully');
        fetchEmployees();
      } else {
        alert('Failed to approve employee');
      }
    } catch (error) {
      alert('Error approving employee');
    }
  };

  const handleDecline = async (id: number, employeeName: string) => {
    if (!confirm(`Are you sure you want to decline ${employeeName}? This will remove the employee from the system.`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/employees/${id}/decline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert('Employee declined and removed successfully');
        fetchEmployees();
      } else {
        alert('Failed to decline employee');
      }
    } catch (error) {
      alert('Error declining employee');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETE':
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'NOT_STARTED':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      'COMPLETE': { color: 'bg-green-100 text-green-800', text: 'Completed' },
      'COMPLETED': { color: 'bg-green-100 text-green-800', text: 'Completed' },
      'IN_PROGRESS': { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
      'NOT_STARTED': { color: 'bg-gray-100 text-gray-800', text: 'Not Started' },
      'pending': { color: 'bg-gray-100 text-gray-800', text: 'Pending' }
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
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
        <h1 className="text-white text-2xl font-bold">Manage Employees</h1>
        <button
          onClick={() => router.push('/admin/employees/add')}
          className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 text-white border border-slate-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="all">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="NOT_STARTED">Not Started</option>
        </select>


      </div>

      <div className="overflow-x-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
        <table className="w-full text-left text-white">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="py-2 px-4">Employee</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Approval Actions</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-slate-400">
                  No employees found.
                </td>
              </tr>
            )}
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                <td className="py-2 px-4">
                  <div>
                    <div className="font-medium">{emp.fullName || 'N/A'}</div>
                    {emp.position && <div className="text-sm text-slate-400">{emp.position}</div>}
                  </div>
                </td>
                <td className="py-2 px-4">{emp.email}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(emp.status)}
                    {getStatusBadge(emp.status)}
                  </div>
                </td>
                <td className="py-2 px-4">
                  {!emp.approved ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(emp.id, emp.fullName)}
                        className="p-2 bg-green-700 rounded hover:bg-green-600"
                        title="Approve Employee"
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleDecline(emp.id, emp.fullName)}
                        className="p-2 bg-red-700 rounded hover:bg-red-600"
                        title="Decline Employee"
                      >
                        <XCircle className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-green-400 text-sm">Approved</span>
                  )}
                </td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/admin-dashboard/employees/${emp.id}/dashboard`)}
                      className="p-2 bg-slate-700 rounded hover:bg-slate-600"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/employees/edit/${emp.id}`)}
                      className="p-2 bg-slate-700 rounded hover:bg-slate-600"
                      title="Edit Profile"
                    >
                      <Edit className="w-4 h-4 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => handleResetProgress(emp.id, emp.fullName)}
                      className="p-2 bg-orange-700 rounded hover:bg-orange-600"
                      title="Reset Progress"
                    >
                      <RefreshCw className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="p-2 bg-red-700 rounded hover:bg-red-600"
                      title="Delete Employee"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
