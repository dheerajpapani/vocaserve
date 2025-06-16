import { Link } from 'react-router-dom';

export default function VocabularyList({ vocabularies, highlightTerm = '' }) {
  const term = highlightTerm.trim().toLowerCase();

  const filteredVocabularies = vocabularies
    .map((vocab) => {
      const titleMatch = vocab.title.toLowerCase().includes(term);
      const termMatch = Array.isArray(vocab.terms)
        ? vocab.terms.some(
            (t) => typeof t === 'string' && t.toLowerCase().includes(term)
          )
        : false;

      if (term === '') return vocab; // No filtering if no search term
      if (titleMatch || termMatch) {
        return {
          ...vocab,
          showTermNote: !titleMatch && termMatch, // only show note if it's from term match only
        };
      }
      return null; // Don't include unmatched vocab
    })
    .filter(Boolean); // Remove nulls

  return (
    <div className="vocab-list">
      {filteredVocabularies.map((vocab) => (
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
            {vocab.showTermNote && (
              <p className="vocab-card-meta">🔍 Term found in this vocabulary</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
