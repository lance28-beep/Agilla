'use client';

import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Player } from '../types/game';

const TOKENS = ['🔵', '🔴', '🟡', '🟢', '🟣', '🟤'];

export default function PlayerSetup() {
  const { dispatch } = useGame();
  const [players, setPlayers] = useState<Omit<Player, 'id'>[]>([
    { name: '', token: '', position: 0, score: 0, consecutiveWrongAnswers: 0, isSkippingTurn: false }
  ]);

  const addPlayer = () => {
    if (players.length < 6) {
      setPlayers([...players, { 
        name: '', 
        token: '', 
        position: 0, 
        score: 0,
        consecutiveWrongAnswers: 0,
        isSkippingTurn: false
      }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, field: keyof Omit<Player, 'id'>, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const startGame = () => {
    if (players.some(p => !p.name || !p.token)) {
      alert('All players must have names and tokens!');
      return;
    }

    const names = new Set(players.map(p => p.name));
    const tokens = new Set(players.map(p => p.token));
    if (names.size !== players.length || tokens.size !== players.length) {
      alert('Players must have unique names and tokens!');
      return;
    }

    const playersWithIds = players.map((player, index) => ({
      ...player,
      id: index + 1
    }));

    dispatch({
      type: 'START_GAME',
      payload: playersWithIds
    });
  };

  return (
    <div className="max-w-lg mx-auto p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all hover:shadow-2xl transform hover:scale-[1.02]">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white text-center animate-fadeIn">
        Welcome to AGILA Board Game
      </h2>

      {/* Game Description */}
      <div className="mb-6 md:mb-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg transform transition-all hover:scale-[1.02] animate-slideUp">
        <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-100">
          About the Game
        </h3>
        <p className="text-sm md:text-base text-blue-700 dark:text-blue-200 mb-4">
          AGILA is an educational board game designed to teach economic principles through interactive gameplay.
          Players move across the board, answering questions about economics, facing challenges, and making strategic decisions.
        </p>
        <div className="space-y-2 text-sm md:text-base text-blue-700 dark:text-blue-200">
          <p className="transform transition-all hover:translate-x-2">
            🎯 <strong>Goal:</strong> Be the first player to reach 100 points by answering questions correctly and making smart economic decisions.
          </p>
          <p className="transform transition-all hover:translate-x-2">
            📚 <strong>Learn about:</strong> Opportunity Cost, Trade-offs, Marginal Thinking, Incentives, and Scarcity
          </p>
          <p className="transform transition-all hover:translate-x-2">
            🎲 <strong>Features:</strong> Interactive questions, events, power-ups, and challenges
          </p>
        </div>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        {players.map((player, index) => (
          <div 
            key={index} 
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg transform transition-all hover:scale-[1.02] animate-fadeIn"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <input
              type="text"
              placeholder="Player Name"
              value={player.name}
              onChange={(e) => updatePlayer(index, 'name', e.target.value)}
              className="flex-1 p-2 border rounded bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white 
                       transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={20}
            />

            <div className="relative w-full sm:w-24">
              <select
                value={player.token}
                onChange={(e) => updatePlayer(index, 'token', e.target.value)}
                className="w-full sm:w-24 p-2 pl-10 text-lg border rounded bg-white dark:bg-gray-600 dark:border-gray-500 
                         dark:text-white appearance-none cursor-pointer transition-all
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Token</option>
                {TOKENS.filter(token => !players.some(p => p.token === token)).map(token => (
                  <option key={token} value={token}>{token}</option>
                ))}
              </select>
              {player.token && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl animate-bounce">
                  {player.token}
                </div>
              )}
            </div>

            <button
              onClick={() => removePlayer(index)}
              disabled={players.length === 1}
              className="p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-50 dark:hover:bg-red-900
                       transition-all transform hover:scale-110 active:scale-95"
              aria-label="Remove player"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={addPlayer}
          disabled={players.length >= 6}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 
                   transition-all transform hover:scale-105 hover:shadow-lg active:scale-95"
        >
          Add Player
        </button>

        <button
          onClick={startGame}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 
                   transition-all transform hover:scale-105 hover:shadow-lg active:scale-95"
        >
          Start Game
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center animate-pulse">
        {players.length < 6 ? `You can add ${6 - players.length} more player(s)` : 'Maximum players reached'}
      </div>
    </div>
  );
} 