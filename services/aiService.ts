import { GoogleGenAI, Chat } from "@google/genai";
import { Product } from "../types";

// Initialize the client with the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const AiService = {
    // Initialize a chat session with context about the products
    createChatSession: (products: Product[]): Chat => {
        // Format product list for the AI's context
        const productContext = products.map(p =>
            `- ${p.productName} ($${p.price}): ${p.description} (ID: ${p.productId}, Sold: ${p.sold})`
        ).join('\n');

        const systemInstruction = `You are a friendly and helpful AI shopping assistant for 'SpringShop', an e-commerce demo store.
    
    Your role is to:
    1. Help users find products from our catalog based on their needs or budget.
    2. Answer questions about product features and pricing.
    3. Suggest popular items (based on 'Sold' count) or new arrivals.
    
    Here is our current Product Catalog:
    ${productContext}
    
    Guidelines:
    - ONLY recommend products listed in the catalog above.
    - If a user asks for a product we don't have, politely apologize and suggest the closest alternative from the catalog if one exists.
    - Keep your responses concise, professional, and enthusiastic.
    - Do not invent products or prices.
    - If asked about shipping, returns, or account issues, say that this is a demo application and those features are simulated.
    `;

        return ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
    },

    // Send a message to the model
    sendMessage: async (chat: Chat, message: string): Promise<string> => {
        try {
            const response = await chat.sendMessage({ message });
            return response.text || "I'm sorry, I couldn't generate a response.";
        } catch (error) {
            console.error("Error communicating with Gemini:", error);
            return "I'm having trouble connecting to the server right now. Please try again later.";
        }
    }
};