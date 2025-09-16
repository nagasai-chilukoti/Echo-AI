import React, { useState, useRef, useEffect } from 'react';
import type { ChatSession } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';
import { SendIcon } from './icons/SendIcon';
import { TypingIndicator } from './TypingIndicator';
import { UserProfile } from './UserProfile';
import { EchoIcon } from './icons/EchoIcon';


interface ChatWindowProps {
  session: ChatSession | undefined;
  isBotTyping: boolean;
  onSendMessage: (text: string) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

const WelcomeScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in bg-gradient-to-br from-gray-800/50 to-gray-900/20">
        <EchoIcon className="h-24 w-24 text-indigo-500 mb-6" />
        <h1 className="text-5xl font-bold text-gray-200 mb-4">Echo AI</h1>
        <p className="text-xl text-gray-400">Your intelligent chat companion. Start a conversation to begin.</p>
    </div>
);


export const ChatWindow: React.FC<ChatWindowProps> = ({ session, isBotTyping, onSendMessage, isLoggedIn, onLoginClick, onLogout }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if(session?.messages.length || isBotTyping) {
        scrollToBottom();
    }
  }, [session?.messages, isBotTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/50">
      <header className="p-4 bg-gray-900/50 border-b border-gray-700/50 flex items-center justify-between shrink-0">
        <h2 className="text-lg font-semibold text-gray-200 truncate pr-4">Echo AI</h2>
        {isLoggedIn ? (
          <UserProfile onLogout={onLogout} />
        ) : (
          <button onClick={onLoginClick} className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors shrink-0">
            <UserIcon />
            <span>Login</span>
          </button>
        )}
      </header>

      <div className="flex-1 overflow-hidden">
        {!session ? (
          <WelcomeScreen />
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-6 overflow-y-auto">
              {session.messages.length === 0 && !isBotTyping ? (
                <WelcomeScreen />
              ) : (
                <div className="space-y-8">
                  {session.messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-4 animate-fade-in">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                        {msg.sender === 'user' ? <UserIcon /> : <BotIcon />}
                      </div>
                      <div className={`max-w-xl px-5 py-3 rounded-2xl ${
                        msg.sender === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tl-none' 
                          : 'bg-gray-700 text-gray-200 rounded-tr-none'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isBotTyping && (
                    <div className="flex items-start gap-4 animate-fade-in">
                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                         <BotIcon />
                       </div>
                       <div className="px-5 py-3 rounded-2xl bg-gray-700">
                         <TypingIndicator />
                       </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-900/50 border-t border-gray-700/50">
              <form onSubmit={handleSubmit} className="flex items-center gap-4">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Echo AI anything..."
                  className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  aria-label="Chat input"
                />
                <button 
                  type="submit" 
                  className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed transition-colors duration-200 shrink-0"
                  disabled={!inputText.trim()}
                  aria-label="Send message"
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};