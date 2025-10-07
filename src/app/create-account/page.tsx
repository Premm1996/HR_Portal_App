'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TermsModal from '@/components/TermsModal';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  phone: string;
}

export default function CreateAccountPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<FormData, 'role'>>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isResuming, setIsResuming] = useState(false);

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
          setIsResuming(true);
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
          currentStep: 1,
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
          email: formData.email,
          password: formData.password,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          role: 'employee',
          companyName: formData.companyName,
          mobile: formData.phone || '0000000000',
          termsAgreed: acceptTerms
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Clear saved progress on successful registration
        await fetch('/api/progress/clear', { method: 'DELETE' });
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-300">Continue where you left off</p>
              
              {isResuming && (
                <div className="mt-2 text-sm text-purple-300">
                  Resuming from saved progress
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 text-red-400 text-sm text-center bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div>
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

              <label className="flex items-center space-x-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 text-purple-500 bg-transparent border-2 border-purple-500 rounded focus:ring-purple-500"
                />
                <span>I agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-purple-400 underline">Terms and Conditions</button></span>
              </label>

              <button
                type="submit"
                disabled={loading || !acceptTerms}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
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
