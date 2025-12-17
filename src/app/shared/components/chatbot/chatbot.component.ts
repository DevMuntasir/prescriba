import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService, GeminiContent } from './gemini.service';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

interface Message {
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements AfterViewChecked {
  private readonly welcomeMessage = 'Hello! How can I help you today?';
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = false;
  userInput = '';
  messages: Message[] = [this.createAgentMessage(this.welcomeMessage)];

  isTyping = false;

  constructor(private geminiService: GeminiService) { }

  private createAgentMessage(text: string): Message {
    return { text, sender: 'agent', timestamp: new Date() };
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  startNewConversation() {
    this.messages = [this.createAgentMessage(this.welcomeMessage)];
    this.userInput = '';
    this.isTyping = false;
  }

  clearChatHistory() {
    this.messages = [];
    this.userInput = '';
    this.isTyping = false;
  }

  private buildConversationPayload(): GeminiContent[] {
    return this.messages
      .filter((message) => {
        if (!message.text?.trim()) return false;
        if (message.sender === 'agent' && message.text === this.welcomeMessage) {
          return false;
        }

        return true;
      })
      .map((message) => ({
        role: message.sender === 'user' ? 'user' : 'model',
        parts: [{ text: message.text }]
      }));
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg = this.userInput;
    this.messages.push({ text: userMsg, sender: 'user', timestamp: new Date() });
    const payloadContents = this.buildConversationPayload();

    this.userInput = '';
    this.isTyping = true;
    this.messages.push({ text: '', sender: 'agent', timestamp: new Date() });
    const currentMessageIndex = this.messages.length - 1;

    this.geminiService.generateStream(payloadContents).subscribe({
      next: (chunk) => {
        this.isTyping = false;
        this.messages[currentMessageIndex].text += chunk;
        // Force change detection or scroll if needed, though Angular usually handles this.
        // We might need to trigger scroll manually.
        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: (err) => {
        this.isTyping = false;
        this.messages[currentMessageIndex].text = 'Sorry, something went wrong.';
        console.error(err);
      },
      complete: () => {
        this.isTyping = false;
      }
    });
  }

}






