// src/components/VocabularyDetail.jsx (or wherever located)
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { useAuth } from '../context/AuthContext';

const API_BASE =
  import.meta.env.VITE_API_BASE || 'https://vocaserve-backend.onrender.com';

export default function VocabularyDetailWrapper() {
  const { id } = useParams();
  return <VocabularyDetail id={id} />;
}

function VocabularyDetail({ id }) {
  const [vocab, setVocab] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    setError('');
    setVocab(null);
    fetch(`${API_BASE}/vocabularies/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setVocab(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load vocabulary.');
      });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this vocabulary?')) return;
    try {
      const res = await fetch(`${API_BASE}/vocabularies/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      navigate('/vocabularies');
    } catch (err) {
      console.error(err);
      alert('Failed to delete.');
    }
  };

  const handleDownloadJSON = () => {
    if (!vocab) return;
    const blob = new Blob([JSON.stringify(vocab, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, `${vocab.id || id}.json`);
  };

  const handleDownloadCSV = () => {
    if (!vocab) return;
    const hasObjectTerms =
      Array.isArray(vocab.terms) && typeof vocab.terms[0] === 'object';
    const csvHeader = hasObjectTerms ? 'Term,Definition\n' : 'Term\n';
    const csvRows = (vocab.terms || [])
      .map((term) => {
        if (typeof term === 'object') {
          const t = (term.term || '').replace(/"/g, '""');
          const d = (term.definition || '').replace(/"/g, '""');
          return `"${t}","${d}"`;
        } else {
          const t = String(term).replace(/"/g, '""');
          return `"${t}"`;
        }
      })
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    saveAs(blob, `${vocab.id || id}.csv`);
  };

  if (error)
    return (
      <p className="text-center mt-6" style={{ color: 'var(--color-danger)' }}>
        {error}
      </p>
    );
  if (!vocab)
    return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="vocab-detail-container">
      <h2 className="vocab-detail-title">{vocab.title}</h2>
      <p className="vocab-detail-description">{vocab.description}</p>

      {Array.isArray(vocab.terms) && vocab.terms.length > 0 && (
        <div className="vocab-detail-terms">
          <h3>Terms:</h3>
          <ul>
            {vocab.terms.map((term, index) => (
              <li key={index}>
                {typeof term === 'object' ? (
                  <>
                    <strong>{term.term}</strong>
                    {term.definition ? `: ${term.definition}` : ''}
                  </>
                ) : (
                  term
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="vocab-detail-buttons">
        <button
          onClick={() => navigate('/vocabularies')}
          className="btn-back"
        >
          ⬅ Back
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => navigate(`/edit/${vocab.id || id}`)}
              className="btn-edit"
            >
              ✏️ Edit
            </button>
            <button onClick={handleDelete} className="btn-delete">
              🗑️ Delete
            </button>
          </>
        )}

        <button onClick={handleDownloadJSON} className="btn-download">
          ⬇ Download JSON
        </button>
        <button onClick={handleDownloadCSV} className="btn-download">
          ⬇ Download CSV
        </button>
      </div>
    </div>
  );
}

export { VocabularyDetailWrapper };
