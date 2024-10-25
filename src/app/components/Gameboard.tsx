// src/components/GameBoard.tsx

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppSelector, useAppDispatch } from "../hooks/hooks"
import { selectQuestion, setError } from "../features/game/gameSlice"
import type { Category } from "../types/game"

const pointValues = [100, 200, 300, 400, 500]

interface CategoryColumnProps {
  category: Category
  onSelectQuestion: (points: number) => void
  disabledPoints: Set<number>
}

const CategoryColumn: React.FC<CategoryColumnProps> = ({
  category,
  onSelectQuestion,
  disabledPoints
}) => (
  <div className="flex flex-col gap-4">
    <div className="h-24 bg-white/10 rounded-xl p-4 flex items-center justify-center text-center">
      <h3 className="text-lg font-bold text-white">{category.name}</h3>
    </div>
    
    {pointValues.map(points => (
      <motion.button
        key={points}
        className={`h-24 rounded-xl font-bold text-2xl transition-colors
          ${disabledPoints.has(points)
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-500 text-white'
          }`}
        whileHover={!disabledPoints.has(points) ? { scale: 1.05 } : {}}
        whileTap={!disabledPoints.has(points) ? { scale: 0.95 } : {}}
        onClick={() => !disabledPoints.has(points) && onSelectQuestion(points)}
        disabled={disabledPoints.has(points)}
      >
        {points}
      </motion.button>
    ))}
  </div>
)

const GameBoard: React.FC = () => {
  const dispatch = useAppDispatch()
  const { selectedCategories, usedQuestions, currentTeam } = useAppSelector(
    state => state.game
  )
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  const handleSelectQuestion = (categoryId: string, points: number) => {
    if (!currentTeam) {
      dispatch(setError("No team selected"))
      return
    }

    dispatch(selectQuestion({ categoryId, points }))
  }

  // Track used questions per category
  const getDisabledPoints = (categoryId: string): Set<number> => {
    const disabledPoints = new Set<number>()
    
    selectedCategories
      .find(c => c.id === categoryId)
      ?.questions?.forEach(q => {
        if (usedQuestions.has(q.id)) {
          disabledPoints.add(q.points)
        }
      })
    
    return disabledPoints
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-6 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {selectedCategories.map(category => (
            <CategoryColumn
              key={category.id}
              category={category}
              onSelectQuestion={(points) => handleSelectQuestion(category.id, points)}
              disabledPoints={getDisabledPoints(category.id)}
            />
          ))}
        </motion.div>

        <AnimatePresence>
          {hoveredCell && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50"
              onClick={() => setHoveredCell(null)}
            >
              <div className="bg-white rounded-xl p-6 max-w-lg">
                <h3 className="text-xl font-bold mb-2">{hoveredCell}</h3>
                {/* Add preview content if needed */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GameBoard