import { GoogleGenAI } from "@google/genai";
import { PlatformSpec, GenerationResult } from "../types";

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const adaptImage = async (
  imageFile: File,
  platform: PlatformSpec,
  customInstructions: string = ""
): Promise<GenerationResult> => {
  try {
    // 1. Check for API Key
    // Use (window as any) to access aistudio to avoid type conflicts with global definition
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }

    // 2. Initialize Client
    // Important: Initialize NEW instance to grab the fresh key if just selected
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 3. Prepare Image
    const base64Image = await fileToGenerativePart(imageFile);
    
    // 4. Construct Prompt
    // We combine the role definition and the specific task
    const prompt = `
      Act as a professional AI Graphic Designer and Image Adaptation Expert.
      
      Your task is to adapt this input image to the "${platform.name}" format (Target Size: ${platform.width}x${platform.height}px, Approx Ratio: ${platform.ratioLabel}).
      
      Strategy:
      1. Analyze the semantic elements (Subject, Text, CTA, Logo).
      2. Perform Smart Adaptation:
         - If the target is wider, use Outpainting to extend the background naturally.
         - If the target is taller, extend vertically.
         - Re-compose the layout to ensure the subject is balanced and text is readable.
         - Do NOT stretch or distort the subject.
         - Fill all space; no black/white bars.
      
      ${customInstructions ? `Additional User Instructions: ${customInstructions}` : ''}
      
      First, provide a brief "Chain of Thought" analysis explaining your design strategy (e.g., "Detected subject at center, will extend background left...").
      Then, generate the adapted image.
    `;

    // 5. Call API
    // We use gemini-3-pro-image-preview for high quality editing/generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: platform.geminiAspectRatio as any, // Cast to any to bypass strict enum checks if needed, but strictly it should be one of "1:1", "3:4", "4:3", "9:16", "16:9"
          imageSize: "1K" // Standard high quality
        }
      }
    });

    // 6. Extract Result
    let analysisText = "";
    let generatedImageUrl = "";

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          analysisText += part.text;
        }
        if (part.inlineData) {
          generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    return {
      analysis: analysisText || "Analysis completed.",
      imageUrl: generatedImageUrl
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
