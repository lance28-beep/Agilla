'use client';

import React, { useState, useEffect } from 'react';
import { Player } from '../types/game';

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
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentDots, setCurrentDots] = useState(1);
  const [rollTime, setRollTime] = useState(5);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    if (isRolling) {
      // Update dots every 200ms during rolling
      intervalId = setInterval(() => {
        setCurrentDots(prev => (prev % 6) + 1);
      }, 200);

      // Countdown timer
      const countdownId = setInterval(() => {
        setRollTime(prev => {
          if (prev <= 1) {
            clearInterval(countdownId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Complete roll after 5 seconds
      timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setCurrentDots(finalValue);
        setIsRolling(false);
        onRollComplete(finalValue);
      }, 5000);
    }

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [isRolling, onRollComplete]);

  const handleRoll = () => {
    setIsRolling(true);
    setRollTime(5);
  };

  if (!isOpen) return null;

  const getDiceLayout = (num: number) => {
    switch (num) {
      case 1:
        return [<div key="center" className="place-self-center" />];
      case 2:
        return [
          <div key="top-right" className="place-self-end" />,
          <div key="bottom-left" className="place-self-start" />
        ];
      case 3:
        return [
          <div key="top-right" className="place-self-end" />,
          <div key="center" className="place-self-center" />,
          <div key="bottom-left" className="place-self-start" />
        ];
      case 4:
        return [
          <div key="top-left" className="place-self-start" />,
          <div key="top-right" className="place-self-end" />,
          <div key="bottom-left" className="place-self-start" />,
          <div key="bottom-right" className="place-self-end" />
        ];
      case 5:
        return [
          <div key="top-left" className="place-self-start" />,
          <div key="top-right" className="place-self-end" />,
          <div key="center" className="place-self-center" />,
          <div key="bottom-left" className="place-self-start" />,
          <div key="bottom-right" className="place-self-end" />
        ];
      case 6:
        return [
          <div key="top-left" className="place-self-start" />,
          <div key="top-right" className="place-self-end" />,
          <div key="middle-left" className="place-self-start" />,
          <div key="middle-right" className="place-self-end" />,
          <div key="bottom-left" className="place-self-start" />,
          <div key="bottom-right" className="place-self-end" />
        ];
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full transform transition-all">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Roll a Dice
        </h2>

        {/* Dice */}
        <div className="flex justify-center mb-8">
          <div className={`
            w-32 h-32 bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6
            grid grid-cols-2 gap-4 items-center
            ${isRolling ? 'animate-bounce' : 'hover:scale-105'}
            transition-all duration-300
          `}>
            {getDiceLayout(currentDots).map((dot, index) => (
              <div
                key={index}
                className="w-4 h-4 bg-gray-800 dark:bg-white rounded-full"
              >
                {dot}
              </div>
            ))}
          </div>
        </div>

        {/* Timer */}
        {isRolling && (
          <div className="text-center mb-6">
            <span className="text-2xl font-bold text-blue-500 animate-pulse">
              {rollTime}s
            </span>
          </div>
        )}

        {/* Roll Button */}
        <button
          onClick={handleRoll}
          disabled={isRolling}
          className={`
            w-full py-3 rounded-lg text-white font-medium text-lg
            transition-all duration-300 transform
            ${isRolling
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95'
            }
          `}
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
      </div>
    </div>
  );
};

export default GameControlModal; 