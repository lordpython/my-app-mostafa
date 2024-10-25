// src/utils/gameUtils.ts

import type { Question, Category, Difficulty, TeamId } from '../types/game'

export const formatPoints = (points: number): string => {
  return points.toLocaleString('ar-EG')
}

export const calculateTimeBonus = (timeLeft: number, basePoints: number): number => {
  const bonusPercentage = (timeLeft / 60) * 0.5 // Up to 50% bonus for fast answers
  return Math.floor(basePoints * bonusPercentage)
}

export const getDifficultyColor = (difficulty: Difficulty): string => {
  const colors = {
    'very easy': 'bg-green-500',
    'easy': 'bg-blue-500',
    'medium': 'bg-yellow-500',
    'hard': 'bg-orange-500',
    'very hard': 'bg-red-500'
  }
  return colors[difficulty]
}

export const getTeamColor = (teamId: TeamId): string => {
  return teamId === 'teamA' ? '#4F46E5' : '#E11D48'
}

export const getCategoryQuestions = (
  category: Category,
  difficulty: Difficulty,
  usedQuestionIds: Set<string>
): Question[] => {
  if (!category.questions) return []
  
  return category.questions
    .filter(q => q.difficulty === difficulty && !usedQuestionIds.has(q.id))
    .sort((a, b) => a.points - b.points)
}

export const validateGameRules = {
  canSelectQuestion: (
    teamId: TeamId | null,
    isAnswering: boolean,
    usedQuestionIds: Set<string>,
    questionId: string
  ): boolean => {
    return (
      !!teamId &&
      !isAnswering &&
      !usedQuestionIds.has(questionId)
    )
  },

  isGameComplete: (
    usedQuestionIds: Set<string>,
    totalQuestions: number
  ): boolean => {
    return usedQuestionIds.size >= totalQuestions
  },

  canSubmitAnswer: (
    answer: string,
    timeLeft: number,
    isAnswering: boolean
  ): boolean => {
    return (
      answer.trim().length > 0 &&
      timeLeft > 0 &&
      isAnswering
    )
  }
}

export const shuffleCategories = (categories: Category[]): Category[] => {
  return [...categories].sort(() => Math.random() - 0.5)
}

export const findSimilarAnswer = (
  userAnswer: string,
  correctAnswer: string
): number => {
  // Simple similarity score based on character matching
  let matches = 0
  const userChars = userAnswer.toLowerCase().split('')
  const correctChars = correctAnswer.toLowerCase().split('')
  
  for (let i = 0; i < userChars.length; i++) {
    if (userChars[i] === correctChars[i]) {
      matches++
    }
  }
  
  return matches / Math.max(userAnswer.length, correctAnswer.length)
}

export const formatGameTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}