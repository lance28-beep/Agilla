'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRollComplete: (value: number) => void;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, onRollComplete }) => {
  const { state } = useGame();
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

  useEffect(() => {
    if (isRolling) {
      const rolls = 2; // Number of complete rotations
      const duration = 1000; // Duration in milliseconds
      const startTime = Date.now();

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
          setRotation(diceRotations[value as keyof typeof diceRotations]);
          onRollComplete(value);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isRolling, value, onRollComplete]);

  const getDiceFace = (value: number) => {
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[value - 1];
  };

  return (
    <div className="dice-container perspective-1000 w-24 h-24 relative">
      <div
        className={`dice-3d w-full h-full relative transform-style-3d transition-transform duration-1000 ${
          isRolling ? 'animate-spin-slow' : ''
        }`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
        }}
      >
        {/* Dice faces */}
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center transform translate-z-12">1</div>
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center transform rotate-x-90 translate-z-12">2</div>
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center transform rotate-y-90 translate-z-12">3</div>
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center transform rotate-y--90 translate-z-12">4</div>
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center transform rotate-x--90 translate-z-12">5</div>
        <div className="dice-face absolute w-full h-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center transform rotate-y-180 translate-z-12">6</div>
      </div>
    </div>
  );
};

export default Dice; 