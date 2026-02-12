import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Zap } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, name: string) => void;
}

export const AuthPage: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignup && !name) {
      setError('Name is required for signup');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Simulate authentication (in real app, would call backend)
    const displayName = isSignup ? name : email.split('@')[0];
    localStorage.setItem('user', JSON.stringify({ email, name: displayName }));
    onLogin(email, displayName);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30 flex items-center justify-center p-4 overflow-x-hidden">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg shadow-blue-500/20">
              <Zap className="w-6 h-6 text-white fill-current" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Agentic <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Wander</span>
          </h1>
          <p className="text-slate-400 text-sm">AI-Powered Budget Travel Intelligence</p>
        </div>

        {/* Auth Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative bg-slate-950/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 shadow-2xl">
            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => {
                  setIsSignup(false);
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  !isSignup
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsSignup(true);
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  isSignup
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Signup only) */}
              {isSignup && (
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-100 text-sm placeholder-slate-500 backdrop-blur-sm"
                    placeholder="John Doe"
                  />
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-100 text-sm placeholder-slate-500 backdrop-blur-sm"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-100 text-sm placeholder-slate-500 backdrop-blur-sm pr-10"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 group uppercase tracking-wide text-sm mt-6"
              >
                {isSignup ? 'Create Account' : 'Login'}
                <Zap className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Demo Login */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-xs text-slate-400 text-center mb-3">Demo Login</p>
              <button
                onClick={() => {
                  setEmail('demo@example.com');
                  setPassword('demo123');
                  setTimeout(() => {
                    localStorage.setItem('user', JSON.stringify({ email: 'demo@example.com', name: 'Demo User' }));
                    onLogin('demo@example.com', 'Demo User');
                  }, 100);
                }}
                className="w-full bg-slate-800/50 hover:bg-slate-800/80 border border-slate-600/50 text-slate-300 font-medium py-2.5 rounded-lg transition-all text-sm"
              >
                Try Demo
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          For hackathon demo purposes. All data is local.
        </p>
      </div>
    </div>
  );
};
