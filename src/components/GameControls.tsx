'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
      className="p-4 rounded-xl shadow-lg 
                backdrop-blur-md border border-white/30 dark:border-gray-700/30
                bg-white/80 dark:bg-gray-800/80 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <span className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
              {currentPlayer?.name}
            </span>
            <span className="text-2xl md:text-3xl animate-bounce">
              {currentPlayer?.token}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
            <span className="font-medium">Score:</span>
            <span className="font-bold text-yellow-600 dark:text-yellow-400">{currentPlayer?.score || 0}</span>
            <span className="text-yellow-500">⭐</span>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRollClick}
            disabled={!currentPlayer || currentPlayer.isSkippingTurn}
            className="px-4 py-2 md:px-6 md:py-3 
                      bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg
                      hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all transform hover:shadow-lg active:scale-95
                      text-sm md:text-base font-medium md:font-semibold tracking-wide
                      backdrop-blur-sm shadow-md"
          >
            Roll 🎲
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEndTurnClick}
            disabled={!lastRoll || !canInteractWithSpace}
            className="px-4 py-2 md:px-6 md:py-3 
                      bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg
                      hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all transform hover:shadow-lg active:scale-95
                      text-sm md:text-base font-medium md:font-semibold tracking-wide
                      backdrop-blur-sm shadow-md"
          >
            End ➡️
          </motion.button>
        </div>
      </div>
      
      {/* Last Roll Indicator */}
      {lastRoll !== null && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <div className="px-3 py-2 bg-blue-100/80 dark:bg-blue-900/30 rounded-full text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2">
            <span>Last Roll:</span>
            <span className="font-bold">{lastRoll}</span>
            <span className="text-blue-500">🎲</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(GameControls); 