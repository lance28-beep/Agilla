'use client';

import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import GameBoard from '../components/GameBoard';
import QuestionModal from '../components/QuestionModal';
import EventModal from '../components/EventModal';
import PlayerSetup from '../components/PlayerSetup';
import GameControlModal from '../components/GameControlModal';
import { questions, events } from '../data/gameData';
import GameCommentary from '../components/GameCommentary';
import { Space } from '../types/game';
import React from 'react';

// Define player type
interface Player {
  id: number;
  name: string;
  token: string;
  position: number;
  score: number;
  isSkippingTurn: boolean;
}

// Extracted PlayerStats component
const PlayerStats = React.memo(({ player, isCurrentPlayer }: { player: Player, isCurrentPlayer: boolean }) => (
  <div
    className={`
      relative overflow-hidden p-4 md:p-5 rounded-xl shadow-lg 
      transition-all duration-300 transform hover:shadow-2xl
      ${isCurrentPlayer
        ? 'bg-gradient-to-br from-indigo-50/90 to-purple-50/90 dark:from-indigo-900/50 dark:to-purple-900/50 scale-105 hover:scale-110'
        : 'bg-white/90 dark:bg-gray-800/90 hover:scale-105'}
    `}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50" />
    
    <div className="flex items-center gap-3">
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center text-2xl
        ${isCurrentPlayer 
          ? 'bg-gradient-to-br from-yellow-300 to-yellow-400 animate-pulse shadow-lg' 
          : 'bg-gradient-to-br from-gray-100 to-white dark:from-gray-700 dark:to-gray-600'}
        font-bold border-2 border-current transition-all
        ${isCurrentPlayer ? 'text-yellow-600' : 'text-gray-600 dark:text-gray-300'}
      `}>
        {player.token}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">
          {player.name}
        </h3>
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Score:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-yellow-600 dark:text-yellow-400 text-lg">{player.score}</span>
              <span className="text-yellow-500">⭐</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Position:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-blue-600 dark:text-blue-400">{player.position + 1}</span>
              <span className="text-blue-500">📍</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {player.isSkippingTurn && (
      <div className="mt-3 py-2 px-3 bg-red-100 dark:bg-red-900/30 rounded-lg animate-pulse">
        <p className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
          <span>⏭️</span>
          Skipping Next Turn
        </p>
      </div>
    )}
  </div>
));

PlayerStats.displayName = 'PlayerStats';

// Extracted GameControls component
const GameControls = React.memo(({ 
  currentPlayer, 
  lastRoll, 
  canInteractWithSpace,
  onRollClick,
  onEndTurnClick 
}: {
  currentPlayer: Player;
  lastRoll: number | null;
  canInteractWithSpace: boolean;
  onRollClick: () => void;
  onEndTurnClick: () => void;
}) => (
  <div className="mb-6 md:mb-8 bg-white/90 dark:bg-gray-800/90 p-5 rounded-xl shadow-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            {currentPlayer?.name}
          </span>
          <span className="text-3xl animate-bounce">
            {currentPlayer?.token}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <span className="font-medium">Score:</span>
          <span className="font-bold text-yellow-600 dark:text-yellow-400">{currentPlayer?.score || 0}</span>
          <span className="text-yellow-500">⭐</span>
        </div>
      </div>
      <div className="flex gap-3 md:gap-4 w-full sm:w-auto justify-center sm:justify-end">
        <button
          onClick={onRollClick}
          disabled={!currentPlayer || currentPlayer.isSkippingTurn}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg
                    hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all transform hover:scale-105 hover:shadow-lg active:scale-95
                    font-semibold tracking-wide"
        >
          Roll Dice 🎲
        </button>
        <button
          onClick={onEndTurnClick}
          disabled={!lastRoll || !canInteractWithSpace}
          className="px-6 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg
                    hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all transform hover:scale-105 hover:shadow-lg active:scale-95
                    font-semibold tracking-wide"
        >
          End Turn ➡️
        </button>
      </div>
    </div>
  </div>
));

GameControls.displayName = 'GameControls';

export default function Home() {
  const { state, dispatch } = useGame();
  const [showGameControlModal, setShowGameControlModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [hasRolled, setHasRolled] = useState(false);
  const [canInteractWithSpace, setCanInteractWithSpace] = useState(false);
  const [commentary, setCommentary] = useState<{ message: string; type: 'success' | 'error' | 'info' }>({
    message: '',
    type: 'info'
  });

  const currentPlayer = state.players[state.currentPlayerIndex];

  const spaces: Space[] = Array.from({ length: 100 }, (_, index) => {
    if (index === 0) return { id: 0, type: 'start' };
    if (index === 99) return { id: 99, type: 'finish' };

    // Determine question difficulty based on specified distribution
    // 50% of questions are 1 point, 30% are 3 points, 20% are 5 points
    const random = Math.random();
    let points = 1; // Default (50% chance)
    
    if (random > 0.8) {
      points = 5; // 20% chance for 5 points (hardest)
    } else if (random > 0.5) {
      points = 3; // 30% chance for 3 points (medium)
    }

    return {
      id: index,
      type: "question",
      points
    };
  });

  const handleRollComplete = (value: number) => {
    setLastRoll(value);
    setHasRolled(true);
    setCommentary({ 
      message: `${currentPlayer.name} rolled a ${value}! Moving forward ${value} spaces.`,
      type: 'info'
    });
    
    dispatch({ type: 'MOVE_PLAYER', payload: value });
    setCanInteractWithSpace(true);
    setShowGameControlModal(false);
  };

  const handleQuestionAnswer = (isCorrect: boolean, points: number, correctAnswer?: string, explanation?: string) => {
    // Get the current space the player is on
    const currentSpace = spaces[currentPlayer.position];
    const spacePoints = currentSpace.points || 1; // Default to 1 if not defined
    
    if (isCorrect) {
      setCommentary({ 
        message: `✅ Correct answer! ${currentPlayer.name} earned ${spacePoints} points!`,
        type: 'success'
      });
      dispatch({
        type: 'UPDATE_SCORE',
        payload: { playerId: currentPlayer.id, points: spacePoints }
      });
    } else {
      // Check if player has points to lose
      const playerCurrentScore = currentPlayer.score || 0;
      const pointsToLose = playerCurrentScore > 0 ? -1 : 0;
      
      setCommentary({ 
        message: pointsToLose < 0 
          ? `❌ Incorrect. You lost 1 point. The correct answer is: ${correctAnswer}`
          : `❌ Incorrect. The correct answer is: ${correctAnswer}`,
        type: 'error'
      });
      
      dispatch({
        type: 'UPDATE_SCORE',
        payload: { playerId: currentPlayer.id, points: pointsToLose }
      });
    }
    
    setTimeout(() => {
      if (explanation) {
        setCommentary({
          message: `💡 ${explanation}`,
          type: 'info'
        });
      }
      
      setTimeout(() => {
        setShowQuestionModal(false);
        handleNextPlayer();
      }, 3000);
    }, 2000);
  };

  const handleEventEffect = () => {
    if (!state.currentEvent) return;
    
    const event = state.currentEvent;
    let message = '';
    
    switch (event.effect) {
      case 'skip':
        message = `${currentPlayer.name} must skip their next turn!`;
        dispatch({ type: 'SKIP_TURN', payload: currentPlayer.id });
        break;
      case 'move':
        message = `${currentPlayer.name} ${event.value > 0 ? 'advances' : 'moves back'} ${Math.abs(event.value)} spaces!`;
        dispatch({ type: 'MOVE_PLAYER', payload: event.value });
        break;
      case 'reroll':
        message = `${currentPlayer.name} gets to roll again!`;
        setShowGameControlModal(true);
        break;
    }
    
    setCommentary({ message, type: 'info' });
    setShowEventModal(false);
    
    if (event.effect !== 'reroll') {
      handleNextPlayer();
    }
  };

  const handleNextPlayer = () => {
    setLastRoll(null);
    setHasRolled(false);
    setCanInteractWithSpace(false);
    dispatch({ type: 'NEXT_PLAYER' });
    setCommentary({
      message: `Next player's turn!`,
      type: 'info'
    });
  };

  const handleSpaceClick = (spaceType: string) => {
    if (!hasRolled || !canInteractWithSpace) {
      setCommentary({
        message: "Please roll the dice first!",
        type: 'error'
      });
      return;
    }
    
    switch (spaceType) {
      case 'question':
        const unusedQuestions = questions.filter(q => !state.usedQuestionIds.has(q.id));
        if (unusedQuestions.length === 0) {
          dispatch({ type: 'RESET_USED_QUESTIONS' });
        }
        const question = unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
        if (question) {
          dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
          setShowQuestionModal(true);
          setCanInteractWithSpace(false);
        }
        break;
      case 'event':
        const event = events[Math.floor(Math.random() * events.length)];
        dispatch({ type: 'SET_CURRENT_EVENT', payload: event });
        setShowEventModal(true);
        setCanInteractWithSpace(false);
        break;
      default:
        handleNextPlayer();
    }
  };

  // Check for winner
  useEffect(() => {
    if (state.winner) {
      setCommentary({
        message: `🎉 Congratulations ${state.winner.name}! You've won the game with ${state.winner.score} points! 🎉`,
        type: 'success'
      });
    }
  }, [state.winner]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 flex-grow relative">
        {/* Game Header with Enhanced Styling */}
        <div className="text-center mb-8 md:mb-10 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AGILA Board Game
          </h1>
          
          {/* Enhanced AGILA Header */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-center divide-x divide-gray-200 dark:divide-gray-700">
                {[
                  { letter: 'A', word: 'Araling Panlipunan', icon: '📚' },
                  { letter: 'G', word: 'Game-based', icon: '🎮' },
                  { letter: 'I', word: 'Interactive', icon: '🤝' },
                  { letter: 'L', word: 'Learning', icon: '🎓' },
                  { letter: 'A', word: 'Activities', icon: '✨' }
                ].map(({ letter, word, icon }, index) => (
                  <div 
                    key={index}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 group hover:bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700/30 dark:to-gray-600/30 transition-all duration-300"
                  >
                    <div className="w-6 h-6 flex items-center justify-center text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded">
                      {letter}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">
                        {word}
                      </span>
                      <span className="text-base">
                        {icon}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Game Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full inline-block backdrop-blur-sm">
            An educational journey through interactive gameplay
          </p>
        </div>

        {!state.gameStarted ? (
          <div className="animate-slideUp">
            <PlayerSetup />
          </div>
        ) : (
          <>
            {/* Enhanced Player Stats Grid */}
            <div className="mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
              {state.players.map((player) => (
                <PlayerStats
                  key={player.id}
                  player={player}
                  isCurrentPlayer={state.currentPlayerIndex === player.id - 1}
                />
              ))}
            </div>

            {/* Enhanced Game Controls */}
            <GameControls
              currentPlayer={currentPlayer}
              lastRoll={lastRoll}
              canInteractWithSpace={canInteractWithSpace}
              onRollClick={() => setShowGameControlModal(true)}
              onEndTurnClick={handleNextPlayer}
            />

            {/* Enhanced Game Commentary */}
            {commentary.message && (
              <div className="animate-slideDown">
                <GameCommentary
                  message={commentary.message}
                  type={commentary.type}
                  duration={5000}
                />
              </div>
            )}

            {/* Enhanced Game Board */}
            <div className="relative animate-fadeIn">
              <GameBoard
                spaces={spaces}
                onSpaceClick={handleSpaceClick}
                currentPlayerPosition={currentPlayer?.position || 0}
                canInteractWithSpace={canInteractWithSpace}
              />
            </div>

            {showGameControlModal && (
              <GameControlModal
                isOpen={showGameControlModal}
                onClose={() => setShowGameControlModal(false)}
                onRollComplete={handleRollComplete}
                currentPlayer={currentPlayer}
                lastRoll={lastRoll}
                hasRolled={hasRolled}
                onRollAttempt={() => setHasRolled(true)}
              />
            )}

            {showQuestionModal && state.currentQuestion && (
              <QuestionModal
                isOpen={showQuestionModal}
                onClose={() => setShowQuestionModal(false)}
                question={state.currentQuestion}
                spacePoints={spaces[currentPlayer.position].points || 1}
                onAnswer={handleQuestionAnswer}
              />
            )}

            {showEventModal && state.currentEvent && (
              <EventModal
                isOpen={showEventModal}
                onClose={() => setShowEventModal(false)}
                event={state.currentEvent}
                onEffect={handleEventEffect}
              />
            )}

            {state.gameEnded && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-2xl shadow-2xl max-w-md w-full m-4 animate-scaleUp backdrop-blur-lg border border-white/20">
                  <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Game Over!
                  </h2>
                  <p className="text-center mb-6 text-gray-600 dark:text-gray-300 text-lg">
                    {state.winner ? (
                      <>
                        <span className="font-bold text-2xl text-yellow-500">🏆</span>
                        <br />
                        <span className="font-semibold">{state.winner.name}</span> wins with{' '}
                        <span className="font-bold text-yellow-600 dark:text-yellow-400">{state.winner.score}</span> points!
                      </>
                    ) : "It's a tie!"}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
                             text-white rounded-xl font-semibold tracking-wide
                             hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 
                             transform hover:scale-105 transition-all duration-300
                             shadow-lg hover:shadow-xl active:scale-95"
                  >
                    Play Again 🎮
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-white/90 dark:bg-gray-800/90 shadow-lg mt-4 md:mt-8 animate-fadeIn backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Developed by{' '}
              <a
                href="https://lance28-beep.github.io/portfolio-website"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors hover:underline"
              >
                Lance
              </a>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Requested project by: Maam Lyne C. Villegas
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
