import React from 'react';

export const EchoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={0.5}
  >
    <circle cx="12" cy="12" r="3" strokeOpacity="1" />
    <circle cx="12" cy="12" r="6" strokeOpacity="0.7" />
    <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
  </svg>
);