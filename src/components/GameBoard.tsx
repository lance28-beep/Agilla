'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Space } from '../types/game';
import { motion } from 'framer-motion';
import BoardSpace, { useSpaceStyles } from './BoardSpace';

// Add Player type
interface Player {
  id: number;
  name: string;
  token: string;
  position: number;
  score: number;
  isSkippingTurn: boolean;
}

interface GameBoardProps {
  spaces: Space[];
  onSpaceClick: (type: string) => void;
  currentPlayerPosition: number;
  canInteractWithSpace: boolean;
  isReturningToPrevious: boolean;
  previousPosition: number;
}

// Memoized LegendItem component
const LegendItem = React.memo(({ type, points, label }: { type: string; points: number; label: string }) => {
  const spaceStyle = useSpaceStyles(type);
  
  return (
    <div className="flex items-center gap-1 md:gap-2 p-1 md:p-2 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/20 transition-colors group backdrop-blur-sm">
      <div 
        className={`
          w-6 h-6 md:w-7 md:h-7 rounded-md md:rounded-lg flex items-center justify-center text-sm md:text-base
          bg-gradient-to-br ${spaceStyle}
          shadow-sm md:shadow-md group-hover:shadow-md transition-all
          group-hover:scale-105
        `}
      >
        {type === 'question' ? (
          <motion.span
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="text-lg md:text-xl"
          >
            ❓
          </motion.span>
        ) : (
          type === 'start' ? '🚀' : type === 'finish' ? '🏁' : '🎲'
        )}
      </div>
      <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
        {label}
      </span>
    </div>
  );
});

LegendItem.displayName = 'LegendItem';

// Add Dialog Component
const RollPromptDialog = React.memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/90 dark:bg-gray-800/90 p-4 md:p-5 rounded-xl shadow-xl max-w-xs md:max-w-sm w-full mx-4 backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
      >
        <div className="text-center">
          <span className="text-3xl md:text-4xl mb-3 block animate-bounce">🎲</span>
          <h3 className="text-lg md:text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            Roll First!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Please roll the dice before interacting with the board.
          </p>
          <button
            onClick={onClose}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-blue-600 
                     text-white rounded-lg text-sm font-medium md:font-semibold
                     hover:from-blue-600 hover:to-blue-700
                     transform hover:scale-105 transition-all duration-300
                     shadow-md hover:shadow-lg active:scale-95 button-hover-effect"
          >
            Got it!
          </button>
        </div>
      </motion.div>
    </div>
  );
});

RollPromptDialog.displayName = 'RollPromptDialog';

// Main GameBoard component
const GameBoard: React.FC<GameBoardProps> = ({
  spaces,
  onSpaceClick,
  currentPlayerPosition,
  canInteractWithSpace,
  isReturningToPrevious,
  previousPosition
}) => {
  const { state } = useGame();
  const [showRollPrompt, setShowRollPrompt] = useState(false);
  const [hoveredSpace, setHoveredSpace] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayPosition, setDisplayPosition] = useState(currentPlayerPosition);

  const getPlayerTokens = (spaceId: number) => {
    return state.players.filter(player => player.position === spaceId);
  };

  const handleSpaceClick = (space: Space) => {
    if (!canInteractWithSpace) {
      setShowRollPrompt(true);
      return;
    }

    if (space.id !== currentPlayerPosition) {
      return;
    }

    if (space.type === 'start' || space.type === 'finish') {
      return;
    }

    if (space.type === 'question') {
      onSpaceClick(space.type);
    }
  };

  // Memoize legend items for better performance
  const legendItems = useMemo(() => [
    { type: 'start', points: 0, label: 'Start' },
    { type: 'finish', points: 0, label: 'Finish' },
    { type: 'question', points: 1, label: 'Question' },
  ], []);

  // Memoize the board spaces to prevent unnecessary re-renders
  const boardSpaces = useMemo(() => {
    return spaces.map((space, index) => {
      let row = Math.floor(index / 10);
      let col = index % 10;
      
      if (row % 2 === 1) {
        col = 9 - col;
      }
      
      const actualIndex = row * 10 + col;
      const actualSpace = spaces[actualIndex];
      
      return {
        space: actualSpace,
        row,
        col,
        actualIndex
      };
    });
  }, [spaces]);

  // Handle position animation
  useEffect(() => {
    if (isReturningToPrevious) {
      setIsAnimating(true);
      const startTime = Date.now();
      const duration = 1000; // 1 second animation
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        setDisplayPosition(
          previousPosition + (currentPlayerPosition - previousPosition) * easeProgress
        );
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      animate();
    } else {
      setDisplayPosition(currentPlayerPosition);
    }
  }, [currentPlayerPosition, previousPosition, isReturningToPrevious]);

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-6">
      {/* Board Legend */}
      <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 justify-center">
        {legendItems.map((item) => (
          <motion.div
            key={item.type}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full
                     bg-white/90 dark:bg-gray-800/90 shadow-md
                     border border-gray-200/50 dark:border-gray-700/50
                     text-sm text-gray-700 dark:text-gray-300
                     backdrop-blur-sm transition-all duration-300"
          >
            <span className="w-5 h-5 flex items-center justify-center rounded-full 
                         bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              {item.type === 'start' ? '🚀' : item.type === 'finish' ? '🏁' : '❓'}
            </span>
            <span className="font-medium">{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Current Position Indicator */}
      {currentPlayerPosition > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 sm:mb-4 flex justify-center"
        >
          <div className="px-4 py-2 bg-gradient-to-r from-yellow-100/90 to-yellow-200/90 dark:from-yellow-900/30 dark:to-yellow-800/30 
                       rounded-full text-sm text-yellow-700 dark:text-yellow-300 
                       font-medium flex items-center gap-2 shadow-lg backdrop-blur-sm 
                       border border-yellow-200/50 dark:border-yellow-800/50">
            <span className="font-semibold">{state.players[state.currentPlayerIndex].name}</span>
            <span className="font-bold text-lg">{currentPlayerPosition + 1}</span>
            <span className="text-yellow-500 animate-bounce">📍</span>
          </div>
        </motion.div>
      )}

      {/* Game Board Grid */}
      <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                    rounded-2xl p-2 sm:p-3 md:p-4 overflow-hidden
                    border border-white/20 dark:border-gray-800/20
                    shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]
                    dark:shadow-[inset_0_0_30px_rgba(255,255,255,0.05)]">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full grid grid-cols-10 grid-rows-10">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-gray-500/20" />
            ))}
          </div>
        </div>

        {/* Board Spaces */}
        <div className="relative grid grid-cols-10 gap-1 sm:gap-2">
          {boardSpaces.map(({ space, row, col, actualIndex }) => (
            <motion.div
              key={actualIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: actualIndex * 0.01 }}
              className="relative"
            >
              <BoardSpace
                space={space}
                isCurrentPosition={actualIndex === displayPosition}
                isPreviousPosition={actualIndex === previousPosition}
                isHovered={hoveredSpace === actualIndex}
                onHover={() => setHoveredSpace(actualIndex)}
                onLeave={() => setHoveredSpace(null)}
                onClick={() => handleSpaceClick(space)}
                players={getPlayerTokens(actualIndex)}
                isAnimating={isAnimating}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Roll Prompt Dialog */}
      <RollPromptDialog
        isOpen={showRollPrompt}
        onClose={() => setShowRollPrompt(false)}
      />
    </div>
  );
};

export default React.memo(GameBoard); 