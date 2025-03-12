'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

interface DiceProps {
  onRollComplete: (value: number) => void;
}

const Dice: React.FC<DiceProps> = ({ onRollComplete }) => {
  const { state } = useGame();
  const [isRolling, setIsRolling] = useState(false);
  const [value, setValue] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  // Mapping of dice values to rotations for showing correct face
  const diceRotations = {
    1: { x: 0, y: 0, z: 0 },
    2: { x: -90, y: 0, z: 0 },
    3: { x: 0, y: 90, z: 0 },
    4: { x: 0, y: -90, z: 0 },
    5: { x: 90, y: 0, z: 0 },
    6: { x: 180, y: 0, z: 0 },
  };

  const roll = () => {
    if (isRolling || !state.gameStarted || state.gameEnded) return;

    setIsRolling(true);
    const finalValue = Math.floor(Math.random() * 6) + 1;
    setValue(finalValue);

    // Animate for 1 second
    const startTime = Date.now();
    const duration = 1000;
    const rolls = 2;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        const rotationAmount = progress * 360 * rolls;
        setRotation({
          x: rotationAmount,
          y: rotationAmount,
          z: rotationAmount,
        });
        requestAnimationFrame(animate);
      } else {
        // Set final rotation for the correct face
        setRotation(diceRotations[finalValue as keyof typeof diceRotations]);
        setIsRolling(false);
        onRollComplete(finalValue);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <button
      onClick={roll}
      disabled={isRolling || !state.gameStarted || state.gameEnded}
      className={`
        perspective-1000 w-24 h-24 relative
        ${!state.gameStarted || state.gameEnded ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        transition-all duration-300
      `}
      aria-label="Roll dice"
    >
      <div
        className={`
          w-full h-full relative transform-style-3d transition-transform duration-1000
          ${isRolling ? 'animate-spin-slow' : ''}
        `}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
        }}
      >
        {/* Dice faces with dots instead of numbers */}
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center transform translate-z-12">
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
        </div>
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg grid grid-cols-2 gap-8 p-4 transform rotate-x-90 translate-z-12">
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full justify-self-end" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full justify-self-start self-end" />
        </div>
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg grid grid-cols-3 gap-2 p-4 transform rotate-y-90 translate-z-12">
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full justify-self-end" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full place-self-center" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full justify-self-start self-end" />
        </div>
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg grid grid-cols-2 gap-4 p-4 transform rotate-y--90 translate-z-12">
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
        </div>
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg grid grid-cols-3 gap-2 p-4 transform rotate-x--90 translate-z-12">
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full place-self-center" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
        </div>
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg grid grid-cols-3 gap-2 p-4 transform rotate-y-180 translate-z-12">
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full" />
        </div>
      </div>
    </button>
  );
};

export default Dice; 