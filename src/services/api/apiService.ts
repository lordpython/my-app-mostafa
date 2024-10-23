import axios from 'axios'
import API_CONFIG from '../../config/api.config'
import type { Question, ValidateAnswerResponse, Team, Category } from '../../types'

// Add interfaces for API responses
interface GenerateQuestionResponse {
  question: string
  questionId: string
  id: string
  categoryName: string
  points: number
  media?: {
    type: 'image' | 'video'
    url: string
    caption?: string
  }
}

interface ValidateAnswerApiResponse {
  is_correct: boolean
  feedback: string
  correct_answer: string
}

interface TeamRegistrationResponse {
  message: string
}

interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    avatar?: string
  }
  token: string
}

interface GoogleAuthResponse {
  user: {
    id: string
    email: string
    name: string
    avatar?: string
  }
  token: string
}

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
  withCredentials: true
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      // You might want to implement token refresh logic here
    }
    return Promise.reject(error)
  }
)

export const apiService = {
  generateQuestion: async (params: {
    categoryName: string
    subcategories?: string[]
    difficulty: string
  }): Promise<Question> => {
    const response = await api.post<GenerateQuestionResponse>('/api/generate-question', params)
    return {
      id: response.data.id,
      questionId: response.data.questionId,
      question: response.data.question,
      categoryName: response.data.categoryName,
      points: response.data.points,
      media: response.data.media
    }
  },

  validateAnswer: async (params: {
    questionId: string
    answer: string
  }): Promise<ValidateAnswerResponse> => {
    const response = await api.post<ValidateAnswerApiResponse>('/api/validate-answer', params)
    return {
      isCorrect: response.data.is_correct,
      feedback: response.data.feedback,
      correctAnswer: response.data.correct_answer,
      points: 100 // You might want to calculate this based on difficulty
    }
  },

  registerTeams: async (teams: Team[]): Promise<{ message: string }> => {
    const response = await api.post<TeamRegistrationResponse>('/api/team-registration', {
      teamA: teams[0],
      teamB: teams[1]
    })
    return {
      message: response.data.message
    }
  },

  getCategories: async () => {
    const response = await api.get<Category[]>('/api/categories')
    return response.data
  },

  // Auth methods
  login: async (email: string, password: string, recaptchaToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password,
      recaptchaToken
    })
    return response.data
  },

  register: async (email: string, password: string, name: string, recaptchaToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', {
      email,
      password,
      name,
      recaptchaToken
    })
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout')
  },

  getCurrentUser: async () => {
    const response = await api.get<AuthResponse['user']>('/api/auth/me')
    return response.data
  },

  resetPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/auth/reset-password', { email })
    return response.data
  },

  updateProfile: async (data: { name?: string; avatar?: File }) => {
    const formData = new FormData()
    if (data.name) formData.append('name', data.name)
    if (data.avatar) formData.append('avatar', data.avatar)

    const response = await api.put('/api/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  googleAuth: async (token: string, recaptchaToken: string): Promise<AuthResponse> => {
    const response = await api.post<GoogleAuthResponse>('/api/auth/google', { 
      token,
      recaptchaToken
    })
    return response.data
  }
}

export default apiService
