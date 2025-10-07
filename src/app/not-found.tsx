'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Premium 3D floating elements */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {/* Floating cubes */}
        {[...Array(8)].map((_, i) => {
          const size = Math.random() * 60 + 30;
          const delay = Math.random() * 10;
          const duration = Math.random() * 25 + 15;
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
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-slate-300 max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-slate-800/60 backdrop-blur-sm border-2 border-slate-600/30 rounded-xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-slate-500/50"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-cyan-400/20"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: Math.random() * 0.3 + 0.1,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes float3d {
          0% { transform: translateY(0) rotateX(0) rotateY(0) rotateZ(0); }
          25% { transform: translateY(-20px) rotateX(10deg) rotateY(10deg) rotateZ(5deg); }
          50% { transform: translateY(-40px) rotateX(20deg) rotateY(20deg) rotateZ(10deg); }
          75% { transform: translateY(-20px) rotateX(10deg) rotateY(10deg) rotateZ(5deg); }
          100% { transform: translateY(0) rotateX(0) rotateY(0) rotateZ(0); }
        }

        @keyframes float {
          0% { transform: translateY(0) rotate(0deg) translateX(0) scale(1); }
          50% { transform: translateY(-30px) rotate(5deg) translateX(0) scale(1.05); }
          100% { transform: translateY(0) rotate(0deg) translateX(0) scale(1); }
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
