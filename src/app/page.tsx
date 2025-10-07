'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateAccountModal from './CreateAccountModal';
import LoginModal from './LoginModal';
import AuthService from '../lib/auth';

export default function Home() {
  const router = useRouter();
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'slideIn' | 'hold' | 'slideOut'>('initial');
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [hoverSignIn, setHoverSignIn] = useState(false);
  const [hoverCreateAccount, setHoverCreateAccount] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setWelcomeVisible(true);

    const animateHireConnect = () => {
      setAnimationPhase('slideIn');
      setTimeout(() => setAnimationPhase('hold'), 1000);
      setTimeout(() => setAnimationPhase('slideOut'), 4000);
      setTimeout(() => setAnimationPhase('initial'), 5000);
    };

    const initialDelay = setTimeout(animateHireConnect, 1000);
    const interval = setInterval(animateHireConnect, 6000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  // Check onboarding status on page load and redirect if needed
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!AuthService.isAuthenticated()) {
        // User is not authenticated, stay on homepage
        return;
      }

      const onboardingStatus = localStorage.getItem('onboardingStatus');
      const onboardingStep = localStorage.getItem('onboardingStep');

      if (onboardingStatus === 'COMPLETE') {
        // Check if user can access dashboard before redirecting
        try {
          const canAccess = await AuthService.canAccessDashboard();
          if (canAccess) {
            const employeeId = AuthService.getCurrentEmployeeId();
            if (employeeId) {
              router.push(`/employee-dashboard/${employeeId}`);
            } else {
              router.push('/signin');
            }
          } else {
            // Cannot access dashboard, stay on homepage or redirect to appropriate page
            // For now, stay on homepage
          }
        } catch (error) {
          console.error('Error checking dashboard access:', error);
          // On error, stay on homepage
        }
        return;
      } else if (onboardingStatus === 'IN_PROGRESS') {
        // Redirect to current onboarding step
        const step = parseInt(onboardingStep || '0');
        if (step >= 1 && step <= 4) {
          router.push(`/onboarding/step-${step}`);
        } else {
          router.push('/onboarding/step-1');
        }
        return;
      }
    };

    // Small delay to ensure localStorage is available
    const timer = setTimeout(checkOnboardingStatus, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Professional Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-xl border-b border-slate-700/60 shadow-2xl" style={{height: '0.5in'}}>
        <div className="h-full flex items-center justify-between px-8">
          {/* Logo on the left */}
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xl ring-2 ring-cyan-400/30 group-hover:ring-cyan-400/60 transition-all duration-300">
                <img
                  src="/logo.jpg"
                  alt="Truerize IQ Logo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl tracking-tight">HireConnect</span>
              <span className="text-cyan-400/80 text-xs font-medium tracking-wider">TRUERIZE IQ</span>
            </div>
          </div>

          {/* Running company name from right to left */}
          <div className="flex-1 overflow-hidden ml-12">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-cyan-300 font-semibold text-lg tracking-wide px-4">
                Truerize IQ Strategic Solutions Pvt Ltd
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Premium 3D floating elements */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {/* Floating cubes */}
        {[...Array(12)].map((_, i) => {
          const size = Math.random() * 80 + 40;
          const delay = Math.random() * 10;
          const duration = Math.random() * 30 + 20;
          const rotateX = Math.random() * 360;
          const rotateY = Math.random() * 360;
          const color = `hsla(${Math.random() * 60 + 200}, 80%, 60%, ${Math.random() * 0.1 + 0.05})`;
          
          return (
            <div 
              key={`cube-${i}`}
              className="absolute"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float3d ${duration}s ease-in-out infinite both`,
                animationDelay: `${delay}s`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-400/20"
                style={{
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${Math.random() * 360}deg)`,
                  boxShadow: `0 0 40px ${color}`,
                }}
              >
                {[...Array(6)].map((_, side) => (
                  <div 
                    key={`side-${side}`}
                    className="absolute inset-0 border border-cyan-400/20 bg-cyan-500/5"
                    style={{
                      transform: getCubeSideTransform(side, size),
                      backfaceVisibility: 'visible',
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Floating pyramids */}
        {[...Array(8)].map((_, i) => {
          const size = Math.random() * 100 + 50;
          const delay = Math.random() * 10;
          const duration = Math.random() * 25 + 20;
          const color = `hsla(${Math.random() * 60 + 200}, 80%, 60%, ${Math.random() * 0.1 + 0.05})`;
          
          return (
            <div 
              key={`pyramid-${i}`}
              className="absolute"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float3d ${duration}s ease-in-out infinite both`,
                animationDelay: `${delay}s`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  transform: `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)`,
                }}
              >
                <div 
                  className="absolute w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-cyan-400/20"
                  style={{
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    transform: 'translateZ(30px)',
                    boxShadow: `0 0 40px ${color}`,
                  }}
                />
                <div 
                  className="absolute w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-cyan-400/20"
                  style={{
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    transform: 'rotateY(90deg) translateZ(30px)',
                  }}
                />
                <div 
                  className="absolute w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-cyan-400/20"
                  style={{
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    transform: 'rotateY(180deg) translateZ(30px)',
                  }}
                />
                <div 
                  className="absolute w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-cyan-400/20"
                  style={{
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    transform: 'rotateY(270deg) translateZ(30px)',
                  }}
                />
                <div 
                  className="absolute w-full h-full bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border border-cyan-400/20"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                    transform: 'rotateX(90deg) translateY(-50%) translateZ(30px)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Section */}
      <section className="relative z-10">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span className={`inline-block transition-all duration-1000 ease-out ${welcomeVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
                Welcome to{' '}
              </span>
              <span className={`inline-block transition-all duration-1000 ease-in-out ${
                animationPhase === 'slideIn' || animationPhase === 'hold'
                  ? 'translate-x-0 opacity-100'
                  : animationPhase === 'slideOut'
                  ? 'translate-x-full opacity-0'
                  : 'translate-x-full opacity-0'
              }`}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-gradient-x">
                  Truerize HireConnect portal
                </span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-opacity duration-1000 delay-300">
              Streamline your hiring process with our comprehensive platform for interview management, 
              document submission, and seamless onboarding experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="#"
                className="relative inline-flex items-center justify-center px-12 py-5 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden group hover:-translate-y-1"
                onMouseEnter={() => setHoverSignIn(true)}
                onMouseLeave={() => setHoverSignIn(false)}
              onClick={e => {
                  e.preventDefault();
                  setShowLoginModal(true);
                }}
              >
                <span className="relative z-10 flex items-center">
                  Login
                  <svg className="ml-2 w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <span className={`absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-0 transition-opacity duration-500 ${hoverSignIn ? 'opacity-100' : ''}`}></span>
                <span className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              {showLoginModal && (
                <LoginModal
                  onLoginSuccess={async () => {
                    setShowLoginModal(false);
                    // Check if user can access dashboard after login
                    try {
                      const canAccess = await AuthService.canAccessDashboard();
                      if (canAccess) {
                        const employeeId = AuthService.getCurrentEmployeeId();
                      if (employeeId) {
                        router.push(`/employee-dashboard/${employeeId}`);
                      } else {
                        router.push('/signin');
                      }
                    } else {
                      // Stay on homepage if cannot access dashboard
                      console.log('Login successful but cannot access dashboard');
                    }
                  } catch (error) {
                    console.error('Error checking dashboard access after login:', error);
                    router.push('/signin');
                  }
                }}
                onBack={() => setShowLoginModal(false)}
                onShowSignup={() => {
                  setShowLoginModal(false);
                  setShowCreateAccountModal(true);
                }}
              />
            )}
              
              <a
                href="#"
                className="relative inline-flex items-center justify-center px-12 py-5 text-lg font-semibold text-white bg-slate-800/60 backdrop-blur-sm border-2 border-slate-600/30 rounded-xl transition-all duration-500 hover:shadow-xl overflow-hidden group hover:-translate-y-1 hover:border-slate-500/50"
                onMouseEnter={() => setHoverCreateAccount(true)}
                onMouseLeave={() => setHoverCreateAccount(false)}
                onClick={e => {
                  e.preventDefault();
                  setShowCreateAccountModal(true);
                }}
              >
                <span className="relative z-10 flex items-center">
                  Create Account
                  <svg className="ml-2 w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <span className={`absolute inset-0 bg-slate-700/50 opacity-0 transition-opacity duration-500 ${hoverCreateAccount ? 'opacity-100' : ''}`}></span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-500/30 transition-all duration-500 group-hover:h-full group-hover:bg-slate-600/20"></span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-800/60 backdrop-blur-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Professional Features
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to manage your hiring process efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Interview Results",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                desc: "Access comprehensive interview feedback and results in real-time with detailed analytics."
              },
              {
                title: "Document Management",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                desc: "Securely upload, manage, and verify all required documents through our streamlined process."
              },
              {
                title: "ID Card Generation",
                icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0H9m15 0h2m-2 4h2M9 18H5a2 2 0 01-2-2V8a2 2 0 012-2h2",
                desc: "Receive your personalized digital ID card instantly upon successful onboarding."
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-slate-700/40 backdrop-blur-md rounded-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-slate-600/20 hover:border-cyan-400/30 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-inner group-hover:shadow-md transition-shadow duration-300">
                  <svg className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 text-center group-hover:text-cyan-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed text-center">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-cyan-400/20"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 25 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 15}s`,
              opacity: Math.random() * 0.5 + 0.1,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>



      {/* Create Account Modal */}
      {showCreateAccountModal && (
        <CreateAccountModal onClose={() => setShowCreateAccountModal(false)} />
      )}

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg) translateX(0) scale(1); }
          50% { transform: translateY(-40px) rotate(5deg) translateX(0) scale(1.05); }
          100% { transform: translateY(0) rotate(0deg) translateX(0) scale(1); }
        }

        @keyframes float3d {
          0% { transform: translateY(0) rotateX(0) rotateY(0) rotateZ(0); }
          25% { transform: translateY(-30px) rotateX(10deg) rotateY(10deg) rotateZ(5deg); }
          50% { transform: translateY(-60px) rotateX(20deg) rotateY(20deg) rotateZ(10deg); }
          75% { transform: translateY(-30px) rotateX(10deg) rotateY(10deg) rotateZ(5deg); }
          100% { transform: translateY(0) rotateX(0) rotateY(0) rotateZ(0); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }

        .animate-gradient-x {
          background-size: 300% 300%;
          animation: gradient-x 6s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease;
        }

        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

function getCubeSideTransform(side: number, size: number) {
  const halfSize = size / 2;
  switch(side) {
    case 0: return `rotateY(0deg) translateZ(${halfSize}px)`;
    case 1: return `rotateY(90deg) translateZ(${halfSize}px)`;
    case 2: return `rotateY(180deg) translateZ(${halfSize}px)`;
    case 3: return `rotateY(-90deg) translateZ(${halfSize}px)`;
    case 4: return `rotateX(90deg) translateZ(${halfSize}px)`;
    case 5: return `rotateX(-90deg) translateZ(${halfSize}px)`;
    default: return '';
  }
}
