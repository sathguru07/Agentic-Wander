
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
    destination: 'Pondicherry',
    duration: '2 Days',
    budget: 3000
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TripPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    const queryString = `${query.destination} for ${query.duration} with ${query.budget} INR budget.`;

    try {
      const result = await generateTripPlan(queryString, mlCost);
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
      {/* Header */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Agentic <span className="text-blue-500">Wander</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <span className="bg-slate-800 px-3 py-1 rounded-full text-blue-400">Frugal Edition</span>
            <span>Autonomous Logic: Active</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero & Query Form */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Plan Your Getaway
              </h2>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Destination</label>
                  <input
                    type="text"
                    value={query.destination}
                    onChange={(e) => setQuery({ ...query, destination: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="e.g. Goa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={query.duration}
                        onChange={(e) => setQuery({ ...query, duration: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="2 Days"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget (₹)</label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        value={query.budget}
                        onChange={(e) => setQuery({ ...query, budget: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="3000"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    {loading ? 'Initializing Agent...' : 'Optimize Travel'}
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {query.destination && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.destination)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white w-16 rounded-xl flex items-center justify-center transition-all group"
                      title="Verify Location on Google Maps"
                    >
                      <MapPin className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                </div>
              </form>
            </div>

            {/* Frugal Tip Card */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingDown className="w-20 h-20" />
              </div>
              <h3 className="text-sm font-bold text-blue-300 mb-2 uppercase tracking-widest">Efficiency Protocol</h3>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "Agentic Wander finds the most efficient path through the noise of expensive travel options."
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {loading && <LoadingScreen />}

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {!loading && !plan && !error && (
              <div className="h-[500px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500 space-y-4">
                <div className="bg-slate-900 p-4 rounded-full">
                  <Backpack className="w-12 h-12" />
                </div>
                <p className="text-lg font-medium">Agentic Wander is ready. Provide destination details.</p>
              </div>
            )}

            {plan && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                {/* Status Bar */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-2xl ${plan.budget_status === 'CRITICAL' ? 'bg-red-900/20 border-red-500/50' :
                  plan.budget_status === 'WARNING' ? 'bg-amber-900/20 border-amber-500/50' :
                    'bg-emerald-900/20 border-emerald-500/50'
                  }`}>
                  <div className="flex items-center gap-3">
                    {plan.budget_status === 'CRITICAL' ? <AlertTriangle className="text-red-500" /> :
                      plan.budget_status === 'WARNING' ? <AlertTriangle className="text-amber-500" /> :
                        <CheckCircle className="text-emerald-500" />}
                    <div>
                      <p className="text-xs uppercase font-bold tracking-tighter opacity-70">Budget Status</p>
                      <p className="font-bold text-lg">{plan.budget_status === 'CRITICAL' ? 'BUDGET ALARM' : plan.budget_status + ' LIMITS'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium opacity-80">{plan.ml_comparison}</p>
                  </div>
                </div>

                {/* Summary & Breakdown Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest">Strategy Summary</h3>
                    <p className="text-xl font-semibold leading-snug">{plan.trip_summary}</p>

                    <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Zap className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Pro Travel Tip</p>
                        <p className="text-sm font-medium">{plan.local_pro_tip}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-4">Cost Allocation (INR)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-slate-400">Transport: {plan.cost_breakdown.transport}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-slate-400">Stay: {plan.cost_breakdown.stay}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-slate-400">Food: {plan.cost_breakdown.food}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="text-slate-400">Activity: {plan.cost_breakdown.activities}</span>
                        </div>
                      </div>
                      <div className="h-24 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Transport', value: parseInt(plan.cost_breakdown.transport.replace(/\D/g, '')) || 1 },
                                { name: 'Stay', value: parseInt(plan.cost_breakdown.stay.replace(/\D/g, '')) || 1 },
                                { name: 'Food', value: parseInt(plan.cost_breakdown.food.replace(/\D/g, '')) || 1 },
                                { name: 'Activities', value: parseInt(plan.cost_breakdown.activities.replace(/\D/g, '')) || 1 },
                              ]}
                              innerRadius={25}
                              outerRadius={40}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {COLORS.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Itinerary Timeline */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      Execution Timeline
                    </h3>
                    <span className="text-xs font-mono text-slate-500 uppercase">Strategic Logistics</span>
                  </div>
                  <div className="p-6 space-y-6">
                    {plan.itinerary.map((item, idx) => (
                      <div key={idx} className="relative pl-8 pb-6 last:pb-0">
                        {/* Timeline Connector */}
                        {idx !== plan.itinerary.length - 1 && (
                          <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-800"></div>
                        )}
                        <div className="absolute left-0 top-1.5 w-6 h-6 bg-slate-800 border-2 border-blue-500/50 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-blue-400 font-mono text-sm font-medium">{item.time}</span>
                            <h4 className="font-semibold text-slate-100">{item.activity}</h4>
                          </div>
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mt-2 flex items-start gap-3">
                            <TrendingDown className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-slate-400">
                              <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-wider mr-2">Frugal Hack:</span>
                              {item.cost_saving_tip}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-800 mt-12 text-center space-y-4">
        <p className="text-slate-500 text-sm">
          Agentic Wander Intelligence Engine.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
          <span>Global Frugal Engineering</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
          <span>Zero Waste Travel</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
          <span>Max Value Focus</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
