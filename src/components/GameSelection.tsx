import React, { useState } from 'react';
import { GameDifficulty } from '../types/game';
import BeginnerGame from './BeginnerGame';

const GameSelection: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty | null>(null);
  const [bestMoves, setBestMoves] = useState<Record<GameDifficulty, number | null>>({
    beginner: null,
    intermediate: null,
    expert: null,
  });

  const handleGameComplete = (moves: number) => {
    if (selectedDifficulty) {
      const currentBest = bestMoves[selectedDifficulty];
      if (!currentBest || moves < currentBest) {
        setBestMoves(prev => ({
          ...prev,
          [selectedDifficulty]: moves,
        }));
      }
    }
  };

  const renderDifficultySelection = () => (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">Select Game Difficulty</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['beginner', 'intermediate', 'expert'] as GameDifficulty[]).map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => setSelectedDifficulty(difficulty)}
            className={`
              p-4 rounded-lg text-lg font-semibold capitalize transition-all duration-200
              ${difficulty === selectedDifficulty
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
              }
            `}
          >
            {difficulty}
            {bestMoves[difficulty] && (
              <div className="text-sm mt-2">
                Best: {bestMoves[difficulty]} moves
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderGame = () => {
    if (!selectedDifficulty) return null;

    switch (selectedDifficulty) {
      case 'beginner':
        return (
          <div>
            <button
              onClick={() => setSelectedDifficulty(null)}
              className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              ← Back to Selection
            </button>
            <BeginnerGame
              difficulty={selectedDifficulty}
              onComplete={handleGameComplete}
            />
          </div>
        );
      // TODO: Add other difficulty components when implemented
      default:
        return (
          <div className="text-center p-4">
            <p>Coming soon!</p>
            <button
              onClick={() => setSelectedDifficulty(null)}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              ← Back to Selection
            </button>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!selectedDifficulty ? renderDifficultySelection() : renderGame()}
    </div>
  );
};

export default GameSelection; 