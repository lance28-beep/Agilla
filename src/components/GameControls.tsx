'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Player {
  id: number;
  name: string;
  token: string;
  position: number;
  score: number;
  isSkippingTurn: boolean;
}

interface GameControlsProps {
  currentPlayer: Player;
  lastRoll: number | null;
  canInteractWithSpace: boolean;
  onRollClick: () => void;
  onEndTurnClick: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  lastRoll,
  canInteractWithSpace,
  onRollClick,
  onEndTurnClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 rounded-2xl shadow-xl 
                backdrop-blur-md border border-white/30 dark:border-gray-700/30
                bg-gradient-to-br from-white/90 to-white/80 
                dark:from-gray-800/90 dark:to-gray-800/80 
                transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto">
          <motion.div 
            className="flex items-center gap-3 md:gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                         text-transparent bg-clip-text">
              {currentPlayer?.name}
            </span>
            <motion.span 
              className="text-3xl md:text-4xl"
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {currentPlayer?.token}
            </motion.span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 text-sm md:text-base"
            whileHover={{ scale: 1.05 }}
          >
            <span className="font-medium text-gray-600 dark:text-gray-300">Score:</span>
            <span className="font-bold text-yellow-600 dark:text-yellow-400 text-lg md:text-xl">
              {currentPlayer?.score || 0}
            </span>
            <motion.span 
              className="text-yellow-500 text-xl md:text-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              ⭐
            </motion.span>
          </motion.div>
        </div>
        <div className="flex gap-3 md:gap-4 w-full sm:w-auto justify-center sm:justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRollClick}
            disabled={!currentPlayer || currentPlayer.isSkippingTurn}
            className="px-5 py-2.5 md:px-6 md:py-3 
                      bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl
                      hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all transform hover:shadow-lg active:scale-95
                      text-sm md:text-base font-medium md:font-semibold tracking-wide
                      backdrop-blur-sm shadow-md border border-blue-400/20
                      disabled:hover:scale-100 disabled:hover:shadow-md"
          >
            <span className="flex items-center gap-2">
              Roll 
              <motion.span
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                🎲
              </motion.span>
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEndTurnClick}
            disabled={!lastRoll || !canInteractWithSpace}
            className="px-5 py-2.5 md:px-6 md:py-3 
                      bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl
                      hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all transform hover:shadow-lg active:scale-95
                      text-sm md:text-base font-medium md:font-semibold tracking-wide
                      backdrop-blur-sm shadow-md border border-gray-400/20
                      disabled:hover:scale-100 disabled:hover:shadow-md"
          >
            <span className="flex items-center gap-2">
              End 
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                ➡️
              </motion.span>
            </span>
          </motion.button>
        </div>
      </div>
      
      {/* Last Roll Indicator */}
      <AnimatePresence>
        {lastRoll !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 
                     flex items-center justify-center"
          >
            <motion.div 
              className="px-4 py-2 bg-gradient-to-r from-blue-100/90 to-blue-200/90 
                       dark:from-blue-900/30 dark:to-blue-800/30 
                       rounded-full text-sm text-blue-700 dark:text-blue-300 
                       font-medium flex items-center gap-2 shadow-md backdrop-blur-sm 
                       border border-blue-200/50 dark:border-blue-800/50"
              whileHover={{ scale: 1.05 }}
            >
              <span>Last Roll:</span>
              <span className="font-bold text-lg">{lastRoll}</span>
              <motion.span 
                className="text-blue-500 text-xl"
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                🎲
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(GameControls); 