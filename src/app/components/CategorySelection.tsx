import React from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGameActions } from "../../hooks/useGameActions"
import { useAppDispatch } from "../../hooks/hooks"
import { setGamePhase } from "../../features/game/gameSlice"
import type { Category } from "../../types"
import Button from "../../components/ui/Button"
import Loader from "./Loader"
import categoriesData from "../../data/categories.json" // Import the categories data
import { motion, AnimatePresence } from "framer-motion"

interface CategorySelectionProps {
  onSubmit: (selection: CategorySelectionData) => void;
}

export interface CategorySelectionData {
  categories: string[];
  subcategories: string[];
  difficulty: string;
}

const DIFFICULTIES = ['very easy', 'easy', 'medium', 'hard', 'very hard'] as const;
type Difficulty = typeof DIFFICULTIES[number];

const CategorySelection: React.FC<CategorySelectionProps> = ({ onSubmit }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategorySelect = (id: string) => {
    setSelectedCategories(prev => {
      // If category is already selected, remove it
      if (prev.includes(id)) {
        return prev.filter(catId => catId !== id);
      }
      // If less than 3 categories are selected, add the new one
      if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (isLoading || selectedCategories.length === 0) return;
    
    setIsLoading(true);
    onSubmit({
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      difficulty
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  const categoryVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      y: -20,
      opacity: 0
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center min-h-screen"
      >
        <Loader />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-neutral-900 via-primary-900/20 to-neutral-900" dir="rtl">
      <motion.div
        className="max-w-4xl mx-auto glass-morphism rounded-2xl p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          اختر الفئات (حد أقصى 3)
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {categoriesData.map(category => (
            <motion.div
              key={category.id}
              variants={categoryVariants}
              layout
              className={`
                relative overflow-hidden rounded-xl cursor-pointer
                ${selectedCategories.includes(category.id) 
                  ? 'ring-2 ring-primary-500 bg-white/10' 
                  : 'bg-white/5'
                }
                ${selectedCategories.length >= 3 && !selectedCategories.includes(category.id)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                }
              `}
              onClick={() => handleCategorySelect(category.id)}
              whileHover={{ 
                scale: selectedCategories.length < 3 || selectedCategories.includes(category.id) ? 1.03 : 1,
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredCategory(category.id)}
              onHoverEnd={() => setHoveredCategory(null)}
            >
              {hoveredCategory === category.id && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              <div className="relative p-4 z-10">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                  {category.name}
                </h3>
                {category.subcategories && (
                  <p className="text-sm text-white/70">
                    {category.subcategories.slice(0, 3).join(' • ')}...
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 text-center">مستوى الصعوبة</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {DIFFICULTIES.map((level) => (
              <Button
                key={level}
                onClick={() => setDifficulty(level)}
                variant={difficulty === level ? "primary" : "secondary"}
                className={`capitalize ${difficulty === level ? 'ring-2 ring-primary-500' : ''}`}
              >
                {level}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="large"
            className="min-w-[200px] relative overflow-hidden group"
            disabled={selectedCategories.length === 0}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-primary-400/20"
              initial={{ x: "-100%" }}
              animate={{
                x: "100%",
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="relative z-10">ابدأ اللعب</span>
          </Button>
          
          {selectedCategories.length === 0 && (
            <p className="text-white/60 mt-2">الرجاء اختيار فئة واحدة على الأقل</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CategorySelection;
