
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
    transport_options: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.STRING },
          name: { type: SchemaType.STRING },
          cost: { type: SchemaType.STRING },
          duration: { type: SchemaType.STRING },
          comfort_rating: { type: SchemaType.STRING }
        },
        required: ["type", "name", "cost", "duration", "comfort_rating"]
      }
    },
    itinerary: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          time: { type: SchemaType.STRING },
          activity: { type: SchemaType.STRING },
          cost: { type: SchemaType.STRING, description: "Estimated cost for this specific activity (e.g., '₹95', '₹200', 'Free')" },
          cost_saving_tip: { type: SchemaType.STRING }
        },
        required: ["time", "activity", "cost_saving_tip"]
      }
    },
    local_pro_tip: { type: SchemaType.STRING }
  },
  required: ["trip_summary", "budget_status", "ml_comparison", "transport_options", "cost_breakdown", "itinerary", "local_pro_tip"]
};

import { PlaceResult } from './googleMapsService';




const MODELS_TO_TRY = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-2.0-flash-lite"
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateTripPlan = async (
  query: string,
  mlBaseCost: number,
  transportType: 'Train' | 'Bus' | 'Flight' | 'Any' = 'Any',
  realHotels: PlaceResult[] = [],
  realAttractions: PlaceResult[] = [],
  realRestaurants: PlaceResult[] = [],
  budgetBreakdown?: { transport?: number; stay?: number; food?: number; activities?: number }
): Promise<TripPlanResponse> => {
  const budgetInstructions = budgetBreakdown
    ? `\n    [CUSTOM_BUDGET_ALLOCATION]:\n    - Transport: ₹${budgetBreakdown.transport || 0}\n    - Stay: ₹${budgetBreakdown.stay || 0}\n    - Food: ₹${budgetBreakdown.food || 0}\n    - Activities: ₹${budgetBreakdown.activities || 0}\n    **CRITICAL**: You MUST respect these custom budget allocations. Do not exceed the specified amount for each category.`
    : '';

  const prompt = `
    You are the "Agentic Wander Intelligence Engine," a highly accurate and frugal travel coordinator.
    
    [USER_QUERY]: ${query}
    [ML_PREDICTED_BASE_COST]: ${mlBaseCost} INR
    [PREFERRED_TRANSPORT_MODE]: ${transportType}
    
    [REAL_HOTELS_FOUND]: ${JSON.stringify(realHotels.map(h => `${h.name} (Rating: ${h.rating}, Price Level: ${h.price_level})`))}
    [REAL_ATTRACTIONS_FOUND]: ${JSON.stringify(realAttractions.map(a => `${a.name} (Rating: ${a.rating})`))}
    [REAL_RESTAURANTS_FOUND]: ${JSON.stringify(realRestaurants.map(r => `${r.name} (Rating: ${r.rating}, Price Level: ${r.price_level})`))}
${budgetInstructions}

    CRITICAL INSTRUCTIONS:
    ${budgetBreakdown ? `
    0. **CUSTOM BUDGET ALLOCATION - HIGHEST PRIORITY:**
       - The user has specified EXACT budget allocations for each category.
       - You MUST use these EXACT values in the "cost_breakdown" field:
         * "transport": "₹${budgetBreakdown.transport || 0}"
         * "stay": "₹${budgetBreakdown.stay || 0}"
         * "food": "₹${budgetBreakdown.food || 0}"
         * "activities": "₹${budgetBreakdown.activities || 0}"
       - DO NOT calculate your own values. Use the user's specified amounts EXACTLY.
       - Plan the itinerary to fit within these specific allocations.
    ` : ''}
    1. **VERIFY THE LOCATION:** If the [USER_QUERY] contains a fake, nonsense, or ambiguous location (e.g., "Xyzabc", "RandomPlace123"), IMMEDIATELY return a plan where "trip_summary" starts with "⚠️ LOCATION UNKNOWN:" followed by a suggestion to check the spelling. Do NOT Hallucinate a trip for a place that doesn't exist.
    2. **REALISM OVER HYPE:** Provide *strictly* real execution details. 
       - Transport: You MUST prioritize the [PREFERRED_TRANSPORT_MODE] if it is not "Any".
         - If "Train", suggest specific trains (e.g., "Shatabdi Express", "Vande Bharat").
         - If "Bus", suggest operators (e.g., "KSRTC Airavat", "VRL Travels").
         - If "Flight", suggest airlines.
       - Prices: Estimate real-world costs for the current year.
    3. **TRANSPORT OPTIONS:** Provide a comparison of available options, but highlight the preferred mode.
    4. **FRUGAL ENGINEERING:** Your goal is to maximize the experience within the budget.
       - Suggest specific hostels, dorms, or budget guesthouses. **PRIORITIZE using names from [REAL_HOTELS_FOUND] if they fit the budget.**
       - Recommend specific local street food spots or budget messes. **PRIORITIZE using names from [REAL_RESTAURANTS_FOUND] for Lunch/Dinner.**
    5. **BUDGET LOGIC:**
       - If the user's budget is < 500 INR/day, warn them it's extremely tight.
       - If budget < [ML_PREDICTED_BASE_COST] * 0.8, set "budget_status" to "CRITICAL".
    6. **ITINERARY:** Create a logical flow (Morning -> Afternoon -> Evening). 
       - **PRIORITIZE using names from [REAL_ATTRACTIONS_FOUND] for activities.**
     7. **INDIVIDUAL ACTIVITY COSTS:**
       - For EACH itinerary item, provide a specific "cost" field showing the estimated expense for that activity.
       - Examples: "₹95" for bus fare, "₹200" for hostel per night, "₹70" for a meal, "Free" for free attractions.
       - Be specific and realistic with costs. Break down expenses clearly.
    8. **ACTIVITY NAMES FOR MAPS:**
       - The "activity" field MUST be the EXACT name of the place or activity.
       - DO NOT include verbs like "Visit", "Explore", "Travel to".
       - DO NOT include descriptions.
       - BAD: "Visit the beautiful Botanical Garden"
       - GOOD: "Botanical Garden"
       - This is critical for map integration.
  `;

  let lastError: any = null;

  // Try each model with retry logic
  for (const modelName of MODELS_TO_TRY) {
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempting to generate plan with model: ${modelName} (attempt ${attempt + 1}/${maxRetries + 1})`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA as any,
          },
        });

        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text()) as TripPlanResponse;

      } catch (error: any) {
        console.warn(`Model ${modelName} failed (attempt ${attempt + 1}):`, error);
        lastError = error;

        // Check if it's a retryable error (503, 429, quota)
        const is503 = error?.message?.includes('503') || error?.status === 503;
        const isQuota = error?.message?.includes('429') || error?.status === 429 ||
          error?.message?.toLowerCase().includes('quota') ||
          error?.message?.toLowerCase().includes('resource_exhausted');

        // Retry same model for 503 errors
        if (is503 && attempt < maxRetries) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000); // Exponential backoff, max 5s
          console.log(`503 error - Retrying after ${waitTime}ms...`);
          await sleep(waitTime);
          continue; // Retry same model
        }

        // For quota errors, immediately try next model (don't retry same model)
        if (isQuota) {
          console.log(`Quota/429 error - Switching to next model...`);
          break; // Try next model
        }

        // Otherwise, break and try next model
        break;
      }
    }
  }

  // If we exhaust all models
  console.error("All Gemini models failed. Last error:", lastError);
  throw new Error(
    lastError?.message?.includes('503')
      ? "The AI service is currently experiencing high demand. Please try again in a moment."
      : (lastError?.message?.includes('quota') || lastError?.message?.includes('429'))
        ? "API quota exceeded. All available models exhausted. Please check your Gemini API billing at https://ai.google.dev/"
        : lastError?.message || "Failed to generate trip plan"
  );
};
