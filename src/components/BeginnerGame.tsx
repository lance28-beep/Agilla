import React, { useState, useEffect } from 'react';
import { GameProps, GameCell } from '../types/game';

const BeginnerGame: React.FC<GameProps> = ({ difficulty, onComplete }) => {
  const [cells, setCells] = useState<GameCell[]>([]);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [moveHistory, setMoveHistory] = useState<number[]>([0]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Initialize game board
  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const initialCells: GameCell[] = Array.from({ length: 16 }, (_, index) => ({
      id: index,
      isBlocked: false,
      isStart: index === 0,
      isEnd: index === 15,
    }));

    // Set blocked cells for beginner layout
    const blockedCells = [2, 3, 7, 8, 11, 12];
    blockedCells.forEach(index => {
      initialCells[index].isBlocked = true;
    });

    setCells(initialCells);
    setCurrentPosition(0);
    setMoves(0);
    setMoveHistory([0]);
    setIsCompleted(false);
    setShowHint(false);
  };

  const handleMove = (targetIndex: number) => {
    if (isCompleted) return;
    
    const isValidMove = (current: number, target: number) => {
      if (cells[target].isBlocked) return false;
      
      const currentRow = Math.floor(current / 4);
      const currentCol = current % 4;
      const targetRow = Math.floor(target / 4);
      const targetCol = target % 4;
      
      return (
        (Math.abs(currentRow - targetRow) === 1 && currentCol === targetCol) ||
        (Math.abs(currentCol - targetCol) === 1 && currentRow === targetRow)
      );
    };

    if (isValidMove(currentPosition, targetIndex)) {
      setCurrentPosition(targetIndex);
      setMoves(prev => prev + 1);
      setMoveHistory(prev => [...prev, targetIndex]);
      setShowHint(false);
      
      if (cells[targetIndex].isEnd) {
        setIsCompleted(true);
        onComplete(moves + 1);
      }
    }
  };

  const undoMove = () => {
    if (moveHistory.length > 1) {
      const newHistory = moveHistory.slice(0, -1);
      setMoveHistory(newHistory);
      setCurrentPosition(newHistory[newHistory.length - 1]);
      setMoves(prev => prev - 1);
      setShowHint(false);
    }
  };

  const getHint = () => {
    // Simple hint system showing possible moves
    const currentRow = Math.floor(currentPosition / 4);
    const currentCol = currentPosition % 4;
    const possibleMoves = [];

    // Check all adjacent cells
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1] // up, down, left, right
    ];

    for (const [dx, dy] of directions) {
      const newRow = currentRow + dx;
      const newCol = currentCol + dy;
      
      if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
        const targetIndex = newRow * 4 + newCol;
        if (!cells[targetIndex].isBlocked) {
          possibleMoves.push(targetIndex);
        }
      }
    }

    setShowHint(true);
    return possibleMoves;
  };

  const possibleMoves = showHint ? getHint() : [];

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Beginner Stage</h2>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {cells.map((cell, index) => (
          <div
            key={cell.id}
            onClick={() => handleMove(index)}
            className={`
              w-20 h-20 rounded-lg cursor-pointer transition-all duration-200
              ${cell.isBlocked ? 'bg-gray-400' : 'bg-blue-200 hover:bg-blue-300'}
              ${cell.isStart ? 'bg-green-400' : ''}
              ${cell.isEnd ? 'bg-purple-400' : ''}
              ${currentPosition === index ? 'ring-4 ring-yellow-400' : ''}
              ${showHint && possibleMoves.includes(index) ? 'ring-2 ring-green-300' : ''}
              flex items-center justify-center relative
            `}
          >
            {cell.isStart && <span className="text-2xl">🚀</span>}
            {cell.isEnd && <span className="text-2xl">🏁</span>}
            {moveHistory.includes(index) && !cell.isStart && !cell.isEnd && (
              <div className="absolute top-1 left-1 text-xs bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {moveHistory.indexOf(index) + 1}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-lg">Moves: {moves}</span>
          {isCompleted && <div className="text-green-500 font-bold">Level Complete! 🎉</div>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={undoMove}
            disabled={moveHistory.length <= 1}
            className={`px-4 py-2 rounded-lg ${
              moveHistory.length <= 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Undo Move
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          <button
            onClick={initializeBoard}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeginnerGame; 