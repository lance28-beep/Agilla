import { Question, EventCard, GameDifficulty, Category } from '../types/game';

// Questions for different difficulty levels
const questionsByDifficulty: Record<GameDifficulty, Question[]> = {
  beginner: [
    {
      id: 1,
      text: "This refers to the alternative that you gave up in your choice.",
      options: ["Marginal Thinking", "Trade-off", "Opportunity Cost", "Incentives"],
      correctAnswer: "Opportunity Cost",
      category: "Opportunity Cost",
      difficulty: "easy",
      points: 1,
      explanation: "Opportunity cost is the most important alternative that we give up in our choice."
    },
    {
      id: 2,
      text: "Ana chose to study instead of watching a movie. What is the opportunity cost of her decision?",
      options: ["Time spent studying", "Money for the movie", "Enjoyment from watching the movie", "Food expenses"],
      correctAnswer: "Enjoyment from watching the movie",
      category: "Opportunity Cost",
      difficulty: "easy",
      points: 1,
      explanation: "The enjoyment from watching the movie is what Ana gave up when she chose to study."
    },
    {
      id: 3,
      text: "A farmer decided to plant rice instead of corn. What is the opportunity cost?",
      options: ["Income from planting rice", "Cost of buying seeds", "Income from corn", "Time spent planting"],
      correctAnswer: "Income from corn",
      category: "Opportunity Cost",
      difficulty: "easy",
      points: 1,
      explanation: "The income that could have been earned from corn is the opportunity cost of choosing to plant rice."
    },
    {
      id: 4,
      text: "Choosing a course in college is an example of:",
      options: ["Trade-off", "Scarcity", "Opportunity Cost", "Incentives"],
      correctAnswer: "Opportunity Cost",
      category: "Opportunity Cost",
      difficulty: "easy",
      points: 1,
      explanation: "When you choose a course, you give up alternative courses."
    },
    {
      id: 5,
      text: "When you spend time playing instead of studying, the opportunity cost is:",
      options: ["Enjoyment from playing", "Grades in the exam", "Money for internet", "Family time"],
      correctAnswer: "Grades in the exam",
      category: "Opportunity Cost",
      difficulty: "easy",
      points: 1,
      explanation: "The grades that could have been achieved in the exam were given up by choosing to play."
    },
    {
      id: 6,
      text: "Accepting lower pay in exchange for shorter working hours is an example of:",
      options: ["Trade-off", "Scarcity", "Opportunity Cost", "Incentives"],
      correctAnswer: "Trade-off",
      category: "Trade-off",
      difficulty: "easy",
      points: 1,
      explanation: "This is a trade-off because there is an exchange of benefits and their corresponding costs."
    },
    {
      id: 7,
      text: "If you choose to buy a cellphone instead of clothes, what is the trade-off?",
      options: ["Time for studying", "Money for clothes", "Money for food", "Time for playing"],
      correctAnswer: "Money for clothes",
      category: "Trade-off",
      difficulty: "easy",
      points: 1,
      explanation: "The money that could have been spent on clothes is the trade-off for choosing to buy a cellphone."
    },
    {
      id: 8,
      text: "The decision to save instead of spending is an example of:",
      options: ["Trade-off", "Marginal Thinking", "Opportunity Cost", "Incentives"],
      correctAnswer: "Trade-off",
      category: "Trade-off",
      difficulty: "easy",
      points: 1,
      explanation: "The decision to save has a corresponding enjoyment from spending."
    },
    {
      id: 9,
      text: "In decision-making, giving up one option is called:",
      options: ["Incentives", "Scarcity", "Trade-off", "Marginal Thinking"],
      correctAnswer: "Trade-off",
      category: "Trade-off",
      difficulty: "easy",
      points: 1,
      explanation: "Trade-off is giving up or surrendering one thing to get another."
    },
    {
      id: 10,
      text: "Analyzing whether it's worth buying an extra pizza is an example of:",
      options: ["Trade-off", "Marginal Thinking", "Opportunity Cost", "Incentives"],
      correctAnswer: "Marginal Thinking",
      category: "Marginal Thinking",
      difficulty: "easy",
      points: 1,
      explanation: "Analyzing additional benefits or value is marginal thinking."
    }
  ],
  intermediate: [
    {
      id: 11,
      text: "When considering if the extra cost for a premium subscription is worth it, this is:",
      options: ["Trade-off", "Marginal Thinking", "Opportunity Cost", "Incentives"],
      correctAnswer: "Marginal Thinking",
      category: "Marginal Thinking",
      difficulty: "medium",
      points: 2,
      explanation: "Analyzing the additional benefits or value of a premium subscription is marginal thinking."
    },
    {
      id: 12,
      text: "Analyzing whether it's worth working overtime is an example of:",
      options: ["Trade-off", "Marginal Thinking", "Opportunity Cost", "Scarcity"],
      correctAnswer: "Marginal Thinking",
      category: "Marginal Thinking",
      difficulty: "medium",
      points: 2,
      explanation: "Analyzing the additional benefits or value of overtime is marginal thinking."
    },
    {
      id: 13,
      text: "Receiving additional pay for overtime is an example of:",
      options: ["Opportunity Cost", "Trade-off", "Incentives", "Scarcity"],
      correctAnswer: "Incentives",
      category: "Incentives",
      difficulty: "medium",
      points: 2,
      explanation: "The additional salary serves as an incentive or motivation to work overtime."
    },
    {
      id: 14,
      text: "When the government gives tax discounts to entrepreneurs, this is:",
      options: ["Opportunity Cost", "Trade-off", "Incentives", "Scarcity"],
      correctAnswer: "Incentives",
      category: "Incentives",
      difficulty: "medium",
      points: 2,
      explanation: "The tax discount is an incentive to encourage entrepreneurs."
    },
    {
      id: 15,
      text: "Giving a bonus for early debt payment is:",
      options: ["Trade-off", "Incentives", "Scarcity", "Opportunity Cost"],
      correctAnswer: "Incentives",
      category: "Incentives",
      difficulty: "medium",
      points: 2,
      explanation: "The bonus is an incentive to encourage early payment."
    }
  ],
  expert: [
    {
      id: 16,
      text: "The positive outcomes of choices in decision-making are called:",
      options: ["Marginal Thinking", "Trade-off", "Opportunity Cost", "Incentives"],
      correctAnswer: "Incentives",
      category: "Incentives",
      difficulty: "hard",
      points: 3,
      explanation: "Incentives are positive outcomes or motivations in decision-making."
    },
    {
      id: 17,
      text: "The limited supply of rice in the market is an example of:",
      options: ["Trade-off", "Incentives", "Scarcity", "Opportunity Cost"],
      correctAnswer: "Scarcity",
      category: "Scarcity",
      difficulty: "hard",
      points: 3,
      explanation: "The limited supply of rice shows scarcity or shortage."
    },
    {
      id: 18,
      text: "When there is high demand but low supply, this is:",
      options: ["Trade-off", "Scarcity", "Opportunity Cost", "Incentives"],
      correctAnswer: "Scarcity",
      category: "Scarcity",
      difficulty: "hard",
      points: 3,
      explanation: "The mismatch between demand and supply is scarcity."
    },
    {
      id: 19,
      text: "The limited number of classrooms in a school is an example of:",
      options: ["Opportunity Cost", "Scarcity", "Trade-off", "Incentives"],
      correctAnswer: "Scarcity",
      category: "Scarcity",
      difficulty: "hard",
      points: 3,
      explanation: "The limited number of classrooms is an example of scarcity or shortage of resources."
    },
    {
      id: 20,
      text: "What is the main cause of scarcity?",
      options: [
        "Unlimited wants and limited resources",
        "Overproduction of goods",
        "Low prices of commodities",
        "Lack of control over government funds"
      ],
      correctAnswer: "Unlimited wants and limited resources",
      category: "Scarcity",
      difficulty: "hard",
      points: 3,
      explanation: "The mismatch between unlimited wants and limited resources is the main cause of scarcity."
    }
  ]
};

