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
import { Space, SpaceType } from '../types/game';

export default function Home() {
  const { state, dispatch } = useGame();
  const [showGameControlModal, setShowGameControlModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [canInteractWithSpace, setCanInteractWithSpace] = useState(false);
  const [commentary, setCommentary] = useState<{ message: string; type: 'success' | 'error' | 'info' }>({
    message: '',
    type: 'info'
  });

  const currentPlayer = state.players[state.currentPlayerIndex];

  const spaces: Space[] = Array(100).fill(null).map((_, index): Space => {
    let type: SpaceType;
    if (index === 0) type = "start";
    else if (index === 99) type = "finish";
    else if (index % 5 === 0) type = "question";
    else if (index % 7 === 0) type = "event";
    else if (index % 11 === 0) type = "powerup";
    else if (index % 13 === 0) type = "challenge";
    else if (index % 20 === 0) type = "checkpoint";
    else if (index % 15 === 0) type = "bonus";
    else if (index % 17 === 0) type = "penalty";
    else type = "question"; // Make 80% of remaining spaces questions

    return {
      id: index,
      type
    };
  });

  const handleRollComplete = (value: number) => {
    setLastRoll(value);
    setCommentary({ 
      message: `${currentPlayer.name} rolled a ${value}! Moving forward ${value} spaces.`,
      type: 'info'
    });
    
    dispatch({ type: 'MOVE_PLAYER', payload: value });
    
    if (value === 6) {
      setCommentary({ 
        message: `${currentPlayer.name} rolled a 6! They get another turn!`,
        type: 'success'
      });
    } else {
      setCanInteractWithSpace(true);
    }
    setShowGameControlModal(false);
  };

  const handleQuestionAnswer = (isCorrect: boolean, correctAnswer?: string, explanation?: string) => {
    if (isCorrect) {
      setCommentary({ 
        message: `Correct answer! ${currentPlayer.name} earned 10 points!`,
        type: 'success'
      });
      dispatch({
        type: 'UPDATE_SCORE',
        payload: { playerId: currentPlayer.id, points: 10 }
      });
    } else {
      setCommentary({ 
        message: `Incorrect. The correct answer is: ${correctAnswer}. ${explanation || ''}`,
        type: 'error'
      });
    }
    setShowQuestionModal(false);
    handleNextPlayer();
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
    setCanInteractWithSpace(false);
    dispatch({ type: 'NEXT_PLAYER' });
    setCommentary({ 
      message: `It's ${state.players[(state.currentPlayerIndex + 1) % state.players.length].name}'s turn!`,
      type: 'info'
    });
  };

  const handleSpaceClick = (spaceType: string) => {
    if (!canInteractWithSpace) return;
    
    switch (spaceType) {
      case 'question':
        const unusedQuestions = questions.filter(q => !state.usedQuestionIds.has(q.id));
        if (unusedQuestions.length === 0) {
          dispatch({ type: 'RESET_USED_QUESTIONS' });
        }
        const question = unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
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
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 py-4 md:py-8 flex-grow relative">
        <div className="text-center mb-6 md:mb-8 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 dark:text-white">
            AGILA Board Game
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            An interactive educational game that teaches economic principles through engaging gameplay.
            Learn about opportunity cost, trade-offs, and more while having fun!
          </p>
        </div>

        {!state.gameStarted ? (
          <div className="animate-slideUp">
            <PlayerSetup />
          </div>
        ) : (
          <>
            {/* Enhanced Scoreboard */}
            <div className="mb-4 md:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-fadeIn">
              {state.players.map((player) => (
                <div
                  key={player.id}
                  className={`
                    p-3 md:p-4 rounded-lg shadow-md transition-all duration-300 transform
                    ${state.currentPlayerIndex === player.id - 1
                      ? 'bg-indigo-100 dark:bg-indigo-900 scale-105 hover:scale-110'
                      : 'bg-white dark:bg-gray-800 hover:scale-105'}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${state.currentPlayerIndex === player.id - 1 
                        ? 'bg-yellow-300 animate-pulse shadow-lg' 
                        : 'bg-white'}
                      text-lg font-bold border-2 border-gray-800 transition-all
                    `}>
                      {player.token}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 dark:text-white truncate">{player.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Score: {player.score}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Position: {player.position + 1}</p>
                    </div>
                  </div>
                  {player.isSkippingTurn && (
                    <p className="text-sm text-red-500 mt-1 font-medium animate-pulse">
                      ⏭️ Skipping Next Turn
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Game Controls Section */}
            <div className="mb-4 md:mb-8 bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg shadow-lg transition-all hover:shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <div className="text-base md:text-lg font-semibold text-gray-800 dark:text-white text-center sm:text-left">
                    Current Player: {currentPlayer?.name}
                    <span className="ml-2 text-xl md:text-2xl animate-bounce inline-block">
                      {currentPlayer?.token}
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Score: {currentPlayer?.score || 0}
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4 w-full sm:w-auto justify-center sm:justify-end">
                  <button
                    onClick={() => setShowGameControlModal(true)}
                    disabled={!currentPlayer || currentPlayer.isSkippingTurn}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 
                             transition-all transform hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    Roll Dice
                  </button>
                  <button
                    onClick={handleNextPlayer}
                    disabled={!lastRoll || !canInteractWithSpace}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 
                             transition-all transform hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    End Turn
                  </button>
                </div>
              </div>
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
            <div className="relative animate-fadeIn">
              <GameBoard
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
              />
            )}

            {showQuestionModal && state.currentQuestion && (
              <QuestionModal
                isOpen={showQuestionModal}
                onClose={() => setShowQuestionModal(false)}
                question={state.currentQuestion}
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
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
                  <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
                    Game Over!
                  </h2>
                  <p className="text-center mb-6 text-gray-600 dark:text-gray-300">
                    {state.winner ? `${state.winner.name} wins with ${state.winner.score} points!` : "It's a tie!"}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-lg mt-4 md:mt-8 animate-fadeIn">
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
