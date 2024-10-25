// src/types/game.ts

export type GamePhase = 'home' | 'registration' | 'categorySelection' | 'game' | 'question' | 'results'
export type Difficulty = 'very easy' | 'easy' | 'medium' | 'hard' | 'very hard'
export type TeamId = 'teamA' | 'teamB'

export interface Player {
  name: string
  id: string
  avatar?: string
}

export interface Team {
  id: TeamId
  name: string
  players: Player[]
  color: string
  score: number
}

export interface Category {
  id: string
  name: string
  subcategories?: string[]
  questions?: Question[]
  isSelected?: boolean
}

export interface Question {
  id: string
  categoryId: string
  question: string
  correctAnswer: string
  points: number
  difficulty: Difficulty
  used: boolean
  media?: {
    type: 'image' | 'video' | 'audio'
    url: string
    caption?: string
  }
}

export interface GameState {
  phase: GamePhase
  teams: Record<TeamId, Team>
  currentTeam: TeamId | null
  categories: Category[]
  selectedCategories: Category[]
  currentQuestion: Question | null
  usedQuestions: Set<string>
  timeLeft: number
  isAnswering: boolean
  error: string | null
  loading: boolean
  roundNumber: number
  maxRounds: number
  soundEnabled: boolean
}

export interface AnswerSubmission {
  questionId: string
  teamId: TeamId
  answer: string
  timeLeft: number
}

export interface QuestionSelection {
  categoryId: string
  points: number
}

export interface GameSettings {
  roundTimeLimit: number
  maxRounds: number
  pointValues: number[]
  minPlayers: number
  maxPlayers: number
}