'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Space } from '../types/game';
import { motion } from 'framer-motion';

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
  onSpaceClick: (spaceType: string) => void;
  currentPlayerPosition: number;
  canInteractWithSpace: boolean;
}

// Extracted types for better reusability
type SpaceStyleProps = {
  type: string;
  points?: number;
  isCurrentPosition?: boolean;
};

// Memoized space style functions
const useSpaceStyles = () => {
  return useMemo(() => ({
    getSpaceColor: ({ type, points = 1, isCurrentPosition }: SpaceStyleProps) => {
      if (isCurrentPosition) {
        return 'bg-yellow-300 dark:bg-yellow-500 animate-pulse';
      }

      if (type === 'start') return 'bg-green-400 dark:bg-green-600';
      if (type === 'finish') return 'bg-red-400 dark:bg-red-600';

      // Color based on points
      switch (points) {
        case 5:
          return 'bg-purple-400 dark:bg-purple-600 hover:bg-purple-500 dark:hover:bg-purple-700';
        case 3:
          return 'bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700';
        case 1:
        default:
          return 'bg-cyan-400 dark:bg-cyan-600 hover:bg-cyan-500 dark:hover:bg-cyan-700';
      }
    },
    getSpaceIcon: (type: string) => {
      switch (type) {
        case 'start':
          return '🎯';
        case 'finish':
          return '🏁';
        default:
          return '❓';
      }
    },
    getSpaceTooltip: (type: string, points: number = 1) => {
      switch (type) {
        case 'start':
          return 'Start - Begin your journey!';
        case 'finish':
          return 'Finish - Win the game!';
        default:
          return `Question Space - ${points} point${points !== 1 ? 's' : ''}`;
      }
    }
  }), []);
};

// Memoized BoardSpace component
const BoardSpace = React.memo(({ 
  space, 
  isCurrentPosition, 
  canInteract, 
  playersOnSpace, 
  onSpaceClick,
  currentPlayerIndex 
}: {
  space: Space;
  isCurrentPosition: boolean;
  canInteract: boolean;
  playersOnSpace: Player[];
  onSpaceClick: (space: Space) => void;
  currentPlayerIndex: number;
}) => {
  const styles = useSpaceStyles();
  
  return (
    <div
      onClick={() => onSpaceClick(space)}
      className={`
        relative aspect-square rounded-xl border-2 border-white/20 dark:border-gray-700/20
        ${styles.getSpaceColor({ type: space.type, points: space.points, isCurrentPosition })}
        ${canInteract && isCurrentPosition 
          ? 'cursor-pointer hover:scale-110 hover:shadow-2xl hover:z-10 ring-2 ring-yellow-400/50 dark:ring-yellow-500/50' 
          : 'cursor-not-allowed'}
        transition-all duration-300 ease-out transform
        flex items-center justify-center text-3xl
        group shadow-lg hover:shadow-xl
        ${isCurrentPosition ? 'animate-pulse-slow' : ''}
      `}
      title={styles.getSpaceTooltip(space.type, space.points)}
      role="button"
      aria-label={`${space.type} space${space.points ? ` worth ${space.points} points` : ''}`}
      tabIndex={canInteract && isCurrentPosition ? 0 : -1}
      onKeyDown={(e) => {
        if (canInteract && isCurrentPosition && (e.key === 'Enter' || e.key === ' ')) {
          onSpaceClick(space);
        }
      }}
    >
      <span className="transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
        {styles.getSpaceIcon(space.type)}
      </span>
      
      {/* Player tokens */}
      {playersOnSpace.length > 0 && (
        <div className="absolute -top-2 -left-2 flex flex-wrap gap-1.5 max-w-[80%]">
          {playersOnSpace.map((player) => (
            <motion.span
              key={player.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`
                w-7 h-7 rounded-full flex items-center justify-center text-base
                ${player.id === currentPlayerIndex + 1 
                  ? 'bg-yellow-300 dark:bg-yellow-400 animate-bounce shadow-lg ring-2 ring-yellow-500/50' 
                  : 'bg-white dark:bg-gray-200'}
                border-2 border-gray-800 font-bold
                transform hover:scale-125 transition-transform z-20
                shadow-md hover:shadow-xl
                ${player.isSkippingTurn ? 'opacity-50' : ''}
              `}
              title={`${player.name}${player.isSkippingTurn ? ' (Skipping next turn)' : ''}`}
            >
              {player.token}
            </motion.span>
          ))}
        </div>
      )}

      {/* Points indicator */}
      {space.type !== 'start' && space.type !== 'finish' && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute -bottom-1 -right-1 text-sm font-bold 
            bg-white dark:bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center
            border-2 border-current shadow-lg group-hover:scale-110 transition-transform
            text-blue-600 dark:text-blue-400"
        >
          {space.points || 1}
        </motion.span>
      )}

      {/* Space number */}
      <span className="absolute top-1 left-1 text-xs font-bold text-gray-700 dark:text-gray-300 opacity-50">
        {space.id + 1}
      </span>
    </div>
  );
});

