import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Gameboard from './Gameboard'
import React from 'react'

describe('Gameboard', () => {
  const mockCategories = [
    { id: 1, name: 'Geography' },
    { id: 2, name: 'History' }
  ]
  
  const mockOnSelectQuestion = vi.fn()

  it('renders all categories', () => {
    render(
      <Gameboard 
        categories={mockCategories}
        onSelectQuestion={mockOnSelectQuestion}
      />
    )

    mockCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument()
    })
  })

  it('renders point buttons for each category', () => {
    render(
      <Gameboard 
        categories={mockCategories}
        onSelectQuestion={mockOnSelectQuestion}
      />
    )

    const pointButtons = screen.getAllByText(/نقطة/)
    expect(pointButtons).toHaveLength(mockCategories.length * 5) // 5 point values per category
  })

  it('calls onSelectQuestion with correct parameters when point button clicked', () => {
    render(
      <Gameboard 
        categories={mockCategories}
        onSelectQuestion={mockOnSelectQuestion}
      />
    )

    fireEvent.click(screen.getAllByText('100 نقطة')[0])
    expect(mockOnSelectQuestion).toHaveBeenCalledWith(1, 100)
  })
})
