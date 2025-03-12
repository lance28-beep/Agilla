'use client';

import React from 'react';
import { Player } from '../types/game';
import Dice from './Dice';

interface GameControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRollComplete: (value: number) => void;
  currentPlayer: Player;
  lastRoll: number | null;
}

const GameControlModal: React.FC<GameControlModalProps> = ({
  isOpen,
  onClose,
  onRollComplete,
  currentPlayer,
  lastRoll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with glass effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal content */}
      <div className="relative bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 backdrop-blur-md border border-white/20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            {currentPlayer.name}&apos;s Turn
          </h2>
          
          <div className="flex flex-col items-center gap-6 mb-6">
            <div className="transform hover:scale-105 transition-transform">
              <Dice onRollComplete={onRollComplete} />
            </div>
            
            {lastRoll && (
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 animate-fadeIn">
                You rolled a {lastRoll}!
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControlModal; 