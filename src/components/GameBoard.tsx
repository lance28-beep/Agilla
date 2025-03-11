'use client';

import React, { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Space } from '../types/game';

interface GameBoardProps {
  onSpaceClick: (spaceType: string) => void;
  currentPlayerPosition: number;
  canInteractWithSpace: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ onSpaceClick, currentPlayerPosition, canInteractWithSpace }) => {
  const { state } = useGame();

  // Use useMemo to create stable space generation with 80% questions
  const spaces = useMemo(() => {
    const spaces: Space[] = Array.from({ length: 100 }, (_, index) => {
      if (index === 0) return { id: index, type: 'start' };
      if (index === 99) return { id: index, type: 'finish' };
      if (index % 20 === 0) return { id: index, type: 'checkpoint' };
      
      // Enhanced space distribution with 80% questions
      const random = Math.random();
      if (random < 0.80) return { id: index, type: 'question' };
      if (random < 0.85) return { id: index, type: 'event' };
      if (random < 0.90) return { id: index, type: 'powerup' };
      if (random < 0.95) return { id: index, type: 'penalty' };
      return { id: index, type: 'challenge' };
    });
    return spaces;
  }, []); // Empty dependency array ensures spaces are generated once

  const getSpaceColor = (type: string) => {
    switch (type) {
      case 'start': return 'bg-green-500';
      case 'finish': return 'bg-red-500';
      case 'checkpoint': return 'bg-yellow-500';
      case 'question': return 'bg-blue-500';
      case 'event': return 'bg-purple-500';
      case 'powerup': return 'bg-cyan-500';
      case 'penalty': return 'bg-rose-500';
      case 'challenge': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getSpaceIcon = (type: string) => {
    switch (type) {
      case 'start': return '🏁';
      case 'finish': return '🎯';
      case 'checkpoint': return '🚩';
      case 'question': return '❓';
      case 'event': return '⚡';
      case 'powerup': return '🎮';
      case 'penalty': return '⚠️';
      case 'challenge': return '🎲';
      default: return '';
    }
  };

  const getSpaceTooltip = (type: string) => {
    switch (type) {
      case 'start': return 'Starting Point - Begin your journey here!';
      case 'finish': return 'Finish Line - Keep playing until someone reaches 100 points!';
      case 'checkpoint': return 'Checkpoint - Earn 15 bonus points!';
      case 'question': return 'Question Card - Answer correctly to earn 20 points!';
      case 'event': return 'Event Card - Random events that can help or challenge you!';
      case 'powerup': return 'Power-up Card - Get special abilities like double points or extra moves!';
      case 'penalty': return 'Penalty Space - Lose 10 points unless you have a shield!';
      case 'challenge': return 'Challenge Space - High risk, high reward! Win 30 points or lose 20!';
      default: return '';
    }
  };

  const getPlayerTokens = (spaceId: number) => {
    return state.players.filter(player => player.position === spaceId);
  };

  const handleSpaceClick = (space: Space) => {
    if (!canInteractWithSpace || space.id !== currentPlayerPosition) return;
    if (['start', 'finish'].includes(space.type)) return;
    onSpaceClick(space.type);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 overflow-x-auto">
      <div className="grid grid-cols-10 gap-2 min-w-[1000px]">
        {spaces.map((space) => (
          <div
            key={space.id}
            onClick={() => handleSpaceClick(space)}
            title={getSpaceTooltip(space.type)}
            className={`
              relative aspect-square rounded-lg shadow-md
              ${getSpaceColor(space.type)}
              flex items-center justify-center
              border-2 border-gray-200
              transition-all duration-300
              ${space.id === currentPlayerPosition && 'ring-4 ring-indigo-500 ring-offset-2 scale-110'}
              ${
                canInteractWithSpace && space.id === currentPlayerPosition && !['start', 'finish'].includes(space.type)
                  ? 'cursor-pointer hover:opacity-80 hover:scale-105'
                  : space.id === currentPlayerPosition
                    ? 'cursor-default'
                    : 'opacity-50 cursor-not-allowed'
              }
              group
            `}
          >
            {/* Space number */}
            <span className="absolute top-1 left-1 text-xs text-white font-bold">
              {space.id + 1}
            </span>
            
            {/* Space icon */}
            <span className="text-xl" role="img" aria-label={space.type}>
              {getSpaceIcon(space.type)}
            </span>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {getSpaceTooltip(space.type)}
            </div>

            {/* Player tokens */}
            <div className="absolute bottom-1 left-1 flex flex-wrap gap-1 max-w-[80%]">
              {getPlayerTokens(space.id).map((player) => (
                <div
                  key={player.id}
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    ${state.currentPlayerIndex === player.id - 1 ? 'bg-yellow-300 animate-pulse' : 'bg-white'}
                    text-sm font-bold border-2 border-gray-800 shadow-md
                    transform transition-transform
                    ${state.currentPlayerIndex === player.id - 1 && 'scale-125'}
                  `}
                  title={`${player.name}'s token`}
                >
                  {player.token}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Space Type Legend */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Board Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['start', 'finish', 'checkpoint', 'question', 'event', 'powerup', 'penalty', 'challenge'].map((type) => (
            <div key={type} className="flex items-center gap-2 group relative">
              <div className={`w-8 h-8 rounded-full ${getSpaceColor(type)} flex items-center justify-center`}>
                {getSpaceIcon(type)}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                {type}
              </span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {getSpaceTooltip(type)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard; 