'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { GameState, Player, Question, EventCard } from '../types/game';

interface Player {
  id: number;
  name: string;
  token: string;
  position: number;
  previousPosition: number;
  startingPosition: number;
  score: number;
  isSkippingTurn: boolean;
  moveHistory: number[]; // Track all positions visited
}

interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentQuestion: Question | null;
  currentEvent: EventCard | null;
  usedQuestionIds: Set<number>;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: Player | null;
}

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
  | { type: 'CHECK_WIN_CONDITION' }
  | { type: 'END_GAME' };

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
        players: action.payload.map(player => ({
          ...player,
          previousPosition: 0,
          startingPosition: 0,
          moveHistory: [0]
        })),
        gameStarted: true,
        currentPlayerIndex: 0,
        currentQuestion: null,
        currentEvent: null,
        usedQuestionIds: new Set(),
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
      return {
        ...state,
        players: state.players.map(player => {
          if (player.id === state.players[state.currentPlayerIndex].id) {
            const newPosition = Math.min(99, Math.max(0, player.position + action.payload));
            return {
              ...player,
              previousPosition: player.position,
              position: newPosition,
              moveHistory: [...player.moveHistory, newPosition]
            };
          }
          return player;
        })
      };

    case 'UPDATE_SCORE':
      const playersWithUpdatedScore = state.players.map(player => {
        if (player.id === action.payload.playerId) {
          const currentScore = typeof player.score === 'number' ? player.score : 0;
          const points = typeof action.payload.points === 'number' ? action.payload.points : 0;
          return { 
            ...player, 
            score: Math.max(0, currentScore + points)
          };
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
          return { 
            ...player, 
            isSkippingTurn: true,
            consecutiveWrongAnswers: 0
          };
        }
        return { ...player, isSkippingTurn: false };
      });
      return { ...state, players: playersWithSkip };

    case 'RESET_USED_QUESTIONS':
      return { ...state, usedQuestionIds: new Set() };

    case 'CHECK_WIN_CONDITION':
      const playerAtFinish = state.players.find(player => player.position >= 99);
      if (playerAtFinish) {
        return {
          ...state,
          gameEnded: true,
          winner: playerAtFinish
        };
      }
      return state;

    case 'END_GAME':
      return {
        ...state,
        gameEnded: true,
        winner: null
      };

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