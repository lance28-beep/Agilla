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
  const styles = useSpaceStyles();
  
  return (
    <div className="flex items-center gap-1 md:gap-2 p-1 md:p-2 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/20 transition-colors group backdrop-blur-sm">
      <div 
        className={`
          w-6 h-6 md:w-7 md:h-7 rounded-md md:rounded-lg flex items-center justify-center text-sm md:text-base
          bg-gradient-to-br ${styles.getSpaceColor({ type, points })}
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
          styles.getSpaceIcon(type)
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
    // Only show roll prompt if trying to interact without rolling
    if (!canInteractWithSpace) {
      setShowRollPrompt(true);
      return;
    }

    // Allow interaction only with current position and when canInteractWithSpace is true
    if (space.id !== currentPlayerPosition) {
      return;
    }

    // Don't allow interaction with start/finish spaces
    if (space.type === 'start' || space.type === 'finish') {
      return;
    }

    // Only allow interaction with question spaces
    if (space.type === 'question') {
      onSpaceClick(space.type);
    }
  };

  // Memoize legend items for better performance
  const legendItems = useMemo(() => [
    { type: 'start', points: 0, label: 'Start' },
    { type: 'finish', points: 0, label: 'Finish' },
    { type: 'question', points: 1, label: 'Question Space' },
  ], []);

  // Memoize the board spaces to prevent unnecessary re-renders
  const boardSpaces = useMemo(() => {
    return spaces.map((space, index) => {
      // Calculate the actual index for the snake pattern
      let row = Math.floor(index / 10);
      let col = index % 10;
      
      // Reverse direction for odd rows (0-indexed)
      if (row % 2 === 1) {
        col = 9 - col;
      }
      
      // Calculate the actual index in the array
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
    <div className="w-full h-full overflow-auto p-1 sm:p-2 md:p-4 game-board-container">
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Board Legend */}
        <div className="mb-2 sm:mb-4 flex flex-wrap gap-1 sm:gap-2 justify-center">
          {legendItems.map((item) => (
            <LegendItem key={`${item.type}-${item.points}`} {...item} />
          ))}
        </div>
        
        {/* Current Position Indicator */}
        {currentPlayerPosition > 0 && (
          <div className="mb-2 sm:mb-4 flex justify-center">
            <div className="px-3 py-1 bg-yellow-100/80 dark:bg-yellow-900/30 rounded-full text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 font-medium flex items-center gap-1 shadow-sm backdrop-blur-sm border border-yellow-200 dark:border-yellow-800/50">
              <span>{state.players[state.currentPlayerIndex].name}'s Position:</span>
              <span className="font-bold">{currentPlayerPosition + 1}</span>
              <span className="text-yellow-500">📍</span>
              {canInteractWithSpace && (
                <span className="ml-1 text-green-600 dark:text-green-400 text-[10px] xs:text-xs animate-pulse">
                  (Click to interact)
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Game Board Grid - Optimized 10x10 Layout */}
        <div className="game-board glass-effect rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-xl border border-white/30 dark:border-gray-700/30 bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm">
          {/* Grid Container with Fixed Aspect Ratio */}
          <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
            <div className="absolute inset-0 grid grid-cols-10 gap-1 xs:gap-1.5 sm:gap-2">
              {boardSpaces.map(({ space, actualIndex }) => {
                // Find players on this space
                const playersOnSpace = getPlayerTokens(space.id);
                
                // Check if this space is interactive
                const isInteractive = canInteractWithSpace && space.id === currentPlayerPosition;
                
                return (
                  <BoardSpace
                    key={space.id}
                    space={space}
                    isCurrentPosition={space.id === currentPlayerPosition}
                    canInteract={canInteractWithSpace}
                    playersOnSpace={playersOnSpace}
                    onSpaceClick={handleSpaceClick}
                    currentPlayerIndex={state.currentPlayerIndex}
                    onHover={() => setHoveredSpace(space.id)}
                    onLeave={() => setHoveredSpace(null)}
                    isHovered={hoveredSpace === space.id}
                    isInteractive={isInteractive}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Desktop Board Controls */}
        <div className="hidden md:flex justify-center mt-4">
          <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg shadow-md backdrop-blur-sm border border-white/20 dark:border-gray-700/20 max-w-md">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">How to Play:</h3>
            <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>Roll the dice by clicking the "Roll" button</li>
              <li>Your token will move automatically to the new position</li>
              <li>Click on your current position to interact with the space</li>
              <li>Answer correctly to earn points equal to your dice roll</li>
              <li>Answer incorrectly to return to your previous position</li>
              <li>The first player to reach position 100 wins!</li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* Roll Prompt Dialog */}
      <RollPromptDialog isOpen={showRollPrompt} onClose={() => setShowRollPrompt(false)} />
    </div>
  );
};

export default React.memo(GameBoard); 