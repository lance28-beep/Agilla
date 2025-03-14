import React from 'react';
import { useGame } from '../context/GameContext';
import { Player } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';

interface GameOverModalProps {
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ onRestart }) => {
  const { state } = useGame();

  // Sort players by score in descending order
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  // If there are no players, show a simple message
  if (!winner) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 dark:bg-gray-800/90 rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 sm:mb-6">
            Game Over!
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
            No players in the game.
          </p>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg font-medium sm:font-semibold text-sm sm:text-base hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
            >
              Start New Game
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/90 dark:bg-gray-800/90 rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto backdrop-blur-sm border border-white/20 dark:border-gray-700/20 max-h-[90vh] overflow-auto"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-3 sm:mb-4 md:mb-6">
          Game Over!
        </h2>
        
        {/* Winner Section */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="text-base sm:text-lg md:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Winner
          </div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-800 shadow-md"
          >
            <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 animate-bounce">{winner.token}</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{winner.name}</div>
            <div className="text-sm sm:text-base md:text-lg text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
              <span>Score:</span>
              <span className="font-bold">{winner.score}</span>
              <span className="text-yellow-500">⭐</span>
            </div>
          </motion.div>
        </div>

        {/* All Players Ranking */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 md:mb-4">Final Ranking</h3>
          <div className="space-y-1 sm:space-y-2 max-h-[30vh] overflow-auto pr-1">
            {sortedPlayers.map((player: Player, index: number) => (
              <motion.div
                key={player.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-2 sm:p-3 rounded-lg ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border border-yellow-200 dark:border-yellow-800' 
                    : 'bg-white/60 dark:bg-gray-700/60 border border-gray-100 dark:border-gray-600'
                } shadow-sm`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                    index === 0 
                      ? 'bg-yellow-400 text-yellow-900' 
                      : index === 1 
                        ? 'bg-gray-300 text-gray-700'
                        : index === 2
                          ? 'bg-amber-600 text-amber-100'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-base sm:text-lg md:text-xl">{player.token}</span>
                  <span className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200 truncate max-w-[100px] sm:max-w-[150px]">{player.name}</span>
                </div>
                <span className="font-semibold text-sm sm:text-base text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  {player.score}
                  <span className="text-xs text-yellow-500">⭐</span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg font-medium sm:font-semibold text-sm sm:text-base hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
          >
            Play Again 🎮
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameOverModal; 