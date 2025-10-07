'use client';

import React, { useEffect, useRef } from 'react';

const Unified3DCubes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const cubes: HTMLDivElement[] = [];

    // Create floating cubes
    for (let i = 0; i < 20; i++) {
      const cube = document.createElement('div');
      cube.className = 'absolute w-4 h-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm border border-white/10';

      // Random positioning
      cube.style.left = Math.random() * 100 + '%';
      cube.style.top = Math.random() * 100 + '%';
      cube.style.animationDelay = Math.random() * 10 + 's';
      cube.style.animationDuration = (Math.random() * 10 + 10) + 's';

      container.appendChild(cube);
      cubes.push(cube);
    }

    // Cleanup function
    return () => {
      cubes.forEach(cube => {
        if (container.contains(cube)) {
          container.removeChild(cube);
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)'
      }}
    >
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        div > div {
          animation: float infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Unified3DCubes;
