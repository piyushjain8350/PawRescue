'use client';

import { useEffect, useState } from 'react';
import { Heart, Dog, Cat } from 'lucide-react';

const Preloader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-orange-100 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-bounce delay-0">
              <Dog className="h-12 w-12 text-green-600" />
            </div>
            <div className="animate-pulse">
              <Heart className="h-16 w-16 text-red-500" />
            </div>
            <div className="animate-bounce delay-300">
              <Cat className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-4 -left-4 animate-float">
            <div className="w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
          </div>
          <div className="absolute -top-2 -right-6 animate-float-delay">
            <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
          </div>
          <div className="absolute -bottom-2 -left-2 animate-float-delay-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full opacity-60"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Paw<span className="text-green-600">Rescue</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">Finding homes for loving animals</p>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">Loading... {progress}%</p>
        </div>

        {/* Loading Messages */}
        <div className="mt-6 h-6">
          {progress < 30 && (
            <p className="text-sm text-gray-600 animate-fade-in">Preparing animal profiles...</p>
          )}
          {progress >= 30 && progress < 60 && (
            <p className="text-sm text-gray-600 animate-fade-in">Loading rescue locations...</p>
          )}
          {progress >= 60 && progress < 90 && (
            <p className="text-sm text-gray-600 animate-fade-in">Setting up volunteer opportunities...</p>
          )}
          {progress >= 90 && (
            <p className="text-sm text-gray-600 animate-fade-in">Almost ready...</p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        
        @keyframes float-delay-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 4s ease-in-out infinite;
        }
        
        .animate-float-delay-2 {
          animation: float-delay-2 2.5s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Preloader;