import type { AnswerRecord, Question } from '../types';

interface ResultsProps {
  score: number;
  total: number;
  history: AnswerRecord[];
  questions: Question[];
  onRestart: () => void;
  onNewCategory: () => void;
}

export function Results({
  score,
  total,
  history,
  questions,
  onRestart,
  onNewCategory,
}: ResultsProps) {
  const percentage = Math.round((score / total) * 100);

  const getPerformanceLabel = () => {
    if (percentage >= 90) return { label: 'Excelente!', color: '#22c55e', emoji: '🏆' };
    if (percentage >= 70) return { label: 'Bom desempenho!', color: '#3b82f6', emoji: '👏' };
    if (percentage >= 50) return { label: 'Razoável', color: '#f59e0b', emoji: '📚' };
    return { label: 'Precisa melhorar', color: '#ef4444', emoji: '💪' };
  };

  const perf = getPerformanceLabel();

  return (
    <div className="results">
      <div className="results-hero" style={{ borderColor: perf.color }}>
        <div className="results-emoji">{perf.emoji}</div>
        <h2 className="results-title">{perf.label}</h2>
        <div className="results-score">
          <span className="results-score-number" style={{ color: perf.color }}>
            {score}
          </span>
          <span className="results-score-total">/{total}</span>
        </div>
        <div className="results-percentage" style={{ color: perf.color }}>
          {percentage}% de aproveitamento
        </div>
      </div>

      <div className="results-history">
        <h3>Resumo das respostas</h3>
        {history.map((record, index) => {
          const q = questions.find((q) => q.id === record.questionId);
          if (!q) return null;
          return (
            <div
              key={record.questionId}
              className={`history-item ${record.isCorrect ? 'history-item--correct' : 'history-item--wrong'}`}
            >
              <span className="history-number">Q{index + 1}</span>
              <span className="history-icon">{record.isCorrect ? '✓' : '✗'}</span>
              <span className="history-text">{q.statement.substring(0, 60)}...</span>
              {!record.isCorrect && (
                <span className="history-correct-answer">
                  Correta: {q.correctAnswer.toUpperCase()}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="results-actions">
        <button className="btn-primary" onClick={onRestart}>
          Refazer este quiz
        </button>
        <button className="btn-secondary" onClick={onNewCategory}>
          Escolher outra categoria
        </button>
      </div>
    </div>
  );
}
