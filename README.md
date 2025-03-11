# AGILA Board Game

An interactive digital version of the AGILA board game designed to test Grade 9 students' understanding of economic concepts through an engaging, turn-based format.

## Features

- Interactive game board with 40+ spaces
- Multiple space types (Questions, Events, Bonus, Penalty, Checkpoints)
- Support for 2-6 players
- Dynamic dice rolling with animations
- Economic concept questions covering:
  - Opportunity Cost
  - Trade-off
  - Marginal Thinking
  - Incentives
  - Scarcity
- Event cards with various effects
- Real-time score tracking
- Modern, responsive UI with Tailwind CSS

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React Context for state management

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agila-app.git
cd agila-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Game Rules

1. Players take turns rolling the dice
2. Landing on different spaces triggers different events:
   - Question Space: Answer economic questions (Correct: +2 steps, +1 point | Wrong: -1 step, -1 point)
   - Event Space: Random events that affect gameplay
   - Bonus Space: Move forward additional steps
   - Penalty Space: Move backward or skip turns
   - Checkpoint: Safe spaces for tracking progress

3. Special Rules:
   - Rolling a 6 grants an extra turn
   - 3 consecutive wrong answers results in skipping a turn
   - First player to reach the finish line wins
   - In case of a tie, the player with the highest score wins

## Development

### Project Structure

```
src/
├── app/
│   └── page.tsx         # Main game page
├── components/
│   ├── GameBoard.tsx    # Game board layout
│   ├── Dice.tsx        # Dice rolling component
│   ├── QuestionModal.tsx # Question display
│   ├── EventModal.tsx   # Event card display
│   └── PlayerSetup.tsx  # Player initialization
├── context/
│   └── GameContext.tsx  # Game state management
├── types/
│   └── game.ts         # TypeScript interfaces
└── data/
    └── gameData.ts     # Questions and events data
```

### Adding Questions

To add more questions, edit `src/data/gameData.ts` and add new entries to the `questions` array following the Question interface:

```typescript
{
  id: number;
  category: "Opportunity Cost" | "Trade-off" | "Marginal Thinking" | "Incentives" | "Scarcity";
  questionText: string;
  options: string[];
  correctAnswer: string;
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
