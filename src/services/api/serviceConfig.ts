import { mockQuestionService } from './mockQuestionService'
import { questionService } from './questionService'

// Set this to false to use the real API
const USE_MOCK_API = true

export const apiService = USE_MOCK_API ? mockQuestionService : questionService
