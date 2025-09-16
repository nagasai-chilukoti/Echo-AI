
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface ChatSession {
  id:string;
  title: string;
  messages: Message[];
}
