'use client';

import React from 'react';
import Dice from './Dice';
import { Player } from '../types/game';

interface GameControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRollComplete: (value: number) => void;
  currentPlayer: Player;
  lastRoll: number | null;
}

export default function GameControlModal({
  isOpen,
  onClose,
  onRollComplete,
  currentPlayer,
  lastRoll
}: GameControlModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {currentPlayer.name}'s Turn
        </h2>
        <div className="flex flex-col items-center gap-4">
          <Dice onRollComplete={onRollComplete} />
          {lastRoll && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Last roll: {lastRoll}
            </p>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 