'use client';

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

interface DiceProps {
  onRollComplete: (value: number) => void;
}

export default function Dice({ onRollComplete }: DiceProps) {
  const { state } = useGame();
  const [isRolling, setIsRolling] = useState(false);
  const [value, setValue] = useState(1);

  const roll = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    const rolls = 10; // Number of animation frames
    let currentRoll = 0;
    
    const rollInterval = setInterval(() => {
      currentRoll++;
      setValue(Math.floor(Math.random() * 6) + 1);
      
      if (currentRoll >= rolls) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setValue(finalValue);
        setIsRolling(false);
        onRollComplete(finalValue);
      }
    }, 100);
  };

  const getDiceFace = (value: number) => {
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[value - 1];
  };

  return (
    <button
      onClick={roll}
      disabled={isRolling}
      className={`
        w-20 h-20 text-4xl flex items-center justify-center
        rounded-lg border-2 border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
        transform transition-all duration-300
        ${isRolling ? 'animate-spin-slow bg-gray-100 dark:bg-gray-700' : ''}
        ${!state.gameStarted || state.gameEnded ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg hover:shadow-xl
      `}
      role="img"
      aria-label={`Dice showing ${value}`}
    >
      <span className={`
        inline-block transform transition-transform duration-200
        ${isRolling ? 'animate-bounce' : ''}
      `}>
        {getDiceFace(value)}
      </span>
    </button>
  );
} 