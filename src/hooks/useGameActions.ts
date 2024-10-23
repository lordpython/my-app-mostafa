import { useAppDispatch } from "./hooks"
import {
  generateQuestion,
  validateAnswer,
  selectGameCategories,
  fetchGameState,
} from "../features/game/gameSlice"
import type {
  Question,
  ValidateAnswerResponse,
  GameState,
} from "../types"
import type {
  SelectCategoriesRequest,
  GenerateQuestionRequest,
  ValidateAnswerRequest,
} from "../services/api/questionService"

export const useGameActions = () => {
  const dispatch = useAppDispatch()

  const selectCategories = async (data: SelectCategoriesRequest) => {
    try {
      const result = await dispatch(selectGameCategories(data))
      if (selectGameCategories.fulfilled.match(result)) {
        return result.payload
      }
      throw new Error("Failed to select categories")
    } catch (error) {
      console.error("Error selecting categories:", error)
      throw error
    }
  }

  const getQuestion = async (data: GenerateQuestionRequest): Promise<Question> => {
    try {
      const result = await dispatch(generateQuestion(data))
      if (generateQuestion.fulfilled.match(result)) {
        return result.payload
      }
      throw new Error("Failed to generate question")
    } catch (error) {
      console.error("Error generating question:", error)
      throw error
    }
  }

  const submitAnswer = async (
    data: ValidateAnswerRequest,
  ): Promise<ValidateAnswerResponse> => {
    try {
      const result = await dispatch(validateAnswer(data))
      if (validateAnswer.fulfilled.match(result)) {
        return result.payload
      }
      throw new Error("Failed to validate answer")
    } catch (error) {
      console.error("Error submitting answer:", error)
      throw error
    }
  }

  const getGameState = async (sessionId: string): Promise<GameState> => {
    try {
      const result = await dispatch(fetchGameState(sessionId))
      if (fetchGameState.fulfilled.match(result)) {
        return result.payload
      }
      throw new Error("Failed to fetch game state")
    } catch (error) {
      console.error("Error fetching game state:", error)
      throw error
    }
  }

  return {
    selectCategories,
    getQuestion,
    submitAnswer,
    getGameState,
  }
}
