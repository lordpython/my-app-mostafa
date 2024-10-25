// src/controllers/QuestionController.ts

import { OpenAIIntegration } from '../services/OpenAIIntegration'
import type { Question, Category, Difficulty } from '../types/game'

export class QuestionController {
  private openAI: OpenAIIntegration
  private questionCache: Map<string, Question[]>

  constructor() {
    this.openAI = new OpenAIIntegration()
    this.questionCache = new Map()
  }

  async generateQuestion(
    category: Category,
    difficulty: Difficulty,
    points: number
  ): Promise<Question> {
    // Check cache first
    const cachedQuestions = this.questionCache.get(category.id)
    const cachedQuestion = cachedQuestions?.find(
      q => q.difficulty === difficulty && q.points === points && !q.used
    )
    if (cachedQuestion) return cachedQuestion

    const question = await this.openAI.createQuizQuestion(
      category.name,
      category.subcategories || [],
      difficulty
    )

    // Cache the question
    if (!this.questionCache.has(category.id)) {
      this.questionCache.set(category.id, [])
    }
    this.questionCache.get(category.id)?.push(question)

    return question
  }

  async validateAnswer(question: Question, answer: string): Promise<{
    isCorrect: boolean
    feedback: string
    points: number
  }> {
    const validation = await this.openAI.validateAnswer(question, answer)
    
    return {
      isCorrect: validation.is_correct,
      feedback: validation.feedback,
      points: validation.is_correct ? question.points : 0
    }
  }

  async prefetchCategoryQuestions(
    category: Category,
    difficulty: Difficulty
  ): Promise<void> {
    const pointValues = [100, 200, 300, 400, 500]
    const questions = await Promise.all(
      pointValues.map(points => 
        this.generateQuestion(category, difficulty, points)
      )
    )
    this.questionCache.set(category.id, questions)
  }

  clearCache(): void {
    this.questionCache.clear()
  }
}

export const questionController = new QuestionController()