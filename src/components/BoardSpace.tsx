'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Space } from '../types/game';

// Add Player type
interface Player {
  id: number;
  name: string;
  token: string;
  position: number;
  score: number;
  isSkippingTurn: boolean;
}

// Extracted types for better reusability
type SpaceStyleProps = {
  type: string;
  points?: number;
  isCurrentPosition?: boolean;
};

// Add random icons array at the top level
const SPACE_ICONS = ['🎯', '🎲', '💫', '✨', '🌟', '💭', '🎪', '🎨', '🎮', '🎪'];

// Custom hook for space styles
export const useSpaceStyles = () => {
  const getSpaceColor = ({ type, points = 0, isCurrentPosition = false }: SpaceStyleProps) => {
    if (isCurrentPosition) {
      return 'from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700';
    }

    switch (type) {
      case 'start':
        return 'from-green-400 to-green-500 dark:from-green-600 dark:to-green-700';
      case 'finish':
        return 'from-purple-400 to-purple-500 dark:from-purple-600 dark:to-purple-700';
      case 'question':
        if (points >= 5) {
          return 'from-red-400 to-red-500 dark:from-red-600 dark:to-red-700';
        } else if (points >= 3) {
          return 'from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700';
        }
        return 'from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700';
      case 'event':
        return 'from-orange-400 to-orange-500 dark:from-orange-600 dark:to-orange-700';
      default:
        return 'from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700';
    }
  };

  const getSpaceIcon = (type: string) => {
    switch (type) {
      case 'start':
        return '🚀';
      case 'finish':
        return '🏁';
      case 'question':
        return '❓';
      case 'event':
        return '⚡';
      default:
        return '⬜';
    }
  };

  const getSpaceTooltip = (type: string, points: number = 0) => {
    switch (type) {
      case 'start':
        return 'Start Space';
      case 'finish':
        return 'Finish Line';
      case 'question':
        return `Question Space (${points} points)`;
      case 'event':
        return 'Event Space';
      default:
        return 'Board Space';
    }
  };

  return { getSpaceColor, getSpaceIcon, getSpaceTooltip };
};

interface BoardSpaceProps {
  space: Space;
  isCurrentPosition: boolean;
  canInteract: boolean;
  playersOnSpace: Player[];
  onSpaceClick: (space: Space) => void;
  currentPlayerIndex: number;
  onHover?: () => void;
  onLeave?: () => void;
  isHovered?: boolean;
  isInteractive?: boolean;
}

const BoardSpace: React.FC<BoardSpaceProps> = ({ 
  space, 
  isCurrentPosition, 
  canInteract, 
  playersOnSpace, 
  onSpaceClick,
  currentPlayerIndex,
  onHover,
  onLeave,
  isHovered,
  isInteractive
}) => {
  const styles = useSpaceStyles();
  
  // Get a random icon based on space id
  const randomIcon = SPACE_ICONS[space.id % SPACE_ICONS.length];
  
  return (
    <motion.div
      whileHover={isInteractive ? { scale: 1.05, zIndex: 10 } : { zIndex: 5 }}
      whileTap={isInteractive ? { scale: 0.95 } : {}}
      onClick={() => onSpaceClick(space)}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      className={`
        relative aspect-square rounded-lg md:rounded-xl overflow-hidden
        border border-white/10 dark:border-gray-700/30
        ${isInteractive 
          ? 'cursor-pointer ring-2 ring-white/50 dark:ring-gray-300/50 shadow-lg' 
          : 'cursor-default shadow-sm'}
        transition-all duration-200 group
      `}
      title={styles.getSpaceTooltip(space.type, space.points)}
    >
      {/* Glass Background */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${styles.getSpaceColor({ type: space.type, points: space.points, isCurrentPosition })}
        opacity-80 backdrop-blur-md
      `}></div>
      
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/20 dark:bg-black/10 backdrop-blur-sm"></div>
      
      {/* Highlight Current Position */}
      {isCurrentPosition && (
        <div className="absolute inset-0 bg-yellow-400/30 dark:bg-yellow-500/30 animate-pulse-slow"></div>
      )}
      
      {/* Space Number - Small in top left */}
      <div className="absolute top-0.5 left-0.5 text-[8px] xs:text-[10px] sm:text-xs text-white/80 font-medium">
        {space.id + 1}
      </div>
      
      {/* Space Type Indicator with Flip Effect */}
      <div className="absolute inset-0 flex items-center justify-center perspective-1000">
        <div className="relative w-full h-full transform-style-preserve-3d transition-transform duration-500 group-hover:rotate-y-180">
          {/* Front - Icon */}
          <div className="absolute inset-0 flex items-center justify-center backface-hidden">
            <span className="text-base xs:text-lg sm:text-xl md:text-2xl text-white drop-shadow-md transform transition-transform duration-300 group-hover:scale-110">
              {space.type === 'start' ? '🚀' : 
               space.type === 'finish' ? '🏁' : 
               space.type === 'question' ? '❓' : 
               randomIcon}
            </span>
          </div>
          
          {/* Back - Number */}
          <div className="absolute inset-0 flex items-center justify-center backface-hidden rotate-y-180">
            <span className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-white drop-shadow-md">
              {space.type === 'start' ? 'S' : 
               space.type === 'finish' ? 'F' : 
               space.points === 5 ? '3' : 
               space.points === 3 ? '2' : '1'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Player tokens */}
      {playersOnSpace.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className={`
            flex flex-wrap justify-center items-center gap-0.5 
            ${playersOnSpace.length > 1 ? 'scale-75' : ''}
          `}>
            {playersOnSpace.map((player) => (
              <div
                key={player.id}
                className={`
                  w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full 
                  bg-white/90 dark:bg-gray-800/90 
                  flex items-center justify-center text-xs xs:text-sm sm:text-base md:text-lg 
                  font-bold shadow-md border-2 border-white/50 dark:border-gray-700/50
                  player-token z-10
                  ${player.id === currentPlayerIndex + 1 ? 'animate-bounce-slow' : ''}
                  ${player.isSkippingTurn ? 'opacity-50' : ''}
                `}
                title={`${player.name}${player.isSkippingTurn ? ' (Skipping Turn)' : ''}`}
              >
                {player.token}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Interactive Hint - Only show on hover */}
      {isInteractive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity z-20"
        >
          <span className="text-white text-xs sm:text-sm font-medium px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
            Click to Play
          </span>
        </motion.div>
      )}
      
      {/* Enhanced Hover Glow Effect */}
      {isHovered && !isCurrentPosition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/20 dark:bg-white/10 pointer-events-none z-0
                   shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]
                   dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.3)]"
        />
      )}
    </motion.div>
  );
};

export default React.memo(BoardSpace); 