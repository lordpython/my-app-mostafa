import type { CategorySelectionData } from "./CategorySelection" // Import the correct type name

const handleCategorySelection = async (selection: CategorySelectionData) => {
  try {
    const response = await fetch('/api/generate-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selection),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate question');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating question:', error);
    throw error;
  }
};

export default handleCategorySelection;
