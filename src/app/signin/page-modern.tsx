'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './animations.css';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'candidate' // Keep for backward compatibility, but not used in login
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // On mount, check if user is already logged in and redirect accordingly
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    if (token && isAdmin === 'true') {
      router.push('/admin');
    } else if (token && userRole === 'employee' && userId) {
      router.push(`/employee-dashboard/${userId}/home`);
    } else if (token && userRole === 'candidate' && userId) {
      router.push(`/employee-dashboard/${userId}/home`);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    (async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          // Store authentication data
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.user.id);
          localStorage.setItem('candidateId', data.user.candidateId || data.user.id); // Store candidateId for onboarding form
          localStorage.setItem('userRole', data.user.role);
          localStorage.setItem('isAdmin', data.user.is_admin ? 'true' : 'false');

          // Store onboarding status
          localStorage.setItem('onboardingStatus', data.user.onboardingStatus || 'NOT_STARTED');
          localStorage.setItem('onboardingStep', data.user.onboardingStep || '0');

          // Use redirectUrl from backend if provided, otherwise fall back to role-based logic
          if (data.user.redirectUrl) {
            router.push(data.user.redirectUrl);
          } else {
            // Role-based redirection - handle employee, candidate and admin roles
            if (data.user.is_admin || data.user.role === 'admin') {
              // Admin users go directly to admin dashboard
              router.push('/admin');
            } else if (data.user.role === 'employee') {
              // Employee users - redirect based on onboarding status
              const onboardingStatus = data.user.onboardingStatus || 'NOT_STARTED';
              const onboardingStep = parseInt(data.user.onboardingStep) || 0;

              if (onboardingStatus === 'COMPLETE') {
                // Onboarding completed - go to employee dashboard home
                router.push(`/employee-dashboard/${data.user.id}/home`);
              } else if (onboardingStatus === 'IN_PROGRESS' || onboardingStatus === 'NOT_STARTED') {
                // Redirect to onboarding form or step based on onboardingStep
                if (onboardingStep === 0) {
                  router.push('/employee-registration-process');
                } else if (onboardingStep === 1) {
                  router.push('/employee-registration-process?step=1');
                } else if (onboardingStep === 2) {
                  router.push('/offer-letter');
                } else if (onboardingStep === 3) {
                  router.push('/generate-id-card');
                } else {
                  router.push('/employee-registration-process');
                }
              } else {
                // Default fallback
                router.push('/employee-registration-process');
              }
            } else if (data.user.role === 'candidate') {
              // Candidate users - redirect based on onboarding status
              const onboardingStatus = data.user.onboardingStatus || 'NOT_STARTED';
              const onboardingStep = parseInt(data.user.onboardingStep) || 0;

              if (onboardingStatus === 'COMPLETE') {
                // Onboarding completed - go to employee dashboard home
                router.push(`/employee-dashboard/${data.user.id}/home`);
              } else if (onboardingStatus === 'IN_PROGRESS') {
                // Resume from last incomplete step
                const nextStep = Math.max(onboardingStep + 1, 1);
                if (nextStep === 1) {
                  router.push('/employee-registration-process');
                } else if (nextStep === 2) {
                  router.push('/offer-letter');
                } else if (nextStep === 3) {
                  router.push('/generate-id-card');
                } else {
                  // If step is beyond 3, something went wrong, go to employee dashboard home
                  router.push(`/employee-dashboard/home`);
                }
              } else {
                // NOT_STARTED - start onboarding form
                router.push('/employee-registration-process');
              }
            } else {
              // Default fallback for unsupported roles
              router.push('/onboarding-form');
            }
          }
        } else {
          setError(data.message || 'Invalid credentials');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-cyan-900 px-4 py-8">
      <div className="bg-white/95 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-8 animate-fade-in scale-up">
          <img
            src="/logo.jpg"
            alt="TrueRize IQ Strategic Solutions Logo"
            className="w-36 h-36 object-contain mb-6 rounded-full shadow-lg transition-transform duration-500 hover:scale-110 hover:shadow-2xl"
          />
          <h2 className="text-5xl font-black text-gradient bg-gradient-to-r from-slate-700 via-blue-800 to-cyan-700 text-center drop-shadow-xl animate-text-flicker tracking-wide">
            Welcome to TrueRize HRMS Portal
          </h2>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-wide">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-300 bg-slate-50 hover:bg-white shadow-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-wide">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-300 bg-slate-50 hover:bg-white shadow-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white font-bold rounded-lg hover:from-cyan-700 hover:via-blue-700 hover:to-cyan-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-600">
            <Link href="/forgot-password" className="text-cyan-600 hover:text-cyan-800 font-semibold transition-colors duration-300 hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
