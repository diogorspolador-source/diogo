export type Category =
  | 'logica-proposicional'
  | 'sequencias'
  | 'raciocinio-matematico'
  | 'analogias'
  | 'verdadeiro-falso';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  category: Category;
  statement: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  isAnswered: boolean;
  score: number;
  totalAnswered: number;
  history: AnswerRecord[];
  phase: 'category-select' | 'quiz' | 'results';
  selectedCategory: Category | 'all';
}

export interface AnswerRecord {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

export const CATEGORY_LABELS: Record<Category | 'all', string> = {
  all: 'Todas as Categorias',
  'logica-proposicional': 'Lógica Proposicional',
  sequencias: 'Sequências',
  'raciocinio-matematico': 'Raciocínio Matemático',
  analogias: 'Analogias',
  'verdadeiro-falso': 'Verdadeiro ou Falso',
};
