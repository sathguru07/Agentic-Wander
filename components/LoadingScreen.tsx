
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
    <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-blue-400">Agentic Analysis...</h3>
        <p className="text-slate-400 animate-pulse font-medium">{MESSAGES[index]}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
