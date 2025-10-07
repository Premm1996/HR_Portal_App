 'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './animations.css';
import '../../styles/modern-buttons.css';
import '../../styles/modern-forms.css';

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
    <div className="min-h-screen flex flex-row">
      {/* Left side with blue background and welcome message */}
      <div className="w-1/2 bg-gradient-to-br from-blue-700 via-blue-900 to-blue-800 p-16 flex flex-col justify-center text-white shadow-lg rounded-l-3xl">
        <div className="mb-10">
          <div className="flex items-center mb-6">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-16 h-16 rounded-full mr-6 object-contain shadow-xl"
            />
            <span className="text-2xl font-extrabold tracking-wide drop-shadow-lg">
              Welcome to Truerize HRMS Hireconnect portal
            </span>
          </div>
          <h1 className="text-6xl font-extrabold mb-6 leading-tight drop-shadow-xl animate-fade-in-up">
            Hello, <br /> welcome!
          </h1>
          <p className="text-lg max-w-lg animate-fade-in-up text-white/90 leading-relaxed tracking-wide">
            Truerize Hireconnect HRMS Portal is your comprehensive solution for streamlined human resource management, empowering your workforce with modern tools and seamless experience.
          </p>
        </div>
      </div>

      {/* Right side with signin form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="name@mail.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="***************"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded shadow hover:from-blue-700 hover:to-blue-600 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Removed the "Not a member yet? Sign up" section as requested */}
        </form>
      </div>
    </div>
  );
}
