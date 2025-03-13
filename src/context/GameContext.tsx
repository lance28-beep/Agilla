'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
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

const STORAGE_KEY = 'agila_game_state';

const gameReducer = (state: GameState, action: GameAction): GameState => {
  let newState: GameState = state;

  switch (action.type) {
    case 'START_GAME':
      newState = {
        ...initialState,
        players: action.payload,
        gameStarted: true,
      };
      break;

    case 'NEXT_PLAYER':
      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      newState = {
        ...state,
        currentPlayerIndex: nextIndex
      };
      break;

    case 'MOVE_PLAYER':
      const updatedPlayers = state.players.map((player, index) => {
        if (index === state.currentPlayerIndex) {
          const newPosition = Math.min(player.position + action.payload, 99);
          return { ...player, position: newPosition };
        }
        return player;
      });
      newState = { ...state, players: updatedPlayers };
      break;

    case 'UPDATE_SCORE':
      const playersWithUpdatedScore = state.players.map(player => {
        if (player.id === action.payload.playerId) {
          const currentScore = typeof player.score === 'number' ? player.score : 0;
          const points = typeof action.payload.points === 'number' ? action.payload.points : 0;
          return { ...player, score: currentScore + points };
        }
        return player;
      });
      newState = { ...state, players: playersWithUpdatedScore };
      break;

    case 'SET_CURRENT_QUESTION':
      newState = {
        ...state,
        currentQuestion: action.payload,
        usedQuestionIds: new Set([...state.usedQuestionIds, action.payload.id]),
      };
      break;

    case 'SET_CURRENT_EVENT':
      newState = {
        ...state,
        currentEvent: action.payload,
      };
      break;

    case 'MARK_QUESTION_USED':
      const newUsedQuestionIds = new Set(state.usedQuestionIds);
      newUsedQuestionIds.add(action.payload);
      newState = { ...state, usedQuestionIds: newUsedQuestionIds };
      break;

    case 'SKIP_TURN':
      const playersWithSkip = state.players.map(player => {
        if (player.id === action.payload) {
          return { ...player, isSkippingTurn: true };
        }
        return { ...player, isSkippingTurn: false };
      });
      newState = { ...state, players: playersWithSkip };
      break;

    case 'RESET_USED_QUESTIONS':
      newState = { ...state, usedQuestionIds: new Set() };
      break;

    case 'CHECK_WIN_CONDITION':
      const playerWith100Points = state.players.find(player => player.score >= 100);
      if (playerWith100Points) {
        newState = {
          ...state,
          gameEnded: true,
          winner: playerWith100Points
        };
      }
      break;

    case 'END_GAME':
      const maxScore = Math.max(...state.players.map((p) => p.score));
      const winners = state.players.filter((p) => p.score === maxScore);
      newState = {
        ...state,
        gameEnded: true,
        winner: winners.length === 1 ? winners[0] : null,
      };
      break;

    default:
      return state;
  }

  // Check for winner after any state change
  if (!newState.gameEnded) {
    const maxScore = Math.max(...newState.players.map((p) => p.score));
    const winners = newState.players.filter((p) => p.score === maxScore);
    if (winners.length === 1) {
      newState = {
        ...newState,
        gameEnded: true,
        winner: winners[0],
      };
    }
  }

  return newState;
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Convert usedQuestionIds back to Set
      parsedState.usedQuestionIds = new Set(parsedState.usedQuestionIds);
      dispatch({ type: 'START_GAME', payload: parsedState.players });
      // Restore other state properties
      Object.entries(parsedState).forEach(([key, value]) => {
        if (key !== 'players') {
          dispatch({ type: key as any, payload: value as any });
        }
      });
    }
  }, []);

  // Save state to localStorage on every change
  useEffect(() => {
    const stateToSave = {
      ...state,
      usedQuestionIds: Array.from(state.usedQuestionIds),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [state]);

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