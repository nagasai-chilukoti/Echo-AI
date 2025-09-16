import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { LoginModal } from './components/LoginModal';
import type { ChatSession, Message } from './types';
import { getBotResponse } from './services/geminiService';

const App: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const createNewChatSession = useCallback(() => {
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      messages: [],
      title: 'New Chat'
    };
    return newSession;
  }, []);
  
  useEffect(() => {
    try {
      const savedLoginStatus = localStorage.getItem('isLoggedIn');
      if (savedLoginStatus === 'true') {
        setIsLoggedIn(true);
      }

      const savedSessions = localStorage.getItem('chatSessions');
      const savedActiveId = localStorage.getItem('activeChatId');
      
      if (savedSessions) {
        const parsedSessions: ChatSession[] = JSON.parse(savedSessions);
        if (parsedSessions.length > 0) {
          setChatSessions(parsedSessions);
          setActiveChatId(savedActiveId ?? parsedSessions[0].id);
        } else {
          const newSession = createNewChatSession();
          setChatSessions([newSession]);
          setActiveChatId(newSession.id);
        }
      } else {
        const newSession = createNewChatSession();
        setChatSessions([newSession]);
        setActiveChatId(newSession.id);
      }
    } catch (error) {
        console.error("Failed to load from local storage", error);
        const newSession = createNewChatSession();
        setChatSessions([newSession]);
        setActiveChatId(newSession.id);
    }
  }, [createNewChatSession]);

  useEffect(() => {
    try {
        if (chatSessions.length > 0) {
            localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
        } else {
            localStorage.removeItem('chatSessions');
        }
        if (activeChatId) {
            localStorage.setItem('activeChatId', activeChatId);
        } else {
             localStorage.removeItem('activeChatId');
        }
    } catch(error) {
        console.error("Failed to save to local storage", error);
    }
  }, [chatSessions, activeChatId]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };
  
  const handleNewChat = () => {
    const activeChat = chatSessions.find(session => session.id === activeChatId);
    if (activeChat && activeChat.messages.length > 0) {
      const newSession = createNewChatSession();
      setChatSessions(prev => [newSession, ...prev]);
      setActiveChatId(newSession.id);
    } else if (!activeChat) {
      const newSession = createNewChatSession();
      setChatSessions(prev => [newSession, ...prev]);
      setActiveChatId(newSession.id);
    } else {
        setActiveChatId(activeChat.id);
    }
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
  };
  
  const handleDeleteChat = (id: string) => {
    setChatSessions(prev => {
        const remainingSessions = prev.filter(session => session.id !== id);
        if (remainingSessions.length === 0) {
            const newSession = createNewChatSession();
            setActiveChatId(newSession.id);
            return [newSession];
        }

        if (activeChatId === id) {
            setActiveChatId(remainingSessions[0].id);
        }
        return remainingSessions;
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!activeChatId) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setChatSessions(prev =>
      prev.map(session => {
        if (session.id === activeChatId) {
          const updatedMessages = [...session.messages, userMessage];
          const newTitle = session.messages.length === 0 ? text.substring(0, 30) + (text.length > 30 ? '...' : '') : session.title;
          return { ...session, messages: updatedMessages, title: newTitle };
        }
        return session;
      })
    );
    
    setIsBotTyping(true);
    try {
      const botResponseText = await getBotResponse(activeChatId, text);
      const botMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

      setChatSessions(prev =>
        prev.map(session =>
          session.id === activeChatId
            ? { ...session, messages: [...session.messages, botMessage] }
            : session
        )
      );
    } catch (error) {
      console.error("Error getting bot response:", error);
      const errorMessage: Message = {
        id: `msg-err-${Date.now()}`,
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setChatSessions(prev =>
        prev.map(session =>
          session.id === activeChatId
            ? { ...session, messages: [...session.messages, errorMessage] }
            : session
        )
      );
    } finally {
      setIsBotTyping(false);
    }
  };

  const activeChat = chatSessions.find(session => session.id === activeChatId);

  return (
    <div className="flex h-screen font-sans text-white bg-gray-900">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
      <Sidebar
        sessions={chatSessions}
        activeId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />
      <main className="flex-1 flex flex-col bg-gray-800/50">
        <ChatWindow
          key={activeChatId} 
          session={activeChat}
          isBotTyping={isBotTyping}
          onSendMessage={handleSendMessage}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
        />
      </main>
    </div>
  );
};

export default App;