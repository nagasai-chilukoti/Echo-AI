import React from 'react';

export const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full dot-bounce"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full dot-bounce"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full dot-bounce"></div>
  </div>
);