'use client';

import { useEffect, useState } from 'react';

interface GameCommentaryProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export default function GameCommentary({ message, type = 'info', duration = 3000 }: GameCommentaryProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-100 dark:bg-green-900',
    error: 'bg-red-100 dark:bg-red-900',
    info: 'bg-blue-100 dark:bg-blue-900'
  }[type];

  const textColor = {
    success: 'text-green-800 dark:text-green-100',
    error: 'text-red-800 dark:text-red-100',
    info: 'text-blue-800 dark:text-blue-100'
  }[type];

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg ${bgColor} ${textColor} transition-all duration-300`}>
      {message}
    </div>
  );
} 