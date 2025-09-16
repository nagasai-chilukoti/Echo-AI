import React, { useState, useEffect, useRef } from 'react';
import { UserIcon } from './icons/UserIcon';

interface UserProfileProps {
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsMenuOpen(prev => !prev)}
        className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
      >
        <UserIcon />
      </button>

      {isMenuOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 animate-fade-in"
          style={{ animationDuration: '0.15s' }}
        >
          <button 
            onClick={() => {
              onLogout();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};