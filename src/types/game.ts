export interface Category {
  id: string;
  name: string;
  subcategories?: string[];
}

export interface CategorySelection {
  categoryId: string;
  subcategories: string[];
  difficulty: 'very easy' | 'easy' | 'medium' | 'hard' | 'very hard';
}

export interface TeamRegistration {
  teamA: string;
  teamB: string;
}

export interface AnswerSubmission {
  fullQuestion: string;
  answer: string;
}
