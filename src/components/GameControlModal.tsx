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
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rollAttemptsRef = useRef(0);
  const isRollInProgressRef = useRef(false);
  const handleRollCompleteRef = useRef<((value: number) => void) | null>(null);

  // Cleanup function to clear all timeouts and intervals
  const cleanupRollTimers = useCallback(() => {
    console.log('GameControlModal: Cleaning up roll timers');
    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current);
      rollIntervalRef.current = null;
    }
    if (rollTimeoutRef.current) {
      clearTimeout(rollTimeoutRef.current);
      rollTimeoutRef.current = null;
    }
    setIsRolling(false);
    setTurnInProgress(false);
    setRollCompleted(false);
    setRollValue(null);
    isRollInProgressRef.current = false;
  }, []);

  // Reset states when modal opens or player changes
  useEffect(() => {
    if (isOpen) {
      console.log('GameControlModal: Modal opened - resetting states');
      setShowError(false);
      setRollCompleted(false);
      setIsRolling(false);
      setRollValue(null);
      setTurnInProgress(false);
      setRollingNumbers([]);
      rollAttemptsRef.current = 0;
      cleanupRollTimers();
      // Only reset turn count if this is a new player's turn
      if (!hasRolled) {
        setTurnCount(0);
      }
    }

    // Cleanup on unmount
    return cleanupRollTimers;
  }, [isOpen, hasRolled, cleanupRollTimers]);

  const handleRoll = useCallback(() => {
    if (isRolling || hasRolled || turnInProgress || rollCompleted || isRollInProgressRef.current) {
      console.log('GameControlModal: Roll prevented - states:', {
        isRolling,
        hasRolled,
        turnInProgress,
        rollCompleted,
        isRollInProgress: isRollInProgressRef.current
      });
      return;
    }
    
    rollAttemptsRef.current += 1;
    console.log('GameControlModal: Starting roll attempt #', rollAttemptsRef.current);
    
    // Clean up any existing timers first
    cleanupRollTimers();
    
    setIsRolling(true);
    setTurnInProgress(true);
    setShowError(false);
    setRollCompleted(false);
    isRollInProgressRef.current = true;

    // Generate random numbers for rolling effect (ensure all are valid)
    const numbers = Array.from({ length: 10 }, () => {
      const roll = Math.floor(Math.random() * 6) + 1;
      return roll >= 1 && roll <= 6 ? roll : 1;
    });
    setRollingNumbers(numbers);

    // Generate final roll value with guaranteed valid number
    let finalRoll = Math.floor(Math.random() * 6) + 1;
    
    // Ensure final roll is valid, if not, keep generating until valid
    let attempts = 0;
    while ((finalRoll < 1 || finalRoll > 6) && attempts < 3) {
      finalRoll = Math.floor(Math.random() * 6) + 1;
      attempts++;
    }
    
    // If still invalid after retries, use a safe default
    if (finalRoll < 1 || finalRoll > 6) {
      console.error("GameControlModal: Failed to generate valid final roll after retries");
      finalRoll = 1;
    }

    console.log('GameControlModal: Generated final roll:', finalRoll);

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
          if (handleRollCompleteRef.current) {
            handleRollCompleteRef.current(finalRoll);
          }
        }, 500);
      }
    }, 300);
  }, [isRolling, hasRolled, turnInProgress, rollCompleted, cleanupRollTimers, setRollingNumbers, setRollValue]);

  // Handle roll completion
  const handleRollComplete = useCallback((value: number) => {
    console.log('GameControlModal: Roll complete - value:', value);
    
    if (rollCompleted || isRollInProgressRef.current) {
      console.log('GameControlModal: Roll already completed or in progress, ignoring');
      return;
    }
    
    // Validate dice result and reroll if invalid
    if (!value || value < 1 || value > 6) {
      console.error("GameControlModal: Invalid dice roll result:", value);
      setShowError(true);
      cleanupRollTimers();
      
      // Automatically retry after a short delay
      setTimeout(() => {
        handleRoll();
      }, 1000);
      return;
    }
    
    isRollInProgressRef.current = true;
    cleanupRollTimers();
    setRollCompleted(true);
    setTurnInProgress(true);
    setTurnCount(prev => prev + 1);
    onRollAttempt(); // Set hasRolled flag in parent
    onRollComplete(value);
  }, [onRollAttempt, onRollComplete, cleanupRollTimers, rollCompleted, handleRoll]);

  // Update the ref when handleRollComplete changes
  useEffect(() => {
    handleRollCompleteRef.current = handleRollComplete;
  }, [handleRollComplete]);

  // Add effect to handle modal open/close
  useEffect(() => {
    if (!isOpen) {
      console.log('GameControlModal: Modal closing - cleaning up');
      cleanupRollTimers();
      setShowError(false);
    }
  }, [isOpen, cleanupRollTimers]);

  // Reset error state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isRolling) return;
    cleanupRollTimers();
    onClose();
  };

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
                  {currentPlayer.name}&apos;s Turn
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