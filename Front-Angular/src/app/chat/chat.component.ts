import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../Services/chat.service';
import { ChatMessage } from '../models/chat-message';
import {NgClass} from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass,CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: ChatMessage[] = [
    { role: 'assistant', text: 'Bonjour ! Comment puis‑je vous aider aujourd’hui ?' }
  ];
  draft = '';

  constructor(private chatSvc: ChatService) {}

  send() {
    const text = this.draft.trim();
    if (!text) return;

    // append user message
    this.messages.push({ role: 'user', text });
    this.draft = '';

    // call backend
    this.chatSvc.sendMessage(text).subscribe({
      next: res => {
        this.messages.push({ role: 'assistant', text: res.reply });
      },
      error: err => {
        console.error(err);
        this.messages.push({ role: 'assistant', text: 'Désolé, une erreur est survenue.' });
      }
    });
  }
}
