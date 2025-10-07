'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function TrueRizeHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const fullText = "Hireconnect TrueRise Portal";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Typewriter effect for the portal name
    if (textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[textIndex]);
        setTextIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [textIndex]);

  return (
    <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-display font-black">
            <span className="inline-block text-metallic mb-4 text-4xl md:text-5xl tracking-wider">
              Welcome to
            </span>
            <br />
            <span className="inline-block">
              <span className="text-gradient-gold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent font-black tracking-tight text-3d animate-pulse-glow">
                {displayText}
              </span>
              <span className="animate-pulse text-yellow-400">|</span>
            </span>
          </h1>
        </div>

        {/* TrueRize Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-4 animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 shadow-2xl">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-400">Powered by TrueRize</p>
          </div>
        </div>

        <p className="text-xl font-body text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Experience the next generation of talent acquisition with AI-powered matching, 
          seamless onboarding, and professional growth opportunities.
        </p>
      </div>
    </div>
  );
}
