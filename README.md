# Trivia Game

A modern, interactive trivia game built with React, TypeScript, and Redux Toolkit. Features team-based gameplay, multiple categories, and real-time scoring.

## Quick Start - Login Access

### Development Login

During development, you can use these test credentials:

## Features

- 🎮 Team-based gameplay with customizable team names and players
- 📚 Multiple question categories and difficulty levels
- 🎯 Real-time scoring and feedback
- ⏱️ Timed questions with visual countdown
- 🎨 Modern UI with animations and transitions
- 🌐 Arabic language support
- 💫 Power-ups and special question types
- 📊 Team statistics and game progress tracking

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit
- Framer Motion
- Tailwind CSS
- Styled Components
- Vite
- Vitest for testing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

## Game Logic

The game logic is implemented in various components within the `src/app/components` directory.

### Game Phases and Components

1. **Home Screen**
   - Component: `HomeScreen.tsx`
   - Description: Allows the user to start the game.

2. **Team Registration**
   - Component: `TeamRegistration.tsx`
   - Description: Handles the registration of teams.

3. **Category Selection**
   - Component: `CategorySelection.tsx`
   - Description: Allows users to select categories and difficulty levels.

4. **Gameboard**
   - Component: `Gameboard.tsx`
   - Description: Displays the gameboard with categories and point values.

5. **Question Display**
   - Component: `QuestionDisplay.tsx`
   - Description: Handles the display of questions and submission of answers.

6. **Answer Feedback**
   - Component: `AnswerFeedback.tsx`
   - Description: Provides feedback on whether the answer is correct or incorrect.

7. **Game Results**
   - Component: `GameResults.tsx`
   - Description: Displays the final results of the game.

8. **Meta Questions**
   - Component: `MetaQuestions.tsx`
   - Description: Handles the meta round with special questions.

9. **Team Stats**
   - Component: `TeamStats.tsx`
   - Description: Displays statistics for each team.

### State Management

The game state is managed using Redux, with actions and reducers defined in `src/features/game/gameSlice.ts`.

### Game Flow Orchestration

The `src/app/components/TriviaGame.tsx` component orchestrates the game flow, handling transitions between different game phases.

### Game Actions

The `src/hooks/useGameActions.ts` hook provides functions to interact with the game state, such as selecting categories, generating questions, and submitting answers.

### Additional Components

- **Scoreboard**
  - Component: `src/app/components/Scoreboard.tsx`
  - Description: Displays the current scores of the teams.

- **Turn Indicator**
  - Component: `TurnIndicator.tsx`
  - Description: Indicates which team's turn it is and the remaining time.
