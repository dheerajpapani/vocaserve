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
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!vocab) return <p className="text-center mt-10">Loading...</p>;

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Delete Vocabulary</h2>
        <p>Are you sure you want to delete <strong>{vocab.title}</strong>?</p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ Yes, Delete
          </button>
          <button
            onClick={() => navigate(`/vocabularies/${id}`)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
