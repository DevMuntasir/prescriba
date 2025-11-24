import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: environment.geminiApiKey });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: {
            parts: [{
              text: `You are an expert medical assistant for doctors. Your goal is to provide rapid, precise clinical information.

Audience: Doctors. Assume high medical literacy.
Tone: Professional, clinical, concise. 'Doctor-to-Doctor'.
Format: Bullet points, exact dosages, interactions. No conversational filler.
Constraint: Do not provide general patient advice. Stick to high-level medical terminology.` }]
          }
        },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      return response.text || 'No response text found.';
    } catch (error) {
      console.error('Error generating text:', error);
      return 'Sorry, I encountered an error while processing your request.';
    }
  }
}
