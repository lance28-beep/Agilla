'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DiceProps {
  onRollComplete: (value: number) => void;
}

const Dice: React.FC<DiceProps> = ({ onRollComplete }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState(1);

  const handleRoll = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Simulate rolling through numbers quickly
    let rollCount = 0;
    const maxRolls = 15; // Increased number of rolls for smoother animation
    const finalResult = Math.floor(Math.random() * 6) + 1;
    
    const rollInterval = setInterval(() => {
      rollCount++;
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        setCurrentValue(finalResult);
        setIsRolling(false);
        onRollComplete(finalResult);
      } else {
        // Show random numbers while rolling
        setCurrentValue(Math.floor(Math.random() * 6) + 1);
      }
    }, 80); // Faster rolling speed (was 100ms)
  };

  const dots = Array(currentValue).fill(0);

  const getDotPositions = (value: number) => {
    switch (value) {
      case 1:
        return 'justify-center items-center';
      case 2:
        return 'justify-between items-center [&>span:first-child]:self-start [&>span:last-child]:self-end';
      case 3:
        return 'justify-between items-center [&>span:first-child]:self-start [&>span:nth-child(2)]:self-center [&>span:last-child]:self-end';
      case 4:
        return 'justify-between [&>span:nth-child(-n+2)]:self-start [&>span:nth-child(n+3)]:self-end';
      case 5:
        return 'justify-between [&>span:nth-child(-n+2)]:self-start [&>span:nth-child(3)]:self-center [&>span:nth-child(n+4)]:self-end';
      case 6:
        return 'justify-between [&>span:nth-child(-n+2)]:self-start [&>span:nth-child(n+3):nth-child(-n+4)]:self-center [&>span:nth-child(n+5)]:self-end';
      default:
        return '';
    }
  };

  return (
    <motion.div
      onClick={handleRoll}
      animate={{ 
        scale: isRolling ? [1, 0.9, 1.1, 0.9, 1] : 1,
        rotate: isRolling ? [0, -10, 10, -10, 0] : 0
      }}
      transition={{ 
        duration: 0.5,
        repeat: isRolling ? 3 : 0
      }}
      className={`
        w-20 h-20 bg-white dark:bg-gray-800
        rounded-lg cursor-pointer select-none
        flex flex-wrap p-4 gap-2
        ${getDotPositions(currentValue)}
        transition-all duration-200
        hover:bg-gray-50 dark:hover:bg-gray-700
        shadow-md border border-gray-200 dark:border-gray-700
      `}
    >
      {dots.map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="w-3 h-3 rounded-full bg-gray-800 dark:bg-gray-200"
        />
      ))}
    </motion.div>
  );
};

export default Dice; 