'use client';

import React from 'react';
import { useGame } from '../context/GameContext';
import { Space } from '../types/game';

interface GameBoardProps {
  spaces: Space[];
  onSpaceClick: (spaceType: string) => void;
  currentPlayerPosition: number;
  canInteractWithSpace: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ spaces, onSpaceClick, currentPlayerPosition, canInteractWithSpace }) => {
  const { state } = useGame();

  const getSpaceColor = (type: string, index: number, points: number = 1) => {
    if (index === currentPlayerPosition) {
      return 'bg-yellow-300 dark:bg-yellow-500 animate-pulse';
    }

    if (type === 'start') return 'bg-green-400 dark:bg-green-600';
    if (type === 'finish') return 'bg-red-400 dark:bg-red-600';

    // Color based on points
    switch (points) {
      case 5:
        return 'bg-purple-400 dark:bg-purple-600';
      case 3:
        return 'bg-blue-400 dark:bg-blue-600';
      case 1:
      default:
        return 'bg-cyan-400 dark:bg-cyan-600';
    }
  };

  const getSpaceIcon = (type: string) => {
    switch (type) {
      case 'start':
        return '🎯';
      case 'finish':
        return '🏁';
      default:
        return '❓';
    }
  };

  const getSpaceTooltip = (type: string, points: number = 1) => {
    switch (type) {
      case 'start':
        return 'Start - Begin your journey!';
      case 'finish':
        return 'Finish - Win the game!';
      default:
        return `Question - ${points} point${points !== 1 ? 's' : ''}`;
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
            className={`
              relative aspect-square rounded-lg shadow-md
              ${getSpaceColor(space.type, space.id, space.points)}
              ${canInteractWithSpace && space.id === currentPlayerPosition ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed'}
              ${space.id !== currentPlayerPosition && 'opacity-90'}
              transition-all duration-300 ease-out
              flex items-center justify-center text-2xl
              group
            `}
            title={getSpaceTooltip(space.type, space.points)}
          >
            <span className="transform group-hover:scale-125 transition-transform">
              {getSpaceIcon(space.type)}
            </span>
            {space.type !== 'start' && space.type !== 'finish' && (
              <span className="absolute bottom-1 right-1 text-xs font-bold bg-white/90 dark:bg-gray-800/90 rounded-full px-1.5 py-0.5">
                {space.points || 1}p
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Space Type Legend */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Board Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { type: 'start', points: 0, label: 'Start' },
            { type: 'question', points: 1, label: '1 Point Question' },
            { type: 'question', points: 3, label: '3 Points Question' },
            { type: 'question', points: 5, label: '5 Points Question' },
            { type: 'finish', points: 0, label: 'Finish' }
          ].map(({ type, points, label }) => (
            <div key={`${type}-${points}`} className="flex items-center gap-2 group relative">
              <div className={`w-8 h-8 rounded-full ${getSpaceColor(type, -1, points)} flex items-center justify-center`}>
                {getSpaceIcon(type)}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard; 