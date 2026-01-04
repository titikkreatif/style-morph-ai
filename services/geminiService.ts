
import { GoogleGenAI } from "@google/genai";
import { GenerationConfig } from "../types";

export class GeminiService {
  async performClothingSwap(
    personBase64: string,
    garmentBase64: string,
    config: GenerationConfig
  ): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const isPro = config.engine === 'pro';
    const modelName = isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

    const prompt = `
      TASK: Perform a high-fidelity virtual try-on and clothing swap.
      ${isPro && config.customPrompt ? `PRIMARY CREATIVE DIRECTION: ${config.customPrompt}` : "Goal: Naturally fit the garment onto the subject."}
      
      TECHNICAL SPECS:
      - FIT STYLE: ${config.fit}
      - SLEEVE TYPE: ${config.sleeve}
      - REALISM THRESHOLD: ${config.realism * 100}%
      - COLOR CALIBRATION: ${config.colorCorrection ? "Enabled" : "Disabled"}
      
      CORE CONSTRAINTS:
      1. Use Image 1 as the source subject. Maintain their face and core identity.
      2. Use Image 2 as the source garment. Map its texture onto the subject in Image 1.
      3. Lighting must be consistent.
      
      Output ONLY the final synthesized image.
    `;

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: personBase64 } },
            { inlineData: { mimeType: 'image/jpeg', data: garmentBase64 } }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4",
            ...(isPro ? { imageSize: "1K" } : {})
          }
        }
      });

      let imageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!imageUrl) {
        throw new Error("The AI engine failed to return an image.");
      }

      return imageUrl;
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      if (error.message?.includes("Requested entity was not found") && isPro) {
        throw new Error("API_KEY_MISSING");
      }
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