// Events for different difficulty levels
const eventsByDifficulty: Record<GameDifficulty, EventCard[]> = {
  beginner: [
    {
      id: 1,
      description: 'Great decision! Move forward 2 spaces',
      effect: 'move',
      value: 2
    },
    {
      id: 2,
      description: 'Mistake made! Move back 1 space',
      effect: 'move',
      value: -1
    }
  ],
  intermediate: [
    {
      id: 3,
      description: 'Excellent thinking! Move forward 3 spaces',
      effect: 'move',
      value: 3
    },
    {
      id: 4,
      description: 'Incorrect decision! Move back 2 spaces',
      effect: 'move',
      value: -2
    }
  ],
  expert: [
    {
      id: 5,
      description: 'Outstanding performance! Move forward 4 spaces',
      effect: 'move',
      value: 4
    },
    {
      id: 6,
      description: 'Strategy error! Move back 3 spaces',
      effect: 'move',
      value: -3
    }
  ]
};

export const getQuestions = (difficulty: GameDifficulty): Question[] => {
  return questionsByDifficulty[difficulty];
};

export const getEvents = (difficulty: GameDifficulty): EventCard[] => {
  return eventsByDifficulty[difficulty];
};

// For backward compatibility
export const questions = questionsByDifficulty.expert;
export const events = eventsByDifficulty.expert; 