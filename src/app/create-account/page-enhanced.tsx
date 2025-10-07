'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TermsModal from '@/components/TermsModal';
import ProfilePhotoUpload from '@/components/ui/profile-photo-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useNotifications } from '@/components/ui/notification';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface FormData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;

  // Personal Information
  dob: string;
  gender: string;
  nationality: string;

  // Professional Information
  position: string;
  experience: string;
  location: string;
  expectedSalary: string;

  // Education Information
  qualification: string;
  specialization: string;
  college: string;
  graduationYear: string;
  cgpa: string;

  // Banking Information
  accountNumber: string;
  ifscCode: string;
  bankName: string;

  // Additional
  personalEmail: string;
  mobileNumber: string;
  workLocation: string;
  jobTitle: string;
  dateOfJoining: string;
}

export default function CreateAccountPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    gender: '',
    nationality: '',
    position: '',
    experience: '',
    location: '',
    expectedSalary: '',
    qualification: '',
    specialization: '',
    college: '',
    graduationYear: '',
    cgpa: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    personalEmail: '',
    mobileNumber: '',
    workLocation: '',
    jobTitle: '',
    dateOfJoining: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const totalSteps = 4;

  // Load saved progress on mount
  useEffect(() => {
    loadSavedProgress();
  }, []);

  const loadSavedProgress = async () => {
    try {
      const response = await fetch('/api/progress/get');
      if (response.ok) {
        const data = await response.json();
        if (data.formData && Object.keys(data.formData).length > 0) {
          setFormData(prev => ({ ...prev, ...data.formData }));
          setCurrentStep(data.currentStep || 1);
        }
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
  };

  const saveProgress = async (field: string, value: string) => {
    try {
      const updatedFormData = { ...formData, [field]: value };
      await fetch('/api/progress/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: updatedFormData,
          currentStep,
          completedSteps: []
        })
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    saveProgress(name, value);

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return '#ef4444';
    if (passwordStrength <= 50) return '#f59e0b';
    if (passwordStrength <= 75) return '#10b981';
    return '#06b6d4';
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.password && formData.confirmPassword && formData.phone);
      case 2:
        return !!(formData.dob && formData.gender && formData.nationality);
      case 3:
        return !!(formData.position && formData.experience && formData.location);
      case 4:
        return !!(formData.qualification && formData.college);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Basic auth info
          email: formData.email,
          password: formData.password,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          role: 'employee',
          mobile: formData.phone,

          // Comprehensive profile data
          profileData: {
            // Personal Information
            dob: formData.dob,
            gender: formData.gender,
            nationality: formData.nationality,

            // Professional Information
            position: formData.position,
            experience: formData.experience,
            location: formData.location,
            expectedSalary: formData.expectedSalary,
            jobTitle: formData.jobTitle,
            workLocation: formData.workLocation,

            // Education Information
            qualification: formData.qualification,
            specialization: formData.specialization,
            college: formData.college,
            graduationYear: formData.graduationYear,
            cgpa: formData.cgpa,

            // Banking Information
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
            bankName: formData.bankName,

            // Additional
            personalEmail: formData.personalEmail,
            mobileNumber: formData.mobileNumber,
            dateOfJoining: formData.dateOfJoining
          },

          // Photo upload
          photo: photoFile,

          termsAgreed: acceptTerms
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Clear saved progress on successful registration
        await fetch('/api/progress/clear', { method: 'DELETE' });
        addNotification('success', 'Account created successfully! Please log in.');
        router.push('/signin');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
            i + 1 <= currentStep
              ? 'bg-purple-600 text-white'
              : 'bg-gray-300 text-gray-600'
          }`}>
            {i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-16 h-1 mx-2 ${
              i + 1 < currentStep ? 'bg-purple-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>

            {/* Profile Photo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Photo
              </label>
              <ProfilePhotoUpload
                currentPhoto={photoPreview}
                onPhotoUpdate={(file) => handlePhotoUpload(file)}
                employeeId="new"
                size="md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="First Name"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Last Name"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Email Address"
              required
            />

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Phone Number"
              required
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Password"
              required
            />
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${passwordStrength}%`,
                  backgroundColor: getPasswordStrengthColor()
                }}
              />
            </div>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm Password"
              required
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>

            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nationality"
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Professional Information</h3>

            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Position/Job Title"
              required
            />

            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Years of Experience"
              required
            />

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Current Location"
              required
            />

            <input
              type="text"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Expected Salary"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Education & Banking</h3>

            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Highest Qualification"
              required
            />

            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Specialization"
            />

            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="College/University"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Graduation Year"
              />
              <input
                type="text"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="CGPA"
              />
            </div>

            <div className="border-t border-white/20 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Banking Information (Optional)</h4>

              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Account Number"
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="IFSC Code"
                />
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Bank Name"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-300">Complete your profile information</p>
            </div>

            {renderStepIndicator()}

            {error && (
              <div className="mb-4 text-red-400 text-sm text-center bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Next
                  </Button>
                ) : (
                  <>
                    <label className="flex items-center space-x-3 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="w-4 h-4 text-purple-500 bg-transparent border-2 border-purple-500 rounded focus:ring-purple-500"
                      />
                      <span>I agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-purple-400 underline">Terms and Conditions</button></span>
                    </label>

                    <Button
                      type="submit"
                      disabled={loading || !acceptTerms}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {loading ? <LoadingSpinner size="sm" color="white" /> : 'Create Account'}
                    </Button>
                  </>
                )}
              </div>
            </form>

            <p className="text-center text-gray-300 mt-6">
              Already have an account?{' '}
              <Link href="/signin" className="text-purple-400 hover:text-purple-300">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showTerms && <TermsModal isOpen={showTerms} onAccept={() => setShowTerms(false)} onClose={() => setShowTerms(false)} />}
    </div>
  );
}
