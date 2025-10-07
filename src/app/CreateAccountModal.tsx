'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from './ForgotPasswordModal';
import TermsModal from '../components/TermsModal';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  agree: boolean;
}

interface CreateAccountModalProps {
  onClose: () => void;
}

export default function CreateAccountModal({ onClose }: CreateAccountModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    agree: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData & { general: string }>>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    }

    if (!formData.agree) {
      setShowTermsModal(true);
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAcceptTerms = () => {
    setFormData(prev => ({ ...prev, agree: true }));
    setShowTermsModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setFormSubmitted(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
          role: 'candidate',
          termsAgreed: formData.agree
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Account created successfully, redirect to signin
        setTimeout(() => {
          setFormSubmitted(false);
          onClose();
          router.push('/signin');
        }, 1500);
      } else {
        // Handle error
        setFormSubmitted(false);
        setErrors({ general: data.message || 'Registration failed' });
      }
    } catch (error) {
      setFormSubmitted(false);
      setErrors({ general: 'An error occurred during registration' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
            />
            {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          
          <div>
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
            />
            {errors.mobile && <p className="text-red-400 text-sm mt-1">{errors.mobile}</p>}
          </div>


          
          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="accent-cyan-500"
              />
              <span 
                className="cursor-pointer hover:text-cyan-400 transition-colors"
                onClick={() => setShowTermsModal(true)}
              >
                Agree to Terms
              </span>
            </label>
            
            <button
              type="button"
              className="text-cyan-400 hover:underline text-sm"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all mt-4"
            disabled={formSubmitted}
          >
            {formSubmitted ? "Creating..." : "Create Account"}
          </button>
          
          {formSubmitted && (
            <div className="text-center text-cyan-400 mt-2 animate-pulse">
              Account created!
            </div>
          )}
        </form>

        {showForgotPassword && (
          <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
        )}
        
        <TermsModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          onAccept={handleAcceptTerms}
        />
      </div>
    </div>
  );
}