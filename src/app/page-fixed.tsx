'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [hireConnectPosition, setHireConnectPosition] = useState<'right' | 'center' | 'left'>('right');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animation cycle for Truerise HireConnect text
    const animateHireConnect = () => {
      // Start from right
      setHireConnectPosition('right');
      setIsAnimating(true);
      
      setTimeout(() => {
        // Move to center and pause for 3 seconds
        setHireConnectPosition('center');
        
        setTimeout(() => {
          // Move to left
          setHireConnectPosition('left');
          
          setTimeout(() => {
            // Reset to right for next cycle
            setHireConnectPosition('right');
            setIsAnimating(false);
          }, 1000);
        }, 3000); // 3 second pause in center
      }, 1000);
    };

    // Initial animation
    setTimeout(animateHireConnect, 1000);
    
    // Repeat every 8 seconds (1s right->center + 3s pause + 1s center->left + 1s reset + 2s buffer)
    const interval = setInterval(animateHireConnect, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* TOP NAVBAR */}
      <header className="w-full absolute top-0 left-0 z-50 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left Side: Logo + Name */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 blur-sm opacity-60"></div>
              <img 
                src="/logo.jpg" 
                alt="TrueRize Logo" 
                className="relative w-12 h-12 rounded-xl object-cover border-2 border-gray-200/10 shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white font-sans">HireConnect</h1>
              <span className="text-xs text-gray-400 tracking-wider font-mono">TRUERIZE PORTAL</span>
            </div>
          </div>

          {/* Right Side: Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/signin')}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 rounded-lg transition-all duration-200 border border-gray-700 hover:border-gray-600 font-medium text-sm font-sans"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/create-account')}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-lg transition-all duration-200 font-medium text-sm font-sans shadow-lg hover:shadow-blue-500/20"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced 3D Floating Cubes with realistic geometry */}
      <div className="cube-container">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index}
            className="enhanced-cube"
            style={{
              '--delay': `${index * 1.5}s`,
              '--duration': `${12 + index * 0.5}s`,
              '--x': `${Math.random() * 100 - 50}%`,
              '--y': `${Math.random() * 100 - 50}%`,
              '--z': `${Math.random() * 200 - 100}px`,
              '--scale': `${0.8 + Math.random() * 0.4}`,
              '--hue': `${180 + index * 45}`,
              '--saturation': `${70 + Math.random() * 30}%`,
              '--lightness': `${50 + Math.random() * 20}%`
            } as React.CSSProperties}
          >
            <div className="cube-inner">
              {[...Array(6)].map((_, faceIndex) => (
                <div 
                  key={faceIndex}
                  className={`cube-face enhanced-face face-${faceIndex}`}
                />
              ))}
            </div>
            <div className="cube-glow"></div>
            <div className="cube-reflection"></div>
          </div>
        ))}
      </div>

      {/* Enhanced particle system */}
      <div className="particle-system">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="enhanced-particle"
            style={{
              '--delay': `${i * 0.5}s`,
              '--duration': `${10 + Math.random() * 10}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--size': `${1 + Math.random() * 3}px`
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Light rays */}
      <div className="light-rays">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="light-ray"
            style={{
              '--angle': `${i * 60}deg`,
              '--delay': `${i * 0.8}s`
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col justify-center items-center min-h-[90vh]">
        <div className="max-w-4xl w-full text-center">
          {/* Animated Title */}
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

          {/* Description */}
          <div className="mb-16 max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light tracking-wide font-sans">
              <span className="block mb-3 text-blue-300 font-medium">AI-POWERED TALENT ACQUISITION PLATFORM</span>
              Experience next-generation recruitment with intelligent matching, streamlined onboarding, and continuous professional development.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 border-t border-gray-800 pt-12">
            {[
              { value: '10K+', label: 'Successful Hires', color: 'text-blue-400' },
              { value: '500+', label: 'Top Companies', color: 'text-purple-400' },
              { value: '95%', label: 'Satisfaction', color: 'text-cyan-400' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2 font-sans`}>{stat.value}</div>
                <div className="text-gray-400 text-xs uppercase tracking-widest font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full py-6 bg-gradient-to-t from-gray-950 to-transparent border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0 font-sans">
            © {new Date().getFullYear()} TrueRize HireConnect. All rights reserved.
          </div>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact', 'Careers'].map((item) => (
              <a key={item} href="#" className="text-gray-500 hover:text-gray-300 transition-colors text-sm font-sans">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Enhanced CSS for 3D effects */}
      <style jsx>{`
        .cube-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          perspective: 1000px;
          overflow: hidden;
        }

        .enhanced-cube {
          position: absolute;
          width: 80px;
          height: 80px;
          transform-style: preserve-3d;
          animation: enhanced-float var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          top: 20%;
          left: 10%;
          opacity: 0.7;
        }

        .cube-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: rotate-cube 20s linear infinite;
        }

        .enhanced-face {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, 
            hsla(var(--hue), var(--saturation), var(--lightness), 0.1),
            hsla(var(--hue), var(--saturation), var(--lightness), 0.05)
          );
          border: 1px solid hsla(var(--hue), var(--saturation), var(--lightness), 0.3);
          backdrop-filter: blur(10px);
          box-shadow: 
            0 0 20px hsla(var(--hue), var(--saturation), var(--lightness), 0.3),
            inset 0 0 20px hsla(var(--hue), var(--saturation), var(--lightness), 0.1);
        }

        .face-0 { transform: translateZ(40px); }
        .face-1 { transform: rotateY(90deg) translateZ(40px); }
        .face-2 { transform: rotateY(180deg) translateZ(40px); }
        .face-3 { transform: rotateY(-90deg) translateZ(40px); }
        .face-4 { transform: rotateX(90deg) translateZ(40px); }
        .face-5 { transform: rotateX(-90deg) translateZ(40px); }

        .cube-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120%;
          height: 120%;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            hsla(var(--hue), var(--saturation), var(--lightness), 0.4) 0%,
            transparent 70%
          );
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .cube-reflection {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 100%;
          transform: scaleY(-1) translateY(100%);
          background: linear-gradient(
            to bottom,
            hsla(var(--hue), var(--saturation), var(--lightness), 0.1),
            transparent
          );
          opacity: 0.3;
        }

        .particle-system {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .enhanced-particle {
          position: absolute;
          width: var(--size);
          height: var(--size);
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent);
          border-radius: 50%;
          animation: enhanced-float-particle var(--duration) linear infinite;
          animation-delay: var(--delay);
        }

        .light-rays {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .light-ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 2px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform-origin: center;
          transform: translate(-50%, -50%) rotate(var(--angle));
          animation: rotate-rays 20s linear infinite;
          animation-delay: var(--delay);
        }

        @keyframes enhanced-float {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(var(--scale));
            opacity: 0.6;
          }
          25% {
            transform: translate3d(var(--x), calc(var(--y) * -1), var(--z)) rotateX(90deg) rotateY(90deg) scale(calc(var(--scale) * 1.2));
            opacity: 0.9;
          }
          50% {
            transform: translate3d(calc(var(--x) * -1), var(--y), calc(var(--z) * -1)) rotateX(180deg) rotateY(180deg) scale(calc(var(--scale) * 1.4));
            opacity: 0.8;
          }
          75% {
            transform: translate3d(calc(var(--x) * 0.5), calc(var(--y) * 0.5), calc(var(--z) * 0.5)) rotateX(270deg) rotateY(270deg) scale(calc(var(--scale) * 1.1));
            opacity: 0.7;
          }
        }

        @keyframes rotate-cube {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
        }

        @keyframes enhanced-float-particle {
          0% {
            transform: translateY(100vh) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
            transform: translateY(90vh) translateX(-10px) scale(1);
          }
          90% {
            opacity: 0.8;
            transform: translateY(-10vh) translateX(10px) scale(1);
          }
          100% {
            transform: translateY(-20vh) translateX(0) scale(0);
            opacity: 0;
          }
        }

        @keyframes rotate-rays {
          0% { opacity: 0; }
          50% { opacity: 0.3; }
          100% { opacity: 0; }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .enhanced-cube {
            width: 60px;
            height: 60px;
          }
          
          .face-0, .face-1, .face-2, .face-3, .face-4, .face-5 {
            transform: translateZ(30px);
          }
          
          .face-1 { transform: rotateY(90deg) translateZ(30px); }
          .face-2 { transform: rotateY(180deg) translateZ(30px); }
          .face-3 { transform: rotateY(-90deg) translateZ(30px); }
          .face-4 { transform: rotateX(90deg) translateZ(30px); }
          .face-5 { transform: rotateX(-90deg) translateZ(30px); }
        }
      `}</style>
    </div>
  );
}
