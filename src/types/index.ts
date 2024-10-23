export interface Player {
  name: string
  role?: string
}

export interface Team {
  name: string
  score: number
  players: Player[]
  color: string
}

export interface Question {
  id: string
  questionId: string
  question: string
  categoryName: string
  points: number
  media?: {
    type: 'image' | 'video'
    url: string
    caption?: string
  }
}

export interface Category {
  id: number
  name: string
}

export interface ValidateAnswerResponse {
  isCorrect: boolean
  feedback: string
  correctAnswer: string
  points: number // Add this field
}

export interface Quote {
  id: number
  author: string
  quote: string
}

export interface GameState {
  teams: {
    teamA: { name: string; score: number }
    teamB: { name: string; score: number }
  }
  currentTeam: 'teamA' | 'teamB'
  selectedCategories: string[]
  usedQuestions: string[]
  gamePhase: string
}

// Add this interface to your existing types
export interface MetaQuestion {
  id: string
  question: string
  points: number
  type: 'recall' | 'analysis' | 'calculation'
}

// Add to your existing types
export interface PowerUp {
  id: string
  name: string
  description: string
  effect: 'doublePoints' | 'extraTime' | 'skipQuestion' | 'fiftyFifty'
  icon: string
}

export interface SpecialQuestion extends Question {
  type: 'bonus' | 'challenge' | 'rapidFire' | 'teamwork'
  timeLimit?: number
  pointsMultiplier?: number
}
