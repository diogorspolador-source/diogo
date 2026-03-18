import { useState } from 'react';
import type { Category, QuizState } from './types';
import { questions } from './data/questions';
import { CategorySelect } from './components/CategorySelect';
import { QuestionCard } from './components/QuestionCard';
import { Results } from './components/Results';
import './App.css';

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const INITIAL_STATE: QuizState = {
  currentQuestionIndex: 0,
  selectedAnswer: null,
  isAnswered: false,
  score: 0,
  totalAnswered: 0,
  history: [],
  phase: 'category-select',
  selectedCategory: 'all',
};

export default function App() {
  const [state, setState] = useState<QuizState>(INITIAL_STATE);
  const [quizQuestions, setQuizQuestions] = useState(questions);

  const handleCategorySelect = (category: Category | 'all') => {
    const filtered =
      category === 'all' ? questions : questions.filter((q) => q.category === category);
    const shuffled = shuffleArray(filtered);
    setQuizQuestions(shuffled);
    setState({
      ...INITIAL_STATE,
      phase: 'quiz',
      selectedCategory: category,
    });
  };

  const handleAnswer = (optionId: string) => {
    const currentQuestion = quizQuestions[state.currentQuestionIndex];
    const isCorrect = optionId === currentQuestion.correctAnswer;

    setState((prev) => ({
      ...prev,
      selectedAnswer: optionId,
      isAnswered: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      totalAnswered: prev.totalAnswered + 1,
      history: [
        ...prev.history,
        { questionId: currentQuestion.id, selectedAnswer: optionId, isCorrect },
      ],
    }));
  };

  const handleNext = () => {
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex >= quizQuestions.length) {
      setState((prev) => ({ ...prev, phase: 'results' }));
    } else {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        isAnswered: false,
      }));
    }
  };

  const handleRestart = () => {
    const shuffled = shuffleArray(quizQuestions);
    setQuizQuestions(shuffled);
    setState({
      ...INITIAL_STATE,
      phase: 'quiz',
      selectedCategory: state.selectedCategory,
    });
  };

  const handleNewCategory = () => {
    setState(INITIAL_STATE);
  };

  if (state.phase === 'category-select') {
    return (
      <div className="app">
        <CategorySelect onSelect={handleCategorySelect} />
      </div>
    );
  }

  if (state.phase === 'results') {
    return (
      <div className="app">
        <Results
          score={state.score}
          total={quizQuestions.length}
          history={state.history}
          questions={quizQuestions}
          onRestart={handleRestart}
          onNewCategory={handleNewCategory}
        />
      </div>
    );
  }

  const currentQuestion = quizQuestions[state.currentQuestionIndex];

  return (
    <div className="app">
      <header className="app-header">
        <button className="btn-back" onClick={handleNewCategory}>
          ← Categorias
        </button>
        <div className="score-badge">
          ✓ {state.score} / {state.totalAnswered}
        </div>
      </header>

      <QuestionCard
        question={currentQuestion}
        questionNumber={state.currentQuestionIndex + 1}
        totalQuestions={quizQuestions.length}
        selectedAnswer={state.selectedAnswer}
        isAnswered={state.isAnswered}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
}
