'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Unified3DCubes from '../components/Unified3DCubes';

export default function OptimizedHomePage() {
  const router = useRouter();
  const [hireConnectPosition, setHireConnectPosition] = useState<'right' | 'center' | 'left'>('right');
  const [isAnimating, setIsAnimating] = useState(false);

  // Memoized stats to prevent re-renders
  const stats = useMemo(() => [
    { value: '10K+', label: 'Successful Hires', color: 'text-blue-400' },
    { value: '500+', label: 'Top Companies', color: 'text-purple-400' },
    { value: '95%', label: 'Satisfaction', color: 'text-cyan-400' }
  ], []);

  // Memoized navigation items
  const navItems = useMemo(() => ['Privacy', 'Terms', 'Contact', 'Careers'], []);

  useEffect(() => {
    const animateHireConnect = () => {
      setHireConnectPosition('right');
      setIsAnimating(true);
      
      setTimeout(() => {
        setHireConnectPosition('center');
        
        setTimeout(() => {
          setHireConnectPosition('left');
          
          setTimeout(() => {
            setHireConnectPosition('right');
            setIsAnimating(false);
          }, 1000);
        }, 3000);
      }, 1000);
    };

    const timeoutId = setTimeout(animateHireConnect, 1000);
    const interval = setInterval(animateHireConnect, 8000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated Background Cubes */}
      <Unified3DCubes />

      {/* TOP NAVBAR */}
      <header className="w-full absolute top-0 left-0 z-50 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 blur-sm opacity-60"></div>
              <img 
                src="/logo.jpg" 
                alt="TrueRize Logo" 
                className="relative w-12 h-12 rounded-xl object-cover border-2 border-gray-200/10 shadow-lg"
                loading="eager"
                width={48}
                height={48}
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white font-sans">HireConnect</h1>
              <span className="text-xs text-gray-400 tracking-wider font-mono">TRUERIZE PORTAL</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/signin')}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 rounded-lg transition-all duration-200 border border-gray-700 hover:border-gray-600 font-medium text-sm font-sans"
              aria-label="Login to your account"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/create-account')}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-lg transition-all duration-200 font-medium text-sm font-sans shadow-lg hover:shadow-blue-500/20"
              aria-label="Create new account"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col justify-center items-center min-h-[90vh]">
        <div className="max-w-4xl w-full text-center">
          <div className="mb-12">
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-100 font-sans tracking-tight">
                  <span className="block text-gray-400 mb-2 text-lg md:text-xl font-normal">
                    Welcome to
                  </span>
                  <div className="relative">
                    <span 
                      className={`block text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 transition-all duration-1000 ease-in-out font-sans ${
                        hireConnectPosition === 'right' 
                          ? 'translate-x-[100vw]' 
                          : hireConnectPosition === 'center'
                          ? 'translate-x-0'
                          : '-translate-x-[100vw]'
                      }`}
                    >
                      Truerize HireConnect
                    </span>
                  </div>
                  <span className="block text-gray-300 text-xl md:text-3xl mt-4 font-light tracking-wider font-mono">
                    PORTAL
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="mb-16 max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light tracking-wide font-sans">
              <span className="block mb-3 text-blue-300 font-medium">AI-POWERED TALENT ACQUISITION PLATFORM</span>
              Experience next-generation recruitment with intelligent matching, streamlined onboarding, and continuous professional development.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 border-t border-gray-800 pt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2 font-sans`}>{stat.value}</div>
                <div className="text-gray-400 text-xs uppercase tracking-widest font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 w-full py-6 bg-gradient-to-t from-gray-950 to-transparent border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0 font-sans">
            © {new Date().getFullYear()} TrueRize HireConnect. All rights reserved.
          </div>
          <div className="flex gap-6">
            {navItems.map((item) => (
              <a key={item} href="#" className="text-gray-500 hover:text-gray-300 transition-colors text-sm font-sans">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
