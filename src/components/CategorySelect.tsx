import type { Category } from '../types';
import { CATEGORY_LABELS } from '../types';
import { questions } from '../data/questions';

interface CategorySelectProps {
  onSelect: (category: Category | 'all') => void;
}

const CATEGORY_ICONS: Record<Category | 'all', string> = {
  all: '📚',
  'logica-proposicional': '🔗',
  sequencias: '🔢',
  'raciocinio-matematico': '🧮',
  analogias: '🔄',
  'verdadeiro-falso': '✅',
};

export function CategorySelect({ onSelect }: CategorySelectProps) {
  const categories: (Category | 'all')[] = [
    'all',
    'logica-proposicional',
    'sequencias',
    'raciocinio-matematico',
    'analogias',
    'verdadeiro-falso',
  ];

  const countByCategory = (cat: Category | 'all') =>
    cat === 'all'
      ? questions.length
      : questions.filter((q) => q.category === cat).length;

  return (
    <div className="category-select">
      <div className="hero">
        <h1 className="hero-title">Raciocínio Lógico</h1>
        <p className="hero-subtitle">Prepare-se para concursos públicos</p>
      </div>

      <h2 className="section-title">Escolha uma categoria</h2>

      <div className="category-grid">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-card ${cat === 'all' ? 'category-card--all' : ''}`}
            onClick={() => onSelect(cat)}
          >
            <span className="category-icon">{CATEGORY_ICONS[cat]}</span>
            <span className="category-name">{CATEGORY_LABELS[cat]}</span>
            <span className="category-count">{countByCategory(cat)} questões</span>
          </button>
        ))}
      </div>
    </div>
  );
}
