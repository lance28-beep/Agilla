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
    success: 'bg-green-100/90 dark:bg-green-900/80',
    error: 'bg-red-100/90 dark:bg-red-900/80',
    info: 'bg-blue-100/90 dark:bg-blue-900/80'
  }[type];

  const textColor = {
    success: 'text-green-800 dark:text-green-100',
    error: 'text-red-800 dark:text-red-100',
    info: 'text-blue-800 dark:text-blue-100'
  }[type];

  const borderColor = {
    success: 'border-green-300 dark:border-green-700',
    error: 'border-red-300 dark:border-red-700',
    info: 'border-blue-300 dark:border-blue-700'
  }[type];

  return (
    <div className={`p-2 sm:p-3 md:p-4 rounded-lg shadow-md sm:shadow-lg backdrop-blur-sm border ${borderColor} ${bgColor} ${textColor} transition-all duration-300 text-xs sm:text-sm md:text-base max-w-[90vw] md:max-w-2xl mx-auto text-center`}>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
} 