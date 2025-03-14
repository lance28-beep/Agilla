'use client';

import React from 'react';
import { EventCard } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';

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
          ? 'bg-green-100/80 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700'
          : 'bg-red-100/80 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700';
      case 'skip':
        return 'bg-yellow-100/80 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
      case 'reroll':
        return 'bg-blue-100/80 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700';
      default:
        return 'bg-purple-100/80 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
        >
          {/* Backdrop with glass effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={onClose} 
          />
          
          {/* Modal content */}
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative bg-white/90 dark:bg-gray-800/90 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-xl max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto backdrop-blur-sm border border-white/20 dark:border-gray-700/20 animate-fadeIn"
          >
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4"
              >
                {getEventIcon()}
              </motion.div>
              
              <motion.h2 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-gray-800 dark:text-white"
              >
                Event Card
              </motion.h2>
              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3 md:mb-4 border ${getEventColor()}`}
              >
                {event.effect.charAt(0).toUpperCase() + event.effect.slice(1)}
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-5 md:mb-6"
              >
                {event.description}
              </motion.p>
              
              <div className="flex justify-center gap-2 sm:gap-3">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => {
                    onEffect();
                    onClose();
                  }}
                  className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm sm:text-base rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95"
                >
                  Continue
                </motion.button>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={onClose}
                  className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventModal; 