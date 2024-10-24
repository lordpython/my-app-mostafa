import { mockQuestionService } from './mockQuestionService'
import { questionService } from './questionService'

// Set this to false to use the real API
const USE_MOCK_API = import.meta.env.DEV || import.meta.env.VITE_DISABLE_AUTH === 'true'

export const apiService = USE_MOCK_API ? mockQuestionService : questionService
