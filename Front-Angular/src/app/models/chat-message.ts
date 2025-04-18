export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatRequest {
  userInput: string;
  topK?: number;
}

export interface ChatResponse {
  reply: string;
}
