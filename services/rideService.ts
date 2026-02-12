
interface RidePrice {
  service: string;
  basePrice: number;
  estimatedTime: number;
  rating: number;
  discount: number;
  finalPrice: number;
  vehicle: string;
  benefits: string[];
  pricePerKm: number;
  baseFare: number;
  distance: number;
  discount_percentage: number;
}

// Realistic Indian cab pricing (2024)
const PRICING_DATA = {
  uber: {
    service: 'Uber',
    vehicle: 'UberGo',
    baseFare: 50,
    pricePerKm: 12,
    timePerKm: 2,
    rating: 4.7,
    discount: 15,
    benefits: ['WiFi available', 'Professional driver', 'Real-time tracking']
  },
  ola: {
    service: 'Ola',
    vehicle: 'Ola Prime',
    baseFare: 45,
    pricePerKm: 10,
    timePerKm: 2,
    rating: 4.5,
    discount: 20,
    benefits: ['AC available', 'Safety features', 'Quick pickup']
  },
  fastrack: {
    service: 'Fastrack',
    vehicle: 'Economy',
    baseFare: 40,
    pricePerKm: 8,
    timePerKm: 2.5,
    rating: 4.3,
    discount: 10,
    benefits: ['Budget-friendly', 'Local drivers', 'No surge pricing']
  },
  rapido: {
    service: 'Rapido',
    vehicle: 'Bike Taxi',
    baseFare: 20,
    pricePerKm: 6,
    timePerKm: 1.5,
    rating: 4.6,
    discount: 25,
    benefits: ['Fastest option', 'Cheapest ride', 'Easy booking']
  }
};

// Get distance using Google Maps Distance Matrix API
export const getDistance = async (
  from: string,
  to: string
): Promise<{ distance: number; duration: number } | null> => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('❌ Google Maps API key not found in .env.local');
      return null;
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(from)}&destinations=${encodeURIComponent(to)}&key=${apiKey}`;
    
    console.log('📍 Fetching distance data from Google Maps:', { from, to });
    
    const response = await fetch(url);
    const data = await response.json();

    console.log('📡 Google Maps API Response:', data);

    if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
      const element = data.rows[0].elements[0];
      const distance = element.distance.value / 1000; // Convert to km
      const duration = element.duration.value / 60; // Convert to minutes
      
      console.log('✅ Real distance data:', { distance: `${distance.toFixed(1)} km`, duration: `${duration.toFixed(0)} min` });
      
      return { distance, duration };
    }

    console.error('❌ Distance Matrix API error:', data.status, data.error_message);
    return null;
  } catch (error) {
    console.error('❌ Error fetching distance:', error);
    return null;
  }
};

// Calculate ride prices based on actual distance
export const calculateRidePrices = async (
  from: string,
  to: string
): Promise<RidePrice[]> => {
  console.log('🚗 Starting ride price calculation for:', { from, to });
  
  const distanceData = await getDistance(from, to);

  // Fallback to estimated distance if API fails
  const distance = distanceData?.distance || 15; // 15 km default
  const estimatedMinutes = distanceData?.duration || 25; // 25 min default

  console.log('📊 Using distance:', distance, 'km | Duration:', estimatedMinutes, 'min');
  if (!distanceData) {
    console.warn('⚠️ Using fallback distance (Google Maps API failed)');
  }

  const rides: RidePrice[] = [];

  Object.values(PRICING_DATA).forEach((pricing) => {
    const baseCost = pricing.baseFare + distance * pricing.pricePerKm;
    const discountAmount = baseCost * (pricing.discount / 100);
    const finalPrice = baseCost - discountAmount;
    const estimatedTime = Math.ceil(
      distance * pricing.timePerKm + Math.random() * 5 - 2.5
    );

    console.log(`💰 ${pricing.service}: Base(₹${pricing.baseFare}) + (${distance.toFixed(1)}km × ₹${pricing.pricePerKm}) - ${pricing.discount}% = ₹${finalPrice.toFixed(0)}`);

    rides.push({
      service: pricing.service,
      vehicle: pricing.vehicle,
      baseFare: pricing.baseFare,
      pricePerKm: pricing.pricePerKm,
      distance: Math.round(distance * 10) / 10,
      basePrice: Math.round(baseCost),
      finalPrice: Math.round(finalPrice),
      estimatedTime: Math.max(5, estimatedTime),
      rating: pricing.rating,
      discount: pricing.discount,
      discount_percentage: pricing.discount,
      benefits: pricing.benefits
    });
  });

  // Sort by final price (cheapest first)
  return rides.sort((a, b) => a.finalPrice - b.finalPrice);
};
