import React, { useState } from 'react';
import { MapPin, Zap, TrendingDown, Clock, DollarSign, Star } from 'lucide-react';
import { calculateRidePrices } from '../services/rideService';

interface RideOption {
  service: string;
  basePrice: number;
  estimatedTime: number;
  rating: number;
  discount: number;
  finalPrice: number;
  vehicle: string;
  benefits: string[];
  distance: number;
  pricePerKm: number;
  baseFare: number;
}

interface RideComparisonProps {
  onRideSelected?: (ride: RideOption) => void;
}

export const RideComparison: React.FC<RideComparisonProps> = ({ onRideSelected }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rides, setRides] = useState<RideOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [bestOption, setBestOption] = useState<RideOption | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<string>('');

  const handleCompareRides = async () => {
    if (!from || !to) {
      alert('Please enter both locations');
      return;
    }

    setLoading(true);
    try {
      const rideOptions = await calculateRidePrices(from, to);
      
      if (rideOptions.length > 0) {
        const best = rideOptions[0]; // First one is cheapest (already sorted)
        setRides(rideOptions);
        setBestOption(best);
        
        // Extract distance from first ride
        const distKm = rideOptions[0].distance;
        setDistanceInfo(`${distKm} km`);
      } else {
        alert('Unable to fetch ride data. Please try again.');
      }
    } catch (error) {
      console.error('Error calculating rides:', error);
      alert('Error fetching ride prices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Ride Comparison Header */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative bg-slate-950/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-500/20 p-3 rounded-xl">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-300">Ride Comparison</h2>
              <p className="text-xs text-slate-400">Find the best cab service with lowest fares</p>
            </div>
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                From
              </label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Current location"
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-100 text-sm placeholder-slate-500 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                To
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Destination"
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-100 text-sm placeholder-slate-500 backdrop-blur-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCompareRides}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 text-sm uppercase tracking-wide"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Comparing...
                  </>
                ) : (
                  <>
                    Compare Rides
                    <TrendingDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {rides.length > 0 && (
        <div className="space-y-4">
          {/* Best Option Highlight */}
          {bestOption && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-gradient-to-br from-yellow-950/40 to-orange-950/40 backdrop-blur-xl border border-yellow-500/40 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <p className="text-xs font-bold text-yellow-300 uppercase tracking-widest">Best Option</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-200 mb-1">₹{bestOption.finalPrice}</p>
                    <p className="text-sm text-yellow-300/80 font-semibold">{bestOption.service} - {bestOption.vehicle}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-yellow-300">{bestOption.rating}</span>
                    </div>
                    <p className="text-xs text-yellow-300/60">{bestOption.estimatedTime} min away</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {bestOption.benefits.map((benefit, i) => (
                    <div key={i} className="bg-yellow-500/10 rounded-lg p-2 text-center">
                      <p className="text-xs text-yellow-300">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* All Ride Options */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">All Options</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {rides.map((ride) => (
                <div
                  key={ride.service}
                  onClick={() => onRideSelected?.(ride)}
                  className={`group relative cursor-pointer transition-all ${
                    ride.service === bestOption?.service
                      ? 'ring-2 ring-yellow-500/50'
                      : ''
                  }`}
                >
                  <div
                    className={`absolute -inset-0.5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      ride.service === bestOption?.service
                        ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20'
                        : 'bg-gradient-to-br from-blue-600/20 to-indigo-600/20'
                    }`}
                  ></div>

                  <div
                    className={`relative backdrop-blur-xl rounded-xl p-4 border transition-all ${
                      ride.service === bestOption?.service
                        ? 'bg-yellow-950/30 border-yellow-500/40'
                        : 'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/80'
                    }`}
                  >
                    {ride.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-green-500/20 text-green-300 text-xs font-bold px-2 py-1 rounded">
                        {ride.discount}% OFF
                      </div>
                    )}

                    <p className="text-sm font-bold text-slate-200 mb-3">{ride.service}</p>
                    <p className="text-xs text-slate-400 mb-3">{ride.vehicle}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-slate-400">Price</span>
                        </div>
                        <span className="text-lg font-bold text-emerald-300">₹{ride.finalPrice}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-slate-400">ETA</span>
                        </div>
                        <span className="text-sm font-bold text-blue-300">{ride.estimatedTime}m</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-slate-400">Rating</span>
                        </div>
                        <span className="text-sm font-bold text-yellow-300">{ride.rating}</span>
                      </div>
                    </div>

                    <button
                      className={`w-full py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        ride.service === bestOption?.service
                          ? 'bg-yellow-500/30 text-yellow-300 hover:bg-yellow-500/50'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/80'
                      }`}
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* From/To Info */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-1">From</p>
                <p className="text-slate-200 font-semibold">{from}</p>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="border-t-2 border-dashed border-slate-600 flex-1 mx-4"></div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">To</p>
                <p className="text-slate-200 font-semibold">{to}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {rides.length === 0 && !loading && (
        <div className="bg-slate-800/30 border-2 border-dashed border-slate-600/30 rounded-2xl p-12 text-center">
          <div className="bg-slate-800/50 p-4 rounded-xl mb-4 w-fit mx-auto">
            <MapPin className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-sm font-semibold text-slate-300 mb-2">Compare Rides</p>
          <p className="text-xs text-slate-500">Enter your location and destination to see available cab options</p>
        </div>
      )}
    </div>
  );
};
