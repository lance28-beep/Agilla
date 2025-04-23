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
  isPreviousPosition: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  players: Player[];
  isAnimating: boolean;
}

const BoardSpace: React.FC<BoardSpaceProps> = ({
  space,
  isCurrentPosition,
  isPreviousPosition,
  isHovered,
  onHover,
  onLeave,
  onClick,
  players,
  isAnimating
}) => {
  const spaceStyles = useSpaceStyles(space.type);
  const isSpecialSpace = space.type === 'start' || space.type === 'finish';
  const isInteractive = isCurrentPosition && !isSpecialSpace;

  return (
    <motion.div
      className={`
        relative aspect-[4/3] group
        ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
      `}
      onClick={onClick}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      whileHover={isInteractive ? { scale: 1.05 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Base Space */}
      <motion.div 
        className={`
          absolute inset-0 rounded-lg overflow-hidden
          bg-gradient-to-br ${spaceStyles}
          transition-all duration-300 ease-in-out
          ${isCurrentPosition ? 'ring-2 ring-white/50 dark:ring-white/30 shadow-lg' : ''}
          ${isPreviousPosition ? 'ring-1 ring-yellow-400/50 dark:ring-yellow-400/30' : ''}
          ${isHovered ? 'shadow-xl scale-[1.02]' : 'shadow-md'}
          ${isInteractive ? 'hover:shadow-xl hover:scale-[1.02]' : ''}
          backdrop-blur-sm
        `}
        animate={{
          scale: isAnimating ? [1, 1.05, 1] : 1,
          rotate: isAnimating ? [0, 5, -5, 0] : 0
        }}
        transition={{
          duration: 0.5,
          repeat: isAnimating ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
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
          <motion.div 
            className={`
              text-lg xs:text-xl sm:text-2xl
              ${isSpecialSpace ? 'animate-bounce' : ''}
              transition-transform duration-300
            `}
            animate={{
              scale: isHovered ? [1, 1.2, 1] : 1,
              rotate: isHovered ? [0, 15, -15, 0] : 0
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse"
            }}
          >
            {space.type === 'start' ? '🚀' :
             space.type === 'finish' ? '🏁' :
             space.type === 'question' ? '❓' : '🎲'}
          </motion.div>

          {/* Space Number */}
          <div className="absolute bottom-1 right-1 text-[8px] xs:text-[10px] 
                        font-medium text-white/70 dark:text-white/50
                        bg-black/20 dark:bg-white/10 px-1 rounded">
            {space.id + 1}
          </div>
        </div>
      </motion.div>

      {/* Player Tokens */}
      {players.length > 0 && (
        <div className="absolute -top-1 -left-1 flex flex-wrap gap-0.5 max-w-[150%] z-10">
          {players.map((player) => (
            <motion.div
              key={player.id}
              initial={{ scale: 0, y: -10 }}
              animate={{ 
                scale: 1,
                y: 0,
                rotate: isCurrentPosition ? [0, 5, -5, 0] : 0
              }}
              transition={{
                duration: 0.3,
                rotate: {
                  duration: 2,
                  repeat: isCurrentPosition ? Infinity : 0,
                  repeatType: "reverse"
                }
              }}
              className={`
                w-4 h-4 xs:w-5 xs:h-5
                rounded-full flex items-center justify-center
                text-[8px] xs:text-[10px] font-bold
                border-2 border-white/50 shadow-md
                ${player.id === players[0].id
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900'
                  : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'}
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
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2
                     text-[8px] text-white font-medium
                     px-2 py-0.5 rounded-full bg-green-500/90
                     shadow-lg backdrop-blur-sm border border-white/20"
        >
          Click
        </motion.div>
      )}
    </motion.div>
  );
};

export default React.memo(BoardSpace); 