BoardSpace.displayName = 'BoardSpace';

// Memoized Legend Item component
const LegendItem = React.memo(({ type, points, label }: { type: string; points: number; label: string }) => {
  const styles = useSpaceStyles();
  
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
      <div className={`w-10 h-10 rounded-lg ${styles.getSpaceColor({ type, points })} 
        flex items-center justify-center text-2xl
        transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300
        shadow-md group-hover:shadow-xl`}>
        {styles.getSpaceIcon(type)}
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4 animate-scaleUp">
        <div className="text-center">
          <span className="text-4xl mb-4 block">🎲</span>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
            Roll First!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please roll the dice before interacting with the board.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 
                     text-white rounded-lg font-semibold
                     hover:from-blue-600 hover:to-blue-700
                     transform hover:scale-105 transition-all duration-300
                     shadow-lg hover:shadow-xl active:scale-95"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
});

RollPromptDialog.displayName = 'RollPromptDialog';

// Main GameBoard component
const GameBoard: React.FC<GameBoardProps> = ({ 
  spaces, 
  onSpaceClick, 
  currentPlayerPosition, 
  canInteractWithSpace 
}) => {
  const { state } = useGame();
  const [showRollPrompt, setShowRollPrompt] = useState(false);
  const [highlightedSpaces, setHighlightedSpaces] = useState<number[]>([]);

  // Highlight possible landing spaces
  useEffect(() => {
    if (canInteractWithSpace) {
      const possibleSpaces = [currentPlayerPosition];
      setHighlightedSpaces(possibleSpaces);
    } else {
      setHighlightedSpaces([]);
    }
  }, [currentPlayerPosition, canInteractWithSpace]);

  const getPlayerTokens = (spaceId: number) => {
    return state.players.filter(player => player.position === spaceId);
  };

  const handleSpaceClick = (space: Space) => {
    if (space.id === currentPlayerPosition && !canInteractWithSpace) {
      setShowRollPrompt(true);
      return;
    }

    if (!canInteractWithSpace || space.id !== currentPlayerPosition) return;
    if (['start', 'finish'].includes(space.type)) return;
    onSpaceClick(space.type);
  };

  // Memoize legend items
  const legendItems = useMemo(() => [
    { type: 'start', points: 0, label: 'Start Space' },
    { type: 'question', points: 1, label: 'Basic Question (1pt)' },
    { type: 'question', points: 3, label: 'Advanced Question (3pts)' },
    { type: 'question', points: 5, label: 'Expert Question (5pts)' },
    { type: 'finish', points: 0, label: 'Finish Line' }
  ], []);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[1200px] mx-auto p-4 md:p-6 overflow-x-auto bg-gradient-to-br from-white/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl shadow-xl backdrop-blur-sm"
      >
        <div className="grid grid-cols-10 gap-3 min-w-[1000px] p-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-xl" />
          
          {spaces.map((space) => (
            <BoardSpace
              key={space.id}
              space={space}
              isCurrentPosition={space.id === currentPlayerPosition}
              canInteract={canInteractWithSpace}
              playersOnSpace={getPlayerTokens(space.id)}
              onSpaceClick={handleSpaceClick}
              currentPlayerIndex={state.currentPlayerIndex}
            />
          ))}
        </div>

        {/* Legend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">Space Types</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {legendItems.map((item, index) => (
              <LegendItem key={index} {...item} />
            ))}
          </div>
        </motion.div>
      </motion.div>

      <RollPromptDialog isOpen={showRollPrompt} onClose={() => setShowRollPrompt(false)} />
    </>
  );
};

export default React.memo(GameBoard); 