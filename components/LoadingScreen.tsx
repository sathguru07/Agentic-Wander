
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Calculating shared transit rates...",
  "Searching for budget sleeper availability...",
  "Optimizing local street food vs hostel costs...",
  "Bypassing expensive tourist traps for local hacks...",
  "Checking local bus schedules...",
  "Engineering maximum fun on a minimum budget...",
  "Consulting the Frugal Engineering gods...",
  "Triangulating low-cost coordinates..."
];

const LoadingScreen: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8 text-center min-h-[400px]">
      {/* Multiple spinning rings for better visual effect */}
      <div className="relative w-32 h-32">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-400 border-r-blue-500 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
        
        {/* Middle ring */}
        <div className="absolute inset-2 border-4 border-transparent border-b-purple-400 border-l-purple-500 rounded-full animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
        
        {/* Inner ring */}
        <div className="absolute inset-4 border-3 border-transparent border-t-indigo-400 rounded-full animate-spin" style={{animationDuration: '1.5s'}}></div>
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
          Agentic Analysis...
        </h3>
        <p className="text-slate-300 font-medium min-h-[24px] transition-all duration-500 ease-in-out">
          {MESSAGES[index]}
        </p>
        <div className="flex gap-1 justify-center pt-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
