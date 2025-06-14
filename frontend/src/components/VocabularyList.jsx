import { Link } from 'react-router-dom';

export default function VocabularyList({ vocabularies, highlightTerm = '' }) {
  return (
    <div className="grid gap-4">
      {vocabularies.map((vocab) => (
        <Link
          key={vocab.id}
          to={`/vocabularies/${vocab.id}`}
          className="block border rounded p-4 hover:bg-gray-50 transition"
        >
          <h3 className="text-lg font-semibold">{vocab.title}</h3>
          <p className="text-gray-600 text-sm mt-1 truncate">{vocab.description}</p>
          {highlightTerm &&
            vocab.terms?.some((term) =>
              typeof term === 'string' &&
              term.toLowerCase().includes(highlightTerm.toLowerCase())
            ) && (
              <p className="text-blue-600 text-sm mt-2">
                🔍 Term found in this vocabulary
              </p>
            )}
        </Link>
      ))}
    </div>
  );
}
