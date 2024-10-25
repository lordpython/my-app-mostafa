// src/managers/QuestionCacheManager.ts

import type { Question, Category, Difficulty } from '../types/game'
import { questionController } from '../controllers/QuestionController'

interface CacheKey {
  categoryId: string
  difficulty: Difficulty
  points: number
}

interface CachedQuestion extends Question {
  timestamp: number
  used: boolean
}

class QuestionCacheManager {
  private cache: Map<string, CachedQuestion[]>
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
  private readonly MIN_CACHE_SIZE = 3
  private prefetchInProgress: Set<string>

  constructor() {
    this.cache = new Map()
    this.prefetchInProgress = new Set()
    this.startCleanupInterval()
  }

  private getCacheKey(categoryId: string, difficulty: Difficulty): string {
    return `${categoryId}-${difficulty}`
  }

  private startCleanupInterval(): void {
    setInterval(() => this.cleanupExpiredCache(), this.CACHE_DURATION / 2)
  }

  private cleanupExpiredCache(): void {
    const now = Date.now()
    for (const [key, questions] of this.cache.entries()) {
      const validQuestions = questions.filter(q => 
        now - q.timestamp <= this.CACHE_DURATION && !q.used
      )
      
      if (validQuestions.length === 0) {
        this.cache.delete(key)
      } else {
        this.cache.set(key, validQuestions)
      }
    }
  }

  async getQuestion(
    category: Category,
    difficulty: Difficulty,
    points: number
  ): Promise<Question> {
    const cacheKey = this.getCacheKey(category.id, difficulty)
    
    // Get cached questions for this category and difficulty
    const cachedQuestions = this.cache.get(cacheKey) || []
    
    // Find an unused question with matching points
    const question = cachedQuestions.find(q => 
      !q.used && q.points === points
    )

    if (question) {
      question.used = true
      // Trigger background prefetch if cache is running low
      this.checkAndPrefetch(category, difficulty)
      return question
    }

    // Generate new question if none found in cache
    return this.generateAndCacheQuestion(category, difficulty, points)
  }

  private async generateAndCacheQuestion(
    category: Category,
    difficulty: Difficulty,
    points: number
  ): Promise<Question> {
    const newQuestion = await questionController.generateQuestion(
      category,
      difficulty,
      points
    )

    const cachedQuestion: CachedQuestion = {
      ...newQuestion,
      timestamp: Date.now(),
      used: true
    }

    const cacheKey = this.getCacheKey(category.id, difficulty)
    const existingQuestions = this.cache.get(cacheKey) || []
    this.cache.set(cacheKey, [...existingQuestions, cachedQuestion])

    return newQuestion
  }

  private async checkAndPrefetch(
    category: Category,
    difficulty: Difficulty
  ): Promise<void> {
    const cacheKey = this.getCacheKey(category.id, difficulty)
    const cachedQuestions = this.cache.get(cacheKey) || []
    
    const unusedCount = cachedQuestions.filter(q => !q.used).length

    if (unusedCount < this.MIN_CACHE_SIZE && !this.prefetchInProgress.has(cacheKey)) {
      this.prefetchQuestions(category, difficulty)
    }
  }

  async prefetchQuestions(
    category: Category,
    difficulty: Difficulty
  ): Promise<void> {
    const cacheKey = this.getCacheKey(category.id, difficulty)
    
    if (this.prefetchInProgress.has(cacheKey)) {
      return
    }

    this.prefetchInProgress.add(cacheKey)

    try {
      const pointValues = [100, 200, 300, 400, 500]
      const questions = await Promise.all(
        pointValues.map(points =>
          questionController.generateQuestion(category, difficulty, points)
        )
      )

      const cachedQuestions: CachedQuestion[] = questions.map(q => ({
        ...q,
        timestamp: Date.now(),
        used: false
      }))

      const existingQuestions = this.cache.get(cacheKey) || []
      this.cache.set(cacheKey, [
        ...existingQuestions,
        ...cachedQuestions
      ])
    } catch (error) {
      console.error(`Error prefetching questions for ${cacheKey}:`, error)
    } finally {
      this.prefetchInProgress.delete(cacheKey)
    }
  }

  markQuestionUsed(questionId: string): void {
    for (const questions of this.cache.values()) {
      const question = questions.find(q => q.id === questionId)
      if (question) {
        question.used = true
        break
      }
    }
  }

  getUnusedQuestionCount(category: Category, difficulty: Difficulty): number {
    const cacheKey = this.getCacheKey(category.id, difficulty)
    const questions = this.cache.get(cacheKey) || []
    return questions.filter(q => !q.used).length
  }

  clearCache(): void {
    this.cache.clear()
    this.prefetchInProgress.clear()
  }

  async warmupCache(
    categories: Category[],
    difficulties: Difficulty[]
  ): Promise<void> {
    const prefetchPromises = categories.flatMap(category =>
      difficulties.map(difficulty =>
        this.prefetchQuestions(category, difficulty)
      )
    )

    await Promise.all(prefetchPromises)
  }

  exportCacheStats(): {
    totalQuestions: number
    unusedQuestions: number
    categoryCounts: Record<string, number>
  } {
    let totalQuestions = 0
    let unusedQuestions = 0
    const categoryCounts: Record<string, number> = {}

    for (const [key, questions] of this.cache.entries()) {
      const categoryId = key.split('-')[0]
      totalQuestions += questions.length
      unusedQuestions += questions.filter(q => !q.used).length
      categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + questions.length
    }

    return {
      totalQuestions,
      unusedQuestions,
      categoryCounts
    }
  }
}

export const questionCacheManager = new QuestionCacheManager()