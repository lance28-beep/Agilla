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
import { motion } from 'framer-motion';
import CelebrationModal from '../components/CelebrationModal';

// Define player type
interface Player {
  id: number;
  name: string;
  token: string;
  position: number;
  score: number;
  isSkippingTurn: boolean;
  previousPosition: number;
  startingPosition: number;
  moveHistory: number[];
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
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [turnAttempt, setTurnAttempt] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    details?: string;
  }>({
    message: '',
    type: 'info'
  });
  const [commentary, setCommentary] = useState<{ message: string; type: 'success' | 'error' | 'info' }>({
    message: '',
    type: 'info'
  });
  const [isReturningToPrevious, setIsReturningToPrevious] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  const currentPlayer = state.players[state.currentPlayerIndex];

  // Reset game states when player changes
  useEffect(() => {
    setLastRoll(null);
    setHasRolled(false);
    setCanInteractWithSpace(false);
    setIsProcessingTurn(false);
    setShowFeedbackDialog(false);
    setTurnAttempt(0);
    setIsReturningToPrevious(false);
  }, [state.currentPlayerIndex]);

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
    if (isProcessingTurn || hasRolled) return;
    
    setIsProcessingTurn(true);
    setLastRoll(value);
    setHasRolled(true);
    setTurnAttempt(prev => prev + 1);
    
    // Store current position before moving
    const currentPosition = currentPlayer.position;
    const newPosition = Math.min(currentPosition + value, 99);
    
    setCommentary({ 
      message: `${currentPlayer.name} rolled a ${value}! Moving to Card ${newPosition + 1}.`,
      type: 'info'
    });
    
    // Use a single dispatch for player movement
    dispatch({ type: 'MOVE_PLAYER', payload: value });
    
    // Enable space interaction after roll, unless it's a 6
    if (value === 6) {
      setCommentary({ 
        message: `${currentPlayer.name} rolled a 6! They get another turn!`,
        type: 'success'
      });
      setCanInteractWithSpace(false);
      setShowGameControlModal(true);
    } else {
      // Ensure space interaction is enabled for all valid rolls
      setCanInteractWithSpace(true);
      setShowGameControlModal(false);
    }
    
    // Reset processing state after a short delay
    setTimeout(() => {
      setIsProcessingTurn(false);
    }, 500);
  };

  const handleSpaceClick = (type: string) => {
    // Prevent interaction if turn is being processed
    if (isProcessingTurn) return;

    // Check if dice has been rolled
    if (!hasRolled) {
      setShowGameControlModal(true);
      setCommentary({
        message: "Please roll the dice first!",
        type: 'error'
      });
      return;
    }

    // Only allow interaction with current position
    const currentSpace = spaces[currentPlayer.position];
    if (!currentSpace || currentSpace.type !== 'question') return;

    setIsProcessingTurn(true);
    const unusedQuestions = questions.filter(q => !state.usedQuestionIds.has(q.id));
    if (unusedQuestions.length === 0) {
      dispatch({ type: 'RESET_USED_QUESTIONS' });
    }
    const question = unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
    if (question) {
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
      setShowQuestionModal(true);
    }
    
    // Reset processing state after a short delay
    setTimeout(() => {
      setIsProcessingTurn(false);
    }, 500);
  };

  const handleNextPlayer = () => {
    if (isProcessingTurn) return;
    
    setIsProcessingTurn(true);
    // Reset all turn-related states
    setLastRoll(null);
    setHasRolled(false);
    setCanInteractWithSpace(false);
    setTurnAttempt(0);
    dispatch({ type: 'NEXT_PLAYER' });
    setCommentary({
      message: `Next player's turn!`,
      type: 'info'
    });
    
    // Reset processing state after a short delay
    setTimeout(() => {
      setIsProcessingTurn(false);
    }, 500);
  };

  const handleQuestionAnswer = (isCorrect: boolean, points: number, correctAnswer?: string, explanation?: string) => {
    if (isProcessingTurn) return;
    
    setIsProcessingTurn(true);
    setShowQuestionModal(false);
    setCanInteractWithSpace(false);

    // Add a small delay before showing feedback
    setTimeout(() => {
      if (isCorrect) {
        // Award points equal to the dice roll
        const awardedPoints = lastRoll || 0;
        setFeedbackMessage({
          message: "✅ Correct Answer!",
          type: "success",
          details: `You earned ${awardedPoints} points and stay in your current position.`
        });
        dispatch({
          type: 'UPDATE_SCORE',
          payload: { playerId: currentPlayer.id, points: awardedPoints }
        });
      } else {
        // Check if this is the first mistake (no previous valid position)
        const isFirstMistake = currentPlayer.moveHistory.length <= 1;
        
        if (isFirstMistake) {
          setFeedbackMessage({
            message: "❌ Incorrect Answer",
            type: "error",
            details: "Returning to the starting position."
          });
          // Return to starting position
          dispatch({ 
            type: 'MOVE_PLAYER', 
            payload: currentPlayer.startingPosition - currentPlayer.position 
          });
        } else {
          setFeedbackMessage({
            message: "❌ Incorrect Answer",
            type: "error",
            details: `Returning to your previous position (${currentPlayer.previousPosition + 1}). The correct answer is: ${correctAnswer}`
          });
          // Return to previous position
          dispatch({ 
            type: 'MOVE_PLAYER', 
            payload: currentPlayer.previousPosition - currentPlayer.position 
          });
        }
      }
      
      setShowFeedbackDialog(true);

      // Show explanation after a delay
      if (explanation) {
        setTimeout(() => {
          setFeedbackMessage({
            message: "💡 Explanation",
            type: "info",
            details: explanation
          });
        }, 3000);
      }

      // Handle turn completion after feedback
      setTimeout(() => {
        setShowFeedbackDialog(false);
        setIsReturningToPrevious(false);
        if (lastRoll === 6) {
          setHasRolled(false);
          setLastRoll(null);
          setCanInteractWithSpace(false);
          setShowGameControlModal(true);
        } else {
          handleNextPlayer();
        }
        setIsProcessingTurn(false);
      }, 5000);
    }, 500);
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

  // Check for winner
  useEffect(() => {
    if (state.winner) {
      setShowCelebrationModal(true);
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
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm animate-gradient">
              AP GILA EKO9 Board Game
            </h1>
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
                  onRollClick={() => {
                    if (!hasRolled) {
                      setShowGameControlModal(true);
                    } else {
                      setCommentary({
                        message: "You've already rolled! Please interact with your current position.",
                        type: 'error'
                      });
                    }
                  }}
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
                  isReturningToPrevious={isReturningToPrevious}
                  previousPosition={currentPlayer?.previousPosition || 0}
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

              {/* Celebration Modal */}
              {showCelebrationModal && state.winner && (
                <CelebrationModal
                  isOpen={showCelebrationModal}
                  onClose={() => {
                    setShowCelebrationModal(false);
                    window.location.reload();
                  }}
                  winnerName={state.winner.name}
                  score={state.winner.score}
                />
              )}

              {/* Feedback Dialog */}
              {showFeedbackDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-xl max-w-md w-full mx-4 
                              backdrop-blur-sm border ${
                                feedbackMessage.type === 'success' 
                                  ? 'border-green-500/30' 
                                  : feedbackMessage.type === 'error'
                                  ? 'border-red-500/30'
                                  : 'border-blue-500/30'
                              }`}
                  >
                    <div className="text-center space-y-4">
                      <div className={`text-4xl mb-2 ${
                        feedbackMessage.type === 'success' 
                          ? 'text-green-500' 
                          : feedbackMessage.type === 'error'
                          ? 'text-red-500'
                          : 'text-blue-500'
                      }`}>
                        {feedbackMessage.message}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {feedbackMessage.details}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            {/* Game Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              {[
                { letter: 'AP', word: 'Araling Panlipunan', icon: '📚', color: 'from-blue-500 to-indigo-600', bgHover: 'from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20' },
                { letter: 'GILA', word: 'Game-based Interactive Learning Activities', icon: '🎮', color: 'from-purple-500 to-pink-600', bgHover: 'from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20' },
                { letter: 'EKO9', word: 'Ekonomiks Grade 9', icon: '✨', color: 'from-amber-500 to-yellow-600', bgHover: 'from-amber-50/50 to-yellow-50/50 dark:from-amber-900/20 dark:to-yellow-900/20' },
              ].map(({ letter, word, icon, color, bgHover }, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center justify-center p-3 group hover:bg-gradient-to-r ${bgHover} transition-all duration-300 relative overflow-hidden rounded-lg`}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color} opacity-70 transition-all duration-300 group-hover:h-1.5`}></div>
                  
                  <div className={`w-10 h-10 md:w-12 md:h-12 mb-2 flex items-center justify-center text-lg md:text-xl font-bold bg-gradient-to-r ${color} text-white rounded-xl shadow-md group-hover:scale-110 transition-all duration-300`}>
                    {letter}
                  </div>
                  
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center line-clamp-1">
                      {word}
                    </span>
                    <span className="text-lg md:text-xl animate-float">
                      {icon}
                    </span>
                  </div>
                  
                  <div className="mt-1 text-[10px] text-gray-500 dark:text-gray-400 text-center max-w-[200px] opacity-80 group-hover:opacity-100 transition-opacity line-clamp-1">
                    {index === 0 && "Philippine Social Studies"}
                    {index === 1 && "Interactive Educational Gaming"}
                    {index === 2 && "Economics for Freshmen"}
                  </div>
                </div>
              ))}
            </div>

            {/* Developer Information */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 w-full max-w-md">
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
        </div>
      </footer>
    </main>
  );
}
