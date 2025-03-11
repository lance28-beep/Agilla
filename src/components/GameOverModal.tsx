import React from 'react';
import { useGame } from '../context/GameContext';
import { Player } from '../types/game';

interface GameOverModalProps {
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ onRestart }) => {
  const { state } = useGame();

  // Sort players by score in descending order
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  // If there are no players, show a simple message
  if (!winner) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full mx-4 transform animate-fadeIn">
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-6">
            Game Over!
          </h2>
          <p className="text-center text-gray-600 mb-6">
            No players in the game.
          </p>
          <div className="flex justify-center">
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full mx-4 transform animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-indigo-900 mb-6">
          Game Over!
        </h2>
        
        {/* Winner Section */}
        <div className="text-center mb-8">
          <div className="text-xl font-semibold text-indigo-600 mb-2">
            Winner
          </div>
          <div className="bg-indigo-100 rounded-lg p-4 mb-4 winner-animation">
            <div className="text-4xl mb-2">{winner.token}</div>
            <div className="text-2xl font-bold text-indigo-900">{winner.name}</div>
            <div className="text-lg text-indigo-600">Score: {winner.score}</div>
          </div>
        </div>

        {/* All Players Ranking */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Final Ranking</h3>
          <div className="space-y-2">
            {sortedPlayers.map((player: Player, index: number) => (
              <div
                key={player.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? 'bg-yellow-100' : 'bg-gray-50'
                } animate-slideIn`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-600">
                    #{index + 1}
                  </span>
                  <span className="text-xl">{player.token}</span>
                  <span className="font-medium">{player.name}</span>
                </div>
                <span className="font-semibold text-indigo-600">
                  {player.score} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors hover-scale"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal; 