'use client';

import { useEffect, useState } from 'react';

export default function TrueriseSlideBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const animate = () => {
      // Slide in from right
      setIsVisible(true);
      
      // Stay for 3 seconds
      setTimeout(() => {
        // Slide back to right
        setIsVisible(false);
      }, 3000);
      
      // Repeat after 6 seconds total
      setTimeout(() => {
        animate();
      }, 6000);
    };

    // Start animation
    animate();
  }, []);

  return (
    <div className={`fixed top-1/3 right-0 z-50 transition-all duration-1000 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-6 rounded-l-3xl shadow-2xl
        border-l-4 border-blue-400 relative overflow-hidden">
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-300 rounded-full translate-y-10 -translate-x-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Truerise HireConnect
          </h2>
          <p className="text-sm text-blue-100">Your Gateway to Professional Success</p>
          
          {/* Animated underline */}
          <div className="mt-3 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full animate-pulse"></div>
        </div>
        
        {/* Glowing edge effect */}
        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 animate-pulse"></div>
      </div>
    </div>
  );
}
