'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiceProps {
  onRollComplete: (value: number) => void;
  disabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRollComplete, disabled = false }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState(1);
  const [rollAttempts, setRollAttempts] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [rollPhase, setRollPhase] = useState<'ready' | 'rolling' | 'complete'>('ready');
  const MAX_ROLLS = 1;

  const handleRoll = () => {
    if (isRolling || disabled) {
      if (disabled) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
      return;
    }
    
    setIsRolling(true);
    setRollPhase('rolling');
    setRollAttempts(prev => prev + 1);
    
    // Enhanced rolling animation sequence
    let rollCount = 0;
    const maxRolls = 20;
    const finalResult = Math.floor(Math.random() * 6) + 1;
    
    const rollInterval = setInterval(() => {
      rollCount++;
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        setCurrentValue(finalResult);
        setIsRolling(false);
        setRollPhase('complete');
        onRollComplete(finalResult);
      } else {
        setCurrentValue(Math.floor(Math.random() * 6) + 1);
      }
    }, 150);
  };

  // Reset roll phase when dice is ready
  useEffect(() => {
    if (!isRolling && rollPhase === 'complete') {
      const timer = setTimeout(() => setRollPhase('ready'), 1000);
      return () => clearTimeout(timer);
    }
  }, [isRolling, rollPhase]);

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

  // Enhanced animation variants
  const diceVariants = {
    ready: {
      scale: 1,
      rotate: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200
      }
    },
    rolling: {
      scale: [1, 0.9, 1.1, 0.9, 1],
      rotate: [0, -180, 180, -180, 0],
      y: [0, -30, 0, -20, 0],
      transition: {
        duration: 2,
        times: [0, 0.2, 0.5, 0.8, 1],
        ease: "easeInOut"
      }
    },
    complete: {
      scale: 1.05,
      rotate: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const glowVariants = {
    rolling: {
      opacity: [0, 0.8, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const dotVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: i * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }),
    rolling: {
      scale: [1, 0.8, 1],
      opacity: [1, 0.5, 1],
      transition: {
        duration: 0.3,
        repeat: Infinity
      }
    }
  };

  const warningVariants = {
    initial: { opacity: 0, y: 10, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: -50, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    exit: { 
      opacity: 0, 
      y: -60, 
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showWarning && (
          <motion.div
            variants={warningVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute left-1/2 transform -translate-x-1/2 w-64 p-3 rounded-lg bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white text-sm text-center shadow-lg z-10 backdrop-blur-sm border border-white/20"
          >
            <p className="font-medium">⚠️ You've already rolled the dice!</p>
            <p className="text-xs mt-1 text-white/90">Please answer the question at your current position.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        onClick={handleRoll}
        variants={diceVariants}
        animate={rollPhase}
        whileHover={!disabled ? { scale: 1.05 } : undefined}
        className={`
          relative w-28 h-28 
          ${disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
          bg-gradient-to-br from-white/95 to-white/75 dark:from-gray-800/95 dark:to-gray-800/75
          rounded-xl select-none
          flex flex-wrap p-5 gap-2
          ${getDotPositions(currentValue)}
          transition-all duration-300
          shadow-lg shadow-blue-500/20
          border-2 border-white/20 dark:border-gray-700/20
          backdrop-blur-sm
          transform perspective-1000
          ${isRolling ? 'animate-shake' : ''}
        `}
        style={{
          boxShadow: isRolling 
            ? '0 0 30px rgba(59, 130, 246, 0.6)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <AnimatePresence>
          {isRolling && (
            <motion.div
              variants={glowVariants}
              animate="rolling"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20"
            />
          )}
        </AnimatePresence>

        {dots.map((_, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={dotVariants}
            initial="initial"
            animate={isRolling ? "rolling" : "animate"}
            className={`
              w-5 h-5 rounded-full 
              bg-gradient-to-br from-blue-600 to-purple-600
              dark:from-blue-400 dark:to-purple-400
              shadow-lg
              ${isRolling ? 'animate-pulse' : ''}
            `}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-full px-3 py-1"
      >
        <span className={`text-sm font-medium ${disabled ? 'text-red-500' : 'text-blue-500'}`}>
          {disabled ? '🚫 No more rolls' : '🎲 Click to roll!'}
        </span>
      </motion.div>
    </div>
  );
};

// Add these keyframes to your globals.css
const styles = `
@keyframes shake {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-12deg) scale(0.95); }
  75% { transform: rotate(12deg) scale(1.05); }
}

.animate-shake {
  animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) infinite;
}
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Dice; 