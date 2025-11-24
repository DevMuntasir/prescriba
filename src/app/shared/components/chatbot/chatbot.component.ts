import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from './gemini.service';
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
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = false;
  userInput = '';
  messages: Message[] = [
    { text: 'Hello! How can I help you today?', sender: 'agent', timestamp: new Date() }
  ];
  isTyping = false;

  constructor(private geminiService: GeminiService) { }

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

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg = this.userInput;
    this.messages.push({ text: userMsg, sender: 'user', timestamp: new Date() });
    this.userInput = '';
    this.isTyping = true;

    try {
      const response = await this.geminiService.generateText(userMsg);
      this.messages.push({ text: response, sender: 'agent', timestamp: new Date() });
    } catch (error) {
      this.messages.push({ text: 'Sorry, something went wrong.', sender: 'agent', timestamp: new Date() });
    } finally {
      this.isTyping = false;
    }
  }
}
