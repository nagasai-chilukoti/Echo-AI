import React, { useState, useRef } from 'react';
import type { ChatSession } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { CloseIcon } from './icons/CloseIcon';
import { ChatIcon } from './icons/ChatIcon';
import { SearchIcon } from './icons/SearchIcon';
import { EchoIcon } from './icons/EchoIcon';
import { SidebarCloseIcon } from './icons/SidebarCloseIcon';
import { SidebarOpenIcon } from './icons/SidebarOpenIcon';


interface SidebarProps {
  sessions: ChatSession[];
  activeId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sessions, activeId, onNewChat, onSelectChat, onDeleteChat, isSidebarOpen, onToggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    if (!isSidebarOpen) {
      onToggleSidebar();
      // Use a timeout to allow the sidebar to expand before focusing
      setTimeout(() => {
          searchInputRef.current?.focus();
      }, 300); // duration of sidebar transition
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className={`bg-gray-900/70 backdrop-blur-sm border-r border-gray-700/50 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className={`flex items-center justify-between border-b border-gray-700/50 shrink-0 h-[73px] transition-all duration-300 ${isSidebarOpen ? 'p-4' : 'px-2'}`}>
        <EchoIcon className={`text-indigo-500 transition-all duration-300 ${isSidebarOpen ? 'h-8 w-8' : 'h-7 w-7'}`} />
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors shrink-0"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
        </button>
      </div>
      
      {isSidebarOpen ? (
        <div className="p-2 flex-1 flex flex-col min-h-0">
          <button
            onClick={onNewChat}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 mb-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <PlusIcon />
            New Chat
          </button>

          <div className="relative mb-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon />
            </span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/70 border border-gray-700/60 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              aria-label="Search chat sessions"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredSessions.map(session => (
              <div
                key={session.id}
                onClick={() => onSelectChat(session.id)}
                className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  activeId === session.id ? 'bg-gray-700/50' : 'hover:bg-gray-800/70'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <ChatIcon />
                  <span className="text-sm font-medium text-gray-300 truncate">{session.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-opacity p-1 rounded-full hover:bg-gray-700"
                  aria-label="Delete chat"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <button
            onClick={onNewChat}
            className="flex items-center justify-center w-12 h-12 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            aria-label="New Chat"
          >
            <PlusIcon />
          </button>
          <button
            onClick={handleSearchClick}
            className="flex items-center justify-center w-12 h-12 bg-gray-800/70 rounded-lg text-gray-400 hover:bg-gray-700/90 hover:text-white transition-colors"
            aria-label="Search chats"
          >
            <SearchIcon />
          </button>
        </div>
      )}
    </aside>
  );
};