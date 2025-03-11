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
    if (index === currentPlayerPosition) return 'bg-yellow-300 dark:bg-yellow-600';
    
    switch (type) {
      case 'start':
        return 'bg-green-500 dark:bg-green-700';
      case 'finish':
        return 'bg-red-500 dark:bg-red-700';
      case 'question':
        return 'bg-blue-500 dark:bg-blue-700';
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
        return 'bg-gray-500 dark:bg-gray-700';
    }
  };

  const getSpaceIcon = (type: string) => {
    switch (type) {
      case 'start':
        return '🏁';
      case 'finish':
        return '🎯';
      case 'question':
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
        return '';
    }
  };

  const getSpaceTooltip = (type: string) => {
    switch (type) {
      case 'start':
        return 'Starting point';
      case 'finish':
        return 'Finish line - reach here to win!';
      case 'question':
        return 'Answer a question to earn points';
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
        return '';
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
              ${getSpaceColor(space.type, space.id)}
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