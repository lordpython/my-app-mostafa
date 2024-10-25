// src/services/gameService.ts

import { Configuration, OpenAIApi } from 'openai'
import type { Question, AnswerSubmission, Category, Difficulty } from '../types/game'

class GameService {
  private openai: OpenAIApi
  private readonly OPENAI_MODEL = 'gpt-4' // or gpt-3.5-turbo based on your needs

  constructor() {
    const configuration = new Configuration({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    })
    this.openai = new OpenAIApi(configuration)
  }

  private generateQuestionPrompt(
    categoryLabel: string,
    subcategories: string[],
    difficulty: Difficulty
  ): any[] {
    const subtopics = subcategories.slice(0, 5).join(', ')

    return [
      {
        role: 'system',
        content: `أنت مساعد ذكي يقوم بإنشاء أسئلة مسابقة ثقافية عالية الجودة باللغة العربية.
                قم بإنشاء سؤال واحد في هيئة JSON يتضمن السؤال والإجابة الصحيحة.
                يجب أن يكون السؤال مناسباً للعبة مسابقة عائلية.
                التنسيق المطلوب:
                {
                  "question": "نص السؤال",
                  "correct_answer": "الإجابة الصحيحة",
                  "explanation": "شرح مختصر للإجابة"
                }`
      },
      {
        role: 'user',
        content: `الرجاء إنشاء سؤال عن موضوع '${categoryLabel}'.
                المواضيع الفرعية: ${subtopics}.
                مستوى الصعوبة: ${difficulty}.
                يجب أن يكون السؤال:
                1. واضحاً ومحدداً
                2. له إجابة واحدة صحيحة
                3. مناسباً للمستوى المطلوب
                4. باللغة العربية الفصحى`
      }
    ]
  }

  private generateValidationPrompt(
    question: string,
    correctAnswer: string,
    userAnswer: string
  ): any[] {
    return [
      {
        role: 'system',
        content: `أنت محكم ذكي لتقييم إجابات المسابقات.
                يجب أن يكون تقييمك دقيقاً ومنصفاً.
                قدم ردك بتنسيق JSON كما يلي:
                {
                  "is_correct": boolean,
                  "feedback": "تعليق توضيحي",
                  "similarity_score": number // من 0 إلى 1
                }`
      },
      {
        role: 'user',
        content: `
          السؤال: ${question}
          الإجابة الصحيحة: ${correctAnswer}
          إجابة المشارك: ${userAnswer}
          
          قيّم الإجابة مع مراعاة:
          1. المعنى العام للإجابة
          2. الأخطاء الإملائية البسيطة مقبولة
          3. الترادفات اللغوية مقبولة
          4. قدم تعليقاً مفيداً في جميع الحالات`
      }
    ]
  }

  public async generateQuestion(
    category: Category,
    difficulty: Difficulty,
    points: number
  ): Promise<Question> {
    try {
      const messages = this.generateQuestionPrompt(
        category.name,
        category.subcategories || [],
        difficulty
      )

      const response = await this.openai.createChatCompletion({
        model: this.OPENAI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 150
      })

      const content = response.data.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      const questionData = JSON.parse(content)

      return {
        id: crypto.randomUUID(),
        categoryId: category.id,
        question: questionData.question,
        correctAnswer: questionData.correct_answer,
        points,
        difficulty,
        used: false
      }
    } catch (error) {
      console.error('Error generating question:', error)
      throw new Error('Failed to generate question')
    }
  }

  public async validateAnswer(
    submission: AnswerSubmission,
    question: Question
  ): Promise<{
    isCorrect: boolean
    feedback: string
    points: number
  }> {
    try {
      const messages = this.generateValidationPrompt(
        question.question,
        question.correctAnswer,
        submission.answer
      )

      const response = await this.openai.createChatCompletion({
        model: this.OPENAI_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 150
      })

      const content = response.data.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      const validationResult = JSON.parse(content)

      // Calculate points based on similarity score and time left
      const timeBonus = Math.floor((submission.timeLeft / 60) * 10)
      const awardedPoints = validationResult.is_correct
        ? question.points + timeBonus
        : 0

      return {
        isCorrect: validationResult.is_correct,
        feedback: validationResult.feedback,
        points: awardedPoints
      }
    } catch (error) {
      console.error('Error validating answer:', error)
      throw new Error('Failed to validate answer')
    }
  }

  // Cache for storing generated questions
  private questionCache: Map<string, Question[]> = new Map()

  public async prefetchQuestions(
    categories: Category[],
    difficulty: Difficulty
  ): Promise<void> {
    try {
      for (const category of categories) {
        if (!this.questionCache.has(category.id)) {
          const questions = await Promise.all(
            [100, 200, 300, 400, 500].map(points =>
              this.generateQuestion(category, difficulty, points)
            )
          )
          this.questionCache.set(category.id, questions)
        }
      }
    } catch (error) {
      console.error('Error prefetching questions:', error)
    }
  }

  public async getQuestionFromCache(
    categoryId: string,
    points: number
  ): Promise<Question | null> {
    const questions = this.questionCache.get(categoryId)
    return questions?.find(q => q.points === points && !q.used) || null
  }
}

export const gameService = new GameService()
export default gameService