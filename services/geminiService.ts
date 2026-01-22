
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Ward, MitigationPlan, GroundingChunk, AtmosphericPrediction, SourceAttribution } from "../types";

/**
 * Generates decision-support mitigation insights for the dashboard.
 */
export const getMitigationInsight = async (cityAqi: number, dominant: string): Promise<{ text: string; confidence: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform environmental decision-support analysis for Delhi NCT.
                Current Integrated AQI: ${cityAqi}
                Dominant Pollutant: ${dominant}
                
                Task: Generate a concise mitigation insight. 
                Focus on area-based or industry-based interventions. 
                Rules: 
                - Neutral, factual, institutional tone.
                - No generic public advice.
                - Max 2 short paragraphs.
                - Include a confidence tag (High, Medium, or Experimental).
                - Use "Decision Support" framing.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            confidence: { type: Type.STRING }
          },
          required: ["text", "confidence"]
        }
      }
    });
    const text = response.text;
    return text ? JSON.parse(text.trim()) : { text: "Monitoring environmental variables...", confidence: "Medium" };
  } catch (error) {
    return { text: "Decision support node is recalibrating.", confidence: "Low" };
  }
};

export const getAssistantResponse = async (query: string, currentAqi: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the PureAir Intelligence Assistant for Delhi. 
                Context: Current City Average AQI is ${currentAqi}. 
                User asks: "${query}"
                Rules: 
                1. Short, calm, professional tone. 
                2. No medical diagnosis. 
                3. Explain AQI/PM2.5 if asked. 
                4. Focus on prevention and trust. 
                5. Keep response under 60 words.`,
    });
    return response.text || "I'm currently recalibrating my atmospheric nodes. Please try again shortly.";
  } catch (error) {
    return "Intelligence service is momentarily throttled. Stay safe and monitor official advisories.";
  }
};

export const getSourceAttribution = async (ward: Ward): Promise<SourceAttribution> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the environmental data for ${ward.name} ward in Delhi.
                AQI: ${ward.aqi}
                Pollutants: PM2.5(${ward.pollutants.pm25}), PM10(${ward.pollutants.pm10}), NO2(${ward.pollutants.no2}), CO(${ward.pollutants.co})
                Weather: Wind Speed ${ward.windSpeed} km/h, Humidity ${ward.humidity}%
                Context: Region ${ward.region}, Zone ${ward.zone}
                
                Identify the primary and secondary pollution sources. Use probabilistic attribution.
                Rules: 
                - Dominant source type must be one of: vehicular, industrial, construction, biomass, regional.
                - Reasoning must explain WHY based on the pollutant ratios (e.g., PM2.5/PM10 ratio, NO2 spikes).
                - Confidence Score: 0-100.
                - Social snippet: Max 100 characters.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dominantSource: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['vehicular', 'industrial', 'construction', 'biomass', 'regional'] },
                confidence: { type: Type.INTEGER }
              },
              required: ['label', 'type', 'confidence']
            },
            secondarySources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  weight: { type: Type.INTEGER }
                },
                required: ['label', 'weight']
              }
            },
            reasoning: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            socialSnippet: { type: Type.STRING },
            confidenceScore: { type: Type.INTEGER }
          },
          required: ['dominantSource', 'secondarySources', 'reasoning', 'socialSnippet', 'confidenceScore']
        }
      }
    });
    const text = response.text;
    return text ? JSON.parse(text.trim()) : null;
  } catch (error) {
    console.error("Source Attribution Failure", error);
    throw error;
  }
};

export const getAqiForecast = async (currentAqi: number, trendSlope: number): Promise<AtmosphericPrediction[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // We use gemini-3-pro-preview for complex temporal reasoning and grounding
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a government-grade atmospheric projection for Delhi NCT.
                Current integrated average AQI: ${currentAqi}.
                Identified Trend Slope: ${trendSlope.toFixed(2)} AQI units/hour change.
                
                Task:
                1. Use Google Search to find current Delhi AQI news, GRAP stage bulletins, and weather/wind forecasts for the next 72 hours.
                2. Apply the mathematical trend projection (predictedAQI = currentAQI + trendSlope * hours).
                3. Refine the mathematical model using search grounding (e.g., if a construction ban was just announced, lower the predicted values).
                
                Return a JSON array of 3 predictions (24, 48, 72 hours).`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hours: { type: Type.INTEGER },
              aqi: { type: Type.INTEGER },
              primaryPollutant: { type: Type.STRING },
              riskLevel: { type: Type.STRING, enum: ["Extreme", "High", "Medium", "Low"] },
              confidence: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["hours", "aqi", "primaryPollutant", "riskLevel", "confidence", "explanation"]
          }
        }
      }
    });
    const text = response.text;
    return text ? JSON.parse(text.trim()) : [];
  } catch (error) {
    console.error("Forecast Retrieval Failure", error);
    // Fallback logic using the provided formula
    return [24, 48, 72].map(h => {
      const predicted = Math.max(0, Math.round(currentAqi + trendSlope * h));
      return {
        hours: h,
        aqi: predicted,
        primaryPollutant: "PM2.5",
        riskLevel: predicted > 300 ? "Extreme" : predicted > 200 ? "High" : "Medium",
        confidence: 65,
        explanation: `Linear projection based on current slope (${trendSlope.toFixed(2)} units/hr).`
      } as AtmosphericPrediction;
    });
  }
};

