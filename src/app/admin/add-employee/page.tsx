'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AddEmployee() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joiningDate: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [documents, setDocuments] = useState({
    idCard: null as File | null,
    offerLetter: null as File | null,
    nda: null as File | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0] || null;
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Create FormData for file uploads
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      if (documents.idCard) submitData.append('idCard', documents.idCard);
      if (documents.offerLetter) submitData.append('offerLetter', documents.offerLetter);
      if (documents.nda) submitData.append('nda', documents.nda);

      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/employees');
        }, 2000);
      } else {
        const error = await response.json();
        if (error.message.includes('email')) {
          setErrors({ email: 'Email already exists' });
        } else {
          alert('Failed to create employee: ' + error.message);
        }
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Error creating employee');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Employee Created Successfully!</h2>
          <p className="text-slate-300 mb-4">An invitation email has been sent to the employee.</p>
          <p className="text-slate-400 text-sm">Redirecting to employees list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-bold">Add New Employee</h1>
          <button
            onClick={() => router.push('/admin/employees')}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-white text-xl font-semibold mb-4 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-800 text-white border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${errors.fullName ? 'border-red-400' : 'border-slate-600'}`}
                  placeholder="Enter full name"
                />
                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-800 text-white border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${errors.email ? 'border-red-400' : 'border-slate-600'}`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-800 text-white border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${errors.phone ? 'border-red-400' : 'border-slate-600'}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Position *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-800 text-white border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${errors.position ? 'border-red-400' : 'border-slate-600'}`}
                  placeholder="Enter job position"
                />
                {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-800 text-white border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${errors.department ? 'border-red-400' : 'border-slate-600'}`}
                >
                  <option value="">Select department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
                {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Joining Date *</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-800 text-white border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${errors.joiningDate ? 'border-red-400' : 'border-slate-600'}`}
                />
                {errors.joiningDate && <p className="text-red-400 text-xs mt-1">{errors.joiningDate}</p>}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-white text-xl font-semibold mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Additional Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-300 text-sm mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Emergency contact name"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-white text-xl font-semibold mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Document Upload
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 text-sm mb-2">ID Card</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'idCard')}
                  className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 file:bg-cyan-600 file:text-white file:border-none file:rounded file:px-2 file:py-1 file:mr-2"
                />
                <p className="text-slate-400 text-xs mt-1">PDF, JPG, PNG up to 5MB</p>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Offer Letter</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'offerLetter')}
                  className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 file:bg-cyan-600 file:text-white file:border-none file:rounded file:px-2 file:py-1 file:mr-2"
                />
                <p className="text-slate-400 text-xs mt-1">PDF only, up to 5MB</p>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">NDA</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'nda')}
                  className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 file:bg-cyan-600 file:text-white file:border-none file:rounded file:px-2 file:py-1 file:mr-2"
                />
                <p className="text-slate-400 text-xs mt-1">PDF only, up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Creating Employee...' : 'Create Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
