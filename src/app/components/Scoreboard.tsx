import type React from "react"
import { useAppSelector } from "../../hooks/hooks"
import type { Team } from "../../types"

interface ScoreboardProps {
  teams: Team[];
  currentTeam: "teamA" | "teamB" | null;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ teams, currentTeam }) => {
  const { scores } = useAppSelector(state => state.game)

  return (
    <div className="fixed top-0 w-full flex justify-around bg-gray-800 text-white p-4">
      {teams.map((team, index) => (
        <div
          key={team.name}
          className={`text-center ${index === (currentTeam === "teamA" ? 0 : 1) ? "text-yellow-400" : ""}`}
        >
          <h4 className="font-bold">{team.name}</h4>
          <p>{scores[team.name as keyof typeof scores] || 0} pts</p>
        </div>
      ))}
    </div>
  )
}

export default Scoreboard
