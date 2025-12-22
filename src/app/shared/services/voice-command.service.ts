import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

@Injectable({ providedIn: 'root' })
export class VoiceCommandService {
  private recognition: SpeechRecognition | null = null;
  private listeningSubject = new BehaviorSubject<boolean>(false);
  private transcriptSubject = new Subject<string>();

  listening$ = this.listeningSubject.asObservable();
  transcript$ = this.transcriptSubject.asObservable();

  isSupported(): boolean {
    return typeof window !== 'undefined' && !!this.getRecognitionConstructor();
  }

  start(): void {
    const Recognition = this.getRecognitionConstructor();
    if (!Recognition || this.listeningSubject.value) {
      return;
    }

    if (!this.recognition) {
      this.recognition = new Recognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          if (!result.isFinal) {
            continue;
          }
          const transcript = result[0]?.transcript?.trim();
          if (transcript) {
            this.transcriptSubject.next(transcript);
          }
        }
      };

      this.recognition.onerror = () => {
        this.listeningSubject.next(false);
      };

      this.recognition.onend = () => {
        this.listeningSubject.next(false);
      };
    }

    this.recognition.start();
    this.listeningSubject.next(true);
  }

  stop(): void {
    if (!this.recognition || !this.listeningSubject.value) {
      return;
    }
    this.recognition.stop();
    this.listeningSubject.next(false);
  }

  private getRecognitionConstructor(): SpeechRecognitionConstructor | null {
    const browserWindow = window as Window & {
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
      SpeechRecognition?: SpeechRecognitionConstructor;
    };
    return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
  }
}
