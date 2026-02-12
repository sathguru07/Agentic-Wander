
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { TripPlanResponse } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    trip_summary: { type: SchemaType.STRING },
    budget_status: {
      type: SchemaType.STRING,
      description: "OK, WARNING, or CRITICAL based on budget feasibility"
    },
    ml_comparison: { type: SchemaType.STRING },
    cost_breakdown: {
      type: SchemaType.OBJECT,
      properties: {
        transport: { type: SchemaType.STRING },
        stay: { type: SchemaType.STRING },
        food: { type: SchemaType.STRING },
        activities: { type: SchemaType.STRING }
      },
      required: ["transport", "stay", "food", "activities"]
    },
    itinerary: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          time: { type: SchemaType.STRING },
          activity: { type: SchemaType.STRING },
          cost_saving_tip: { type: SchemaType.STRING }
        },
        required: ["time", "activity", "cost_saving_tip"]
      }
    },
    local_pro_tip: { type: SchemaType.STRING }
  },
  required: ["trip_summary", "budget_status", "ml_comparison", "cost_breakdown", "itinerary", "local_pro_tip"]
};

export const generateTripPlan = async (
  query: string,
  mlBaseCost: number
): Promise<TripPlanResponse> => {
  const prompt = `
    You are the "Agentic Wander Intelligence Engine," a highly accurate and frugal travel coordinator.
    
    [USER_QUERY]: ${query}
    [ML_PREDICTED_BASE_COST]: ${mlBaseCost} INR

    CRITICAL INSTRUCTIONS:
    1. **VERIFY THE LOCATION:** If the [USER_QUERY] contains a fake, nonsense, or ambiguous location (e.g., "Xyzabc", "RandomPlace123"), IMMEDIATELY return a plan where "trip_summary" starts with "⚠️ LOCATION UNKNOWN:" followed by a suggestion to check the spelling. Do NOT Hallucinate a trip for a place that doesn't exist.
    2. **REALISM OVER HYPE:** Provide *strictly* real execution details. 
       - Transport: Mention specific bus types (e.g., "KSRTC Airavat", "TNSTC Ultra Deluxe") or train classes (e.g., "Sleeper Class", "2S").
       - Prices: Estimate real-world costs for the current year.
    3. **FRUGAL ENGINEERING:** Your goal is to maximize the experience within the budget.
       - Suggest specific hostels, dorms, or budget guesthouses by name if possible.
       - Recommend specific local street food spots or budget messes.
    4. **BUDGET LOGIC:**
       - If the user's budget is < 500 INR/day, warn them it's extremely tight.
       - If budget < [ML_PREDICTED_BASE_COST] * 0.8, set "budget_status" to "CRITICAL".
    5. **ITINERARY:** Create a logical flow (Morning -> Afternoon -> Evening). Do not just list random activities.
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA as any,
      },
    });

    const result = await model.generateContent(prompt);

    return JSON.parse(result.response.text()) as TripPlanResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