export const getMitigationPlan = async (ward: Ward): Promise<MitigationPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, professional environmental mitigation plan for Delhi's ${ward.name} ward. 
                Current AQI: ${ward.aqi} (${ward.status}). 
                Primary Source: ${ward.primarySource}.
                Structure the output as a JSON with summary, steps (array of 3-4 items), and priority (High, Medium, Low).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            steps: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            priority: { 
              type: Type.STRING,
              description: "Priority of the plan: High, Medium, or Low"
            }
          },
          propertyOrdering: ["summary", "steps", "priority"]
        }
      }
    });
    const text = response.text;
    const data = text ? JSON.parse(text.trim()) : {};
    return {
      summary: data.summary || "Awaiting detailed analysis...",
      steps: data.steps || ["Implement dust control measures", "Enhance public transport usage"],
      priority: (data.priority as 'High' | 'Medium' | 'Low') || 'Medium'
    };
  } catch (error) {
    return {
      summary: "Local analysis recommends immediate reduction in vehicular traffic.",
      steps: ["Enforce odd-even rules", "Halt construction"],
      priority: 'High'
    };
  }
};

export const analyzeAtmosphereImage = async (base64Image: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          { text: "Act as an environmental enforcement officer in Delhi. Analyze this image for violations (stubble burning, open waste burning, construction dust without covers). Provide a structured report: 1. Violation Identified 2. Severity (1-10) 3. Recommended Fine/Action according to GRAP rules." },
        ],
      },
    });
    return response.text || "No violation detected in visual feed.";
  } catch (error) {
    return "Intelligence node timeout. Please try again.";
  }
};

export const getSimulationReport = async (ward: Ward, hours: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Simulate the atmospheric profile for ${ward.name} ward in Delhi ${hours} hours from now. 
                Current status: ${ward.aqi} AQI. Consider typical Delhi diurnal patterns, traffic spikes, and wind direction. 
                Keep it under 50 words, professional and technical.`,
    });
    return response.text || "Simulation stable.";
  } catch (error) {
    return "Projection engine offline.";
  }
};

export const getLiveGovUpdates = async (): Promise<{ text: string; sources: GroundingChunk[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "What are the current Stage of GRAP active in Delhi today? List any new bans on construction or diesel vehicles announced in the last 24 hours.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return {
      text: response.text || "Standard protocols active.",
      sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [],
    };
  } catch (error) {
    return { text: "Standard GRAP 3 protocols remain active.", sources: [] };
  }
};

export const getNearbySafeZones = async (lat: number, lng: number): Promise<{ text: string; sources: GroundingChunk[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find 3 large public parks or indoor 'Clean Air Hubs' within 5km of this location in Delhi. Suggest a 'Safe Breathing Route'.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      },
    });
    return {
      text: response.text || "Searching for safe havens...",
      sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [],
    };
  } catch (error) {
    return { text: "Locating nearest parks manually...", sources: [] };
  }
};
