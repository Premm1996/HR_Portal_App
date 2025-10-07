'use client';

import React, { useEffect, useRef } from 'react';

interface Floating3DCubesProps {
  count: number;
  size: number;
  speed: number;
  colors: string[];
}

const Floating3DCubes: React.FC<Floating3DCubesProps> = ({ count, size, speed, colors }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const cubes: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const cube = document.createElement('div');
      cube.className = 'absolute rounded-lg backdrop-blur-sm border border-white/10';
      cube.style.width = `${size}px`;
      cube.style.height = `${size}px`;
      cube.style.background = `linear-gradient(135deg, ${colors[i % colors.length]} 0%, transparent 100%)`;
      cube.style.left = Math.random() * 100 + '%';
      cube.style.top = Math.random() * 100 + '%';
      cube.style.animation = `float ${speed + Math.random() * speed}s ease-in-out infinite`;
      cube.style.opacity = '0.3';

      container.appendChild(cube);
      cubes.push(cube);
    }

    return () => {
      cubes.forEach(cube => {
        if (container.contains(cube)) {
          container.removeChild(cube);
        }
      });
    };
  }, [count, size, speed, colors]);

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
      `}</style>
    </div>
  );
};

export default Floating3DCubes;
