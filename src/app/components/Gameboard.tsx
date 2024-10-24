import React from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/Button"
import type { Category } from "../../types"

interface GameboardProps {
  categories: Category[]
  onSelectQuestion: (categoryId: number, points: number) => void
}

const Gameboard: React.FC<GameboardProps> = ({
  categories,
  onSelectQuestion,
}) => (
  <div className="p-6" dir="rtl">
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {categories.map(category => (
        <motion.div
          key={category.id}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            {category.name}
          </h3>
          <div className="space-y-3">
            {[100, 200, 300, 700, 1000].map(points => (
              <Button
                key={points}
                onClick={() => onSelectQuestion(category.id, points)}
                variant="primary"
                className="w-full text-lg font-bold glass-morphism"
                size="large"
              >
                {points} نقطة
              </Button>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
)

export default Gameboard
