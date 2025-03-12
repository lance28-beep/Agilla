'use client';

import React, { useState, useEffect } from 'react';
import Dice from './Dice';

interface Player {
  id: number;
  name: string;
  token: string;
  position: number;
  score: number;
  isSkippingTurn: boolean;
}

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
  lastRoll
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scaleUp">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            {currentPlayer.name}'s Turn
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {lastRoll ? `Last roll: ${lastRoll}` : countdown !== null ? `Rolling in ${countdown}...` : 'Click the dice to roll!'}
          </p>
          
          <div className="flex justify-center mb-6">
            <Dice onRollComplete={(value) => {
              setCountdown(3);
              onRollComplete(value);
            }} />
          </div>

          <button
            onClick={() => {
              setCountdown(3);
              onRollComplete(Math.floor(Math.random() * 6) + 1);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                     text-white rounded-lg font-semibold tracking-wide
                     hover:from-blue-600 hover:to-blue-700 
                     transform hover:scale-105 transition-all duration-300
                     shadow-lg hover:shadow-xl active:scale-95"
          >
            Roll the Dice 🎲
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControlModal; 