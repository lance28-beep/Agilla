'use client';

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Player } from '../types/game';

const PlayerSetup: React.FC = () => {
  const { dispatch } = useGame();
  const [players, setPlayers] = useState<Omit<Player, 'id'>[]>([
    { 
      name: '', 
      token: '', 
      position: 0, 
      score: 0, 
      consecutiveWrongAnswers: 0, 
      isSkippingTurn: false,
      previousPosition: 0,
      startingPosition: 0,
      moveHistory: []
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
        isSkippingTurn: false,
        previousPosition: 0,
        startingPosition: 0,
        moveHistory: []
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
      id: index + 1,
      previousPosition: 0,
      startingPosition: 0,
      moveHistory: [0]
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
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
      {/* About the Game Section */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-xl transition-all hover:shadow-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 overflow-y-auto p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-center animate-fadeIn">
          About the Game
        </h2>

        {/* Game Description */}
        <div className="p-4 bg-blue-50/80 dark:bg-blue-900/30 rounded-lg transform transition-all hover:scale-[1.01] animate-slideUp shadow-glow">
          <div id="game-details" className="space-y-4">
            <p className="text-xs md:text-sm text-blue-700 dark:text-blue-200">
              AP GILA EKO9 is an innovative educational board game that transforms complex economic concepts into an exciting adventure! Through interactive gameplay, players navigate a dynamic board filled with challenges, opportunities, and strategic decisions that mirror real-world economic scenarios.
            </p>
            <div className="space-y-4 text-xs md:text-sm text-blue-700 dark:text-blue-200">
              <div className="transform transition-all hover:translate-x-2 flex items-start gap-3">
                <span className="text-base mt-1">🎯</span>
                <div>
                  <strong>Goal:</strong>
                  <p className="text-xs opacity-90 mt-1">Race to the finish line by answering questions correctly, managing resources wisely, and making strategic decisions. The first player to reach the end wins!</p>
                </div>
              </div>
              <div className="transform transition-all hover:translate-x-2 flex items-start gap-3">
                <span className="text-base mt-1">📚</span>
                <div>
                  <strong>Learn about:</strong>
                  <ul className="text-xs opacity-90 list-disc list-inside mt-2 space-y-1">
                    <li>Opportunity Cost: Understanding the value of choices</li>
                    <li>Trade-offs: Making decisions with limited resources</li>
                    <li>Marginal Thinking: Analyzing incremental benefits and costs</li>
                    <li>Incentives: How rewards and penalties influence decisions</li>
                    <li>Scarcity: Managing limited resources effectively</li>
                  </ul>
                </div>
              </div>
              <div className="transform transition-all hover:translate-x-2 flex items-start gap-3">
                <span className="text-base mt-1">🎲</span>
                <div>
                  <strong>Game Features:</strong>
                  <ul className="text-xs opacity-90 list-disc list-inside mt-2 space-y-1">
                    <li>Interactive question spaces with immediate feedback</li>
                    <li>Dynamic event cards that simulate market conditions</li>
                    <li>Bonus spaces for strategic advantages</li>
                    <li>Checkpoint system to track progress</li>
                    <li>Consequence system for wrong answers</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Project Information */}
            <div className="mt-6 pt-4 border-t border-blue-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-800 dark:text-blue-100 mb-4">
                Project for SSE206 - Assessment Methods and Materials Development in Social Studies
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">1</span>
                    Sub-Team 1: Materials Development
                  </h4>
                  <ul className="text-[10px] space-y-1 text-blue-600 dark:text-blue-200">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500 dark:text-blue-400">•</span> Lyne C. Villegas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500 dark:text-blue-400">•</span> Arvin Maruya
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500 dark:text-blue-400">•</span> Paul Lenard Redondo
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">2</span>
                    Sub-Team 2: Assessment Methods
                  </h4>
                  <ul className="text-[10px] space-y-1 text-blue-600 dark:text-blue-200">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500 dark:text-blue-400">•</span> Jojo Natanauan
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500 dark:text-blue-400">•</span> Eulysses Ferreria
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500 dark:text-blue-400">•</span> Ruel Garro
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-[10px] font-medium text-blue-700 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-900/50 py-1.5 px-3 rounded-full inline-block">
                  Professor: <span className="font-semibold">Roel Cantada</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Setup Section */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-xl transition-all hover:shadow-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 overflow-y-auto p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-center animate-fadeIn">
          Add Players
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 animate-slideUp">
          <div className="space-y-4">
            {players.map((player, index) => (
              <div 
                key={index} 
                className="p-4 bg-white/80 dark:bg-gray-700/80 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-600 animate-pulse-glow"
              >
                <div className="flex items-center gap-3 mb-3">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label 
                      htmlFor={`player-${index}-name`} 
                      className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Name
                    </label>
                    <input
                      id={`player-${index}-name`}
                      type="text"
                      value={player.name}
                      onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all duration-200 text-sm"
                      placeholder="Enter player name"
                    />
                  </div>
                  <div>
                    <label 
                      htmlFor={`player-${index}-token`} 
                      className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Token
                    </label>
                    <select
                      id={`player-${index}-token`}
                      value={player.token}
                      onChange={(e) => handlePlayerChange(index, 'token', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all duration-200 text-sm"
                    >
                      <option value="">Select a token</option>
                      {availableTokens
                        .filter(token => !players.some(p => p.token === token && p !== players[index]))
                        .map((token) => (
                          <option key={token} value={token}>
                            {token}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={handleAddPlayer}
              disabled={players.length >= 4}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg
                       hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all transform hover:scale-105 hover:shadow-lg active:scale-95
                       text-sm font-medium tracking-wide"
            >
              Add Player
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg
                       hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all transform hover:scale-105 hover:shadow-lg active:scale-95
                       text-sm font-medium tracking-wide"
            >
              Start Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerSetup; 