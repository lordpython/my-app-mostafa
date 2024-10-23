    // Start of Selection
    import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
    import { apiService } from '../../services/api/serviceConfig'
    import type { Team, Category, Question, ValidateAnswerResponse } from "../../types"
    import type { 
      SelectCategoriesRequest, 
      GenerateQuestionRequest, 
      ValidateAnswerRequest 
    } from '../../services/api/questionService'
    
    // Add new thunks
export const fetchGameState = createAsyncThunk(
  'game/fetchGameState',
  async (sessionId: string) => {
    const response = await apiService.getGameState(sessionId)
    return response
  }
)

export const selectGameCategories = createAsyncThunk(
  'game/selectCategories',
  async (data: SelectCategoriesRequest) => {
    const response = await apiService.selectCategories(data)
    return response
  }
)

// Update existing thunks
export const generateQuestion = createAsyncThunk(
  'game/generateQuestion',
  async (data: GenerateQuestionRequest) => {
    const response = await apiService.generateQuestion(data)
    return response
  }
)

export const validateAnswer = createAsyncThunk(
  'game/validateAnswer',
  async (data: ValidateAnswerRequest) => {
    const response = await apiService.validateAnswer(data)
    return response
  }
)

interface Scores {
  teamA: number
  teamB: number
}

interface GameState {
  gamePhase: "home" | "entry" | "registration" | "categorySelection" | "game" | "meta" | "results"
  teams: Team[]
  categories: Category[]
  selectedCategories: Category[]
  scores: Scores
  currentQuestion: Question | null
  usedQuestions: string[] // Change the type to string[]
  error: string | null
  loading: boolean
  soundEnabled: boolean
  timeLeft: number
  currentTeam: "teamA" | "teamB" | null; // Add this line
  // Add other necessary properties here
}

const initialState: GameState = {
  gamePhase: "home",
  teams: [],
  categories: [],
  selectedCategories: [],
  scores: { teamA: 0, teamB: 0 },
  currentQuestion: null,
  usedQuestions: [] as string[],
  error: null,
  loading: false,
  soundEnabled: true,
  timeLeft: 60,
  currentTeam: null, // Add this line
  // Initialize other properties as needed
}

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGamePhase(state, action: PayloadAction<GameState["gamePhase"]>) {
      state.gamePhase = action.payload
    },
    setTeams(state, action: PayloadAction<Team[]>) {
      state.teams = action.payload
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload
    },
    selectCategories(state, action: PayloadAction<Category[]>) {
      state.selectedCategories = action.payload
    },
    updateScore(
      state,
      action: PayloadAction<{ teamName: "teamA" | "teamB"; points: number }>,
    ) {
      const { teamName, points } = action.payload
      state.scores[teamName] += points
    },
    setCurrentQuestion(state, action: PayloadAction<Question | null>) {
      state.currentQuestion = action.payload
    },
    addUsedQuestion(state, action: PayloadAction<string>) { // Change type to string
      state.usedQuestions.push(action.payload)
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled
    },
    setTimeLeft(state, action: PayloadAction<number>) {
      state.timeLeft = action.payload
    },
    // Add other reducers as needed
  },
  extraReducers: builder => {
    builder
      .addCase(generateQuestion.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        generateQuestion.fulfilled,
        (state, action: PayloadAction<Question>) => {
          state.loading = false
          state.currentQuestion = action.payload
          state.usedQuestions.push(action.payload.id)
        },
      )
      .addCase(generateQuestion.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(validateAnswer.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        validateAnswer.fulfilled,
        (state, action: PayloadAction<ValidateAnswerResponse>) => {
          state.loading = false
          const { isCorrect, points } = action.payload
          if (isCorrect && state.currentTeam) {
            state.scores[state.currentTeam] += points
          }
          // Optionally, switch to the next team or question
          state.currentQuestion = null
          // Update other states as necessary
        },
      )
      .addCase(validateAnswer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setGamePhase,
  setTeams,
  setCategories,
  selectCategories,
  updateScore,
  setCurrentQuestion,
  addUsedQuestion,
  setError,
  setLoading,
  toggleSound,
  setTimeLeft,
  // Export other actions as needed
} = gameSlice.actions

export default gameSlice.reducer

