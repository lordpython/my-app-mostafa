import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGameActions } from "../../hooks/useGameActions"
import { useAppDispatch } from "../../hooks/hooks"
import { setGamePhase } from "../../features/game/gameSlice"
import type { Category } from "../../types"
import Button from "../../components/ui/Button"
import Loader from "./Loader"
import categoriesData from "../../data/categories.json" // Import the categories data

interface CategorySelectionProps {
  onSubmit: (selection: CategorySelectionData) => void;
}

// Renamed to avoid naming conflict with the component
export interface CategorySelectionData {
  categoryId: string;
  subcategories: string[];
  difficulty: string;
}

const DIFFICULTIES = ['very easy', 'easy', 'medium', 'hard', 'very hard'] as const;
type Difficulty = typeof DIFFICULTIES[number];

const CategorySelection: React.FC<CategorySelectionProps> = ({ onSubmit }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    onSubmit({
      categoryId: selectedCategory,
      subcategories: selectedSubcategories,
      difficulty
    });
  };

  const currentCategory = categoriesData.find(cat => cat.id === selectedCategory);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Select Category</h2>
      
      <div className="mb-6">
        <label className="block mb-2">Category:</label>
        <select 
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubcategories([]);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a category</option>
          {categoriesData.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {currentCategory?.subcategories && (
        <div className="mb-6">
          <label className="block mb-2">Subcategories:</label>
          <div className="space-y-2">
            {currentCategory.subcategories.map(sub => (
              <label key={sub} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSubcategories.includes(sub)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSubcategories([...selectedSubcategories, sub]);
                    } else {
                      setSelectedSubcategories(selectedSubcategories.filter(s => s !== sub));
                    }
                  }}
                  className="mr-2"
                />
                {sub}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block mb-2">Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="w-full p-2 border rounded"
        >
          {DIFFICULTIES.map(diff => (
            <option key={diff} value={diff}>
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!selectedCategory || isLoading}
        variant="primary"
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
};

export default CategorySelection;
