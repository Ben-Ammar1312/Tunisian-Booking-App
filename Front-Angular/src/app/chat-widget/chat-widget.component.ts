// src/app/chat-widget/chat-widget.component.ts
import { Component }   from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { DarnaAiService } from '../Services/darna-ai.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './chat-widget.component.html',
  styleUrls:   ['./chat-widget.component.css']
})
export class ChatWidgetComponent {
  isOpen   = false;
  input    = '';
  messages: Array<{ from: 'user'|'bot'; text: string }> = [];

  constructor(private ai: DarnaAiService) {}

  toggleOpen() {
    this.isOpen = !this.isOpen;
    // if we just opened AND it's our first time, push a greeting
    if (this.isOpen && this.messages.length === 0) {
      this.messages.push({
        from: 'bot',
        text: "Bonjour ! Je suis DarnaBot, votre assistant de location. Comment puis‑je vous aider aujourd'hui ?"
      });
      this.scrollToBottom();
    }

  }


  async send() {
    const text = this.input.trim();
    if (!text) return;

    // 1) show what the user wrote
    this.messages.push({ from: 'user', text });
    this.input = '';

    try {
      // 2) call your /api/chat as plain text
      const reply = await this.ai.chat(text).toPromise();
      this.messages.push({
        from: 'bot',
        text: reply !== undefined ? reply : '(no answer)'
      });      this.scrollToBottom();
    } catch (err) {
      console.error(err);
      this.messages.push({ from: 'bot', text: 'Désolé, une erreur est survenue.' });
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const el = document.querySelector('.chat-body');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }


}
