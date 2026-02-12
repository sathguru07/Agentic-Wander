
import React, { useState } from 'react';
import { TripPlanResponse, UserQuery } from './types';
import { generateTripPlan } from './services/geminiService';
import {
  MapPin,
  Calendar,
  Wallet,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Zap,
  TrendingDown,
  Clock,
  Bus,
  Bed,
  Utensils,
  Backpack
} from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const App: React.FC = () => {
  const [query, setQuery] = useState<UserQuery>({
    from: 'Chennai',
    destination: 'Pondicherry',
    duration: '2 Days',
    budget: 3000
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TripPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locatingFrom, setLocatingFrom] = useState(false);

  // Mock ML Logic: Predicts a base cost based on destination keywords and duration
  const getPredictedBaseCost = (q: UserQuery) => {
    let base = 1500;
    const days = parseInt(q.duration) || 1;

    const d = q.destination.toLowerCase();
    if (d.includes('pond')) base = 1800;
    else if (d.includes('bang')) base = 2200;
    else if (d.includes('chennai')) base = 1200;
    else if (d.includes('ooty')) base = 3000;
    else if (d.includes('goa')) base = 4000;
    else base = 2000;

    return base * days;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlan(null);

    const mlCost = getPredictedBaseCost(query);
    const queryString = `Travel from ${query.from} to ${query.destination} for ${query.duration} with ${query.budget} INR budget.`;

    try {
      const result = await generateTripPlan(queryString, mlCost);
      setPlan(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      
      if (errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("Quota")) {
        setError("API quota exceeded. Please check your Gemini API billing and quota limits at https://ai.google.dev/");
      } else if (errorMessage.includes("API key") || errorMessage.includes("authentication")) {
        setError("API key issue. Please check your Gemini API key configuration.");
      } else {
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    setLocatingFrom(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocode using Open Street Map's Nominatim API
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const cityName = data.address?.city || data.address?.town || data.address?.village || 'Current Location';
            setQuery({ ...query, from: cityName });
          } catch (err) {
            console.error('Error fetching location name:', err);
            setQuery({ ...query, from: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` });
          } finally {
            setLocatingFrom(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to access your location. Please enable location permissions.');
          setLocatingFrom(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLocatingFrom(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <nav className="border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Agentic <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Wander</span>
            </h1>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
            <span className="px-3 py-1 rounded-full text-blue-400 border border-blue-500/30 bg-blue-500/10">Premium AI Planner</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              ML Engine Active
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1920px] mx-auto px-6 py-12">
        {/* 3-Column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: Input Form with Glassmorphism */}
          <div className="space-y-6">
            {/* Main Input Card */}
            <div className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-slate-950/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 shadow-2xl hover:border-blue-500/40 transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none"></div>
                
                <div className="relative space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent mb-1">Trip Planner</h2>
                    <p className="text-xs text-slate-400 font-medium">Configure your perfect journey</p>
                  </div>

                  <form onSubmit={handleSearch} className="space-y-5">
                    {/* From Location */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        Origin
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={query.from}
                          onChange={(e) => setQuery({ ...query, from: e.target.value })}
                          className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-100 text-sm placeholder-slate-500 backdrop-blur-sm"
                          placeholder="Your location"
                        />
                        <button
                          type="button"
                          onClick={handleGetCurrentLocation}
                          disabled={locatingFrom}
                          className="bg-slate-800/50 hover:bg-slate-700/50 disabled:bg-slate-800/50 border border-slate-600/50 hover:border-blue-500/50 text-blue-400 px-3 py-3 rounded-lg flex items-center justify-center transition-all group disabled:opacity-50 backdrop-blur-sm"
                          title="Use my location"
                        >
                          <MapPin className={`w-4 h-4 ${locatingFrom ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`} />
                        </button>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-400" />
                        Destination
                      </label>
                      <input
                        type="text"
                        value={query.destination}
                        onChange={(e) => setQuery({ ...query, destination: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-100 text-sm placeholder-slate-500 backdrop-blur-sm"
                        placeholder="Where to explore?"
                      />
                    </div>

                    {/* Duration & Budget */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          Duration
                        </label>
                        <input
                          type="text"
                          value={query.duration}
                          onChange={(e) => setQuery({ ...query, duration: e.target.value })}
                          className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-100 text-sm placeholder-slate-500 backdrop-blur-sm"
                          placeholder="Days"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-green-400" />
                          Budget (₹)
                        </label>
                        <input
                          type="number"
                          value={query.budget}
                          onChange={(e) => setQuery({ ...query, budget: Number(e.target.value) })}
                          className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all text-slate-100 text-sm placeholder-slate-500 backdrop-blur-sm"
                          placeholder="Amount"
                        />
                      </div>
                    </div>

                    {/* Search Button */}
                    <button
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 text-sm uppercase tracking-wide"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Generate Itinerary
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex gap-4">
                <div className="bg-blue-500/20 p-2 rounded-lg h-fit">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">AI Optimization</p>
                  <p className="text-sm text-slate-400 leading-relaxed">ML-powered cost predictions & smart itinerary generation for maximum value.</p>
                </div>
              </div>
            </div>
          </div>

        {/* MIDDLE COLUMN: Budget Analysis */}
          <div className="space-y-6">
            {loading && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-slate-950/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 min-h-[400px]">
                  <LoadingScreen />
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-950/40 border border-red-500/30 backdrop-blur-xl rounded-2xl p-6 flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-200 mb-1">Error</p>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            )}

            {!loading && !plan && !error && (
              <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-2 border-dashed border-slate-600/30 rounded-2xl p-12 flex flex-col items-center justify-center min-h-96 text-center backdrop-blur-xl">
                <div className="bg-slate-800/50 p-4 rounded-xl mb-4">
                  <Backpack className="w-12 h-12 text-slate-600" />
                </div>
                <p className="text-sm font-semibold text-slate-300 mb-2">Ready to Plan</p>
                <p className="text-xs text-slate-500 max-w-xs">Configure your trip in the left panel to see ML-powered budget analysis here.</p>
              </div>
            )}

            {plan && !loading && (
              <div className="space-y-6">
                {/* ML Prediction vs Budget */}
                <div className={`relative group overflow-hidden rounded-2xl`}>
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${plan.budget_status === 'CRITICAL' ? 'from-red-600/20 to-orange-600/20' : plan.budget_status === 'WARNING' ? 'from-amber-600/20 to-orange-600/20' : 'from-emerald-600/20 to-green-600/20'} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className={`relative bg-slate-950/40 backdrop-blur-xl border ${plan.budget_status === 'CRITICAL' ? 'border-red-500/30' : plan.budget_status === 'WARNING' ? 'border-amber-500/30' : 'border-emerald-500/30'} rounded-2xl p-6`}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Budget Status</p>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${plan.budget_status === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : plan.budget_status === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                          {plan.budget_status}
                        </span>
                      </div>

                      {/* Warning Banner */}
                      {plan.budget_status !== 'OK' && (
                        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-3 flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-orange-200 font-medium">Budget constraints detected. Consider extending duration or adjusting spending.</p>
                        </div>
                      )}

                      {/* Cost Comparison */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                          <p className="text-xs text-blue-300 font-bold uppercase tracking-wide mb-2">Estimate</p>
                          <p className="text-2xl font-bold text-blue-300">₹{plan.ml_comparison?.split('vs')[0]?.trim() || 'N/A'}</p>
                          <p className="text-xs text-slate-500 mt-1">AI Prediction</p>
                        </div>
                        <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30">
                          <p className="text-xs text-indigo-300 font-bold uppercase tracking-wide mb-2">Budget</p>
                          <p className="text-2xl font-bold text-indigo-300">₹{query.budget}</p>
                          <p className="text-xs text-slate-500 mt-1">Your allocation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trip Summary */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-slate-950/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                    <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Trip Overview</p>
                    <p className="text-base text-slate-100 leading-relaxed font-medium">{plan.trip_summary}</p>
                    
                    {/* Pro Tip */}
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-start gap-3">
                      <div className="bg-emerald-500/20 p-2 rounded-lg h-fit">
                        <Zap className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest mb-1">Local Pro Tip</p>
                        <p className="text-sm text-slate-200 leading-relaxed">{plan.local_pro_tip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        {/* RIGHT COLUMN: Cost Allocation Donut Chart */}
          <div className="space-y-6">
            {loading && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-slate-950/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-2 h-12 bg-gradient-to-t from-purple-400 to-purple-400/20 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '1s'}}></div>
                    <div className="w-2 h-12 bg-gradient-to-t from-pink-400 to-pink-400/20 rounded-full animate-bounce" style={{animationDelay: '0.2s', animationDuration: '1s'}}></div>
                    <div className="w-2 h-12 bg-gradient-to-t from-purple-400 to-purple-400/20 rounded-full animate-bounce" style={{animationDelay: '0.4s', animationDuration: '1s'}}></div>
                    <div className="w-2 h-12 bg-gradient-to-t from-pink-400 to-pink-400/20 rounded-full animate-bounce" style={{animationDelay: '0.6s', animationDuration: '1s'}}></div>
                  </div>
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Analyzing costs...</h3>
                  <p className="text-sm text-slate-400">Building your cost breakdown</p>
                </div>
              </div>
            )}
            
            {plan && !loading && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-slate-950/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-1">Cost Allocation</p>
                      <p className="text-sm text-slate-400">Budget breakdown across categories</p>
                    </div>

                    {/* Donut Chart */}
                    <div className="flex items-center justify-center h-48">
                      <div className="relative w-40 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Transport', value: parseInt(plan.cost_breakdown.transport.replace(/\D/g, '')) || 1 },
                                { name: 'Stay', value: parseInt(plan.cost_breakdown.stay.replace(/\D/g, '')) || 1 },
                                { name: 'Food', value: parseInt(plan.cost_breakdown.food.replace(/\D/g, '')) || 1 },
                                { name: 'Activities', value: parseInt(plan.cost_breakdown.activities.replace(/\D/g, '')) || 1 },
                              ]}
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {COLORS.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', fontSize: '11px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        {/* Center Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-2xl font-bold text-purple-300">₹{query.budget}</p>
                          <p className="text-xs text-slate-500 mt-1">Total Budget</p>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-3 pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-3 group hover:bg-slate-800/30 p-2 rounded-lg transition-all">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-slate-400 font-semibold">Transport</p>
                          <p className="text-base font-bold text-blue-300">{plan.cost_breakdown.transport}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 group hover:bg-slate-800/30 p-2 rounded-lg transition-all">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-slate-400 font-semibold">Stay</p>
                          <p className="text-base font-bold text-emerald-300">{plan.cost_breakdown.stay}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 group hover:bg-slate-800/30 p-2 rounded-lg transition-all">
                        <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-slate-400 font-semibold">Food</p>
                          <p className="text-base font-bold text-amber-300">{plan.cost_breakdown.food}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 group hover:bg-slate-800/30 p-2 rounded-lg transition-all">
                        <div className="w-3 h-3 rounded-full bg-purple-500 shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-slate-400 font-semibold">Activities</p>
                          <p className="text-base font-bold text-purple-300">{plan.cost_breakdown.activities}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!plan && !loading && (
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-2 border-purple-500/40 rounded-2xl p-8 flex flex-col items-center justify-center min-h-96 text-center backdrop-blur-xl hover:border-purple-500/60 transition-all duration-300">
                <div className="bg-purple-500/20 p-4 rounded-xl mb-4 border border-purple-500/30">
                  <Wallet className="w-12 h-12 text-purple-300" />
                </div>
                <p className="text-base font-bold text-purple-200 mb-2">Cost Breakdown</p>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">Your cost allocation chart will appear here once you generate an itinerary. This shows how your budget is distributed across Transport, Stay, Food, and Activities.</p>
              </div>
            )}
          </div>
        </div>

        {/* FULL WIDTH: Itinerary Timeline */}
        {plan && !loading && (
          <div className="mt-12">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-slate-950/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-700/50 flex items-center justify-between bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
                  <h3 className="font-bold text-lg flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    Daily Itinerary
                  </h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hour-by-Hour Plan</span>
                </div>
                <div className="p-8 space-y-8">
                  {plan.itinerary.map((item, idx) => (
                    <div key={idx} className="relative pl-10">
                      {/* Timeline Connector */}
                      {idx !== plan.itinerary.length - 1 && (
                        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                      )}
                      
                      {/* Timeline Dot */}
                      <div className="absolute left-0 top-0 w-9 h-9 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-2 border-blue-500/50 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-blue-400 font-mono text-sm font-bold bg-blue-500/10 px-2 py-1 rounded">{item.time}</span>
                          <h4 className="font-semibold text-slate-100 text-base">{item.activity}</h4>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg flex items-start gap-3 mt-3">
                          <TrendingDown className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest mb-1">Cost Saving Tip</p>
                            <p className="text-sm text-slate-300">{item.cost_saving_tip}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-[1920px] mx-auto px-6 py-12 border-t border-slate-800/50 mt-16 text-center space-y-4">
        <p className="text-slate-500 text-sm font-medium">
          Agentic Wander — AI-Powered Budget Travel Intelligence
        </p>
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600 uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            SaaS-Grade Analytics
          </span>
          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
          <span>ML-Powered Optimization</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
          <span>Maximum Value</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
