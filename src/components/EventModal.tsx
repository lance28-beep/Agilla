'use client';

import React from 'react';
import { EventCard } from '../types/game';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventCard;
  onEffect: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, onEffect }) => {
  if (!isOpen) return null;

  const getEventIcon = () => {
    switch (event.effect) {
      case 'move':
        return event.value > 0 ? '🚀' : '⬇️';
      case 'skip':
        return '⏭️';
      case 'reroll':
        return '🎲';
      default:
        return '⚡';
    }
  };

  const getEventColor = () => {
    switch (event.effect) {
      case 'move':
        return event.value > 0 
          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'skip':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'reroll':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with glass effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal content */}
      <div className="relative bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 backdrop-blur-md border border-white/20 animate-fadeIn">
        <div className="text-center">
          <div className="text-4xl mb-4">{getEventIcon()}</div>
          
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            Event Card
          </h2>
          
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getEventColor()}`}>
            {event.effect.charAt(0).toUpperCase() + event.effect.slice(1)}
          </div>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {event.description}
          </p>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                onEffect();
                onClose();
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Continue
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal; 