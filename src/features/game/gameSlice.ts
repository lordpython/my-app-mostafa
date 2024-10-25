// src/features/game/gameSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { questionController } from '../../controllers/QuestionController'
import { gameStateManager } from '../../managers/GameStateManager'
import type { 
  GameState, 
  Team, 
  Question, 
  Category, 
  TeamId,
  AnswerSubmission 
} from '../../types/game'

const initialState: GameState = {
  phase: 'home',
  teams: {
    teamA: {
      id: 'teamA',
      name: '',
      players: [],
      color: '#4F46E5',
      score: 0
    },
    teamB: {
      id: 'teamB',
      name: '',
      players: [],
      color: '#E11D48',
      score: 0
    }
  },
  currentTeam: null,
  categories: [],
  selectedCategories: [],
  currentQuestion: null,
  usedQuestions: new Set<string>(),
  timeLeft: 60,
  isAnswering: false,
  loading: false,
  error: null,
  soundEnabled: true,
  roundNumber: 1,
  maxRounds: 10
}

// Async Thunks
export const initializeGame = createAsyncThunk(
  'game/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const savedState = gameStateManager.loadGameState()
      return savedState || initialState
    } catch (error) {
      return rejectWithValue('Failed to initialize game')
    }
  }
)

export const submitAnswer = createAsyncThunk(
  'game/submitAnswer',
  async (submission: AnswerSubmission, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { game: GameState }
      const { currentQuestion } = state.game

      if (!currentQuestion) {
        throw new Error('No active question')
      }

      const result = await questionController.validateAnswer(
        currentQuestion,
        submission.answer
      )

      if (result.isCorrect) {
        // Calculate time bonus
        const timeBonus = Math.floor((submission.timeLeft / 60) * 10)
        result.points += timeBonus
      }

      return {
        ...result,
        teamId: submission.teamId,
        questionId: currentQuestion.id
      }
    } catch (error) {
      return rejectWithValue('Failed to validate answer')
    }
  }
)

export const generateQuestion = createAsyncThunk(
  'game/generateQuestion',
  async ({ categoryId, points }: { categoryId: string; points: number }, 
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { game: GameState }
      const category = state.game.categories.find(c => c.id === categoryId)

      if (!category) {
        throw new Error('Category not found')
      }

      const question = await questionController.generateQuestion(
        category,
        'medium',
        points
      )

      return question
    } catch (error) {
      return rejectWithValue('Failed to generate question')
    }
  }
)

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGamePhase(state, action: PayloadAction<GameState['phase']>) {
      state.phase = action.payload
      if (action.payload === 'game' && !state.currentTeam) {
        state.currentTeam = 'teamA'
      }
    },

    registerTeams(state, action: PayloadAction<{ teamA: Team; teamB: Team }>) {
      state.teams.teamA = { ...action.payload.teamA, score: 0 }
      state.teams.teamB = { ...action.payload.teamB, score: 0 }
      state.currentTeam = 'teamA'
      state.phase = 'categorySelection'
    },

    selectCategories(state, action: PayloadAction<Category[]>) {
      state.selectedCategories = action.payload
      state.phase = 'game'
    },

    updateScore(state, action: PayloadAction<{ teamId: TeamId; points: number }>) {
      const { teamId, points } = action.payload
      state.teams[teamId].score += points
    },

    switchTeam(state) {
      state.currentTeam = state.currentTeam === 'teamA' ? 'teamB' : 'teamA'
      state.isAnswering = false
      state.timeLeft = 60
    },

    updateTimeLeft(state, action: PayloadAction<number>) {
      state.timeLeft = action.payload
    },

    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },

    resetGame: () => initialState,

    // Handle state restoration
    loadState(state, action: PayloadAction<GameState>) {
      return { ...action.payload }
    }
  },
  extraReducers: builder => {
    builder
      // Initialize Game
      .addCase(initializeGame.pending, state => {
        state.loading = true
      })
      .addCase(initializeGame.fulfilled, (state, action) => {
        return { ...action.payload, loading: false }
      })
      .addCase(initializeGame.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Submit Answer
      .addCase(submitAnswer.pending, state => {
        state.loading = true
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.isCorrect) {
          state.teams[action.payload.teamId].score += action.payload.points
        }
        state.usedQuestions.add(action.payload.questionId)
        state.currentQuestion = null
        state.isAnswering = false
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Generate Question
      .addCase(generateQuestion.pending, state => {
        state.loading = true
      })
      .addCase(generateQuestion.fulfilled, (state, action) => {
        state.loading = false
        state.currentQuestion = action.payload
        state.isAnswering = true
        state.timeLeft = 60
      })
      .addCase(generateQuestion.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const {
  setGamePhase,
  registerTeams,
  selectCategories,
  updateScore,
  switchTeam,
  updateTimeLeft,
  toggleSound,
  setError,
  resetGame,
  loadState
} = gameSlice.actions

export default gameSlice.reducer