
// Updated Gemini Service to handle multi-category swapping, custom colors, and background changes.
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GenerationConfig, GarmentCategory } from "../types";

export class GeminiService {
  async performClothingSwap(
    personBase64: string,
    garmentBase64: string,
    config: GenerationConfig
  ): Promise<string> {
    // Initialize GoogleGenAI right before the API call for latest key usage.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const isPro = config.engine === 'pro';
    const modelName = isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

    const activeCategories = config.category.join(', ');

    const prompt = `
      TASK: Perform a professional high-fidelity multi-item virtual swap.
      
      STUDIO CONFIGURATION:
      - ACTIVE CATEGORIES: ${activeCategories}
      - TARGET COLOR FOR ITEMS: ${config.targetColor || 'Match Image 2 exactly'}
      - TOP FIT STYLE: ${config.fit}
      - TOP SLEEVE TYPE: ${config.category.includes(GarmentCategory.TOP) ? config.sleeve : 'N/A'}
      - ENVIRONMENT: ${config.backgroundPrompt || 'Keep Original Background from Image 1'}
      - REALISM THRESHOLD: ${config.realism * 100}%
      
      ${isPro && config.customPrompt ? `ARTISTIC DIRECTION: ${config.customPrompt}` : ""}

      CORE DIRECTIVES:
      1. Image 1 is the subject. Maintain their face, skin tone, skeletal pose, and core identity exactly.
      2. Image 2 contains the target items. Identify and extract the ${activeCategories} from Image 2.
      3. Swapping logic (Apply for all selected categories):
         - If TOP in selection: Replace existing upper garment with item from Image 2.
         - If BOTTOM in selection: Replace existing lower garment with item from Image 2.
         - If SHOES in selection: Replace footwear with item from Image 2.
         - If HEADWEAR in selection: Place the item from Image 2 naturally on the head.
         - If ACCESSORY in selection: Integrate the item (bag, glasses, etc.) into the pose naturally.
      4. Color Consistency: Force all swapped items to be ${config.targetColor || 'the colors seen in Image 2'}.
      5. Background: ${config.backgroundPrompt ? `REPLACE the entire background with: ${config.backgroundPrompt}` : 'Preserve the background from Image 1.'}
      6. Coherence: Ensure the lighting on the newly added items matches the environment perfectly.
      
      Output ONLY the final synthesized image.
    `;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
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
            const base64EncodeString: string = part.inlineData.data;
            imageUrl = `data:image/png;base64,${base64EncodeString}`;
            break;
          }
        }
      }

      if (!imageUrl) {
        throw new Error("The Studio Engine failed to synthesize the asset.");
      }

      return imageUrl;
    } catch (error: any) {
      console.error("Studio AI Error:", error);
      if (error.message?.includes("Requested entity was not found") && isPro) {
        throw new Error("API_KEY_MISSING");
      }
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
