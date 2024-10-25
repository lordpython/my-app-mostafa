// src/components/CategorySelection.tsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { selectCategories, setGamePhase } from '../features/game/gameSlice'
import type { Category } from '../../types/game'
import { Button } from './ui/Button'
import { gameService } from '../services/gameService'

const MAX_CATEGORIES = 6

const CategoryCard: React.FC<{
  category: Category
  isSelected: boolean
  onSelect: () => void
  disabled: boolean
}> = ({ category, isSelected, onSelect, disabled }) => (
  <motion.div
    className={`
      relative overflow-hidden rounded-xl cursor-pointer transition-all
      ${isSelected ? 'ring-2 ring-primary-500 bg-white/10' : 'bg-white/5'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={!disabled ? onSelect : undefined}
  >
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-white font-arabic">
        {category.name}
      </h3>
      
      {category.subcategories && (
        <div className="space-y-1">
          {category.subcategories.slice(0, 3).map((sub, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 bg-white/10 rounded-full text-sm 
                       text-white/70 ml-2 mb-2 font-arabic"
            >
              {sub}
            </span>
          ))}
          {category.subcategories.length > 3 && (
            <span className="text-white/50 text-sm">
              +{category.subcategories.length - 3} أخرى
            </span>
          )}
        </div>
      )}

      {isSelected && (
        <motion.div
          className="absolute top-2 right-2 bg-primary-500 rounded-full p-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </div>
  </motion.div>
)

const CategorySelection: React.FC = () => {
  const dispatch = useAppDispatch()
  const { categories: allCategories } = useAppSelector(state => state.game)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const prefetchQuestions = async () => {
      if (selectedIds.size === MAX_CATEGORIES) {
        setIsLoading(true)
        try {
          const selectedCategories = allCategories.filter(c => 
            selectedIds.has(c.id)
          )
          await gameService.prefetchQuestions(selectedCategories, 'medium')
        } finally {
          setIsLoading(false)
        }
      }
    }

    prefetchQuestions()
  }, [selectedIds, allCategories])

  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories?.some(sub =>
      sub.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const handleCategorySelect = (categoryId: string) => {
    setSelectedIds(prev => {
      const newSelection = new Set(prev)
      if (newSelection.has(categoryId)) {
        newSelection.delete(categoryId)
      } else if (newSelection.size < MAX_CATEGORIES) {
        newSelection.add(categoryId)
      }
      return newSelection
    })
  }

  const handleSubmit = async () => {
    if (selectedIds.size < 3) {
      return
    }

    setIsLoading(true)
    try {
      const selectedCategories = allCategories.filter(c => 
        selectedIds.has(c.id)
      )
      await dispatch(selectCategories(selectedCategories)).unwrap()
      dispatch(setGamePhase('game'))
    } catch (error) {
      console.error('Error selecting categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 font-arabic">
            اختر فئات الأسئلة
          </h1>
          <p className="text-white/70 text-xl font-arabic">
            اختر من 3 إلى {MAX_CATEGORIES} فئات للعبة
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-3 bg-white/10 
                     border border-white/20 rounded-lg text-white 
                     placeholder-white/50 focus:ring-2 focus:ring-primary-500"
            placeholder="ابحث عن فئة..."
            dir="rtl"
          />
        </div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedIds.has(category.id)}
              onSelect={() => handleCategorySelect(category.id)}
              disabled={!selectedIds.has(category.id) && selectedIds.size >= MAX_CATEGORIES}
            />
          ))}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={selectedIds.size < 3 || isLoading}
            isLoading={isLoading}
            size="large"
            className="font-arabic"
          >
            {isLoading ? 'جارٍ التحضير...' : 'ابدأ اللعب'}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default CategorySelection