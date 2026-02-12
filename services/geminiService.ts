
import { GoogleGenAI, Type } from "@google/genai";
import { TripPlanResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    trip_summary: { type: Type.STRING },
    budget_status: { 
      type: Type.STRING,
      description: "OK, WARNING, or CRITICAL based on budget feasibility"
    },
    ml_comparison: { type: Type.STRING },
    cost_breakdown: {
      type: Type.OBJECT,
      properties: {
        transport: { type: Type.STRING },
        stay: { type: Type.STRING },
        food: { type: Type.STRING },
        activities: { type: Type.STRING }
      },
      required: ["transport", "stay", "food", "activities"]
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING },
          activity: { type: Type.STRING },
          cost_saving_tip: { type: Type.STRING }
        },
        required: ["time", "activity", "cost_saving_tip"]
      }
    },
    local_pro_tip: { type: Type.STRING }
  },
  required: ["trip_summary", "budget_status", "ml_comparison", "cost_breakdown", "itinerary", "local_pro_tip"]
};

export const generateTripPlan = async (
  query: string,
  mlBaseCost: number
): Promise<TripPlanResponse> => {
  const prompt = `
    You are the "Agentic Wander Intelligence Engine," a hyper-efficient travel coordinator.
    
    [USER_QUERY]: ${query}
    [ML_PREDICTED_BASE_COST]: ${mlBaseCost} INR

    OPERATIONAL CONSTRAINTS:
    - Focus on the most cost-effective local transit (State buses, Sleeper/General trains, shared autos).
    - If the user's budget in the query is 20% lower than the [ML_PREDICTED_BASE_COST], budget_status MUST be "CRITICAL" (BUDGET_ALARM).
    - Prioritize Frugal Engineering: finding the maximum experience for the minimum cost.
    - Provide specific hacks for saving money on stays (hostels, guesthouses) and local food.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as TripPlanResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
