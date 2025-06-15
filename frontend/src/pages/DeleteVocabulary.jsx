import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function DeleteVocabulary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [vocab, setVocab] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/vocabularies');
      return;
    }

    fetch(`${API_BASE}/vocabularies/${id}`)
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(setVocab)
      .catch(() => setError('Failed to load vocabulary'));
  }, [id, isAdmin, navigate]);

  const handleConfirm = async () => {
    await fetch(`${API_BASE}/vocabularies/${id}`, { method: 'DELETE' });
    navigate('/vocabularies');
  };

  if (!isAdmin) return null;

  if (error)
    return (
      <p className="text-center mt-6" style={{ color: 'var(--color-danger)' }}>
        {error}
      </p>
    );

  if (!vocab)
    return (
      <p className="text-center mt-6">Loading...</p>
    );

  return (
    <PageWrapper>
      <div className="delete-container">
        <h2 className="vocab-detail-title">Delete Vocabulary</h2>
        <p>
          Are you sure you want to delete <strong>{vocab.title}</strong>?
        </p>
        <div className="delete-buttons">
          <button onClick={handleConfirm} className="btn-confirm">
            🗑️ Yes, Delete
          </button>
          <button
            onClick={() => navigate(`/vocabularies/${id}`)}
            className="btn-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
