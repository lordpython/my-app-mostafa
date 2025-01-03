import type React from "react";
import { useEffect, useState } from "react"
import Scoreboard from "./Scoreboard"
import Gameboard from "./Gameboard"
import QuestionDisplay from "./QuestionDisplay"
import { AnswerFeedback } from "./AnswerFeedback"
import { MainMenu } from "./MainMenu"
import TeamRegistration from "./TeamRegistration"
import CategorySelection from "./CategorySelection"
import GameResults from "./GameResults"
import Alert from "../../components/ui/Alert"
import { useGameActions } from "../../hooks/useGameActions"
import { useAppSelector, useAppDispatch } from "../../hooks/hooks"
import { 
  setGamePhase, 
  updateScore, 
  setError, 
  setCurrentQuestion, 
  selectCategories as selectGameCategories, 
  setTeams 
} from "../../features/game/gameSlice"
import type { Category } from "../../types"

const TriviaGame: React.FC = () => {
  const dispatch = useAppDispatch()
  const { getQuestion, submitAnswer } = useGameActions()

  const {
    gamePhase: currentGamePhase,
    teams,
    selectedCategories,
    currentQuestion,
    currentTeam,
    error,
  } = useAppSelector(state => state.game)

  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isQuestionActive, setIsQuestionActive] = useState(false)
  const [isReadyToAnswer, setIsReadyToAnswer] = useState(false)

  // Handle answer submission
  const handleAnswerSubmit = async (answer: string) => {
    if (!currentQuestion) return

    try {
      const response = await submitAnswer({
        questionId: currentQuestion.id,
        answer
      })
      
      if (response) {
        setIsAnswerCorrect(response.isCorrect)
        setFeedbackVisible(true)
        if (response.isCorrect && currentTeam) {
          dispatch(updateScore({
            teamName: currentTeam,
            points: currentQuestion.points,
          }))
        }
      }
    } catch (err) {
      dispatch(setError("Failed to submit answer"))
    } finally {
      setTimeout(() => {
        setFeedbackVisible(false)
        dispatch(setCurrentQuestion(null))
        setIsQuestionActive(false)
        setIsReadyToAnswer(false)
        setTimeLeft(60)
      }, 2000)
    }
  }

  // Timer effect
  useEffect(() => {
    if (!isQuestionActive || !isReadyToAnswer || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswerSubmit("") // Auto-submit empty answer when time's up
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isQuestionActive, isReadyToAnswer, timeLeft])

  // Handle category selection
  const handleCategorySelection = async (selection: {
    categories: string[];
    subcategories: string[];
    difficulty: string;
  }) => {
    try {
      // Convert selected categories to Category objects
      const categoryObjects: Category[] = selection.categories.map(categoryId => ({
        id: parseInt(categoryId),
        name: categoryId // You might want to get the actual name from your categories data
      }))

      // Dispatch selected categories to store
      dispatch(selectGameCategories(categoryObjects))
      
      // Move to game phase
      dispatch(setGamePhase("game"))
    } catch (error) {
      dispatch(setError("Failed to process category selection"))
    }
  }

  // Handle question selection
  const handleSelectQuestion = async (categoryId: number, points: number) => {
    try {
      const question = await getQuestion({
        categoryId: categoryId.toString(),
        difficulty: "medium", // You can make this dynamic based on selected difficulty
        points
      })
      
      if (question) {
        dispatch(setCurrentQuestion(question))
        setTimeLeft(60)
        setIsQuestionActive(true)
        setIsReadyToAnswer(false)
      }
    } catch (error) {
      dispatch(setError("Failed to load question"))
    }
  }

  return (
    <>
      {currentGamePhase === "home" && (
        <MainMenu onStart={() => dispatch(setGamePhase("registration"))} />
      )}

      {currentGamePhase === "registration" && (
        <TeamRegistration
          onRegister={(teams) => {
            dispatch(setTeams(teams))
            dispatch(setGamePhase("categorySelection"))
          }}
        />
      )}

      {currentGamePhase === "categorySelection" && (
        <CategorySelection onSubmit={handleCategorySelection} />
      )}

      {currentGamePhase === "game" && (
        <>
          <Scoreboard teams={teams} currentTeam={currentTeam} />
          {currentQuestion ? (
            <QuestionDisplay
              question={currentQuestion}
              onAnswer={handleAnswerSubmit}
              timeLeft={timeLeft}
              isReady={isReadyToAnswer}
              onReady={() => setIsReadyToAnswer(true)}
            />
          ) : (
            <Gameboard
              categories={selectedCategories}
              onSelectQuestion={handleSelectQuestion}
            />
          )}
        </>
      )}

      {currentGamePhase === "results" && <GameResults teams={teams} />}

      <AnswerFeedback
        isVisible={feedbackVisible}
        isCorrect={isAnswerCorrect}
        message={isAnswerCorrect ? "إجابة صحيحة!" : "إجابة خاطئة!"}
      />

      {error && (
        <Alert message={error} onClose={() => dispatch(setError(null))} />
      )}
    </>
  )
}

export default TriviaGame
