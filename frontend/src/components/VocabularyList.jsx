import { Link } from 'react-router-dom';

export default function VocabularyList({ vocabularies, highlightTerm = '' }) {
  return (
    <div className="vocab-list">
      {vocabularies.map((vocab) => (
        <Link
          key={vocab.id}
          to={`/vocabularies/${vocab.id}`}
          className="vocab-card-link"
        >
          <div className="vocab-card">
            <h3 className="vocab-card-title">{vocab.title}</h3>
            {vocab.description && (
              <p className="vocab-card-desc">{vocab.description}</p>
            )}
            {highlightTerm &&
              vocab.terms?.some((term) =>
                typeof term === 'string' &&
                term.toLowerCase().includes(highlightTerm.toLowerCase())
              ) && (
                <p className="vocab-card-meta">
                  🔍 Term found in this vocabulary
                </p>
              )}
          </div>
        </Link>
      ))}
    </div>
  );
}
