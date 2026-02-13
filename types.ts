
export interface CostBreakdown {
  transport: string;
  stay: string;
  food: string;
  activities: string;
}

export interface ItineraryItem {
  time: string;
  activity: string;
  cost_saving_tip: string;
  cost?: string; // Individual cost for this activity
}

export interface TransportOption {
  type: 'Train' | 'Bus' | 'Flight' | 'Cab' | 'Other';
  name: string;
  cost: string;
  duration: string;
  comfort_rating: 'Low' | 'Medium' | 'High';
}

export interface TripPlanResponse {
  trip_summary: string;
  budget_status: 'OK' | 'WARNING' | 'CRITICAL';
  ml_comparison: string;
  transport_options: TransportOption[];
  cost_breakdown: CostBreakdown;
  itinerary: ItineraryItem[];
  local_pro_tip: string;
}

export interface UserQuery {
  from: string;
  destination: string;
  duration: string;
  budget: number;
  transportType: 'Train' | 'Bus' | 'Flight' | 'Any';
  budgetBreakdown?: {
    transport?: number;
    stay?: number;
    food?: number;
    activities?: number;
  };
}
