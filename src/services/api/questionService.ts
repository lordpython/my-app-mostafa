import axios from 'axios'
import type { Category, Question, ValidateAnswerResponse, GameState } from '../../types'

const API_BASE_URL = 'http://localhost:5000' // Update with your actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface SelectCategoriesRequest {
  sessionId: string
  categories: string[]
}

export interface GenerateQuestionRequest {
  categoryId: string
  difficulty: string
  points: number
  subcategories?: string[]
}

export interface ValidateAnswerRequest {
  questionId: string
  answer: string
}

export const questionService = {
  selectCategories: async (_data: SelectCategoriesRequest) => {
    throw new Error("Not implemented")
  },

  generateQuestion: async (_data: GenerateQuestionRequest) => {
    throw new Error("Not implemented")
  },

  validateAnswer: async (_data: ValidateAnswerRequest): Promise<ValidateAnswerResponse> => {
    throw new Error("Not implemented")
  },

  getGameState: async (_sessionId: string): Promise<GameState> => {
    throw new Error("Not implemented")
  },

  endSession: async (_sessionId: string) => {
    throw new Error("Not implemented")
  }
}
