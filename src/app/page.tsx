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
      relative overflow-hidden p-3 md:p-4 rounded-lg md:rounded-xl shadow-md md:shadow-lg 
      transition-all duration-300 transform hover:shadow-xl
      ${isCurrentPlayer
        ? 'bg-gradient-to-br from-indigo-50/90 to-purple-50/90 dark:from-indigo-900/50 dark:to-purple-900/50 scale-[1.02] hover:scale-[1.05]'
        : 'bg-white/90 dark:bg-gray-800/90 hover:scale-[1.02]'}
    `}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50" />
    
    <div className="flex items-center gap-2 md:gap-3">
      <div className={`
        w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-xl lg:text-2xl
        ${isCurrentPlayer 
          ? 'bg-gradient-to-br from-yellow-300 to-yellow-400 animate-pulse shadow-md' 
          : 'bg-gradient-to-br from-gray-100 to-white dark:from-gray-700 dark:to-gray-600'}
        font-bold border border-current transition-all
        ${isCurrentPlayer ? 'text-yellow-600' : 'text-gray-600 dark:text-gray-300'}
      `}>
        {player.token}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm md:text-base lg:text-lg text-gray-800 dark:text-white truncate">
          {player.name}
        </h3>
        <div className="space-y-1 md:space-y-2 mt-1 md:mt-2">
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">Score:</span>
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="font-bold text-yellow-600 dark:text-yellow-400 text-sm md:text-base lg:text-lg">{player.score}</span>
              <span className="text-yellow-500 text-xs md:text-sm">⭐</span>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">Position:</span>
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="font-bold text-blue-600 dark:text-blue-400 text-sm md:text-base">{player.position + 1}</span>
              <span className="text-blue-500 text-xs md:text-sm">📍</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {player.isSkippingTurn && (
      <div className="mt-2 md:mt-3 py-1 md:py-2 px-2 md:px-3 bg-red-100 dark:bg-red-900/30 rounded-md md:rounded-lg animate-pulse">
        <p className="text-xs md:text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1 md:gap-2">
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
  <div className="mb-4 md:mb-6 bg-white/90 dark:bg-gray-800/90 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md md:shadow-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 w-full sm:w-auto">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-base md:text-lg lg:text-xl font-bold text-gray-800 dark:text-white">
            {currentPlayer?.name}
          </span>
          <span className="text-xl md:text-2xl lg:text-3xl animate-bounce">
            {currentPlayer?.token}
          </span>
        </div>
        <div className="flex items-center gap-1 md:gap-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
          <span className="font-medium">Score:</span>
          <span className="font-bold text-yellow-600 dark:text-yellow-400">{currentPlayer?.score || 0}</span>
          <span className="text-yellow-500">⭐</span>
        </div>
      </div>
      <div className="flex gap-2 md:gap-3 w-full sm:w-auto justify-center sm:justify-end">
        <button
          onClick={onRollClick}
          disabled={!currentPlayer || currentPlayer.isSkippingTurn}
          className="px-3 py-1.5 md:px-4 md:py-2 lg:px-6 lg:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg
                    hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all transform hover:scale-105 hover:shadow-lg active:scale-95
                    text-sm md:text-base font-medium md:font-semibold tracking-wide"
        >
          Roll 🎲
        </button>
        <button
          onClick={onEndTurnClick}
          disabled={!lastRoll || !canInteractWithSpace}
          className="px-3 py-1.5 md:px-4 md:py-2 lg:px-6 lg:py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg
                    hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all transform hover:scale-105 hover:shadow-lg active:scale-95
                    text-sm md:text-base font-medium md:font-semibold tracking-wide"
        >
          End ➡️
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

    // Assign point values between 1 and 5
    let points = 1; // default points
    if (index % 15 === 0) points = 5; // Expert questions (every 15th space)
    else if (index % 7 === 0) points = 3; // Medium questions (every 7th space)

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
    
    // Enable space interaction after roll, unless it's a 6
    if (value === 6) {
      setCommentary({ 
        message: `${currentPlayer.name} rolled a 6! They get another turn!`,
        type: 'success'
      });
      // Don't enable space interaction yet for a 6
      setCanInteractWithSpace(false);
    } else {
      // Enable space interaction for all other rolls
      setCanInteractWithSpace(true);
    }
    setShowGameControlModal(false);
  };

  const handleQuestionAnswer = (isCorrect: boolean, points: number, correctAnswer?: string, explanation?: string) => {
    if (isCorrect) {
      // Ensure points are between 1-5
      const awardedPoints = Math.min(Math.max(points, 1), 5);
      setCommentary({ 
        message: `✅ Correct answer! ${currentPlayer.name} earned ${awardedPoints} points!`,
        type: 'success'
      });
      dispatch({
        type: 'UPDATE_SCORE',
        payload: { playerId: currentPlayer.id, points: awardedPoints }
      });
    } else {
      setCommentary({ 
        message: `❌ Incorrect. You lost 1 point. The correct answer is: ${correctAnswer}`,
        type: 'error'
      });
      dispatch({
        type: 'UPDATE_SCORE',
        payload: { playerId: currentPlayer.id, points: -1 }
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
        // If the last roll was 6, allow another roll instead of ending turn
        if (lastRoll === 6) {
          setHasRolled(false);
          setLastRoll(null);
          setCanInteractWithSpace(false); // Ensure space interaction is disabled for new roll
          setShowGameControlModal(true);
        } else {
          handleNextPlayer();
        }
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
        setCanInteractWithSpace(false); // Ensure space interaction is disabled for new roll
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
    // Reset all turn-related states
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
    if (!canInteractWithSpace) return;
    
    // Disable space interaction immediately to prevent multiple clicks
    setCanInteractWithSpace(false);
    
    switch (spaceType) {
      case 'question':
        const unusedQuestions = questions.filter(q => !state.usedQuestionIds.has(q.id));
        if (unusedQuestions.length === 0) {
          dispatch({ type: 'RESET_USED_QUESTIONS' });
        }
        const question = unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
        // Get the current space's points
        const currentSpace = spaces.find(s => s.id === currentPlayer.position);
        const spacePoints = currentSpace?.points || 1;
        dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
        setShowQuestionModal(true);
        break;
      case 'event':
        const event = events[Math.floor(Math.random() * events.length)];
        dispatch({ type: 'SET_CURRENT_EVENT', payload: event });
        setShowEventModal(true);
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Game Header */}
        <header className="w-full max-w-7xl mx-auto px-4 py-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm animate-gradient">
              AP GILA EKO9 Board Game
            </h1>
            
            {/* Enhanced AGILA Header */}
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
                {[
                  { letter: 'AP', word: 'Araling Panlipunan', icon: '📚', color: 'from-blue-500 to-indigo-600', bgHover: 'from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20' },
                  { letter: 'GILA', word: 'Game-based Interactive Learning Activities', icon: '🎮', color: 'from-purple-500 to-pink-600', bgHover: 'from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20' },
                  { letter: 'EKO9', word: 'Ekonomiks Grade 9', icon: '✨', color: 'from-amber-500 to-yellow-600', bgHover: 'from-amber-50/50 to-yellow-50/50 dark:from-amber-900/20 dark:to-yellow-900/20' },
                ].map(({ letter, word, icon, color, bgHover }, index) => (
                  <div 
                    key={index}
                    className={`flex flex-col items-center justify-center p-4 group hover:bg-gradient-to-r ${bgHover} transition-all duration-300 relative overflow-hidden`}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color} opacity-70 transition-all duration-300 group-hover:h-1.5`}></div>
                    
                    <div className={`w-12 h-12 md:w-14 md:h-14 mb-2 flex items-center justify-center text-xl md:text-2xl font-bold bg-gradient-to-r ${color} text-white rounded-xl shadow-md group-hover:scale-110 transition-all duration-300`}>
                      {letter}
                    </div>
                    
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 text-center line-clamp-1">
                        {word}
                      </span>
                      <span className="text-xl md:text-2xl animate-float">
                        {icon}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center max-w-[200px] opacity-80 group-hover:opacity-100 transition-opacity line-clamp-1">
                      {index === 0 && "Philippine Social Studies"}
                      {index === 1 && "Interactive Educational Gaming"}
                      {index === 2 && "Economics for Freshmen"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Game Content */}
        <div className="flex-1 container mx-auto px-4 py-6 space-y-6">
          {!state.gameStarted ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <PlayerSetup />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Player Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                {state.players.map((player) => (
                  <PlayerStats
                    key={player.id}
                    player={player}
                    isCurrentPlayer={state.currentPlayerIndex === player.id - 1}
                  />
                ))}
              </div>

              {/* Game Controls */}
              <div className="animate-fadeIn">
                <GameControls
                  currentPlayer={currentPlayer}
                  lastRoll={lastRoll}
                  canInteractWithSpace={canInteractWithSpace}
                  onRollClick={() => setShowGameControlModal(true)}
                  onEndTurnClick={handleNextPlayer}
                />
              </div>

              {/* Game Commentary */}
              {commentary.message && (
                <div className="animate-slideDown">
                  <GameCommentary
                    message={commentary.message}
                    type={commentary.type}
                    duration={5000}
                  />
                </div>
              )}

              {/* Game Board */}
              <div className="flex-1 overflow-auto animate-fadeIn">
                <GameBoard
                  spaces={spaces}
                  onSpaceClick={handleSpaceClick}
                  currentPlayerPosition={currentPlayer?.position || 0}
                  canInteractWithSpace={canInteractWithSpace}
                />
              </div>

              {/* Modals */}
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
                  spacePoints={spaces.find(s => s.id === currentPlayer.position)?.points || 1}
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

              {/* Game Over Modal */}
              {state.gameEnded && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                  <div className="bg-white/90 dark:bg-gray-800/90 p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scaleUp backdrop-blur-lg border border-white/20">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Game Over!
                    </h2>
                    <p className="text-center mb-6 text-gray-600 dark:text-gray-300">
                      {state.winner ? (
                        <>
                          <span className="text-2xl md:text-3xl text-yellow-500">🏆</span>
                          <br />
                          <span className="font-semibold text-lg md:text-xl">{state.winner.name}</span> wins with{' '}
                          <span className="font-bold text-yellow-600 dark:text-yellow-400 text-lg md:text-xl">{state.winner.score}</span> points!
                        </>
                      ) : "It's a tie!"}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
                               text-white rounded-xl font-semibold text-base tracking-wide
                               hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 
                               transform hover:scale-105 transition-all duration-300
                               shadow-lg hover:shadow-xl active:scale-95"
                    >
                      Play Again 🎮
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Developed by{' '}
              <a
                href="https://lance28-beep.github.io/portfolio-website"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors hover:underline"
              >
                Lance
              </a>
              {' '} | {' '}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Requested by: Maam Lyne C. Villegas
              </span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
