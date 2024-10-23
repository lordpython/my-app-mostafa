import type { Question, ValidateAnswerResponse, GameState } from '../../types'
import type { SelectCategoriesRequest, GenerateQuestionRequest, ValidateAnswerRequest } from './questionService'

// Mock data
const mockQuestions: Question[] = [
  {
    id: "1",
    questionId: "q1",
    question: "What landmark is shown in this image?",
    categoryName: "Geography",
    points: 100,
    media: {
      type: "image",
      url: "/images/questions/eiffel-tower.jpg",
      caption: "A famous landmark in Europe"
    }
  },
  {
    id: "2",
    questionId: "q2",
    question: "What scientific phenomenon is demonstrated in this video?",
    categoryName: "Science",
    points: 200,
    media: {
      type: "video",
      url: "/videos/questions/physics-demo.mp4",
      caption: "A demonstration of a physical principle"
    }
  }
]

const mockGameState: GameState = {
  teams: {
    teamA: { name: "Team Alpha", score: 0 },
    teamB: { name: "Team Beta", score: 0 }
  },
  currentTeam: 'teamA',
  selectedCategories: ["Geography", "Art", "Science"],
  usedQuestions: [],
  gamePhase: "playing"
}

// Mock service that mimics the real API behavior
export const mockQuestionService = {
  selectCategories: async (data: SelectCategoriesRequest) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      message: "Categories selected successfully",
      selectedCategories: data.categories
    }
  },

  generateQuestion: async (data: GenerateQuestionRequest) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    simulateError() // Randomly throw errors
    // Return a random question from mock data
    const question = mockQuestions[Math.floor(Math.random() * mockQuestions.length)]
    return {
      ...question,
      points: data.points
    }
  },

  validateAnswer: async (_data: ValidateAnswerRequest): Promise<ValidateAnswerResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simulate answer validation
    const isCorrect = Math.random() > 0.5 // Random correct/incorrect for testing
    return {
      isCorrect,
      feedback: isCorrect ? "Correct!" : "Sorry, that's incorrect.",
      correctAnswer: "Mock correct answer",
      points: 100 // Add the required points field
    }
  },

  getGameState: async (sessionId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockGameState
  },

  endSession: async (_sessionId: string) => {
    // Implementation
  }
}

const simulateError = (probability = 0.1) => {
  if (Math.random() < probability) {
    throw new Error("Simulated API error")
  }
}
