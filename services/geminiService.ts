import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const chats = new Map<string, Chat>();

const getOrCreateChat = (sessionId: string): Chat => {
  if (chats.has(sessionId)) {
    return chats.get(sessionId)!;
  }

  const newChat = ai.chats.create({
    model: 'gemini-2.5-flash',
    // Optional: Add system instructions or other configs here
    // config: {
    //   systemInstruction: 'You are a helpful and friendly AI assistant named Echo.'
    // }
  });

  chats.set(sessionId, newChat);
  return newChat;
};

export const getBotResponse = async (sessionId: string, message: string): Promise<string> => {
  try {
    const chat = getOrCreateChat(sessionId);
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    // Re-throw or return a user-friendly error message
    throw new Error("Failed to communicate with the AI service.");
  }
};