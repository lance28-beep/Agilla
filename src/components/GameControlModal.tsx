'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

  // Reset states when modal opens or player changes
  useEffect(() => {
    if (isOpen) {
      setShowError(false);
      setRollCompleted(hasRolled || lastRoll !== null);
      setIsRolling(false);
    }
  }, [isOpen, hasRolled, lastRoll]);

  // Track turn count
  useEffect(() => {
    if (!isOpen) {
      setTurnCount(0);
    }
  }, [isOpen]);

  // Handle roll completion
  const handleRollComplete = useCallback((value: number) => {
    setRollCompleted(true);
    setIsRolling(false);
    setTurnCount(prev => prev + 1);
    onRollAttempt();
    onRollComplete(value);
  }, [onRollAttempt, onRollComplete]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (rollCompleted) {
      setRollCompleted(false); // Reset roll state when closing
      onClose();
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const handleRollStart = () => {
    setIsRolling(true);
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
              </motion.div>

              <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
                <div className="relative">
                  <Dice
                    onRollComplete={handleRollComplete}
                    onRollStart={handleRollStart}
                    disabled={rollCompleted || isRolling}
                    result={lastRoll}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-xs md:text-sm text-gray-600 dark:text-gray-400"
                  >
                    {isRolling ? "Rolling..." : 
                     rollCompleted ? `You rolled a ${lastRoll}!` : 
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