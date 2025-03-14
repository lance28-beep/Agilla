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

interface PlayerStatsProps {
  player: Player;
  isCurrentPlayer: boolean;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, isCurrentPlayer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        relative overflow-hidden p-4 rounded-xl shadow-lg 
        backdrop-blur-md border border-white/30 dark:border-gray-700/30
        transition-all duration-300 transform hover:shadow-xl
        ${isCurrentPlayer
          ? 'bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/40 dark:to-purple-900/40 scale-[1.02] hover:scale-[1.05]'
          : 'bg-white/80 dark:bg-gray-800/80 hover:scale-[1.02]'}
      `}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-70" />
      
      <div className="flex items-center gap-3">
        <div className={`
          w-12 h-12 md:w-14 md:h-14 rounded-xl 
          flex items-center justify-center text-2xl md:text-3xl
          ${isCurrentPlayer 
            ? 'bg-gradient-to-br from-yellow-300 to-yellow-400 animate-pulse shadow-md' 
            : 'bg-gradient-to-br from-gray-100 to-white dark:from-gray-700 dark:to-gray-600'}
          font-bold border border-current transition-all
          ${isCurrentPlayer ? 'text-yellow-600' : 'text-gray-600 dark:text-gray-300'}
        `}>
          {player.token}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base md:text-lg text-gray-800 dark:text-white truncate">
            {player.name}
          </h3>
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Score:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-yellow-600 dark:text-yellow-400 text-base md:text-lg">{player.score}</span>
                <span className="text-yellow-500 text-sm">⭐</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Position:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-blue-600 dark:text-blue-400 text-base">{player.position + 1}</span>
                <span className="text-blue-500 text-sm">📍</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {player.isSkippingTurn && (
        <div className="mt-3 py-2 px-3 bg-red-100/80 dark:bg-red-900/30 rounded-lg animate-pulse">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
            <span>⏭️</span>
            Skipping Next Turn
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(PlayerStats); 