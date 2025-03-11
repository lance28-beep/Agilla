'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import Dice from './Dice';
import { useGame } from '../context/GameContext';

interface GameControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRollComplete: (value: number) => void;
  currentPlayer: any;
  lastRoll: number | null;
}

const GameControlModal: React.FC<GameControlModalProps> = ({
  isOpen,
  onClose,
  onRollComplete,
  currentPlayer,
  lastRoll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          {currentPlayer?.name}'s Turn
        </h2>
        
        <div className="flex flex-col items-center gap-4">
          <Dice onRollComplete={onRollComplete} />
          
          {lastRoll && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Last Roll: {lastRoll}
            </p>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControlModal; 