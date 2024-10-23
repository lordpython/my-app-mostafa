import type React from "react"

interface TimerProps {
  timeLeft: number
}

export const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  return (
    <div className="timer">
      <span>Time Left: {timeLeft}s</span>
    </div>
  )
}
