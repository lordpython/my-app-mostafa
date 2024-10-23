const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000',
  ENDPOINTS: {
    QUESTIONS: '/api/questions',
    VALIDATE_ANSWER: '/api/validate-answer',
    CATEGORIES: '/api/categories',
    GAME_STATE: '/api/game-state',
    TEAMS: '/api/teams'
  },
  HEADERS: {
    'Content-Type': 'application/json',
    // Add any other default headers
  }
}

export default API_CONFIG
