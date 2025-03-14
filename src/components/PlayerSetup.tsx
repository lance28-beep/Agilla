'use client';

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Player } from '../types/game';

const TOKENS = ['🔵', '🔴', '🟡', '🟢', '🟣', '🟤'];

const PlayerSetup: React.FC = () => {
  const { dispatch } = useGame();
  const [players, setPlayers] = useState<Omit<Player, 'id'>[]>([
    { 
      name: '', 
      token: '', 
      position: 0, 
      score: 0, 
      consecutiveWrongAnswers: 0, 
      isSkippingTurn: false 
    }
  ]);

  const availableTokens = ['🦁', '🐯', '🐘', '🦊', '🐼', '🦄', '🐢', '🦉'];

  function addPlayer() {
    console.log("Adding player");
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
  }

  function removePlayer(index: number) {
    console.log("Removing player at index", index);
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  }

  function updatePlayer(index: number, field: keyof Omit<Player, 'id'>, value: string) {
    console.log("Updating player", index, field, value);
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  }

  function startGame() {
    console.log("Start game clicked");
    
    // Validate player data
    if (players.some(p => !p.name || !p.token)) {
      alert('All players must have names and tokens!');
      return;
    }

    // Check for unique names and tokens
    const names = new Set(players.map(p => p.name));
    const tokens = new Set(players.map(p => p.token));
    if (names.size !== players.length || tokens.size !== players.length) {
      alert('Players must have unique names and tokens!');
      return;
    }

    // Create players with IDs
    const playersWithIds = players.map((player, index) => ({
      ...player,
      id: index + 1
    }));

    console.log("Dispatching START_GAME with players:", playersWithIds);
    
    // Dispatch the START_GAME action
    dispatch({
      type: 'START_GAME',
      payload: playersWithIds
    });
  }

  const isFormValid = players.every(p => p.name && p.token);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      startGame();
    }
  };

  const handlePlayerChange = (index: number, field: 'name' | 'token', value: string) => {
    updatePlayer(index, field, value);
  };

  const handleAddPlayer = () => {
    if (players.length < 4) {
      addPlayer();
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-xl transition-all hover:shadow-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 overflow-auto max-h-[calc(100vh-12rem)]">
      <h2 className="text-xl md:text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-center animate-fadeIn">
        Welcome to AP GILA EKO9 Board Game
      </h2>

      {/* Game Description */}
      <div className="mb-4 p-3 bg-blue-50/80 dark:bg-blue-900/30 rounded-lg transform transition-all hover:scale-[1.01] animate-slideUp shadow-glow overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-blue-800 dark:text-blue-100">
            About the Game
          </h3>
          <button 
            type="button" 
            onClick={() => document.getElementById('game-details')?.classList.toggle('hidden')}
            className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-700"
          >
            {document.getElementById('game-details')?.classList.contains('hidden') ? 'Show Details' : 'Hide Details'}
          </button>
        </div>
        
        <div id="game-details">
          <p className="text-xs md:text-sm text-blue-700 dark:text-blue-200 mb-3">
            AP GILA EKO9 is an educational board game designed to teach economic principles through interactive gameplay.
            Players move across the board, answering questions about economics, facing challenges, and making strategic decisions.
          </p>
          <div className="space-y-1 text-xs md:text-sm text-blue-700 dark:text-blue-200">
            <p className="transform transition-all hover:translate-x-2 flex items-center gap-2">
              <span className="text-base">🎯</span> <strong>Goal:</strong> Be the first player to reach 100 points by answering questions correctly.
            </p>
            <p className="transform transition-all hover:translate-x-2 flex items-center gap-2">
              <span className="text-base">📚</span> <strong>Learn about:</strong> Opportunity Cost, Trade-offs, Marginal Thinking
            </p>
            <p className="transform transition-all hover:translate-x-2 flex items-center gap-2">
              <span className="text-base">🎲</span> <strong>Features:</strong> Interactive questions, events, power-ups
            </p>
          </div>
          
          {/* Project Information */}
          <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-100 mb-2">
              Project for SSE206 - Assessment Methods and Materials Development in Social Studies
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className="bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg">
                <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
                  <span className="w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">1</span>
                  Sub-Team 1: Materials Development
                </h4>
                <ul className="text-[10px] space-y-0.5 text-blue-600 dark:text-blue-200">
                  <li className="flex items-center gap-1">
                    <span className="text-blue-500 dark:text-blue-400">•</span> Lyne C. Villegas
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="text-blue-500 dark:text-blue-400">•</span> Arvin Maruya
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="text-blue-500 dark:text-blue-400">•</span> Paul Lenard Redondo
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg">
                <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
                  <span className="w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">2</span>
                  Sub-Team 2: Assessment Methods
                </h4>
                <ul className="text-[10px] space-y-0.5 text-blue-600 dark:text-blue-200">
                  <li className="flex items-center gap-1">
                    <span className="text-blue-500 dark:text-blue-400">•</span> Jojo Natanauan
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="text-blue-500 dark:text-blue-400">•</span> Eulysses Ferreria
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="text-blue-500 dark:text-blue-400">•</span> Ruel Garro
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-2 text-center">
              <p className="text-[10px] font-medium text-blue-700 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-900/50 py-1 px-2 rounded-full inline-block">
                Professor: <span className="font-semibold">Roel Cantada</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Player Setup Form */}
      <form onSubmit={handleSubmit} className="space-y-3 animate-slideUp">
        <div className="space-y-2 max-h-[calc(100vh-30rem)] overflow-auto pr-1">
          {players.map((player, index) => (
            <div 
              key={index} 
              className="p-3 bg-white/80 dark:bg-gray-700/80 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-600 animate-pulse-glow"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-sm
                  bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold
                  shadow-md animate-float
                `}>
                  {index + 1}
                </div>
                <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                  Player {index + 1}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label 
                    htmlFor={`player-${index}-name`} 
                    className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id={`player-${index}-name`}
                    type="text"
                    value={player.name}
                    onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200 text-sm"
                    required
                  />
                </div>
                <div>
                  <label 
                    htmlFor={`player-${index}-token`} 
                    className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Token
                  </label>
                  <select
                    id={`player-${index}-token`}
                    value={player.token}
                    onChange={(e) => handlePlayerChange(index, 'token', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200 text-sm"
                    required
                  >
                    <option value="">Select a token</option>
                    {availableTokens.map((token) => (
                      <option 
                        key={token} 
                        value={token}
                        disabled={players.some(p => p.token === token && p !== player)}
                      >
                        {token}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-between mt-3">
          <button
            type="button"
            onClick={handleAddPlayer}
            disabled={players.length >= 4}
            className={`
              px-3 py-1.5 rounded-lg font-medium text-xs
              ${players.length >= 4 
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95'}
            `}
          >
            {players.length >= 4 ? 'Max Players' : '+ Add Player'}
          </button>
          
          <button
            type="submit"
            disabled={!isFormValid}
            className={`
              px-4 py-2 rounded-lg font-semibold text-white text-sm
              ${!isFormValid 
                ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 button-hover-effect'}
            `}
          >
            Start Game
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerSetup; 