"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-blue-500 border-t-transparent',
    secondary: 'border-gray-500 border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-4
          rounded-full
          animate-spin
        `}
      />
    </div>
  );
}

// Full page loading component
interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <LoadingSpinner size="lg" color="white" />
      <p className="mt-4 text-white text-lg font-medium">{message}</p>
    </div>
  );
}

// Inline loading component
interface InlineLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function InlineLoading({ message, size = 'md' }: InlineLoadingProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-3">
        <LoadingSpinner size={size} color="primary" />
        {message && (
          <p className="text-gray-600 text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

// Skeleton loading component
interface SkeletonProps {
  className?: string;
  rows?: number;
}

export function Skeleton({ className = '', rows = 1 }: SkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-300 rounded mb-2 last:mb-0"
        />
      ))}
    </div>
  );
}

// Card skeleton for loading states
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        <div className="h-3 bg-gray-300 rounded w-4/6"></div>
      </div>
    </div>
  );
}
