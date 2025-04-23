'use client';

import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import GameBoard from '../components/GameBoard';
import QuestionModal from '../components/QuestionModal';
import EventModal from '../components/EventModal';
import PlayerSetup from '../components/PlayerSetup';
import GameControlModal from '../components/GameControlModal';
import { questions, events, getQuestions, getEvents } from '../data/gameData';
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
  const { difficulty } = state;
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

  // Get questions and events based on difficulty
  const questions = getQuestions(difficulty);
  const events = getEvents(difficulty);

  // Create spaces based on difficulty
  const boardSize = difficulty === 'beginner' ? 20 :
                   difficulty === 'intermediate' ? 50 : 100;

  const spaces: Space[] = Array.from({ length: boardSize }, (_, index) => {
    if (index === 0) return { id: 0, type: 'start' };
    if (index === boardSize - 1) return { id: index, type: 'finish' };

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

  const handleRollComplete = (value: number) => {
    // Validate dice roll value with strict type checking
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 6) {
      console.error("Invalid dice roll value:", value);
      setCommentary({
        message: "⚠️ Invalid dice roll! Please try again.",
        type: 'error'
      });
      setHasRolled(false);
      setIsProcessingTurn(false);
      setShowGameControlModal(true); // Keep modal open for retry
      return;
    }

    if (isProcessingTurn) {
      console.warn("Turn already in progress");
      return;
    }

    if (hasRolled) {
      console.warn("Roll already processed");
      return;
    }
    
    setIsProcessingTurn(true);
    
    try {
      // Store current position before moving
      const currentPosition = currentPlayer.position;
      const newPosition = Math.min(currentPosition + value, 99);
      
      setLastRoll(value);
      setHasRolled(true);
      setTurnAttempt(prev => prev + 1);
      
      setCommentary({ 
        message: `${currentPlayer.name} rolled a ${value}! Moving to Card ${newPosition + 1}.`,
        type: 'info'
      });
      
      // Use a single dispatch for player movement
      dispatch({ type: 'MOVE_PLAYER', payload: value });
      
      // Handle rolling a 6
      if (value === 6) {
        setCommentary({ 
          message: `${currentPlayer.name} rolled a 6! They get another turn!`,
          type: 'success'
        });
        setCanInteractWithSpace(false);
        setShowGameControlModal(true);
        setHasRolled(false); // Reset for extra turn
        setIsProcessingTurn(false); // Allow new roll
      } else {
        // Enable space interaction for all other valid rolls
        setCanInteractWithSpace(true);
        setShowGameControlModal(false);
      }
    } catch (error) {
      console.error("Error processing dice roll:", error);
      setCommentary({
        message: "An error occurred while processing your turn. Please try again.",
        type: 'error'
      });
      // Reset states on error
      setHasRolled(false);
      setLastRoll(null);
      setCanInteractWithSpace(false);
      setShowGameControlModal(true); // Keep modal open for retry
    } finally {
      // Reset processing state after a short delay
      setTimeout(() => {
        if (value !== 6) { // Only reset if not rolling again
          setIsProcessingTurn(false);
        }
      }, 500);
    }
  };

  const handleSpaceClick = (type: string) => {
    // Prevent interaction if turn is being processed
    if (isProcessingTurn) return;

    // Check if dice has been rolled and has a valid value
    if (!hasRolled || !lastRoll) {
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
    <div className="flex-1 flex flex-col relative z-10 min-h-screen">
      {/* Game Header */}
      <header className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-6 sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm animate-gradient">
            AP GILA EKO9 Board Game
          </h1>
        </div>
      </header>

      {/* Game Content */}
      <div className="flex-1 container mx-auto px-2 sm:px-4 py-2 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto">
        {!state.gameStarted ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <PlayerSetup />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Player Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 animate-fadeIn">
              {state.players.map((player) => (
                <PlayerStats
                  key={player.id}
                  player={player}
                  isCurrentPlayer={state.currentPlayerIndex === player.id - 1}
                />
              ))}
            </div>

            {/* Game Controls */}
            <div className="animate-fadeIn sticky top-20 sm:top-24 z-20">
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
              <div className="animate-slideDown sticky top-40 sm:top-44 z-10">
                <GameCommentary
                  message={commentary.message}
                  type={commentary.type}
                  duration={5000}
                />
              </div>
            )}

            {/* Game Board */}
            <div className="flex-1 animate-fadeIn pb-20">
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
  );
}
