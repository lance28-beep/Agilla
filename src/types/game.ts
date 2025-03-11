export type Category = "Opportunity Cost" | "Trade-off" | "Marginal Thinking" | "Incentives" | "Scarcity";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category?: Category;
}

export interface EventCard {
  id: number;
  description: string;
  effect: "move" | "reroll" | "skip";
  value: number;
}

export interface Player {
  id: number;
  name: string;
  token: string;
  position: number;
  score: number;
  consecutiveWrongAnswers: number;
  isSkippingTurn: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  questions: Question[];
  events: EventCard[];
  usedQuestionIds: Set<number>;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: Player | null;
  currentQuestion: Question | null;
  currentEvent: EventCard | null;
}

export type SpaceType = 
  | "question" 
  | "event" 
  | "bonus" 
  | "penalty" 
  | "checkpoint" 
  | "start" 
  | "finish"
  | "powerup"
  | "challenge";

export interface Space {
  id: number;
  type: SpaceType;
} 