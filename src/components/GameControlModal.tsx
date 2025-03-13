'use client';

import React, { useState, useEffect } from 'react';
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
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (hasRolled) {
      onClose();
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const handleRoll = (value: number) => {
    if (hasRolled) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    onRollAttempt();
    setCountdown(3);
    onRollComplete(value);
  };

  const getPositionMessage = () => {
    if (currentPlayer.position === 0) {
      return "You are at the starting position";
    }
    return `You are currently at position ${currentPlayer.position}`;
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div 
        className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 
                   relative overflow-hidden border border-white/20"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        {hasRolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                     dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 
                     dark:hover:bg-gray-700/50 group"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" 
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}

        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: hasRolled ? "100%" : "0%" }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="text-center">
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white bg-clip-text">
              {currentPlayer.name}&apos;s Turn
            </h2>
            <span className="text-3xl animate-bounce">
              {currentPlayer.token}
            </span>
          </motion.div>
          
          <AnimatePresence>
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 p-4 rounded-lg bg-red-100/80 dark:bg-red-900/30 border-2 border-red-500 
                         text-red-700 dark:text-red-300"
              >
                {hasRolled ? (
                  <>
                    <p className="font-medium">⚠️ You&apos;ve already rolled the dice!</p>
                    <p className="text-sm mt-1">Please answer the question at your current position.</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">⚠️ You need to roll first!</p>
                    <p className="text-sm mt-1">Roll the dice before closing the dialog.</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {hasRolled ? (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-4 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 border-2 border-blue-500">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <p className="text-blue-700 dark:text-blue-300 font-medium">
                    You rolled:
                  </p>
                  <motion.span 
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                             bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    {lastRoll}
                  </motion.span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {getPositionMessage()}
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    Click on your position to answer the question!
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Click outside or use the ✕ button to close this dialog
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="mb-6">
              {countdown !== null ? (
                <motion.div 
                  className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 
                           bg-clip-text text-transparent relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 blur-xl rounded-full" />
                  {countdown}
                </motion.div>
              ) : null}
            </div>
          )}
          
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Dice onRollComplete={handleRoll} disabled={hasRolled} />
          </motion.div>

          {/* Help text */}
          {!hasRolled && (
            <motion.p 
              className="text-sm text-gray-500 dark:text-gray-400 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Roll the dice to continue your turn
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameControlModal; 