'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { GameState, Player, Question, EventCard } from '../types/game';

type GameAction =
  | { type: 'START_GAME'; payload: Player[] }
  | { type: 'NEXT_PLAYER' }
  | { type: 'MOVE_PLAYER'; payload: number }
  | { type: 'UPDATE_SCORE'; payload: { playerId: number; points: number } }
  | { type: 'SET_CURRENT_QUESTION'; payload: Question }
  | { type: 'SET_CURRENT_EVENT'; payload: EventCard }
  | { type: 'MARK_QUESTION_USED'; payload: number }
  | { type: 'SKIP_TURN'; payload: number }
  | { type: 'RESET_USED_QUESTIONS' }
  | { type: 'CHECK_WIN_CONDITION' };

const initialState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  questions: [],
  events: [],
  usedQuestionIds: new Set(),
  gameStarted: false,
  gameEnded: false,
  winner: null,
  currentQuestion: null,
  currentEvent: null
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  console.log("GameReducer action:", action.type, action);
  
  switch (action.type) {
    case 'START_GAME':
      console.log("Starting game with players:", action.payload);
      return {
        ...state,
        players: action.payload,
        gameStarted: true,
        gameEnded: false,
        winner: null
      };

    case 'NEXT_PLAYER':
      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      return {
        ...state,
        currentPlayerIndex: nextIndex
      };

    case 'MOVE_PLAYER':
      const updatedPlayers = state.players.map((player, index) => {
        if (index === state.currentPlayerIndex) {
          const newPosition = Math.min(player.position + action.payload, 99);
          return { ...player, position: newPosition };
        }
        return player;
      });
      return { ...state, players: updatedPlayers };

    case 'UPDATE_SCORE':
      const playersWithUpdatedScore = state.players.map(player => {
        if (player.id === action.payload.playerId) {
          const currentScore = typeof player.score === 'number' ? player.score : 0;
          const points = typeof action.payload.points === 'number' ? action.payload.points : 0;
          const newScore = Math.max(0, currentScore + points);
          return { ...player, score: newScore };
        }
        return player;
      });
      return { ...state, players: playersWithUpdatedScore };

    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.payload };

    case 'SET_CURRENT_EVENT':
      return { ...state, currentEvent: action.payload };

    case 'MARK_QUESTION_USED':
      const newUsedQuestionIds = new Set(state.usedQuestionIds);
      newUsedQuestionIds.add(action.payload);
      return { ...state, usedQuestionIds: newUsedQuestionIds };

    case 'SKIP_TURN':
      const playersWithSkip = state.players.map(player => {
        if (player.id === action.payload) {
          return { ...player, isSkippingTurn: true };
        }
        return { ...player, isSkippingTurn: false };
      });
      return { ...state, players: playersWithSkip };

    case 'RESET_USED_QUESTIONS':
      return { ...state, usedQuestionIds: new Set() };

    case 'CHECK_WIN_CONDITION':
      const playerWith100Points = state.players.find(player => player.score >= 100);
      if (playerWith100Points) {
        return {
          ...state,
          gameEnded: true,
          winner: playerWith100Points
        };
      }
      return state;

    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 