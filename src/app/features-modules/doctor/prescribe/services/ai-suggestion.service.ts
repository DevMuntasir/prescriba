import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AiSuggestedItem {
  label: string;
  value?: number;
  generic?: string;
  strength?: string;
  form?: string;
  reason?: string;
  defaultDose?: string;
  defaultDuration?: string;
  defaultMeal?: string;
}

interface AiSuggestionResponse {
  suggested: AiSuggestedItem[];
}

@Injectable({
  providedIn: 'root',
})
export class AiSuggestionService {
  private geminiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private backendUrl = `${environment.apiBaseUrl}/ai/medication-suggest`;

  constructor(private http: HttpClient) {}

  suggest(payload: {
    query: string;
    context: Record<string, unknown>;
  }): Observable<AiSuggestedItem[]> {
    if (environment.useBackendAi) {
      return this.http
        .post<AiSuggestionResponse>(this.backendUrl, payload)
        .pipe(map((res) => res?.suggested ?? []), catchError(() => of([])));
    }

    return this.callGemini(payload.query, payload.context);
  }

  private callGemini(
    query: string,
    context: Record<string, unknown>
  ): Observable<AiSuggestedItem[]> {
    const prompt = this.buildPrompt(query, context);
    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    };

    return this.http
      .post<any>(`${this.geminiUrl}?key=${environment.geminiApiKey}`, body)
      .pipe(
        map((response) => this.extractSuggestions(response)),
        catchError(() => of([]))
      );
  }

  private buildPrompt(query: string, context: Record<string, unknown>): string {
    return [
      'You are assisting a doctor by suggesting medications.',
      'Return ONLY a JSON array of objects with keys: label, value, generic, strength, form, reason, defaultDose, defaultDuration, defaultMeal.',
      'Do not include any extra commentary or code fences.',
      'Each item label should be a brand or medication name.',
      `Doctor query: ${query || 'n/a'}.`,
      `Context: ${JSON.stringify(context)}.`,
      'If unsure, return an empty JSON array [].',
    ].join(' ');
  }

  private extractSuggestions(response: any): AiSuggestedItem[] {
    const candidates = response?.candidates ?? [];
    const textParts = candidates
      .flatMap((candidate: any) => candidate?.content?.parts ?? [])
      .map((part: any) => part?.text)
      .filter(Boolean);

    const combinedText = textParts.join('\n');
    const jsonText = this.extractJsonArray(combinedText);

    try {
      const parsed = JSON.parse(jsonText ?? '[]');
      return Array.isArray(parsed) ? (parsed as AiSuggestedItem[]) : [];
    } catch (error) {
      return [];
    }
  }

  private extractJsonArray(text: string | undefined): string | undefined {
    if (!text) return undefined;

    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');

    if (start !== -1 && end !== -1 && end > start) {
      return text.slice(start, end + 1);
    }

    return text;
  }
}
