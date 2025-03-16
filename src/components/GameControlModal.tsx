'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Dice from './Dice';
import { motion, AnimatePresence } from 'framer-motion';

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
  hasRolled: boolean;
  onRollAttempt: () => void;
}

const GameControlModal: React.FC<GameControlModalProps> = ({
  isOpen,
  onClose,
  onRollComplete,
  currentPlayer,
  lastRoll,
  hasRolled,
  onRollAttempt
}) => {
  const [showError, setShowError] = useState(false);
  const [rollCompleted, setRollCompleted] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [rollValue, setRollValue] = useState<number | null>(null);
  const [turnInProgress, setTurnInProgress] = useState(false);
  const [rollingNumbers, setRollingNumbers] = useState<number[]>([]);
  const [rollAttempts, setRollAttempts] = useState(0);
  const MAX_ROLL_ATTEMPTS = 3;
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function to clear all timeouts and intervals
  const cleanupRollTimers = useCallback(() => {
    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current);
      rollIntervalRef.current = null;
    }
    if (rollTimeoutRef.current) {
      clearTimeout(rollTimeoutRef.current);
      rollTimeoutRef.current = null;
    }
  }, []);

  // Reset states when modal opens or player changes
  useEffect(() => {
    if (isOpen) {
      setShowError(false);
      setRollCompleted(false);
      setIsRolling(false);
      setRollValue(null);
      setTurnInProgress(false);
      setRollingNumbers([]);
      setRollAttempts(0);
      cleanupRollTimers();
      // Only reset turn count if this is a new player's turn
      if (!hasRolled) {
        setTurnCount(0);
      }
    }

    return () => {
      cleanupRollTimers();
      setTurnInProgress(false);
      setIsRolling(false);
    };
  }, [isOpen, hasRolled, cleanupRollTimers]);

  // Validate dice roll value
  const validateRollValue = (value: number): boolean => {
    return Number.isInteger(value) && value >= 1 && value <= 6;
  };

  // Generate a valid roll value
  const generateValidRollValue = (): number => {
    const value = Math.floor(Math.random() * 6) + 1;
    return validateRollValue(value) ? value : 1; // Fallback to 1 if invalid
  };

  // Handle roll completion
  const handleRollComplete = useCallback((value: number) => {
    if (rollCompleted) return; // Prevent double execution
    
    // Validate dice result
    if (!validateRollValue(value)) {
      console.error("Invalid dice roll result:", value);
      setShowError(true);
      setIsRolling(false);
      setTurnInProgress(false);
      setRollCompleted(false);
      setRollAttempts(prev => prev + 1);
      
      // Retry roll if under max attempts
      if (rollAttempts < MAX_ROLL_ATTEMPTS) {
        setTimeout(() => {
          handleRoll();
        }, 1000);
        return;
      } else {
        // Use fallback value after max attempts
        value = 1;
        console.error("Max roll attempts reached. Using fallback value:", value);
      }
    }
    
    cleanupRollTimers();
    setRollCompleted(true);
    setIsRolling(false);
    setTurnInProgress(false); // Reset turn progress before notifying parent
    setTurnCount(prev => prev + 1);
    
    // Notify parent component
    onRollAttempt(); // Set hasRolled flag in parent
    onRollComplete(value);
  }, [onRollAttempt, onRollComplete, cleanupRollTimers, rollCompleted, rollAttempts]);

  const handleRoll = () => {
    if (isRolling || hasRolled || turnInProgress || rollCompleted) {
      console.log("Roll prevented: already rolling or turn in progress");
      return;
    }
    
    setIsRolling(true);
    setTurnInProgress(true);
    setShowError(false);
    setRollCompleted(false); // Reset roll completion state

    // Generate valid random numbers for rolling effect
    const numbers = Array.from({ length: 10 }, () => generateValidRollValue());
    setRollingNumbers(numbers);

    // Generate final roll value
    let finalRoll = generateValidRollValue();
    
    // Clear any existing timers
    cleanupRollTimers();

    // Simulate rolling animation
    let currentIndex = 0;
    rollIntervalRef.current = setInterval(() => {
      if (currentIndex < numbers.length) {
        setRollValue(numbers[currentIndex]);
        currentIndex++;
      } else {
        cleanupRollTimers();
        setRollValue(finalRoll);
        rollTimeoutRef.current = setTimeout(() => {
          handleRollComplete(finalRoll);
        }, 500);
      }
    }, 300);
  };

  if (!isOpen) return null;

  const handleClose = () => {
    if (isRolling) return;
    cleanupRollTimers();
    setTurnInProgress(false);
    setShowError(false);
    onClose();
  };

  // Reset error state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowError(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl 
                     max-w-sm w-full mx-auto p-4 md:p-6 
                     backdrop-blur-sm border border-white/20 dark:border-gray-700/20
                     max-h-[90vh] overflow-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center 
                       rounded-full bg-gray-200/80 dark:bg-gray-700/80 
                       text-gray-600 dark:text-gray-400 
                       hover:bg-gray-300 dark:hover:bg-gray-600
                       transition-colors duration-200"
            >
              ✕
            </button>

            <div className="text-center space-y-4 md:space-y-6">
              <motion.div 
                className="flex items-center justify-center gap-2 md:gap-3"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                  {currentPlayer.name}'s Turn
                </h2>
                <span className="text-2xl md:text-3xl animate-bounce">
                  {currentPlayer.token}
                </span>
                {turnCount > 0 && (
                  <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    (Roll #{turnCount})
                  </span>
                )}
              </motion.div>
              
              <AnimatePresence mode="wait">
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-3 md:p-4 rounded-lg bg-red-100/80 dark:bg-red-900/30 border border-red-500 
                             text-red-700 dark:text-red-300"
                  >
                    <p className="font-medium text-sm md:text-base">⚠️ You need to roll first!</p>
                    <p className="text-xs md:text-sm mt-1">Roll the dice before closing the dialog.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Player Position Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-3 py-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700
                         text-blue-700 dark:text-blue-300 text-sm"
              >
                <p>Current Position: <span className="font-bold">{currentPlayer.position + 1}</span></p>
                {rollValue && (
                  <p className="mt-1 text-yellow-600 dark:text-yellow-400 font-semibold">
                    🎲 Dice Roll Result: {rollValue}
                  </p>
                )}
              </motion.div>

              <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
                <div className="relative">
                  <Dice
                    onRollComplete={handleRollComplete}
                    onRollStart={handleRoll}
                    disabled={rollCompleted || isRolling || turnInProgress}
                    result={rollValue}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-xs md:text-sm text-gray-600 dark:text-gray-400"
                  >
                    {isRolling ? "Rolling..." : 
                     rollCompleted ? `You rolled a ${rollValue}!` : 
                     "Click the dice to roll"}
                  </motion.div>
                </div>

                <div className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-3"
                  >
                    <button
                      onClick={handleClose}
                      disabled={!rollCompleted}
                      className={`
                        px-4 py-2 rounded-lg font-medium text-sm
                        ${!rollCompleted 
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 button-hover-effect'}
                      `}
                    >
                      {rollCompleted ? 'Continue Game' : 'Roll First'}
                    </button>
                    
                    {/* Roll Count Indicator */}
                    {turnCount > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <p>After rolling, click on your current position on the board to interact with it.</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameControlModal; 