import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from "@testing-library/react"
import TeamRegistration from "./TeamRegistration"

describe("TeamRegistration", () => {
  it("renders input and submit button", () => {
    render(<TeamRegistration onRegister={vi.fn()} />)
    expect(screen.getByLabelText(/Team Name/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument()
  })

  it("calls onRegister with team name on submit", () => {
    const mockRegister = vi.fn()
    render(<TeamRegistration onRegister={mockRegister} />)

    const input = screen.getByLabelText(/Team Name/i)
    const button = screen.getByRole("button", { name: /Register/i })

    fireEvent.change(input, { target: { value: 'Test Team' } })
    fireEvent.click(button)

    // Update the expected argument to match the component's interface
    expect(mockRegister).toHaveBeenCalledWith([{
      name: 'Test Team',
      players: [],
      color: expect.any(String)
    }])
  })
})
