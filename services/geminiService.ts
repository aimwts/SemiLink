import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client following strict naming parameter rules
const getAI = () => {
  if (!process.env.API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateIndustryInsight = async (topic: string): Promise<string> => {
  const ai = getAI();
  if (!ai) {
    return "API Key not configured. Please set a valid API_KEY in your environment.";
  }

  try {
    const prompt = `Write a professional, engaging social media post (max 280 chars) for a LinkedIn-like platform specifically for the Semiconductor industry. 
    The topic is: "${topic}". 
    Use industry jargon correctly (e.g., specific nm nodes, yield, packaging, EDA, RTL, etc.). 
    Make it sound like an expert opinion or an exciting update. Include 2-3 relevant hashtags.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate insight.";
  } catch (error) {
    console.error("Error generating content:", error);
    return "Failed to contact the AI service. Please try again later.";
  }
};

export const polishPostContent = async (draft: string): Promise<string> => {
  const ai = getAI();
  if (!ai) {
    return draft;
  }
  try {
    const prompt = `Rewrite the following text to be more professional and suitable for a senior semiconductor engineer's social media update. Keep it under 300 characters. Text: "${draft}"`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || draft;
  } catch (error) {
    console.error("Error polishing content:", error);
    return draft;
  }
};