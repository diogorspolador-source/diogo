import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  isAnswered: boolean;
  onAnswer: (optionId: string) => void;
  onNext: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isAnswered,
  onAnswer,
  onNext,
}: QuestionCardProps) {
  const progress = (questionNumber / totalQuestions) * 100;

  const getOptionClass = (optionId: string) => {
    if (!isAnswered) {
      return selectedAnswer === optionId ? 'option option--selected' : 'option';
    }
    if (optionId === question.correctAnswer) return 'option option--correct';
    if (optionId === selectedAnswer && optionId !== question.correctAnswer)
      return 'option option--wrong';
    return 'option option--disabled';
  };

  return (
    <div className="question-card">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="question-header">
        <span className="question-counter">
          Questão {questionNumber} de {totalQuestions}
        </span>
        <span className="question-category-badge">
          {question.category.replace(/-/g, ' ')}
        </span>
      </div>

      <p className="question-statement">{question.statement}</p>

      <div className="options-list">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={getOptionClass(option.id)}
            onClick={() => !isAnswered && onAnswer(option.id)}
            disabled={isAnswered}
          >
            <span className="option-label">{option.id.toUpperCase()}</span>
            <span className="option-text">{option.text}</span>
          </button>
        ))}
      </div>

      {isAnswered && (
        <div
          className={`explanation ${
            selectedAnswer === question.correctAnswer
              ? 'explanation--correct'
              : 'explanation--wrong'
          }`}
        >
          <strong>
            {selectedAnswer === question.correctAnswer
              ? '✓ Correto!'
              : `✗ Incorreto! A resposta correta é ${question.correctAnswer.toUpperCase()}`}
          </strong>
          <p>{question.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button className="btn-next" onClick={onNext}>
          {questionNumber < totalQuestions ? 'Próxima questão →' : 'Ver resultado →'}
        </button>
      )}
    </div>
  );
}
