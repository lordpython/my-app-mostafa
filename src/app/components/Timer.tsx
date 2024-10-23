import type React from "react"
import { useAppSelector } from "../../hooks/hooks"

const Timer: React.FC = () => {
  const timeLeft = useAppSelector(state => state.game.timeLeft)

  return (
    <div className="timer">
      <span className="text-xl font-semibold">Time Left: {timeLeft}s</span>
    </div>
  )
}

export default Timer
