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

  const getSpaceColor = (type: string, index: number) => {
    if (index === currentPlayerPosition) {
      return 'bg-yellow-300 dark:bg-yellow-500 animate-pulse';
    }

    switch (type) {
      case 'start':
        return 'bg-green-400 dark:bg-green-600';
      case 'finish':
        return 'bg-red-400 dark:bg-red-600';
      case 'question':
        const points = spaces[index].points || 10;
        if (points >= 50) return 'bg-purple-400 dark:bg-purple-600';
        if (points >= 30) return 'bg-blue-400 dark:bg-blue-600';
        if (points >= 20) return 'bg-indigo-400 dark:bg-indigo-600';
        return 'bg-cyan-400 dark:bg-cyan-600';
      case 'event':
        return 'bg-purple-500 dark:bg-purple-700';
      case 'powerup':
        return 'bg-yellow-500 dark:bg-yellow-700';
      case 'challenge':
        return 'bg-orange-500 dark:bg-orange-700';
      case 'checkpoint':
        return 'bg-teal-500 dark:bg-teal-700';
      case 'bonus':
        return 'bg-emerald-500 dark:bg-emerald-700';
      case 'penalty':
        return 'bg-rose-500 dark:bg-rose-700';
      default:
        return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  const getSpaceIcon = (type: string, points?: number) => {
    switch (type) {
      case 'start':
        return '🚀';
      case 'finish':
        return '🏁';
      case 'question':
        if (points && points >= 50) return '⭐';
        if (points && points >= 30) return '💫';
        if (points && points >= 20) return '✨';
        return '❓';
      case 'event':
        return '⚡';
      case 'powerup':
        return '⭐';
      case 'challenge':
        return '🎲';
      case 'checkpoint':
        return '🚩';
      case 'bonus':
        return '🎁';
      case 'penalty':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const getSpaceTooltip = (type: string, points?: number) => {
    switch (type) {
      case 'start':
        return 'Start - Begin your journey!';
      case 'finish':
        return 'Finish - Win the game!';
      case 'question':
        return `Question - ${points || 10} points`;
      case 'event':
        return 'Random event - could be good or bad!';
      case 'powerup':
        return 'Get a power-up to help you advance';
      case 'challenge':
        return 'Face a challenge for extra points';
      case 'checkpoint':
        return 'Safe spot - save your progress';
      case 'bonus':
        return 'Get bonus points or advantages';
      case 'penalty':
        return 'Watch out for penalties!';
      default:
        return 'Unknown space';
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
              ${getSpaceColor(space.type, space.id)}
              ${canInteractWithSpace ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed opacity-75'}
              transition-all duration-300 ease-out
              flex items-center justify-center text-2xl
              group
            `}
            title={getSpaceTooltip(space.type, space.points)}
          >
            <span className="transform group-hover:scale-125 transition-transform">
              {getSpaceIcon(space.type, space.points)}
            </span>
            {space.points && space.type === 'question' && (
              <span className="absolute bottom-1 right-1 text-xs font-bold bg-white dark:bg-gray-800 rounded-full px-1">
                {space.points}
              </span>
            )}
            {space.id === currentPlayerPosition && (
              <div className="absolute inset-0 bg-yellow-300 dark:bg-yellow-500 opacity-50 rounded-lg animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* Space Type Legend */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Board Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['start', 'finish', 'checkpoint', 'question', 'event', 'powerup', 'penalty', 'challenge'].map((type) => (
            <div key={type} className="flex items-center gap-2 group relative">
              <div className={`w-8 h-8 rounded-full ${getSpaceColor(type, 0)} flex items-center justify-center`}>
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