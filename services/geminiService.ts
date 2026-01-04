
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GenerationConfig } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async performClothingSwap(
    personBase64: string,
    garmentBase64: string,
    config: GenerationConfig
  ): Promise<string> {
    const prompt = `
      TASK: Perform a high-fidelity virtual try-on / clothing swap.
      IMAGE 1: A person posing.
      IMAGE 2: A garment to be fitted onto the person in Image 1.
      
      INSTRUCTIONS:
      1. Detect the person in Image 1 and the garment in Image 2.
      2. Remove the existing upper-body clothing from the person in Image 1.
      3. Fit the garment from Image 2 naturally onto the person's body.
      4. FIT STYLE: ${config.fit}.
      5. SLEEVE STYLE: ${config.sleeve}.
      6. REALISM LEVEL: ${config.realism * 100}%.
      7. CRITICAL: Preserve the person's identity (face, hair, skin tone), original pose, and the original background perfectly.
      8. Synthesize realistic fabric folds, shadows, and lighting based on the environment in Image 1.
      9. ${config.colorCorrection ? "Perform advanced color matching to ensure the garment matches the scene lighting." : ""}
      
      Output ONLY the final edited image.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: personBase64 } },
            { inlineData: { mimeType: 'image/jpeg', data: garmentBase64 } },
            { text: prompt }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4"
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
        throw new Error("Model failed to generate an image output.");
      }

      return imageUrl;
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
