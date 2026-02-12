
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
}

export interface TripPlanResponse {
  trip_summary: string;
  budget_status: 'OK' | 'WARNING' | 'CRITICAL';
  ml_comparison: string;
  cost_breakdown: CostBreakdown;
  itinerary: ItineraryItem[];
  local_pro_tip: string;
}

export interface UserQuery {
  destination: string;
  duration: string;
  budget: number;
}
