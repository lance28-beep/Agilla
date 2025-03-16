'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DiceProps {
  onRollComplete: (value: number) => void;
  onRollStart?: () => void; // Optional callback when roll starts
  disabled?: boolean;
  result?: number | null;
}

const Dice: React.FC<DiceProps> = ({ 
  onRollComplete, 
  onRollStart,
  disabled = false, 
  result = null 
}) => {
  const [currentFace, setCurrentFace] = useState(result || 1);
  const [isRolling, setIsRolling] = useState(false);
  const [rollInterval, setRollInterval] = useState<NodeJS.Timeout | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const MAX_ERROR_RETRIES = 3;

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (rollInterval) clearInterval(rollInterval);
    };
  }, [rollInterval]);

  // Validate dice value
  const validateDiceValue = useCallback((value: number): boolean => {
    return Number.isInteger(value) && value >= 1 && value <= 6;
  }, []);

  // Generate valid dice value
  const generateValidDiceValue = useCallback((): number => {
    const value = Math.floor(Math.random() * 6) + 1;
    return validateDiceValue(value) ? value : 1; // Fallback to 1 if invalid
  }, [validateDiceValue]);

  // Handle roll animation
  const handleRoll = useCallback(() => {
    if (disabled || isRolling) {
      console.log("Roll prevented: dice is disabled or already rolling");
      return;
    }
    
    // Reset error count on new roll
    setErrorCount(0);
    
    // Call onRollStart if provided
    if (onRollStart) {
      onRollStart();
    }
    
    setIsRolling(true);
    
    // Generate random values during animation
    const interval = setInterval(() => {
      const animationValue = generateValidDiceValue();
      setCurrentFace(animationValue);
    }, 100);
    
    setRollInterval(interval);
    
    // Stop rolling after 1 second and get final value
    setTimeout(() => {
      clearInterval(interval);
      setRollInterval(null);
      
      // Generate final result (1-6)
      let finalValue: number;
      
      if (result !== null && validateDiceValue(result)) {
        finalValue = result;
      } else {
        finalValue = generateValidDiceValue();
      }

      // Validate final value
      if (!validateDiceValue(finalValue)) {
        setErrorCount(prev => prev + 1);
        if (errorCount < MAX_ERROR_RETRIES) {
          // Retry roll if invalid value
          console.log("Invalid roll value, retrying...");
          handleRoll();
          return;
        } else {
          // Fallback to 1 after max retries
          finalValue = 1;
          console.error('Max dice roll retries reached. Falling back to 1');
        }
      }

      setCurrentFace(finalValue);
      setIsRolling(false);
      
      // Notify parent component
      onRollComplete(finalValue);
    }, 1000);
  }, [disabled, isRolling, onRollComplete, onRollStart, result, errorCount, validateDiceValue, generateValidDiceValue]);

  // Reset rolling state when disabled prop changes
  useEffect(() => {
    if (disabled) {
      setIsRolling(false);
      if (rollInterval) {
        clearInterval(rollInterval);
        setRollInterval(null);
      }
    }
  }, [disabled, rollInterval]);

  const getDiceFace = (value: number) => {
    switch (value) {
      case 1: return '⚀';
      case 2: return '⚁';
      case 3: return '⚂';
      case 4: return '⚃';
      case 5: return '⚄';
      case 6: return '⚅';
      default: return '⚀';
    }
  };

  return (
    <motion.div
      className={`
        w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
        flex items-center justify-center
        bg-white dark:bg-gray-700
        rounded-xl shadow-lg
        text-4xl sm:text-5xl md:text-6xl
        cursor-pointer
        dice-container
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}
        ${isRolling ? 'animate-pulse-glow' : ''}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={{
        rotate: isRolling ? [0, 360, 720, 1080] : 0,
        scale: isRolling ? [1, 1.1, 0.9, 1.05, 0.95, 1] : 1,
      }}
      transition={{
        duration: isRolling ? 1 : 0.2,
        ease: "easeInOut",
      }}
      onClick={!disabled ? handleRoll : undefined}
    >
      <motion.span
        animate={{ 
          opacity: isRolling ? [1, 0.7, 1, 0.7, 1] : 1,
          scale: isRolling ? [1, 1.2, 0.8, 1.1, 0.9, 1] : 1,
        }}
        transition={{ duration: isRolling ? 1 : 0.2 }}
        className={`
          dice-face
          ${isRolling ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}
        `}
      >
        {getDiceFace(currentFace)}
      </motion.span>
    </motion.div>
  );
};

// Add these styles to your globals.css
const styles = `
@keyframes shake {
  0%, 100% { transform: rotate(0deg) translateY(0) scale(1); }
  25% { transform: rotate(-12deg) translateY(-6px) scale(0.95); }
  75% { transform: rotate(12deg) translateY(-3px) scale(1.05); }
}

.animate-shake {
  animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) infinite;
}

.dice-container {
  transform-style: preserve-3d;
}

.dot {
  @apply absolute w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-300 dark:to-gray-400;
  box-shadow: inset 0 0 2px rgba(0,0,0,0.2);
}

.center-center { @apply left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2; }
.top-left { @apply left-1 md:left-1.5 lg:left-2 top-1 md:top-1.5 lg:top-2; }
.top-right { @apply right-1 md:right-1.5 lg:right-2 top-1 md:top-1.5 lg:top-2; }
.center-left { @apply left-1 md:left-1.5 lg:left-2 top-1/2 transform -translate-y-1/2; }
.center-right { @apply right-1 md:right-1.5 lg:right-2 top-1/2 transform -translate-y-1/2; }
.bottom-left { @apply left-1 md:left-1.5 lg:left-2 bottom-1 md:bottom-1.5 lg:bottom-2; }
.bottom-right { @apply right-1 md:right-1.5 lg:right-2 bottom-1 md:bottom-1.5 lg:bottom-2; }
.top-center { @apply left-1/2 top-1 md:top-1.5 lg:top-2 transform -translate-x-1/2; }
.bottom-center { @apply left-1/2 bottom-1 md:bottom-1.5 lg:bottom-2 transform -translate-x-1/2; }

.perspective-1000 {
  perspective: 1000px;
}
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Dice;