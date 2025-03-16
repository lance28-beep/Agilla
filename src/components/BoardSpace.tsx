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

interface SpaceStyles {
  [key: string]: string;
}

// Custom hook for space styles
export const useSpaceStyles = (type: string): string => {
  const baseStyles: SpaceStyles = {
    start: 'from-green-400 to-green-500 hover:from-green-500 hover:to-green-600',
    finish: 'from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600',
    question: 'from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600',
    event: 'from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600'
  };

  return baseStyles[type] || baseStyles.question;
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
  const spaceStyles = useSpaceStyles(space.type);
  const isSpecialSpace = space.type === 'start' || space.type === 'finish';

  return (
    <motion.div
      className={`
        relative aspect-[4/3] group
        ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
      `}
      onClick={() => onSpaceClick(space)}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      whileHover={isInteractive ? { scale: 1.05 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Base Space */}
      <div className={`
        absolute inset-0 rounded-md overflow-hidden
        bg-gradient-to-br ${spaceStyles}
        transition-all duration-300 ease-in-out
        ${isCurrentPosition ? 'ring-1 ring-white/50 dark:ring-white/30 shadow-md' : ''}
        ${isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-sm'}
        ${isInteractive ? 'hover:shadow-lg hover:scale-[1.02]' : ''}
        backdrop-blur-sm
      `}>
        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full grid grid-cols-2 grid-rows-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        {/* Content Container */}
        <div className="relative h-full flex items-center justify-center p-1">
          {/* Space Icon */}
          <div className={`
            text-lg xs:text-xl sm:text-2xl
            ${isSpecialSpace ? 'animate-bounce' : 'group-hover:scale-110'}
            transition-transform duration-300
          `}>
            {space.type === 'start' ? '🚀' :
             space.type === 'finish' ? '🏁' :
             space.type === 'question' ? '❓' : '🎲'}
          </div>

          {/* Space Number */}
          <div className="absolute bottom-0.5 right-0.5 text-[8px] xs:text-[10px] 
                        font-medium text-white/70 dark:text-white/50">
            {space.id + 1}
          </div>
        </div>
      </div>

      {/* Player Tokens */}
      {playersOnSpace.length > 0 && (
        <div className="absolute -top-1 -left-1 flex flex-wrap gap-0.5 max-w-[150%] z-10">
          {playersOnSpace.map((player) => (
            <motion.div
              key={player.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`
                w-4 h-4 xs:w-5 xs:h-5
                rounded-full flex items-center justify-center
                text-[8px] xs:text-[10px] font-bold
                border border-white/50 shadow-sm
                ${player.id - 1 === currentPlayerIndex
                  ? 'bg-yellow-400 text-yellow-900 animate-pulse'
                  : 'bg-gray-200 text-gray-600'}
              `}
            >
              {player.token}
            </motion.div>
          ))}
        </div>
      )}

      {/* Interactive Indicator */}
      {isInteractive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2
                     text-[8px] text-white font-medium
                     px-1.5 py-0.5 rounded-full bg-green-500/80
                     shadow-sm backdrop-blur-sm"
        >
          Click
        </motion.div>
      )}
    </motion.div>
  );
};

export default React.memo(BoardSpace); 