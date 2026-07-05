import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

export async function askGemini({ message, context }) {
  if (!env.GEMINI_API_KEY) {
    return "Gemini is not configured yet. Add GEMINI_API_KEY to server/.env to enable live AI analysis. Based on your current data, review categories with the highest monthly spend and set budgets 10-15% below recent averages.";
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
  const prompt = [
    "You are a personal finance assistant. Provide concise, practical, non-investment-advisory guidance.",
    "Use INR formatting if currency is INR. Do not claim certainty about future returns.",
    `Financial context: ${JSON.stringify(context)}`,
    `User question: ${message}`,
  ].join("\n\n");

  const result = await model.generateContent(prompt);
  return result.response.text();
}
