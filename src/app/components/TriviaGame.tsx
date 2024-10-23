import React, { useEffect } from "react"
import Scoreboard from "./Scoreboard"
import Gameboard from "./Gameboard"
import QuestionCard from "./QuestionCard"
import { AnswerFeedback } from "./AnswerFeedback"
import { MainMenu } from "./MainMenu"
import TeamRegistration from "./TeamRegistration"
import CategorySelection from "./CategorySelection"
import GameResults from "./GameResults"
import Alert from "../../components/ui/Alert"
import { useGameActions } from "../../hooks/useGameActions"
import { useAppSelector, useAppDispatch } from "../../hooks/hooks"
import { setGamePhase, setTimeLeft, updateScore, setError, setCurrentQuestion, selectCategories, setTeams } from "../../features/game/gameSlice"
import type { ValidateAnswerRequest } from '../../services/api/questionService'
import MetaQuestions from "./MetaQuestions"
import type { GenerateQuestionRequest } from '../../services/api/questionService'
import type { Category } from "../../types"

interface SelectCategoryParams {
  categoryId: number
  difficulty: string
  points: number
}

const TriviaGame: React.FC = () => {
  const dispatch = useAppDispatch()
  const { getQuestion, submitAnswer } = useGameActions()

  const {
    gamePhase: currentGamePhase,
    teams,
    selectedCategories,
    categories,
    currentQuestion,
    currentTeam,
    timeLeft,
    error,
  } = useAppSelector(state => state.game)

  const [isAnswerCorrect, setIsAnswerCorrect] = React.useState(false)
  const [feedbackVisible, setFeedbackVisible] = React.useState(false)

  // Define handleAnswerSubmit before the useEffect that uses it
  const handleAnswerSubmit = React.useCallback(async (answer: string) => {
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
          dispatch(
            updateScore({
              teamName: currentTeam,
              points: currentQuestion.points,
            }),
          )
        }
      }
    } catch (err) {
      dispatch(setError("Failed to submit answer. Please try again."))
    } finally {
      setTimeout(() => {
        setFeedbackVisible(false)
        dispatch(setCurrentQuestion(null))
        dispatch(setGamePhase("game"))
      }, 2000)
    }
  }, [currentQuestion, currentTeam, dispatch, submitAnswer])

  useEffect(() => {
    // Fetch categories when in category selection phase
    if (currentGamePhase === "categorySelection" && categories.length === 0) {
      // Fetch categories logic here if not already fetched
      // For example: dispatch(fetchCategories());
    }
  }, [currentGamePhase, categories.length, dispatch])

  // Timer logic with improved dependencies and cleanup
  useEffect(() => {
    if (currentGamePhase !== "game" || !currentQuestion) return

    if (timeLeft === 0) {
      handleAnswerSubmit("")
      return
    }

    const timer = setInterval(() => {
      dispatch(setTimeLeft(timeLeft - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [currentGamePhase, currentQuestion, timeLeft, dispatch, handleAnswerSubmit])

  // Move handleSelectCategory to useCallback
  const handleSelectCategory = React.useCallback(async ({
    categoryId,
    difficulty,
    points,
  }: SelectCategoryParams) => {
    try {
      const question = await getQuestion({
        categoryId: categoryId.toString(),
        difficulty,
        points
      })
      if (question) {
        dispatch(setCurrentQuestion(question))
      }
    } catch (error) {
      console.error("Error selecting category:", error)
      dispatch(setError("Failed to select category"))
    }
  }, [dispatch, getQuestion])

  return (
    <>
      {currentGamePhase === "home" && (
        <MainMenu onStart={() => dispatch(setGamePhase("registration"))} />
      )}
      {currentGamePhase === "registration" && (
        <TeamRegistration
          onRegister={(teams) => {
            dispatch(setTeams(teams)) // Now receiving an array of teams
            dispatch(setGamePhase("categorySelection"))
          }}
        />
      )}
      {currentGamePhase === "categorySelection" && (
        <CategorySelection
          onSubmit={(selection) => {
            // Create a Category object from the selection
            const selectedCategory: Category = {
              id: parseInt(selection.categoryId),
              name: selection.categoryId // You might want to get the actual name from your categories data
            };
            dispatch(selectCategories([selectedCategory]));
            dispatch(setGamePhase("game"));
          }}
        />
      )}
      {currentGamePhase === "game" && (
        <>
          <Scoreboard teams={teams} currentTeam={currentTeam} />
          {currentQuestion ? (
            <QuestionCard
              question={currentQuestion}
              onSubmit={handleAnswerSubmit}
            />
          ) : (
            <Gameboard
              categories={selectedCategories}
              onSelectQuestion={(categoryId: number, points: number) => {
                // Start of Selection
                const difficulty = "easy" // Example difficulty
                handleSelectCategory({ categoryId, difficulty, points })
              }}
            />
          )}
        </>
      )}
      {currentGamePhase === "results" && <GameResults teams={teams} />}

      {currentGamePhase === "meta" && <MetaQuestions />}

      {/* Answer Feedback */}
      <AnswerFeedback
        isVisible={feedbackVisible}
        isCorrect={isAnswerCorrect}
        message={isAnswerCorrect ? "Correct answer!" : "Incorrect answer!"}
      />

      {/* Alert for Errors */}
      {error && (
        <Alert message={error} onClose={() => dispatch(setError(null))} />
      )}
    </>
  )
}

export default TriviaGame
