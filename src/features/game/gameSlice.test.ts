import { describe, it, expect } from 'vitest'
import gameReducer, {
  setGamePhase,
  setTeams,
  updateScore,
  setCurrentQuestion
} from './gameSlice'
import type { GameState } from '../../types' // Import from types instead of gameSlice

describe('gameSlice', () => {
  const initialState: GameState = {
    gamePhase: "home",
    teams: {
      teamA: { name: 'Team A', score: 0 },
      teamB: { name: 'Team B', score: 0 }
    },
    categories: [{ id: 1, name: 'Category 1' }],
    selectedCategories: [],
    scores: { teamA: 0, teamB: 0 },
    currentQuestion: null,
    usedQuestions: [],
    error: null,
    loading: false,
    soundEnabled: true,
    timeLeft: 60,
    currentTeam: 'teamA'
  }

  it('should handle initial state', () => {
    expect(gameReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle setGamePhase', () => {
    const actual = gameReducer(initialState, setGamePhase('registration'))
    expect(actual.gamePhase).toEqual('registration')
  })

  it('should handle updateScore', () => {
    const actual = gameReducer(
      initialState,
      updateScore({ teamName: 'teamA', points: 100 })
    )
    expect(actual.scores.teamA).toEqual(100)
  })

  it('should handle setCurrentQuestion', () => {
    const question = {
      id: '1',
      questionId: 'q1',
      question: 'Test question?',
      categoryName: 'Test',
      points: 100,
      type: 'standard'
    }
    const actual = gameReducer(initialState, setCurrentQuestion(question))
    expect(actual.currentQuestion).toEqual(question)
  })
})
