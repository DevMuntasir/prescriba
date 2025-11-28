import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: environment.geminiApiKey });
    this.initializeChat();
  }

  private initializeChat() {
    this.chatSession = this.ai.chats.create({
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
      history: []
    });
  }

  generateStream(prompt: string): Observable<string> {
    return new Observable(observer => {
      this.chatSession.sendMessageStream({
        message: prompt
      }).then(async (result: any) => {
        for await (const chunk of result) {
          const text = chunk.text;
          if (text) {
            observer.next(text);
          }
        }
        observer.complete();
      }).catch((error: any) => {
        observer.error(error);
      });
    });
  }
}
