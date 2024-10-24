import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import TriviaGame from './TriviaGame'
import gameReducer from '../../features/game/gameSlice'
import { GameState } from '../../types' // Import from gameSlice instead of types
import React from 'react'

const createMockStore = (initialState: Partial<GameState> = {}) => {
  return configureStore({
    reducer: {
      game: gameReducer
    },
    preloadedState: {
      game: {
        gamePhase: "home",
        teams: {
          teamA: { name: 'Team A', score: 0 },
          teamB: { name: 'Team B', score: 0 }
        },
        currentTeam: 'teamA',
        selectedCategories: [],
        usedQuestions: [],
        categories: [],
        scores: { teamA: 0, teamB: 0 },
        currentQuestion: null,
        error: null,
        loading: false,
        soundEnabled: true,
        timeLeft: 60,
        ...initialState
      } as GameState
    }
  })
}

describe('TriviaGame', () => {
  it('renders main menu in home phase', () => {
    const store = createMockStore()
    render(
      <Provider store={store}>
        <TriviaGame />
      </Provider>
    )
    
    expect(screen.getByText(/Start Game/i)).toBeInTheDocument()
  })

  it('transitions to registration phase when start button clicked', async () => {
    const store = createMockStore()
    render(
      <Provider store={store}>
        <TriviaGame />
      </Provider>
    )
    
    fireEvent.click(screen.getByText(/Start Game/i))
    
    await waitFor(() => {
      expect(store.getState().game.gamePhase).toBe('registration')
    })
  })

  it('handles answer submission correctly', async () => {
    const store = createMockStore({
      gamePhase: "game",
      currentTeam: 'teamA',
      currentQuestion: {
        id: '1',
        questionId: 'q1',
        question: 'Test question?',
        categoryName: 'Test',
        points: 100,
        type: 'standard'
      }
    })

    render(
      <Provider store={store}>
        <TriviaGame />
      </Provider>
    )

    const answerInput = screen.getByRole('textbox')
    fireEvent.change(answerInput, { target: { value: 'test answer' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/إجابة/)).toBeInTheDocument()
    })
  })
})
