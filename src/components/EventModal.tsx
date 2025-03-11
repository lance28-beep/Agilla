'use client';

import { useEffect, useState } from 'react';
import { EventCard } from '../types/game';

interface EventModalProps {
  isOpen: boolean;
  event: EventCard | null;
  onClose: () => void;
  onEffect: () => void;
}

export default function EventModal({ isOpen, event, onClose, onEffect }: EventModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && event) {
      const timer = setTimeout(() => {
        onEffect();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, event, onEffect]);

  if (!mounted || !isOpen || !event) return null;

  const getEventIcon = () => {
    switch (event.effect) {
      case 'move':
        return event.value > 0 ? '🚀' : '⬇️';
      case 'reroll':
        return '🎲';
      case 'skip':
        return '⏭️';
      default:
        return '⚡';
    }
  };

  const getEventColor = () => {
    switch (event.effect) {
      case 'move':
        return event.value > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      case 'reroll':
        return 'bg-blue-100 text-blue-800';
      case 'skip':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`
        bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full
        transform transition-all duration-300
        ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        <div className={`
          ${getEventColor()}
          p-4 rounded-lg mb-4 flex items-center gap-4
        `}>
          <span className="text-4xl">{getEventIcon()}</span>
          <div>
            <h3 className="text-xl font-bold mb-2">Event Card</h3>
            <p>{event.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 